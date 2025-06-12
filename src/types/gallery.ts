import React from 'react';

export interface Resource {
  id: string;
  title: string;
  description?: string;
  type: string;
  category: string;
  thumbnailUrl: string;
  fileUrl: string;
  createdAt: string;
  viewCount?: number;
  downloadCount?: number;
  uploadedBy?: string;
  gallery?: string[];
  tags?: string[];
  awards?: string[];
  country?: 'Thailand' | 'International';
  collaboration?: 'domestic' | 'international';
}

export interface FilterState {
  category: string[];
  tags: string[];
  technology: string[];
  awards: string[];
  country: string[];
  year: string[];
  timeframe: string | null;
  [key: string]: string[] | string | null;
}

export interface Category {
  label: string;
  value: string;
  icon: React.ReactNode;
  children?: SubCategory[];
  description: string;
}

export interface SubCategory {
  label: string;
  value: string;
}

export interface FilterType {
  label: string;
  icon: React.ReactNode;
  options: string[];
}

export interface FilterTypes {
  [key: string]: FilterType;
}

export interface SortOption {
  value: string;
  label: string;
} 