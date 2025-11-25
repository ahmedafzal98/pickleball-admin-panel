import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Vite env variable
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_DIRECTUS_TOKEN}`, // Vite env variable
  },
});

// Fetch all categories with parent info and image details
export const getCategories = () =>
  api.get(
    "/items/categories?fields=id,name,parent.id,parent.name,image.*,children.*&limit=-1"
  );

// Fetch single category
export const getCategory = (id) =>
  api.get(
    `/items/categories/${id}?fields=id,name,parent.id,parent.name,image.*,children.*`
  );

// Create category
export const createCategory = (data) => api.post("/items/categories", data);

// Update category
export const updateCategory = (id, data) =>
  api.patch(`/items/categories/${id}`, data);

// Recursive delete category
export const deleteCategory = async (id) => {
  // Fetch the category with children
  const res = await getCategory(id);
  const category = res.data.data;

  if (category.children && category.children.length > 0) {
    // Delete all child categories first
    for (const child of category.children) {
      await deleteCategory(child.id); // recursive deletion
    }
  }

  // Delete the parent category
  return api.delete(`/items/categories/${id}`);
};
