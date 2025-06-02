import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export interface BookmarkedItem {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  fileUrl?: string;
  type: string;
  category: string;
  createdAt: string;
  tags?: string[];
}

interface BookmarkContextType {
  bookmarks: BookmarkedItem[];
  addBookmark: (item: BookmarkedItem) => void;
  removeBookmark: (itemId: string) => void;
  isBookmarked: (itemId: string) => boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export const BookmarkProvider = ({ children }: { children: ReactNode }) => {
  const [bookmarks, setBookmarks] = useState<BookmarkedItem[]>([]);
  const { user } = useAuth();

  // Load bookmarks from localStorage when user changes
  useEffect(() => {
    if (user) {
      const savedBookmarks = localStorage.getItem(`bookmarks_${user.id}`);
      if (savedBookmarks) {
        setBookmarks(JSON.parse(savedBookmarks));
      }
    } else {
      setBookmarks([]);
    }
  }, [user]);

  // Save bookmarks to localStorage whenever they change
  useEffect(() => {
    if (user) {
      localStorage.setItem(`bookmarks_${user.id}`, JSON.stringify(bookmarks));
    }
  }, [bookmarks, user]);

  const addBookmark = (item: BookmarkedItem) => {
    setBookmarks(prev => {
      if (!prev.some(bookmark => bookmark.id === item.id)) {
        return [...prev, item];
      }
      return prev;
    });
  };

  const removeBookmark = (itemId: string) => {
    setBookmarks(prev => prev.filter(item => item.id !== itemId));
  };

  const isBookmarked = (itemId: string) => {
    return bookmarks.some(item => item.id === itemId);
  };

  return (
    <BookmarkContext.Provider value={{ bookmarks, addBookmark, removeBookmark, isBookmarked }}>
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmarks = () => {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error('useBookmarks must be used within a BookmarkProvider');
  }
  return context;
}; 