import React from 'react';
import { getCategoryConfig } from '../../config/categoryConfig';

const CategoryCarousel = ({ categories, selectedCategoryId, onSelect }) => {
    return (
        <div className="flex overflow-x-auto gap-2 pb-2 scrollbar-hide">
            {categories.map((cat) => {
                const config = getCategoryConfig(cat.name);
                return (
                    <button
                        key={cat.id}
                        onClick={() => onSelect(cat.id)}
                        className={`flex-shrink-0 p-3 rounded-xl flex flex-col items-center min-w-[80px] ${
                            selectedCategoryId === cat.id ? `ring-2 ring-blue-500 ${config.color}` : config.color
                        }`}
                    >
                        <span className="text-2xl">{config.icon}</span>
                        <span className="text-xs mt-1">{config.name}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default CategoryCarousel;