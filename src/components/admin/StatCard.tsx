import React from 'react';

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  color: string; // Tailwind bg color class
  note?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color, note }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-kiogloss transition-shadow duration-300">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-full ${color}`}>
          <span className="text-2xl">{icon}</span>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">
            {title}
          </p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            {value}
          </p>
          {note && <p className="text-xs text-gray-400">{note}</p>}
        </div>
      </div>
    </div>
  );
};

export default StatCard;