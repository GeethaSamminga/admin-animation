import React from "react";
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const NavbarWithoutSidebar = ({ handleLogout }) => {
  const username = "Admin"; // Replace with dynamic username
  const navigate = useNavigate(); // For navigation

  const handleMenuClick = (route) => {
    navigate(`/${route.toLowerCase()}`); // Navigate to the appropriate route
  };

  const handleLogoutClick = () => {
    handleLogout(); // Call the handleLogout function
    navigate("/login"); // Navigate to the login page after logging out
  };

  return (
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
        <Navbar.Toggle aria-controls="navbar-nav" style={{ border: "none" }} />
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
              {username}
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
  );
};

export default NavbarWithoutSidebar;
