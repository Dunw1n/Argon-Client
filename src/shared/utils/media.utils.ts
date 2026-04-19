// src/shared/utils/media.utils.ts

const SERVER_IP = process.env.EXPO_PUBLIC_SERVER_IP || '192.168.1.199';
const SERVER_PORT = process.env.EXPO_PUBLIC_SERVER_PORT || '3000';
const BASE_URL = `http://${SERVER_IP}:${SERVER_PORT}`;

export const getMediaUrl = (path: string | null | undefined): string | null => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  if (path.startsWith('//')) return `https:${path}`;
  
  return `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

export const getAvatarUrl = getMediaUrl; 