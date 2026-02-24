import React from 'react';
import { getCategoryConfig } from '../../config/categoryConfig';

const CategoryCarousel = ({ categories, selectedCategoryId, onSelect }) => {
    return (
        <div className="flex overflow-x-auto gap-2 pl-2 py-2 scrollbar-hide">
            {categories.map((cat) => {
                const config = getCategoryConfig(cat.name);
                return (
                    <button
                        key={cat.id}
                        type="button"
                        onClick={() => onSelect(cat.id)}
                        className={`flex-shrink-0 min-w-[90px] px-2 py-3 rounded-xl flex flex-col items-center ${
                            selectedCategoryId === cat.id
                                ? `ring-2 ring-blue-500 ${config.color} dark:ring-blue-400`
                                : `${config.color} dark:bg-opacity-80`
                        }`}
                    >
                        <span className="text-2xl">{config.icon}</span>
                        <span className="text-xs mt-1 text-center truncate w-full dark:text-gray-800">{config.name}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default CategoryCarousel;