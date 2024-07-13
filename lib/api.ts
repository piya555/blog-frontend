import axios, { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

const api = axios.create({
  baseURL: API_URL,
});

export const setAuthToken = (token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  // ด้วย token นี้ใน localStorage เพื่อให้สามารถใช้ได้หลังจาก refresh หน้า
  localStorage.setItem("authToken", token);
};

export const removeAuthToken = () => {
  delete api.defaults.headers.common["Authorization"];
  // ลบ token ออกจาก localStorage
  localStorage.removeItem("authToken");
};

// Intercept requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`;
  }
  return config;
});

// Intercept responses
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token หมดอายุหรือไม่ถูกต้อง
      removeAuthToken();
      // รีไดเร็กไปยังหน้า login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    setAuthToken(response.data.token);
    return response.data;
  } catch (error) {
    console.error("Login failed:", error);
    throw error;
  }
};

// Users
export const getUsers = async () => {
  try {
    const response = await api.get("/users");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
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
export const getPosts = async (page = 1, limit = 10) => {
  const response = await api.get("/posts", { params: { page, limit } });
  return response.data;
};

export const getPost = async (slug: string) => {
  const response = await api.get(`/posts/${slug}`);
  return response.data;
};

export const createPost = async (postData: any) => {
  const response = await api.post("/posts", postData);
  return response.data;
};

export const updatePost = async (slug: string, postData: any) => {
  const response = await api.put(`/posts/${slug}`, postData);
  return response.data;
};

export const deletePost = async (slug: string) => {
  const response = await api.delete(`/posts/${slug}`);
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
