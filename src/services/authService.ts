import { User } from '../contexts/AuthContext';

export const login = async (username: string, password: string): Promise<User> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: '1',
        username: username,
        fullName: 'Test User',
        role: 'user',
        department: 'Test Department',
        createdAt: new Date().toISOString(),
        stats: {
          uploadCount: 0,
          downloadCount: 0,
          savedCount: 0
        }
      });
    }, 1000);
  });
};

export const logout = async (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
};
