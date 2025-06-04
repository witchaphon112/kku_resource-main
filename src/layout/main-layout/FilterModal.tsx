import React, { useEffect } from 'react';
import { createUseStyles } from 'react-jss';
import { FaFilter, FaTimes, FaCheck, FaSearch, FaSort } from 'react-icons/fa';

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
    display: 'none',
    '@media (max-width: 768px)': {
      display: 'flex',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      justifyContent: 'flex-end',
      alignItems: 'stretch',
      zIndex: 1000,
    }
  },
  filterContent: {
    background: '#fff',
    width: '85%',
    maxWidth: '360px',
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
    boxShadow: '-4px 0 20px rgba(0,0,0,0.15)',
    animation: '$slideRight 0.3s ease-out',
  },
  '@keyframes slideRight': {
    from: {
      transform: 'translateX(100%)',
    },
    to: {
      transform: 'translateX(0)',
    },
  },
  filterHeader: {
    padding: '16px',
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
    fontSize: '1.1rem',
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
    '&:active': {
      background: '#DBE2EF',
      color: '#112D4E',
      transform: 'scale(0.95)',
    },
  },
  filterBody: {
    padding: '16px',
    height: 'calc(100% - 130px)',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
  },
  filterSection: {
    marginBottom: '24px',
    '&:last-child': {
      marginBottom: 0,
    },
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
  },
  sectionIcon: {
    color: '#3F72AF',
    fontSize: '1rem',
  },
  label: {
    fontWeight: 700,
    fontSize: '0.95rem',
    color: '#112D4E',
  },
  searchBox: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1.5px solid #DBE2EF',
    fontSize: '0.95rem',
    color: '#112D4E',
    background: '#fff',
    transition: 'all 0.2s',
    WebkitAppearance: 'none',
    '&:focus': {
      outline: 'none',
      borderColor: '#3F72AF',
      boxShadow: '0 0 0 3px rgba(63,114,175,0.1)',
    },
  },
  select: {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '12px',
    border: '1.5px solid #DBE2EF',
    fontSize: '0.95rem',
    color: '#112D4E',
    background: '#fff',
    cursor: 'pointer',
    WebkitAppearance: 'none',
    backgroundImage: 'url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'currentColor\' stroke-width=\'2\' stroke-linecap=\'round\' stroke-linejoin=\'round\'%3e%3cpolyline points=\'6 9 12 15 18 9\'%3e%3c/polyline%3e%3c/svg%3e")',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
    backgroundSize: '16px',
    paddingRight: '40px',
    '&:focus': {
      outline: 'none',
      borderColor: '#3F72AF',
      boxShadow: '0 0 0 3px rgba(63,114,175,0.1)',
    },
  },
  typeGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
  },
  typeButton: {
    background: '#f8f9fa',
    border: '1.5px solid #DBE2EF',
    borderRadius: '12px',
    padding: '12px',
    fontSize: '0.9rem',
    color: '#3F72AF',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'all 0.2s',
    '&:active': {
      transform: 'scale(0.98)',
      background: '#DBE2EF',
    },
  },
  typeButtonActive: {
    background: '#3F72AF',
    color: '#fff',
    borderColor: '#3F72AF',
  },
  yearGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '8px',
    maxHeight: '200px',
    overflowY: 'auto',
    WebkitOverflowScrolling: 'touch',
    padding: '4px 0',
  },
  yearButton: {
    background: '#f8f9fa',
    border: '1.5px solid #DBE2EF',
    borderRadius: '12px',
    padding: '10px 12px',
    fontSize: '0.9rem',
    color: '#3F72AF',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    transition: 'all 0.2s',
    '&:active': {
      transform: 'scale(0.98)',
      background: '#DBE2EF',
    },
  },
  yearButtonActive: {
    background: '#3F72AF',
    color: '#fff',
    borderColor: '#3F72AF',
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
    gap: '8px',
    padding: '16px',
    borderTop: '1px solid #DBE2EF',
    background: '#fff',
    position: 'sticky',
    bottom: 0,
    zIndex: 1,
  },
  resetButton: {
    flex: 1,
    padding: '14px',
    borderRadius: '12px',
    border: '1.5px solid #DBE2EF',
    background: '#fff',
    color: '#3F72AF',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:active': {
      background: '#DBE2EF',
      transform: 'scale(0.98)',
    },
  },
  applyButton: {
    flex: 2,
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    background: '#3F72AF',
    color: '#fff',
    fontSize: '0.95rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
    '&:active': {
      background: '#112D4E',
      transform: 'scale(0.98)',
    },
  },
  '@supports (padding-bottom: env(safe-area-inset-bottom))': {
    filterContent: {
      paddingBottom: 'env(safe-area-inset-bottom)',
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
              <div className={classes.sectionHeader}>
                <FaSearch className={classes.sectionIcon} />
                <div className={classes.label}>คำสำคัญ</div>
              </div>
              <input
                className={classes.searchBox}
                placeholder="หนังสือ, หัวข้อ, ผู้แต่ง ฯลฯ"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
              />
            </div>

            <div className={classes.filterSection}>
              <div className={classes.sectionHeader}>
                <FaSort className={classes.sectionIcon} />
                <div className={classes.label}>การจัดเรียง</div>
              </div>
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
              <div className={classes.sectionHeader}>
                <FaFilter className={classes.sectionIcon} />
                <div className={classes.label}>ประเภททรัพยากร</div>
              </div>
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
              <div className={classes.sectionHeader}>
                <div className={classes.label}>ปีที่เผยแพร่</div>
              </div>
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