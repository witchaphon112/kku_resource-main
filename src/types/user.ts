export interface User {
  id: string;
  username: string;
  fullName: string;
  department: string;
  role: string;
  profileImage?: string;
  createdAt: string;
  stats?: {
    uploadCount?: number;
    downloadCount?: number;
  };
} 