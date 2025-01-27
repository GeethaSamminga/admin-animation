import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import NavbarWithSidebar from "./components/navbar/NavBar"; // Updated Navbar to Bootstrap
import Users from "./components/Users/Users";
import ServicesList from "./components/causes/CampaignList";
import Gallery from "./components/gallery/Gallery";
import CampaignForm from "./components/causes/Causes";
import { Container } from "react-bootstrap";
import LoginPage from "./components/Login";
import Faq from "./components/faqs/faq";
import ServiceForm from "./components/causes/Causes";

function App() {
  const [activeComponent, setActiveComponent] = useState("Users");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(null); // State to track login status

  // Check if user is logged in when app initializes
  useEffect(() => {
    const savedUser = sessionStorage.getItem("user"); // Check sessionStorage for user data
    if (savedUser) {
      setUser(JSON.parse(savedUser)); // Load user from sessionStorage
    }
  }, []);

  // Render a fallback component for components without dedicated routes
  const renderComponent = () => {
    switch (activeComponent) {
      case "Users":
        return <Users />;
      case "Services":
        return <campaigns />;
      case "Animations":
        return <Gallery />;
      case "FAQ":
        return <Faq />;
      default:
        return <Users />;
    }
  };

  // Handle login
  const handleLogin = (user) => {
    setUser(user); // Set the user in state
    sessionStorage.setItem("user", JSON.stringify(user)); // Store user in sessionStorage
  };

  // Handle logout
  const handleLogout = () => {
    setUser(null); // Clear user state on logout
    sessionStorage.removeItem("user"); // Remove user from sessionStorage
  };

  return (
    <Router>
      <div className="d-flex vh-100">
        {/* Conditionally render Navbar only if user is logged in */}
        {user && (
          <NavbarWithSidebar
            setActiveComponent={setActiveComponent}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            handleLogout={handleLogout} // Pass logout handler to Navbar
          />
        )}

        {/* Main Content */}
        <Container
          fluid
          className={`transition-all px-4 py-3 ${
            isSidebarOpen ? "ms-250" : "ms-0"
          }`}
          style={{ flex: 1 }}
        >
          <Routes>
            {/* Login Page */}
            <Route
              path="/login"
              element={
                user ? (
                  <Navigate to="/" />
                ) : (
                  <LoginPage handleLogin={handleLogin} />
                )
              }
            />

            {/* Redirect to Users page after login */}
            <Route
              path="/"
              element={user ? <Users /> : <Navigate to="/login" />}
            />

            {/* Other routes */}
            <Route path="/services" element={<ServicesList />} />
            <Route path="/add-service" element={<ServiceForm />} />
            <Route path="/edit-service/:id" element={<CampaignForm />} />
            <Route path="/animations" element={<Gallery />} />
            <Route path="/faq" element={<Faq />} />

            <Route path="*" element={renderComponent()} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;
