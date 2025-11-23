import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Button,
  Card,
  Modal,
  Toast,
  Form,
} from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [newFile, setNewFile] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    techniques: [],
  });
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const categories = ["Wildlife", "Pets", "Mythical Creatures", "Others"];

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/animations/"
        );
        setImages(response.data);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };
    fetchImages();
  }, []);

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setNewFile(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*,video/*",
  });

  const handleUpload = async () => {
    if (!newFile || !formData.title || !formData.category) {
      showToastMessage("Please fill in all required fields and select a file.");
      return;
    }

    setUploading(true);
    const uploadFormData = new FormData();
    uploadFormData.append("file", newFile);
    uploadFormData.append("upload_preset", "gallery");

    try {
      const cloudinaryResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/dfbfpq5rf/video/upload", // Change to video upload URL
        uploadFormData
      );

      const uploadedFile = cloudinaryResponse.data;

      const savedImageResponse = await axios.post(
        "http://localhost:5000/api/animations/add",
        {
          title: formData.title,
          category: formData.category,
          description: formData.description,
          techniques: formData.techniques,
          public_id: uploadedFile.public_id,
          secure_url: uploadedFile.secure_url,
          file_type: uploadedFile.resource_type, // Store file type (video/image)
        }
      );

      setImages((prevImages) => [...prevImages, savedImageResponse.data]);
      showToastMessage("Animation added successfully!");
      resetFormData();
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFormData = () => {
    setFormData({
      title: "",
      category: "",
      description: "",
      techniques: [],
    });
    setNewFile(null);
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleEdit = (image) => {
    setEditMode(true);
    setSelectedImage(image);
    setFormData({
      title: image.title,
      category: image.category,
      description: image.description,
      techniques: image.techniques.join(", "),
    });
  };

  const handleUpdate = async () => {
    if (!formData.title || !formData.category) {
      showToastMessage("Please fill in all required fields.");
      return;
    }

    let fileUrl = selectedImage.secure_url; // Keep existing file URL by default

    // If a new file is selected, upload it to Cloudinary
    if (newFile) {
      const uploadFormData = new FormData();
      uploadFormData.append("file", newFile);
      uploadFormData.append("upload_preset", "gallery");

      try {
        const cloudinaryResponse = await axios.post(
          "https://api.cloudinary.com/v1_1/dfbfpq5rf/video/upload",
          uploadFormData
        );
        const uploadedFile = cloudinaryResponse.data;
        fileUrl = uploadedFile.secure_url; // Update the URL with the new file URL
      } catch (error) {
        console.error("Error uploading new video:", error);
        showToastMessage("Failed to upload the new video.");
        return;
      }
    }

    // Update animation metadata, with or without a new video
    try {
      const response = await axios.put(
        `hhttp://localhost:5000/api/animations/${selectedImage._id}`,
        {
          title: formData.title,
          category: formData.category,
          description: formData.description,
          techniques: formData.techniques.split(","),
          secure_url: fileUrl, // Use the new or existing video URL
        }
      );

      setImages((prevImages) =>
        prevImages.map((image) =>
          image._id === selectedImage._id ? response.data : image
        )
      );

      showToastMessage("Animation updated successfully!");
      setEditMode(false);
      resetFormData();
    } catch (error) {
      console.error("Error updating video:", error);
      showToastMessage("Failed to update the animation.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/animations/${id}`
      );
      setImages((prevImages) => prevImages.filter((image) => image._id !== id));
      showToastMessage("Animation deleted successfully!");
    } catch (error) {
      console.error("Error deleting image:", error);
    }
  };

  return (
    <Container fluid className="py-5">
      {/* Toast Message */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        className="position-fixed top-0 end-0 m-3"
      >
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>

      <Row className="justify-content-center">
        <Col xs={12} md={8}>
          <h2 className="mb-4 text-center">Add Animation</h2>
          <Form className="mt-3">
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleFormChange}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleFormChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Techniques</Form.Label>
              <Form.Control
                type="text"
                name="techniques"
                value={formData.techniques}
                onChange={handleFormChange}
                placeholder="Enter techniques separated by commas (e.g., Blender, Maya)"
              />
            </Form.Group>
          </Form>

          {/* Drag-and-Drop Section */}
          <div
            {...getRootProps()}
            className="border rounded p-3 text-center bg-light mt-4"
            style={{ cursor: "pointer" }}
          >
            <input {...getInputProps()} />
            {newFile ? (
              <p className="mb-0">Selected File: {newFile.name}</p>
            ) : (
              <p className="mb-0">
                Drag and drop an image or video here, or click to select one.
              </p>
            )}
          </div>

          {/* Add Animation Button */}
          <Button
            style={{
              backgroundColor: "#1E90FF",
              borderColor: "#1E90FF",
              color: "white",
            }}
            className="mt-3 w-100"
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Add Animation"}
          </Button>
        </Col>
      </Row>

      <Row className="mt-4 g-4">
        {images.map((image) => (
          <Col xs={12} sm={6} md={4} lg={3} key={image._id}>
            <Card className="h-100">
              <video
                controls
                autoPlay
                muted
                loop
                className="w-100"
                src={image.secure_url}
                alt={image.title}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{image.title}</Card.Title>
                <Card.Text className="flex-grow-1">
                  {image.description}
                </Card.Text>
                <div className="d-flex justify-content-between mt-3">
                  <Button
                    variant="primary"
                    onClick={() => handleEdit(image)}
                    size="sm"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => handleDelete(image._id)}
                    size="sm"
                  >
                    Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Modal for Editing Animation */}
      <Modal show={editMode} onHide={() => setEditMode(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Animation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                name="category"
                value={formData.category}
                onChange={handleFormChange}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleFormChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Techniques</Form.Label>
              <Form.Control
                type="text"
                name="techniques"
                value={formData.techniques}
                onChange={handleFormChange}
                placeholder="Enter techniques separated by commas"
              />
            </Form.Group>

            {/* Drag-and-Drop Section for Editing Animation Image */}
            <div
              {...getRootProps()}
              className="border rounded p-3 text-center bg-light mt-4"
              style={{ cursor: "pointer" }}
            >
              <input {...getInputProps()} />
              {newFile ? (
                <p className="mb-0">Selected File: {newFile.name}</p>
              ) : (
                <p className="mb-0">
                  Drag and drop a video here, or click to select one.
                </p>
              )}
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setEditMode(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default Gallery;
