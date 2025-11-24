import React, { useEffect, useState } from "react";
import { Container, Button, Table, Modal, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BsEye, BsPencil, BsTrash } from "react-icons/bs";
import FaqForm from "./faqform"; // Import the form component

const FaqList = () => {
  const [faqs, setFaqs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showForm, setShowForm] = useState(false); // For toggling Add/Edit form
  const navigate = useNavigate();

  // Fetch FAQs on load
  useEffect(() => {
    fetchFaqs();
  }, []);

  // Fetch FAQs from API
  const fetchFaqs = async () => {
    try {
      const response = await axios.get(
        "https://backend-animation.onrender.com/api/faqs/"
      );
      setFaqs(response.data);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    }
  };

  // Handle delete FAQ
  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await axios.delete(`https://backend-animation.onrender.com/api/faqs/${id}`);
      setFaqs((prevFaqs) => prevFaqs.filter((item) => item._id !== id));
    } catch (error) {
      console.error("Error deleting FAQ:", error);
    }
  };

  // Handle viewing FAQ
  const handleView = (faqItem) => {
    setSelectedFaq(faqItem);
    setShowModal(true);
  };

  // Handle edit FAQ
  const handleEdit = (faqItem) => {
    setSelectedFaq(faqItem);
    setShowForm(true); // Open the edit form
  };

  // Handle adding new FAQ
  const handleAdd = () => {
    setShowForm(true); // Open the add form
    setSelectedFaq(null); // Ensure no FAQ is selected for editing
  };

  // Close the modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedFaq(null);
  };

  return (
    <Container className="py-5">
      <Row className="align-items-center mb-4">
        <Col>
          <h2 className="text-center text-md-start">FAQs</h2>
        </Col>
        <Col className="text-center text-md-end">
          <Button
            variant="contained"
            style={{
              backgroundColor: "#1E90FF",
              boxShadow: "3px 3px 10px rgba(0, 0, 0, 0.2)",
              border: "none",
            }}
            onClick={handleAdd}
          >
            Add FAQ
          </Button>
        </Col>
      </Row>

      {/* Table Section */}
      <Table responsive bordered hover className="text-center">
        <thead className="table-dark">
          <tr>
            <th>Question</th>
            <th>Answer</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {faqs.length > 0 ? (
            faqs.map((item) => (
              <tr key={item._id}>
                <td>{item.question}</td>
                <td>{item.answer}</td>
                <td style={{ textAlign: "center", width: "150px" }}>
                  <BsEye
                    className="text-info me-3 cursor-pointer"
                    onClick={() => handleView(item)}
                  />
                  <BsPencil
                    className="text-warning me-3 cursor-pointer"
                    onClick={() => handleEdit(item)}
                  />
                  <BsTrash
                    className="text-danger cursor-pointer"
                    onClick={() => handleDelete(item._id)}
                  />
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No FAQs found.</td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Modal for Quick View */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>FAQ Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedFaq && (
            <>
              <h4>{selectedFaq.question}</h4>
              <p>{selectedFaq.answer}</p>
            </>
          )}
        </Modal.Body>
      </Modal>

      {/* Add/Edit FAQ Form Modal */}
      {showForm && (
        <FaqForm
          faq={selectedFaq}
          closeForm={() => setShowForm(false)} // Close the form when done
          fetchFaqs={fetchFaqs} // Refresh FAQs after add/edit
        />
      )}
    </Container>
  );
};

export default FaqList;
