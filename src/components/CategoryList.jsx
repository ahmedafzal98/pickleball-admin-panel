// src/components/CategoryList.jsx
import React, { useEffect, useState, useCallback, useMemo } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Skeleton,
  Snackbar,
  Alert,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import CategoryCard from "./CategoryCard";
import CategoryFormModal from "./CategoryFormModal";
import ConfirmDialog from "./ConfirmDialog";
import { getCategories, deleteCategory } from "../api/categoryService";
import { buildHierarchy } from "../utils/buildHierarchy";
import { debounce } from "lodash";

const CategoryList = () => {
  const [tree, setTree] = useState([]);
  const [filteredTree, setFilteredTree] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, category: null });
  const [snack, setSnack] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [search, setSearch] = useState("");

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getCategories(); // expects res.data.data
      const list = res.data?.data ?? [];
      const hierarchical = buildHierarchy(list);
      setTree(hierarchical);
      setFilteredTree(hierarchical);
    } catch (err) {
      console.error(err);
      setSnack({
        open: true,
        message: "Failed to load categories",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  // Debounced search
  const handleSearch = useMemo(
    () =>
      debounce((query) => {
        if (!query) {
          setFilteredTree(tree);
          return;
        }
        const filterTree = (nodes) => {
          return nodes
            .map((node) => {
              const children = node.children ? filterTree(node.children) : [];
              if (
                node.name.toLowerCase().includes(query.toLowerCase()) ||
                children.length > 0
              ) {
                return { ...node, children };
              }
              return null;
            })
            .filter(Boolean);
        };
        setFilteredTree(filterTree(tree));
      }, 300),
    [tree]
  );

  const onSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    handleSearch(value);
  };

  const handleAdd = () => {
    setEditing(null);
    setOpenForm(true);
  };
  const handleEdit = useCallback((cat) => {
    setEditing(cat);
    setOpenForm(true);
  }, []);
  const handleDeleteRequest = useCallback((cat) => {
    setConfirm({ open: true, category: cat });
  }, []);
  const handleConfirmDelete = async () => {
    const cat = confirm.category;
    if (!cat) return;
    setConfirm({ open: false, category: null });
    try {
      await deleteCategory(cat.id);
      setSnack({
        open: true,
        message: "Deleted successfully",
        severity: "success",
      });
      fetchAll();
    } catch (err) {
      console.error(err);
      setSnack({ open: true, message: "Delete failed", severity: "error" });
    }
  };

  const handleSaved = () => {
    fetchAll();
  };

  return (
    <Box>
      {/* Header with Add + Search */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Button
          variant="contained"
          onClick={handleAdd}
          sx={{
            background: "linear-gradient(45deg, #4caf50, #81c784)", // gradient green
            color: "#fff",
            fontWeight: 600,
            textTransform: "none",
            borderRadius: 3,
            px: 3,
            py: 1.2,
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            transition: "transform 0.2s, box-shadow 0.2s",
            "&:hover": {
              transform: "translateY(-2px)",
              boxShadow: "0 6px 12px rgba(0,0,0,0.3)",
              background: "linear-gradient(45deg, #43a047, #66bb6a)",
            },
          }}
        >
          + Add Category
        </Button>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <TextField
            placeholder="Search categories..."
            value={search}
            onChange={onSearchChange}
            size="medium"
            sx={{
              width: 350,
              backgroundColor: "#f5f5f5",
              borderRadius: "12px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
              "& .MuiInputBase-root": {
                borderRadius: "12px",
                paddingRight: "8px",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
              },
              "&:hover": {
                boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
              },
              "& .Mui-focused": {
                boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#666" }} />
                </InputAdornment>
              ),
              endAdornment: search && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => {
                      setSearch("");
                      handleSearch("");
                    }}
                    size="small"
                  >
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          {loading && (
            <CircularProgress
              size={28}
              thickness={5}
              sx={{
                color: "#1976d2",
                ml: 1,
              }}
            />
          )}
        </Box>
      </Box>

      {/* Categories List */}
      {loading ? (
        <>
          <Skeleton variant="rectangular" height={96} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={96} sx={{ mb: 2 }} />
          <Skeleton variant="rectangular" height={96} sx={{ mb: 2 }} />
        </>
      ) : filteredTree.length === 0 ? (
        <Box>No categories found</Box>
      ) : (
        filteredTree.map((cat) => (
          <CategoryCard
            key={cat.id}
            category={cat}
            onEdit={handleEdit}
            onDelete={handleDeleteRequest}
          />
        ))
      )}

      <CategoryFormModal
        open={openForm}
        onClose={() => setOpenForm(false)}
        onSaved={handleSaved}
        initialCategory={editing}
      />

      <ConfirmDialog
        open={confirm.open}
        title="Delete category?"
        message={`Are you sure you want to delete "${confirm.category?.name}"? This action cannot be undone.`}
        onCancel={() => setConfirm({ open: false, category: null })}
        onConfirm={handleConfirmDelete}
      />

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
    </Box>
  );
};

export default CategoryList;
