import React from 'react';

const NumericKeyboard = ({ value, onChange, onSubmit }) => {
    const handleButton = (key) => {
        if (key === '⌫') {
            onChange(value.slice(0, -1));
        } else if (key === '.' || key === ',') {
            if (!value.includes('.')) {
                onChange(value + '.');
            }
        } else if (key === '✓') {
            onSubmit?.();
        } else if (!isNaN(key) || key === '') {
            onChange(value + key);
        }
    };

    const buttons = [
        ['1', '2', '3', '+'],
        ['4', '5', '6', '−'],
        ['7', '8', '9', '×'],
        [',', '0', '⌫', '✓']
    ];

    return (
        <div className="grid grid-cols-4 gap-2 mt-4">
            {buttons.flat().map((btn, idx) => (
                <button
                    key={idx}
                    onClick={() => handleButton(btn)}
                    className="p-4 bg-gray-100 rounded-xl text-xl font-medium hover:bg-gray-200 active:bg-gray-300 transition"
                >
                    {btn}
                </button>
            ))}
        </div>
    );
};

export default NumericKeyboard;