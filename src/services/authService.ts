import users from '../mock/db.json';

export const login = (username: string, password: string) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        resolve(user);
      } else {
        reject(new Error('Invalid username or password'));
      }
    }, 800); // simulate delay
  });
};
