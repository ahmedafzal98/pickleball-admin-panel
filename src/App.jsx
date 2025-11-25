import { useState } from "react";
import { Container, Typography, Button } from "@mui/material";
import CategoryList from "./components/CategoryList";
import AddCategoryModal from "./components/CategoryFormModal";

const App = () => {
  const [openModal, setOpenModal] = useState(false);
  const [refresh, setRefresh] = useState(false); // trigger CategoryList refresh

  const handleAdded = () => {
    setRefresh(!refresh); // refresh category list after adding new category
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Categories Admin Panel
      </Typography>
      <AddCategoryModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onAdded={handleAdded}
      />
      <CategoryList key={refresh} />{" "}
      {/* refresh list when new category added */}
    </Container>
  );
};

export default App;
