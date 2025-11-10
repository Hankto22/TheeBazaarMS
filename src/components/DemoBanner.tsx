import React from 'react';

const DemoBanner: React.FC = () => {
  const isDemo = process.env.REACT_APP_DEMO_MODE === 'true';

  if (!isDemo) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-2 px-4 z-50 shadow-lg">
      <div className="flex items-center justify-center space-x-2">
        <span className="text-sm font-medium">🎯 Demo Mode Active</span>
        <span className="text-xs opacity-90">| Thee Bazaar Carwash Management System</span>
      </div>
    </div>
  );
};

export default DemoBanner;