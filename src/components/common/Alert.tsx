import React from 'react';

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  children: React.ReactNode;
}

export const Alert: React.FC<AlertProps> = ({ type = 'info', children }) => {
  const styles = {
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    error: 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <div className={`p-4 rounded border ${styles[type]}`}>
      {children}
    </div>
  );
};