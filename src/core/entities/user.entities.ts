// src/core/entities/user.entities.ts
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string | null;
  phone?: string;
  username?: string;
  birthday?: string;
  bio?: string;
  last_seen?: string;
  is_verified?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserProfile extends User {}

export interface UpdateUserData {
  name?: string;
  phone?: string;
  username?: string;
  birthday?: string;
  bio?: string;
  avatar?: string;
}