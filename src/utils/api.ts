import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const uploadProfilePicture = async (file: File) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const formData = new FormData();
    formData.append("image", file);

    const response = await API.post("/users/profile-picture", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error uploading profile picture:", error);
    throw error;
  }
};

export const addNote = async (note: { title: string; content: string }) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No authentication token found");
    }

    const response = await API.post("/notes", note, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating note:", error);
    throw error;
  }
};

export default API;
