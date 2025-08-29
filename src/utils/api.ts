import axios from "axios";

const BASE_URL = "http://localhost:3000/api";

const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

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
