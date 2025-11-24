import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LoginPage = ({ handleLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Show loading toast
      const loadingToast = toast.loading("Logging in...");

      // Make API call to login endpoint
      const response = await axios.post(
        "https://backend-animation.onrender.com/api/users/login",
        { email, password }
      );
      console.log(response);

      const { token, user } = response.data;

      // Check if the user is an admin
      if (user.role !== "Admin") {
        toast.update(loadingToast, {
          render: "You are not authorized as an admin.",
          type: "error",
          isLoading: false,
          autoClose: 3000,
        });
        return;
      }

      // Store token, user ID, and user details in sessionStorage
      sessionStorage.setItem("token", token);
      sessionStorage.setItem("userId", user.id);
      sessionStorage.setItem("firstName", user.FirstName);
      sessionStorage.setItem("lastName", user.LastName);
      sessionStorage.setItem("role", user.role);
      // Pass user data to the parent handleLogin function
      handleLogin(user);

      // Show success toast
      toast.update(loadingToast, {
        render: "Login successful!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      // Delay navigation to the home page by 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      // Show error toast
      toast.dismiss(); // Dismiss any active toast
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message, { autoClose: 3000 });
      } else {
        toast.error("An error occurred while logging in.", { autoClose: 3000 });
      }
    }
  };

  return (
    <>
      <ToastContainer />
      <Container
        fluid
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <Row className="w-100">
          <Col xs={12} sm={10} md={8} lg={6} className="mx-auto">
            <div className="p-4 shadow rounded bg-white">
              <h2 className="text-center mb-4">Login</h2>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formEmail">
                  <Form.Label>Email address</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button
                  sx={{
                    backgroundColor: "#1E90FF",
                    color: "white", // to make the text white
                  }}
                  type="submit"
                  className="w-100"
                >
                  Login
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default LoginPage;
