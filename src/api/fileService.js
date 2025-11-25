import axios from "axios";

const api = axios.create({
  baseURL: "https://pickleball-admin-backend.directus.app",
  headers: {
    "Content-Type": "multipart/form-data",
    Authorization: `Bearer G6qYcu1ntJiPB_aFLRcIl4Ic-_BZBMWq`,
  },
});

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/files", formData);
  return response.data.data; // returns uploaded file object
};
