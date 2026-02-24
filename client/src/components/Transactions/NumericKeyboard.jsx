import React from 'react';

const NumericKeyboard = ({ value, onChange }) => {
    const handleButton = (key) => {
        if (key === 'с') {
            onChange(value.slice(0, -1));
        } else if (key === '.' || key === ',') {
            if (!value.includes('.')) {
                onChange(value + '.');
            }
        } else if (!isNaN(key)) {
            onChange(value + key);
        }
    };

    const buttons = [
        ['1', '2', '3', '+'],
        ['4', '5', '6', '−'],
        ['7', '8', '9', '×'],
        [',', '0', 'с', '÷']
    ];

    return (
        <div className="grid grid-cols-4 gap-2 mt-4">
            {buttons.flat().map((btn, idx) => (
                <button
                    key={idx}
                    type="button"
                    onClick={() => handleButton(btn)}
                    className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl text-xl font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 active:bg-gray-300 dark:active:bg-gray-500 transition"
                >
                    {btn}
                </button>
            ))}
        </div>
    );
};

export default NumericKeyboard;