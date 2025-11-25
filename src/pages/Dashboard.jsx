import React from "react";
import { Box, Toolbar } from "@mui/material";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import CategoryList from "../components/CategoryList";

const Dashboard = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <Header />
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <CategoryList />
      </Box>
    </Box>
  );
};

export default Dashboard;
