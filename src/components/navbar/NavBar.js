import React, { useEffect, useState } from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const NavbarWithoutSidebar = ({ handleLogout }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState("");
  const [firstName, setFirstName] = useState("User");
  const [lastName, setLastName] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists in sessionStorage
    const token = sessionStorage.getItem("token");
    const userRole = sessionStorage.getItem("role");
    const userFirstName = sessionStorage.getItem("firstName") || "User";
    const userLastName = sessionStorage.getItem("lastName") || "";

    // If the user is logged in and has a valid role, set authentication state
    if (token && userRole === "Admin") {
      setIsAuthenticated(true);
      setRole(userRole);
      setFirstName(userFirstName);
      setLastName(userLastName);
    } else {
      // If not authenticated, redirect to login
      navigate("/login");
    }
  }, [navigate]);

  const handleLogoutClick = async () => {
    try {
      // Show a loading toast
      const loadingToast = toast.loading("Logging out...");

      // Call logout API
      const token = sessionStorage.getItem("token");
      await axios.post(
        "https://animation-backend.vercel.app/api/users/logout",
        {}, // API may expect a body; send empty if not required
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
        }
      );

      // Clear session storage
      sessionStorage.clear();

      // Call the parent handleLogout function if needed
      if (handleLogout) {
        handleLogout();
      }

      // Update the toast to show a success message
      toast.update(loadingToast, {
        render: "Logout successful!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });

      // Redirect to the login page after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      // Dismiss any active toast and show an error toast
      toast.dismiss();
      toast.error(
        error.response?.data?.message || "An error occurred while logging out.",
        { autoClose: 3000 }
      );
    }
  };

  const handleMenuClick = (route) => {
    navigate(`/${route.toLowerCase()}`); // Navigate to the appropriate route
  };

  // Only render Navbar if role is 'Admin'
  if (!isAuthenticated) {
    return null; // Do not render anything if user is not authenticated
  }

  return (
    <>
      {/* Toast Container for displaying notifications */}
      <ToastContainer />

      <Navbar
        variant="contained"
        expand="lg"
        style={{
          backgroundColor: "#1E90FF",
          boxShadow: "3px 3px 10px rgba(0, 0, 0, 0.2)",
          border: "none",
        }}
        fixed="top"
      >
        <Container fluid>
          {/* Brand */}
          <Navbar.Brand
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: "1.5rem",
            }}
          >
            Admin Dashboard
          </Navbar.Brand>

          {/* Toggle button for mobile */}
          <Navbar.Toggle
            aria-controls="navbar-nav"
            style={{ border: "none" }}
          />
          <Navbar.Collapse id="navbar-nav" className="justify-content-between">
            {/* Center Links */}
            <Nav className="mx-auto">
              {["Users", "Services", "Animations", "FAQ"].map((item) => (
                <Nav.Link
                  key={item}
                  onClick={() => handleMenuClick(item)}
                  style={{
                    color: "white",
                    fontWeight: "bold",
                    textTransform: "capitalize",
                    fontSize: "20px",
                  }}
                  className="px-3"
                >
                  {item}
                </Nav.Link>
              ))}
            </Nav>

            {/* Right-side elements */}
            <div className="d-flex align-items-center">
              <span
                style={{
                  color: "white",
                  fontWeight: "bold",
                  marginRight: "15px",
                }}
              >
                {`${firstName} ${lastName}`}
              </span>
              <Button
                variant="outline-light"
                onClick={handleLogoutClick}
                style={{
                  fontWeight: "bold",
                }}
              >
                Logout
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default NavbarWithoutSidebar;
