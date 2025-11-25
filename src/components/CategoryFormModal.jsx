// src/components/CategoryFormModal.jsx
import React, { useEffect, useState, useCallback } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  Box,
  MenuItem,
  Stack,
  Snackbar,
  Alert,
} from "@mui/material";
import {
  getCategories,
  createCategory,
  updateCategory,
} from "../api/categoryService";
import { uploadFile } from "../api/fileService";

const CategoryFormModal = ({
  open,
  onClose,
  onSaved,
  initialCategory = null,
}) => {
  const isEdit = Boolean(initialCategory);
  const [name, setName] = useState("");
  const [parent, setParent] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [allCategories, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const fetchCategories = useCallback(async () => {
    try {
      const res = await getCategories();
      // res.data.data is array
      setAllCategories(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (open) fetchCategories();
  }, [open, fetchCategories]);

  useEffect(() => {
    if (initialCategory) {
      setName(initialCategory.name || "");
      setParent(initialCategory.parent?.id || "");
      setImagePreview(
        initialCategory.image
          ? `https://pickleball-admin-backend.directus.app/assets/${initialCategory.image.id}`
          : null
      );
      setImageFile(null);
    } else {
      setName("");
      setParent("");
      setImageFile(null);
      setImagePreview(null);
    }
  }, [initialCategory, open]);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0] ?? null;
    if (f) {
      setImageFile(f);
      setImagePreview(URL.createObjectURL(f));
    }
  };

  const handleSave = async () => {
    if (!name?.trim()) {
      setSnack({ open: true, message: "Name is required", severity: "error" });
      return;
    }
    setLoading(true);
    try {
      let imageId = initialCategory?.image?.id || null;

      if (imageFile) {
        const uploaded = await uploadFile(imageFile);
        imageId = uploaded.id;
      }

      const payload = {
        name: name.trim(),
        parent: parent ? Number(parent) : null,
        image: imageId || null,
      };

      if (isEdit) {
        await updateCategory(initialCategory.id, payload);
        setSnack({
          open: true,
          message: "Category updated",
          severity: "success",
        });
      } else {
        await createCategory(payload);
        setSnack({
          open: true,
          message: "Category created",
          severity: "success",
        });
      }

      onSaved(); // ask parent to refresh
      onClose();
    } catch (err) {
      console.error(err);
      setSnack({ open: true, message: "Save failed", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            p: 2,
            boxShadow: 6,
          },
        }}
      >
        <DialogTitle
          sx={{ fontWeight: 600, fontSize: 22, textAlign: "center" }}
        >
          {isEdit ? "Edit Category" : "Add Category"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            {/* Name Field */}
            <TextField
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              required
              variant="outlined"
              sx={{
                "& label": { fontWeight: 500 },
              }}
            />

            {/* Parent Dropdown */}
            <TextField
              select
              label="Parent (optional)"
              value={parent ?? ""}
              onChange={(e) => setParent(e.target.value ?? "")}
              fullWidth
              variant="outlined"
            >
              <MenuItem value="">None</MenuItem>
              {allCategories
                .filter((c) => !initialCategory || c.id !== initialCategory.id)
                .map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.name}
                  </MenuItem>
                ))}
            </TextField>

            {/* Image Upload */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Button
                variant="contained"
                component="label"
                sx={{
                  background: imagePreview
                    ? "linear-gradient(45deg, #f57c00, #ffb74d)"
                    : "linear-gradient(45deg, #1976d2, #64b5f6)",
                  color: "#fff",
                  fontWeight: 600,
                  textTransform: "none",
                  borderRadius: 2,
                  py: 1,
                  "&:hover": {
                    background: imagePreview
                      ? "linear-gradient(45deg, #ef6c00, #ffa726)"
                      : "linear-gradient(45deg, #1565c0, #42a5f5)",
                  },
                }}
              >
                {imagePreview ? "Change Image" : "Upload Image"}
                <input
                  hidden
                  accept="image/*"
                  type="file"
                  onChange={handleFileChange}
                />
              </Button>

              {imagePreview && (
                <Box
                  component="img"
                  src={imagePreview}
                  alt="preview"
                  sx={{
                    width: "100%",
                    height: 200,
                    objectFit: "cover",
                    borderRadius: 2,
                    border: "1px solid #e0e0e0",
                    boxShadow: 3,
                  }}
                />
              )}
            </Box>

            {/* Action Buttons */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                justifyContent: "flex-end",
                mt: 1,
              }}
            >
              <Button
                onClick={onClose}
                variant="outlined"
                sx={{
                  borderRadius: 2,
                  px: 3,
                  fontWeight: 500,
                  textTransform: "none",
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                variant="contained"
                disabled={loading}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  fontWeight: 600,
                  textTransform: "none",
                  background: "linear-gradient(45deg, #4caf50, #81c784)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #43a047, #66bb6a)",
                  },
                }}
              >
                {isEdit ? "Update" : "Add"}
              </Button>
            </Box>
          </Stack>
        </DialogContent>

        {/* Snackbar */}
        <Snackbar
          open={snack.open}
          autoHideDuration={3000}
          onClose={() => setSnack({ ...snack, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => setSnack({ ...snack, open: false })}
            severity={snack.severity}
            sx={{ width: "100%", fontWeight: 500 }}
          >
            {snack.message}
          </Alert>
        </Snackbar>
      </Dialog>

      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={() => setSnack({ ...snack, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnack({ ...snack, open: false })}
          severity={snack.severity}
          sx={{ width: "100%" }}
        >
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default CategoryFormModal;
