// src/models/interface.ts

// User
export interface User {
  id: string;
  username: string;
  email: string;
  role: "user" | "admin";
  avatar?: string;
}

// Post
export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author: User;
  categories: Category[];
  tags: Tag[];
  isPublished: boolean;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

// Category
export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  thumbnail?: string;
}

// Tag
export interface Tag {
  id: string;
  name: string;
  slug: string;
}

// Comment
export interface Comment {
  id: string;
  content: string;
  post: string; // Post ID
  author: User;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

// Banner
export interface Banner {
  id: string;
  title: string;
  imageUrl: string;
  link?: string;
  isActive: boolean;
}

// Page
export interface Page {
  id: string;
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}

// MenuItem
export interface MenuItem {
  id: string;
  title: string;
  url: string;
  order: number;
  parent?: string; // Parent MenuItem ID
  children?: MenuItem[];
}

// API Response Interfaces
export interface PaginatedResponse<T> {
  data: T[];
  totalPages: number;
  currentPage: number;
  totalItems: number;
}

// Input Interfaces for Create/Update operations
export interface CreatePostInput {
  id?: string;
  title: string;
  content: string;
  excerpt?: string;
  categories: string[]; // Array of category IDs
  tags: string[]; // Array of tag IDs
  isPublished: boolean;
  thumbnail?: File | null; // เปลี่ยนจาก File เป็น File | null
}

export interface UpdatePostInput extends Partial<CreatePostInput> {
  slug?: string;
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  description?: string;
  thumbnail?: string;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {}

export interface CreateTagInput {
  name: string;
  slug: string;
}

export interface UpdateTagInput extends Partial<CreateTagInput> {}

export interface CreateCommentInput {
  content: string;
  postId: string;
}

export interface UpdateCommentInput {
  content: string;
  isApproved: boolean;
}

export interface CreateBannerInput {
  title: string;
  imageUrl: string;
  link?: string;
  isActive: boolean;
}

export interface UpdateBannerInput extends Partial<CreateBannerInput> {}

export interface CreatePageInput {
  title: string;
  slug: string;
  content: string;
  isPublished: boolean;
  thumbnail?: string;
}

export interface UpdatePageInput extends Partial<CreatePageInput> {}

export interface CreateMenuItemInput {
  title: string;
  url: string;
  order: number;
  parentId?: string;
}

export interface UpdateMenuItemInput extends Partial<CreateMenuItemInput> {}

// Auth
export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterInput extends LoginInput {
  username: string;
}
