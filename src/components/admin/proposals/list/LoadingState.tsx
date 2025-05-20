
import React from 'react';

const LoadingState: React.FC = () => {
  return (
    <div className="h-40 flex items-center justify-center">
      <div className="animate-spin h-6 w-6 border-2 border-purple-500 border-t-transparent rounded-full"></div>
    </div>
  );
};

export default LoadingState;
