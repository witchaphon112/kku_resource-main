import React from 'react';
import { createUseStyles } from 'react-jss';
import { FaImage } from 'react-icons/fa';

const useStyles = createUseStyles({
  emptyState: {
    textAlign: 'center',
    padding: '48px',
    color: '#3F72AF',
    fontSize: '1.25rem',
    fontWeight: 600,
    gridColumn: '1 / -1',
    background: 'white',
    borderRadius: '24px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    animation: '$fadeIn 0.5s ease forwards',
    '& svg': {
      fontSize: '3rem',
      marginBottom: '16px',
      color: '#DBE2EF',
    }
  },
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
      transform: 'translateY(20px)',
    },
    to: {
      opacity: 1,
      transform: 'translateY(0)',
    },
  },
});

interface NoResultsProps {
  message?: string;
}

const NoResults: React.FC<NoResultsProps> = ({ message = 'ไม่พบรูปภาพที่ตรงกับเงื่อนไขการค้นหา' }) => {
  const classes = useStyles();

  return (
    <div className={classes.emptyState}>
      <FaImage />
      <p>{message}</p>
    </div>
  );
};

export default NoResults; 