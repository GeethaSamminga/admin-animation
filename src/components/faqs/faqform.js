import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";

const FaqForm = ({ faq, closeForm, fetchFaqs }) => {
  const [question, setQuestion] = useState(faq ? faq.question : "");
  const [answer, setAnswer] = useState(faq ? faq.answer : "");
  const [loading, setLoading] = useState(false);

  // Handle form submit for both Add and Edit FAQ
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (faq) {
        // Update FAQ
        await axios.put(
          `http://localhost:5000/api/faqs/${faq._id}`,
          {
            question,
            answer,
          }
        );
      } else {
        // Add new FAQ
        await axios.post("http://localhost:5000/api/faqs", {
          question,
          answer,
        });
      }
      fetchFaqs(); // Fetch the updated FAQ list
      closeForm(); // Close the form
    } catch (error) {
      console.error("Error saving FAQ:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show onHide={closeForm}>
      <Modal.Header closeButton>
        <Modal.Title>{faq ? "Edit FAQ" : "Add FAQ"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formQuestion">
            <Form.Label>Question</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter the question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group controlId="formAnswer" className="mt-3">
            <Form.Label>Answer</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter the answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
            />
          </Form.Group>

          <Button
            style={{
              backgroundColor: "#1E90FF",
              boxShadow: "3px 3px 10px rgba(0, 0, 0, 0.2)",
              border: "none",
            }}
            type="submit"
            className="mt-3"
            disabled={loading}
          >
            {loading ? "Saving..." : faq ? "Update FAQ" : "Add FAQ"}
          </Button>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          style={{
            backgroundColor: "#1E90FF",
            boxShadow: "3px 3px 10px rgba(0, 0, 0, 0.2)",
            border: "none",
          }}
          onClick={closeForm}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FaqForm;
