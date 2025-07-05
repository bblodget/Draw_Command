import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white p-4">
      <h1 className="text-2xl font-bold">Draw Command</h1>
      <p className="text-sm opacity-90">Voice-Controlled Drawing Demo</p>
    </header>
  );
};