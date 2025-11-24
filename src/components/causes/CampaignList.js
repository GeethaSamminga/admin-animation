import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  Table,
  Modal,
  Row,
  Col,
  Image,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BsEye, BsPencil, BsTrash } from "react-icons/bs";

const ServicesList = () => {
  const [services, setServices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const navigate = useNavigate();
  // console.log(selectedService);
  console.log(services);
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get(
        "https://backend-animation.onrender.com/api/services/"
      );
      setServices(response.data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `https://backend-animation.onrender.com/api/services/${id}`
      );
      fetchServices();
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const handleView = (service) => {
    setSelectedService(service);
    setShowModal(true);
  };

  const handleEdit = (service) => {
    navigate(`/edit-service/${service._id}`);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedService(null);
  };

  return (
    <Container className="py-5">
      <Row className="align-items-center mb-4">
        <Col>
          <h2 className="text-center text-md-start">Services</h2>
        </Col>
        <Col className="text-center text-md-end">
          <Button
            variant="contained"
            style={{
              backgroundColor: "#1E90FF",
              boxShadow: "3px 3px 10px rgba(0, 0, 0, 0.2)",
              border: "none",
            }}
            onClick={() => navigate("/add-service")}
          >
            Add Service
          </Button>
        </Col>
      </Row>
      <Table responsive bordered hover className="text-center">
        <thead className="table-dark">
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Price</th>
            <th>Category</th>
            <th>Image</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.length > 0 ? (
            services.map((service) => (
              <tr key={service._id}>
                <td>{service.name}</td>
                <td>{service.description}</td>
                <td>${service.price.toLocaleString()}</td>
                <td>{service.category}</td>
                <td>
                  {service.image.secure_url && (
                    <Image
                      src={service.image.secure_url}
                      rounded
                      style={{ width: "50px", height: "50px" }}
                    />
                  )}
                </td>
                <td style={{ width: "150px" }}>
                  <BsEye
                    className="text-info me-3 cursor-pointer"
                    onClick={() => handleView(service)}
                  />
                  <BsPencil
                    className="text-warning me-3 cursor-pointer"
                    onClick={() => handleEdit(service)}
                  />
                  <BsTrash
                    className="text-success cursor-pointer"
                    onClick={() => handleDelete(service._id)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No services found.</td>
            </tr>
          )}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Service Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedService && (
            <>
              <h4>{selectedService.name}</h4>
              <p>{selectedService.description}</p>
              <p>
                <strong>Price:</strong> $
                {selectedService.price.toLocaleString()}
              </p>
              <p>
                <strong>Category:</strong> {selectedService.category}
              </p>
              {selectedService.image.secure_url && (
                <div>
                  <strong>Image:</strong>
                  <br />
                  <Image
                    src={selectedService.image.secure_url}
                    rounded
                    style={{ width: "100px", height: "100px" }}
                  />
                </div>
              )}
            </>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ServicesList;
