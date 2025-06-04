import React, { useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { FaFilter, FaTimes, FaCheck } from 'react-icons/fa';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  keyword: string;
  setKeyword: (value: string) => void;
  searchBy: string;
  setSearchBy: (value: string) => void;
  sort: string;
  setSort: (value: string) => void;
  types: string[];
  handleTypeChange: (type: string) => void;
  selectedYears: string[];
  setSelectedYears: (years: string[]) => void;
  yearCounts: Record<string, number>;
  uniqueYears: string[];
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  resourceTypes: string[];
}

const useStyles = createUseStyles({
  filterModal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
    zIndex: 1000,
    padding: '20px',
    overflow: 'auto',
  },
  filterContent: {
    background: '#fff',
    borderRadius: '16px',
    width: '100%',
    maxWidth: '600px',
    maxHeight: '90vh',
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
    animation: '$slideIn 0.3s ease-out',
    '@media (max-width: 768px)': {
      maxWidth: '90%',
      margin: '0 auto',
    },
  },
  '@keyframes slideIn': {
    from: {
      transform: 'translateY(-20px)',
      opacity: 0,
    },
    to: {
      transform: 'translateY(0)',
      opacity: 1,
    },
  },
  filterHeader: {
    padding: '20px',
    borderBottom: '1px solid #DBE2EF',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#fff',
    position: 'sticky',
    top: 0,
    zIndex: 1,
  },
  filterTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#112D4E',
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  closeButton: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    border: 'none',
    background: '#f8f9fa',
    color: '#666',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
      background: '#DBE2EF',
      color: '#112D4E',
    },
  },
  filterBody: {
    padding: '20px',
    overflowY: 'auto',
    maxHeight: 'calc(90vh - 160px)',
  },
  filterSection: {
    marginBottom: '24px',
    '&:last-child': {
      marginBottom: 0,
    },
  },
  label: {
    fontWeight: 700,
    fontSize: '0.95rem',
    color: '#112D4E',
    marginBottom: '8px',
  },
  searchBox: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1.5px solid #DBE2EF',
    fontSize: '0.95rem',
    color: '#112D4E',
    background: '#fff',
    transition: 'all 0.2s',
    '&:focus': {
      outline: 'none',
      borderColor: '#3F72AF',
      boxShadow: '0 0 0 3px rgba(63,114,175,0.1)',
    },
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '10px',
    border: '1.5px solid #DBE2EF',
    fontSize: '0.95rem',
    color: '#112D4E',
    background: '#fff',
    cursor: 'pointer',
    '&:focus': {
      outline: 'none',
      borderColor: '#3F72AF',
      boxShadow: '0 0 0 3px rgba(63,114,175,0.1)',
    },
  },
  typeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: '8px',
    marginTop: '8px',
  },
  typeButton: {
    background: '#f8f9fa',
    border: '1.5px solid #DBE2EF',
    borderRadius: '10px',
    padding: '12px 16px',
    fontSize: '0.95rem',
    color: '#3F72AF',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s',
    '&:hover': {
      background: '#DBE2EF',
    },
  },
  typeButtonActive: {
    background: '#3F72AF',
    color: '#fff',
    borderColor: '#3F72AF',
    '&:hover': {
      background: '#112D4E',
    },
  },
  yearGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
    gap: '8px',
    marginTop: '8px',
    maxHeight: '240px',
    overflowY: 'auto',
    padding: '4px',
  },
  yearButton: {
    background: '#f8f9fa',
    border: '1.5px solid #DBE2EF',
    borderRadius: '10px',
    padding: '10px 12px',
    fontSize: '0.9rem',
    color: '#3F72AF',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'all 0.2s',
    '&:hover': {
      background: '#DBE2EF',
    },
  },
  yearButtonActive: {
    background: '#3F72AF',
    color: '#fff',
    borderColor: '#3F72AF',
    '&:hover': {
      background: '#112D4E',
    },
  },
  yearCount: {
    fontSize: '0.85rem',
    opacity: 0.8,
  },
  checkIcon: {
    fontSize: '0.9rem',
  },
  filterActions: {
    display: 'flex',
    gap: '12px',
    padding: '20px',
    borderTop: '1px solid #DBE2EF',
    background: '#fff',
    position: 'sticky',
    bottom: 0,
    zIndex: 1,
  },
  resetButton: {
    flex: 1,
    padding: '12px',
    borderRadius: '10px',
    border: '1.5px solid #DBE2EF',
    background: '#fff',
    color: '#3F72AF',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
      background: '#DBE2EF',
    },
  },
  applyButton: {
    flex: 2,
    padding: '12px',
    borderRadius: '10px',
    border: 'none',
    background: '#3F72AF',
    color: '#fff',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:hover': {
      background: '#112D4E',
    },
  },
});

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  keyword,
  setKeyword,
  searchBy,
  setSearchBy,
  sort,
  setSort,
  types,
  handleTypeChange,
  selectedYears,
  setSelectedYears,
  yearCounts,
  uniqueYears,
  handleSubmit,
  resourceTypes,
}) => {
  const classes = useStyles();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={classes.filterModal} onClick={onClose}>
      <div className={classes.filterContent} onClick={e => e.stopPropagation()}>
        <div className={classes.filterHeader}>
          <h2 className={classes.filterTitle}>
            <FaFilter /> ตัวกรองการค้นหา
          </h2>
          <button className={classes.closeButton} onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        <div className={classes.filterBody}>
          <form onSubmit={handleSubmit}>
            <div className={classes.filterSection}>
              <div className={classes.label}>คำสำคัญ</div>
              <input
                className={classes.searchBox}
                placeholder="หนังสือ, หัวข้อ, ผู้แต่ง ฯลฯ"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
              />
            </div>

            <div className={classes.filterSection}>
              <div className={classes.label}>ค้นหาจาก</div>
              <select
                className={classes.select}
                value={searchBy}
                onChange={e => setSearchBy(e.target.value)}
              >
                <option value="title">ชื่อเรื่อง</option>
                <option value="category">หมวดหมู่</option>
              </select>
            </div>

            <div className={classes.filterSection}>
              <div className={classes.label}>เรียงลำดับจาก</div>
              <select
                className={classes.select}
                value={sort}
                onChange={e => setSort(e.target.value)}
              >
                <option value="newest">เรียงตาม: ล่าสุด</option>
                <option value="oldest">เรียงตาม: เก่าสุด</option>
                <option value="az">เรียงตาม: ก-ฮ</option>
                <option value="za">เรียงตาม: ฮ-ก</option>
                <option value="popular">เรียงตาม: ยอดนิยม</option>
              </select>
            </div>

            <div className={classes.filterSection}>
              <div className={classes.label}>ประเภททรัพยากร</div>
              <div className={classes.typeGrid}>
                {resourceTypes.map(type => (
                  <button
                    key={type}
                    type="button"
                    className={`${classes.typeButton} ${types.includes(type) ? classes.typeButtonActive : ''}`}
                    onClick={() => handleTypeChange(type)}
                  >
                    {types.includes(type) && <FaCheck className={classes.checkIcon} />}
                    {type === "image" ? "รูปภาพ" : 
                     type === "video" ? "วิดีโอ" : 
                     type === "graphic" ? "กราฟิก" : type}
                  </button>
                ))}
              </div>
            </div>

            <div className={classes.filterSection}>
              <div className={classes.label}>ปีที่เผยแพร่</div>
              <div className={classes.yearGrid}>
                {uniqueYears.map(year => (
                  <button
                    key={year}
                    type="button"
                    className={`${classes.yearButton} ${selectedYears.includes(year) ? classes.yearButtonActive : ''}`}
                    onClick={() => setSelectedYears(
                      selectedYears.includes(year)
                        ? selectedYears.filter(y => y !== year)
                        : [...selectedYears, year]
                    )}
                  >
                    {year}
                    <span className={classes.yearCount}>({yearCounts[year] || 0})</span>
                    {selectedYears.includes(year) && <FaCheck className={classes.checkIcon} />}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
        <div className={classes.filterActions}>
          <button 
            type="button" 
            className={classes.resetButton}
            onClick={() => {
              setKeyword("");
              setSearchBy("title");
              setSort("newest");
              handleTypeChange("ทั้งหมด");
              setSelectedYears([]);
            }}
          >
            รีเซ็ตตัวกรอง
          </button>
          <button 
            type="button" 
            className={classes.applyButton} 
            onClick={() => {
              handleSubmit(new Event('submit') as any);
              onClose();
            }}
          >
            ใช้ตัวกรอง
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal; 