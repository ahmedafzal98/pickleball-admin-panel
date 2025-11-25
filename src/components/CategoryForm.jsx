import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Avatar,
  Snackbar,
  Alert,
} from "@mui/material";
import { createCategory, updateCategory } from "../api/categoryService";
import { uploadFile } from "../api/fileService";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

const CategoryFormModal = ({ open, handleClose, category }) => {
  const [name, setName] = useState("");
  const [file, setFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [breadcrumb, setBreadcrumb] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    if (category) {
      setName(category.name || "");
      setBreadcrumb(
        category.breadcrumb || (category.parent_id ? "Parent Category" : "")
      );
      setImagePreview(category.image?.data?.full_url || "");
    } else {
      setName("");
      setFile(null);
      setImagePreview("");
      setBreadcrumb("");
    }
  }, [category]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setImagePreview(URL.createObjectURL(selectedFile));
  };

  const handleSubmit = async () => {
    try {
      let imageData = null;
      if (file) {
        const uploadedFile = await uploadFile(file);
        imageData = { id: uploadedFile.id };
      }

      const data = { name };
      if (imageData) data.image = imageData;
      if (category?.parent_id) data.parent_id = category.parent_id;

      if (category && category.id) {
        await updateCategory(category.id, data);
        setSnackbar({
          open: true,
          message: "Category updated successfully!",
          severity: "success",
        });
      } else {
        await createCategory(data);
        setSnackbar({
          open: true,
          message: "Category added successfully!",
          severity: "success",
        });
      }

      handleClose();
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Error saving category.",
        severity: "error",
      });
    }
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" mb={2}>
            {category?.id ? "Edit Category" : "Add Category"}
          </Typography>
          {breadcrumb && (
            <Typography variant="caption" color="text.secondary" mb={1}>
              Parent Path: {breadcrumb}
            </Typography>
          )}
          <Stack spacing={2}>
            <TextField
              label="Category Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            <Button variant="contained" component="label">
              {file || imagePreview ? "Change Image" : "Upload Image"}
              <input
                type="file"
                hidden
                onChange={handleFileChange}
                accept="image/*"
              />
            </Button>
            {imagePreview && (
              <Avatar src={imagePreview} sx={{ width: 100, height: 100 }} />
            )}
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              {category?.id ? "Update" : "Add"}
            </Button>
          </Stack>
        </Box>
      </Modal>

      {/* Snackbar Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CategoryFormModal;
