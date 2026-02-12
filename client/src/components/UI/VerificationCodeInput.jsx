import { useState, useRef } from 'react';

const VerificationCodeInput = ({ length = 6, onComplete }) => {
    const [code, setCode] = useState(Array(length).fill(''));
    const inputs = useRef([]);

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (!/^\d*$/.test(value)) return;

        const newCode = [...code];
        newCode[index] = value.slice(-1);
        setCode(newCode);

        if (value && index < length - 1) {
            inputs.current[index + 1].focus();
        }

        if (newCode.every(c => c !== '')) {
            onComplete?.(newCode.join(''));
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputs.current[index - 1].focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const paste = e.clipboardData.getData('text').slice(0, length);
        if (!/^\d+$/.test(paste)) return;

        const newCode = [...code];
        paste.split('').forEach((char, i) => {
            if (i < length) newCode[i] = char;
        });
        setCode(newCode);

        if (paste.length === length) {
            onComplete?.(paste);
            inputs.current[length - 1].focus();
        }
    };

    return (
        <div className="flex gap-2 justify-center" onPaste={handlePaste}>
            {code.map((digit, index) => (
                <input
                    key={index}
                    ref={el => inputs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            ))}
        </div>
    );
};

export default VerificationCodeInput;