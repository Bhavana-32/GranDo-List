import React from 'react';

const Header = () => {
  return (
    <header className="text-center p-8 pt-6">
      <h1 className="text-4xl font-bold text-[var(--color-text-base)] flex items-center justify-center gap-4">
        <span className="text-5xl transition-transform duration-300 ease-in-out hover:rotate-12 hover:scale-110">👵</span>
        Grandma's Naggy Notes
      </h1>
      <p className="text-[var(--color-text-muted)] mt-2 italic text-base">"You'd forget your own head if it wasn't attached."</p>
    </header>
  );
};

export default Header;