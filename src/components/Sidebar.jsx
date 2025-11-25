import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";

const Sidebar = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          bgcolor: "#1976d2",
          color: "#fff",
        },
      }}
    >
      <Typography variant="h5" sx={{ m: 2 }}>
        Admin Panel
      </Typography>
      <List>
        <ListItemButton>
          <ListItemText primary="Categories" />
        </ListItemButton>
        {/* Add more menu items here if needed */}
      </List>
    </Drawer>
  );
};

export default Sidebar;
