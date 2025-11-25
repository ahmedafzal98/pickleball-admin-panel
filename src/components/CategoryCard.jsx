// src/components/CategoryCard.jsx
import React, { useState, useCallback } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
  Collapse,
  Tooltip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";

const CategoryCard = React.memo(({ category, level = 0, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const indent = level * 20;

  const imageUrl = category.image
    ? `${import.meta.env.VITE_API_BASE_URL}/assets/${category.image.id}`
    : null;

  const handleToggle = useCallback(() => setOpen((s) => !s), []);

  return (
    <Box sx={{ ml: indent, mb: 2 }}>
      <Card
        variant="outlined"
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          borderRadius: 2,
          boxShadow: 2,
          transition: "transform 0.2s, box-shadow 0.2s",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: 4,
          },
        }}
      >
        {/* Category Image */}
        {imageUrl ? (
          <Box
            component="img"
            src={imageUrl}
            alt={category.name}
            sx={{
              width: 80,
              height: 80,
              objectFit: "cover",
              borderRadius: 2,
              mr: 2,
              border: "1px solid #ddd",
            }}
          />
        ) : (
          <Box
            sx={{
              width: 80,
              height: 80,
              backgroundColor: "grey.100",
              borderRadius: 2,
              mr: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "grey.500",
              fontWeight: "bold",
              fontSize: 16,
              border: "1px dashed #ccc",
            }}
          >
            No Image
          </Box>
        )}

        {/* Category Info */}
        <CardContent sx={{ flex: "1 1 auto", py: 0 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, mb: 0.5 }}
            title={category.name}
          >
            {category.name}
          </Typography>
          {category.parent && (
            <Typography variant="body2" color="text.secondary">
              Parent: {category.parent.name}
            </Typography>
          )}
          {category.children && category.children.length > 0 && (
            <Typography variant="caption" color="text.secondary">
              {category.children.length} Subcategories
            </Typography>
          )}
        </CardContent>

        {/* Actions */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, pr: 1 }}>
          {category.children?.length > 0 && (
            <Tooltip title={open ? "Collapse" : "Expand"}>
              <IconButton
                size="small"
                onClick={handleToggle}
                sx={{
                  transition: "transform 0.2s",
                  "&:hover": { transform: "scale(1.2)" },
                }}
              >
                {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
            </Tooltip>
          )}
          <Button
            size="small"
            variant="outlined"
            color="warning"
            onClick={() => onEdit(category)}
            sx={{ textTransform: "none", fontWeight: 500 }}
          >
            Edit
          </Button>
          <Button
            size="small"
            variant="contained"
            color="error"
            onClick={() => onDelete(category)}
            sx={{ textTransform: "none", fontWeight: 500 }}
          >
            Delete
          </Button>
        </Box>
      </Card>

      {/* Children */}
      {category.children && category.children.length > 0 && (
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Box sx={{ mt: 1 }}>
            {category.children.map((child) => (
              <CategoryCard
                key={child.id}
                category={child}
                level={level + 1}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </Box>
        </Collapse>
      )}
    </Box>
  );
});

export default CategoryCard;
