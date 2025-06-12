import React from 'react';
import { createUseStyles } from 'react-jss';
import { FaTags, FaClock, FaFilter, FaTimes, FaUndo } from 'react-icons/fa';

const useStyles = createUseStyles({
  filterBar: {
    background: '#fff',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    animation: '$slideDown 0.3s ease',
  },
  filterContent: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '24px',
    marginTop: '20px',
    '@media (max-width: 768px)': {
      gridTemplateColumns: '1fr',
    },
  },
  filterSection: {
    '& h3': {
      fontSize: '0.9rem',
      fontWeight: 600,
      color: '#666',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      '& svg': {
        color: '#3F72AF',
      },
    },
  },
  tagsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
  },
  tagButton: {
    padding: '6px 12px',
    borderRadius: '100px',
    border: '1px solid #e0e0e0',
    background: '#fff',
    color: '#666',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: '#3F72AF',
      color: '#3F72AF',
      background: '#f8faff',
    },
    '&.active': {
      background: '#3F72AF',
      color: '#fff',
      borderColor: '#3F72AF',
    },
  },
  timeframeSelect: {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    background: '#fff',
    color: '#666',
    fontSize: '0.9rem',
    cursor: 'pointer',
    '&:focus': {
      outline: 'none',
      borderColor: '#3F72AF',
    },
  },
  activeFilters: {
    marginTop: '20px',
    padding: '16px',
    background: '#f8faff',
    borderRadius: '8px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  activeFiltersList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    flex: 1,
  },
  activeFilterTag: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '4px 8px 4px 12px',
    borderRadius: '100px',
    background: '#fff',
    border: '1px solid #e0e0e0',
    color: '#666',
    fontSize: '0.9rem',
    '& button': {
      background: 'none',
      border: 'none',
      padding: '2px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      color: '#999',
      '&:hover': {
        color: '#ff4757',
      },
    },
  },
  clearFiltersBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '8px',
    border: '1px solid #ff7e67',
    background: '#fff5f3',
    color: '#ff7e67',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    '&:hover': {
      background: '#ffe8e4',
    },
    '& svg': {
      fontSize: '0.9rem',
    },
  },
  '@keyframes slideDown': {
    from: {
      opacity: 0,
      transform: 'translateY(-10px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
  categoriesBar: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
    marginBottom: '20px',
    paddingBottom: '20px',
    borderBottom: '1px solid #e0e0e0',
  },
  categoriesList: {
    display: 'flex',
    gap: '12px',
    overflowX: 'auto',
    flex: 1,
    '&::-webkit-scrollbar': {
      height: '4px',
    },
    '&::-webkit-scrollbar-track': {
      background: '#f1f1f1',
    },
    '&::-webkit-scrollbar-thumb': {
      background: '#888',
      borderRadius: '2px',
    },
  },
  categoryButton: {
    padding: '8px 16px',
    border: '1px solid #e0e0e0',
    background: '#fff',
    borderRadius: '100px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    color: '#666',
    fontSize: '0.95rem',
    transition: 'all 0.2s ease',
    '&:hover': {
      borderColor: '#3F72AF',
      color: '#3F72AF',
      background: '#f8faff',
    },
    '&.active': {
      background: '#3F72AF',
      color: '#fff',
      borderColor: '#3F72AF',
    },
  },
});

interface FilterBarProps {
  activeFilters: {
    category: string[];
    tags: string[];
    timeframe: string | null;
    [key: string]: string[] | string | null;
  };
  onFilterChange: (type: string, value: string) => void;
  onTimeframeChange: (value: string) => void;
  onClearFilters: () => void;
  availableTags: string[];
}

const FilterBar: React.FC<FilterBarProps> = ({
  activeFilters,
  onFilterChange,
  onTimeframeChange,
  onClearFilters,
  availableTags
}) => {
  const classes = useStyles();

  const categories = [
    { value: 'all', label: 'ทั้งหมด' },
    { value: 'medical', label: 'การแพทย์' },
    { value: 'education', label: 'การศึกษา' },
    { value: 'campus', label: 'รอบรั้วมหาลัย' }
  ];

  const timeframes = [
    { value: '', label: 'ทั้งหมด' },
    { value: 'today', label: 'วันนี้' },
    { value: 'week', label: 'สัปดาห์นี้' },
    { value: 'month', label: 'เดือนนี้' },
    { value: 'year', label: 'ปีนี้' }
  ];

  return (
    <div className={classes.filterBar}>
      <div className={classes.categoriesBar}>
        <div className={classes.categoriesList}>
          {categories.map(category => (
            <button
              key={category.value}
              className={`${classes.categoryButton} ${
                activeFilters.category.includes(category.value) ? 'active' : ''
              }`}
              onClick={() => onFilterChange('category', category.value)}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <div className={classes.filterContent}>
        <div className={classes.filterSection}>
          <h3>
            <FaTags />
            แท็ก
          </h3>
          <div className={classes.tagsList}>
            {availableTags.map(tag => (
              <button
                key={tag}
                className={`${classes.tagButton} ${
                  activeFilters.tags.includes(tag) ? 'active' : ''
                }`}
                onClick={() => onFilterChange('tags', tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className={classes.filterSection}>
          <h3>
            <FaClock />
            ช่วงเวลา
          </h3>
          <select
            className={classes.timeframeSelect}
            value={activeFilters.timeframe || ''}
            onChange={(e) => onTimeframeChange(e.target.value)}
          >
            {timeframes.map(timeframe => (
              <option key={timeframe.value} value={timeframe.value}>
                {timeframe.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {(activeFilters.category.length > 0 ||
        activeFilters.tags.length > 0 ||
        activeFilters.timeframe) && (
        <div className={classes.activeFilters}>
          <div className={classes.activeFiltersList}>
            {activeFilters.category.map(cat => (
              <span key={cat} className={classes.activeFilterTag}>
                {categories.find(c => c.value === cat)?.label}
                <button onClick={() => onFilterChange('category', cat)}>
                  <FaTimes />
                </button>
              </span>
            ))}
            {activeFilters.tags.map(tag => (
              <span key={tag} className={classes.activeFilterTag}>
                {tag}
                <button onClick={() => onFilterChange('tags', tag)}>
                  <FaTimes />
                </button>
              </span>
            ))}
            {activeFilters.timeframe && (
              <span className={classes.activeFilterTag}>
                {timeframes.find(t => t.value === activeFilters.timeframe)?.label}
                <button onClick={() => onTimeframeChange('')}>
                  <FaTimes />
                </button>
              </span>
            )}
          </div>
          <button className={classes.clearFiltersBtn} onClick={onClearFilters}>
            <FaUndo />
            ล้างทั้งหมด
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterBar; 