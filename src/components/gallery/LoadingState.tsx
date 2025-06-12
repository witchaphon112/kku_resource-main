import React from 'react';
import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  '@keyframes shimmerAnimation': {
    '0%': {
      backgroundPosition: '-1000px 0',
    },
    '100%': {
      backgroundPosition: '1000px 0',
    },
  },
  shimmer: {
    position: 'relative',
    overflow: 'hidden',
    background: '#f6f7f8',
    backgroundImage: 'linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '1000px 100%',
    animation: '$shimmerAnimation 1s linear infinite forwards',
    borderRadius: '24px',
    '&::before': {
      content: '""',
      position: 'absolute',
      width: '100%',
      height: '100%',
      background: 'inherit',
      animation: '$shimmerAnimation 1s linear infinite',
    },
  },
  loadingGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '32px',
    padding: '32px',
    '@media (max-width: 1400px)': {
      gridTemplateColumns: 'repeat(3, 1fr)',
    },
    '@media (max-width: 1100px)': {
      gridTemplateColumns: 'repeat(2, 1fr)',
    },
    '@media (max-width: 767px)': {
      gridTemplateColumns: '1fr',
      gap: '24px',
      padding: '16px',
    },
  },
  loadingList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    padding: '32px',
    '@media (max-width: 767px)': {
      padding: '24px',
    },
  },
  cardSkeleton: {
    height: '360px',
    width: '100%',
  },
  listItemSkeleton: {
    height: '210px',
    width: '100%',
  },
});

interface LoadingStateProps {
  viewMode: 'grid' | 'list';
  count?: number;
}

const LoadingState: React.FC<LoadingStateProps> = ({ viewMode, count = 12 }) => {
  const classes = useStyles();

  return (
    <div className={viewMode === 'grid' ? classes.loadingGrid : classes.loadingList}>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={`skeleton-${index}`}
          className={`${classes.shimmer} ${
            viewMode === 'grid' ? classes.cardSkeleton : classes.listItemSkeleton
          }`}
          style={{ animationDelay: `${index * 0.1}s` }}
        />
      ))}
    </div>
  );
};

export default LoadingState; 