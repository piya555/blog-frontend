import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
});

export const setAuthToken = (token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const removeAuthToken = () => {
  delete api.defaults.headers.common["Authorization"];
};

export const login = async (email: string, password: string) => {
  try {
    console.log("Sending login request to:", `${API_URL}/auth/login`);
    console.log("Login payload:", { email, password });
    const response = await api.post("/auth/login", { email, password });
    console.log("Login response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Login request failed:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// Users
export const getUsers = async () => {
  const response = await api.get("/users");
  return response.data;
};

export const getUser = async (id: string) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const updateUserRole = async (id: string, role: string) => {
  const response = await api.put(`/users/${id}/role`, { role });
  return response.data;
};

export const createUser = async (userData: any) => {
  const response = await api.post("/users", userData);
  return response.data;
};

export const updateUser = async (id: string, userData: any) => {
  const response = await api.put(`/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id: string) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};

// Posts
export const getPosts = async () => {
  const response = await api.get("/posts");
  return response.data;
};

export const getPost = async (id: string) => {
  const response = await api.get(`/posts/${id}`);
  return response.data;
};

export const createPost = async (postData: any) => {
  const response = await api.post("/posts", postData);
  return response.data;
};

export const updatePost = async (id: string, postData: any) => {
  const response = await api.put(`/posts/${id}`, postData);
  return response.data;
};

export const deletePost = async (id: string) => {
  const response = await api.delete(`/posts/${id}`);
  return response.data;
};
// Categories
export const getCategories = async () => {
  const response = await api.get("/categories");
  return response.data;
};

export const createCategory = async (categoryData: any) => {
  const response = await api.post("/categories", categoryData);
  return response.data;
};

export const updateCategory = async (slug: string, categoryData: any) => {
  const response = await api.put(`/categories/${slug}`, categoryData);
  return response.data;
};

export const deleteCategory = async (slug: string) => {
  const response = await api.delete(`/categories/${slug}`);
  return response.data;
};

// Tags
export const getTags = async () => {
  const response = await api.get("/tags");
  return response.data;
};

export const createTag = async (tagData: any) => {
  const response = await api.post("/tags", tagData);
  return response.data;
};

export const updateTag = async (slug: string, tagData: any) => {
  const response = await api.put(`/tags/${slug}`, tagData);
  return response.data;
};

export const deleteTag = async (slug: string) => {
  const response = await api.delete(`/tags/${slug}`);
  return response.data;
};

// Comments
export const getComments = async (postId?: string) => {
  const response = await api.get("/comments", { params: { postId } });
  return response.data;
};

export const approveComment = async (id: string) => {
  const response = await api.patch(`/comments/${id}/approve`);
  return response.data;
};

export const deleteComment = async (id: string) => {
  const response = await api.delete(`/comments/${id}`);
  return response.data;
};

export default api;
