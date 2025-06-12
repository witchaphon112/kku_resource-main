import { FaHeart, FaUniversity, FaBook, FaThLarge, FaTrophy, FaFolder, FaTags, FaCode, FaGlobe, FaFileAlt } from 'react-icons/fa';
import { Category, FilterTypes, SortOption } from '../types/gallery';

export const categories: Category[] = [
  { 
    label: "ทั้งหมด", 
    value: "all", 
    icon: <FaThLarge />,
    description: "แสดงทุกหมวดหมู่"
  },
  { 
    label: "การแพทย์", 
    value: "medical", 
    icon: <FaHeart />,
    description: "คลินิก ศูนย์การแพทย์ และการรักษาโรค"
  },
  { 
    label: "การศึกษา", 
    value: "education", 
    icon: <FaBook />,
    description: "การเรียนการสอน อบรม และสัมมนา"
  },
  { 
    label: "รอบรั้วมหาลัย", 
    value: "campus", 
    icon: <FaUniversity />,
    description: "กิจกรรมและข่าวสารในมหาวิทยาลัย"
  }
];

export const filterTypes: FilterTypes = {
  awards: {
    label: "รางวัล",
    icon: <FaTrophy />,
    options: ["Best of KKU", "Popular Choice", "Editor's Pick", "Innovation Award", "Research Excellence"]
  },
  category: {
    label: "หมวดหมู่",
    icon: <FaFolder />,
    options: ["การแพทย์", "การศึกษา", "รอบรั้วมหาลัย", "วิจัย", "นวัตกรรม"]
  },
  tags: {
    label: "แท็ก",
    icon: <FaTags />,
    options: ["คลินิก", "การแพทย์", "แพทย์", "การเรียนการสอน", "วิจัย", "นวัตกรรม", "เทคโนโลยี", "สุขภาพ", "การศึกษา"]
  },
  technology: {
    label: "เทคโนโลยี",
    icon: <FaCode />,
    options: ["AI", "VR/AR", "IoT", "Blockchain", "Mobile App", "Web Application", "Machine Learning", "Data Analytics"]
  },
  country: {
    label: "ประเทศ",
    icon: <FaGlobe />,
    options: ["ในประเทศ", "ต่างประเทศ", "ความร่วมมือระหว่างประเทศ"]
  },
  year: {
    label: "ปี",
    icon: <FaFileAlt />,
    options: ["2024", "2023", "2022", "2021", "2020"]
  }
};

export const sortOptions: SortOption[] = [
  { value: 'latest', label: 'ล่าสุด' },
  { value: 'oldest', label: 'เก่าสุด' },
  { value: 'popular', label: 'ยอดนิยม' },
  { value: 'views', label: 'ดูมากที่สุด' },
];

export const ITEMS_PER_PAGE = 12; 