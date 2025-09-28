import React from 'react';

const Loader = () => {
  return (
    <div className="flex flex-col justify-center items-center p-4 gap-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-primary)]"></div>
      <p className="text-[var(--color-text-muted)] text-lg italic">Grandma is thinking...</p>
    </div>
  );
};

export default Loader;