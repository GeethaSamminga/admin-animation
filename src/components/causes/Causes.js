import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Row,
  Col,
  Spinner,
  Image,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ServiceForm = () => {
  const [formValues, setFormValues] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: { public_id: "", secure_url: "" },
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const categoryOptions = [
    "3D Animation",
    "Promotional Videos",
    "Game Animations",
    "Educational Content",
  ];

  useEffect(() => {
    if (id) {
      fetchServiceDetails(id);
    }
  }, [id]);

  const fetchServiceDetails = async (id) => {
    try {
      const response = await axios.get(
        `https://animation-backend.vercel.app/api/services/${id}`
      );
      const service = response.data;

      setFormValues({
        name: service.name || "",
        description: service.description || "",
        price: service.price || "",
        category: service.category || "",
        image: service.image || { public_id: "", secure_url: "" },
      });
    } catch (error) {
      console.error(
        "Error fetching service details:",
        error.response?.data || error.message
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "gallery");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dfbfpq5rf/image/upload",
        formData
      );
      console.log(response.data);
      setFormValues((prevValues) => ({
        ...prevValues,
        image: {
          public_id: response.data.public_id,
          secure_url: response.data.secure_url,
        },
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formValues.name ||
      !formValues.description ||
      !formValues.price ||
      !formValues.category ||
      !formValues.image.secure_url
    ) {
      alert("Please fill in all required fields!");
      return;
    }

    setLoading(true);
    const payload = {
      ...formValues,
    };

    try {
      const url = id
        ? `https://animation-backend.vercel.app/api/services/${id}`
        : "https://animation-backend.vercel.app/api/services/";
      const method = id ? "put" : "post";

      await axios[method](url, payload);
      navigate("/services");
    } catch (error) {
      console.error(
        "Error submitting service form:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container fluid className="py-5">
      <h2 className="text-center mb-4">
        {id ? "Edit Service" : "Create Service"}
      </h2>
      <Form onSubmit={handleSubmit}>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formValues.name}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Price</Form.Label>
              <Form.Control
                type="number"
                name="price"
                value={formValues.price}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={formValues.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="description"
                value={formValues.description}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-3">
          <Col>
            <Form.Group>
              <Form.Label>Image</Form.Label>
              <Form.Control
                type="file"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {uploading && (
                <Spinner animation="border" size="sm" className="mt-2" />
              )}
              {formValues.image.secure_url && (
                <div className="mt-3">
                  <Image
                    src={formValues.image.secure_url}
                    alt="Current Service Image"
                    rounded
                    style={{ width: "100px" }}
                  />
                  <p className="text-muted">Current Image</p>
                </div>
              )}
            </Form.Group>
          </Col>
        </Row>
        <Button
          type="submit"
          variant="contained"
          style={{
            backgroundColor: "#1E90FF",
            boxShadow: "3px 3px 10px rgba(0, 0, 0, 0.2)",
            border: "none",
          }}
          disabled={loading}
          className="w-100"
        >
          {loading ? "Saving..." : id ? "Update Service" : "Create Service"}
        </Button>
      </Form>
    </Container>
  );
};

export default ServiceForm;
