import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ isOpen, message, type, duration, onClose }) => {
    useEffect(() => {
        if (isOpen && duration) {
            const timer = setTimeout(() => {
                onClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [isOpen, duration, onClose]);

    if (!isOpen) return null;

    const icons = {
        success: <CheckCircle className="text-green-500" size={24} />,
        error: <AlertCircle className="text-red-500" size={24} />,
        info: <Info className="text-blue-500" size={24} />,
    };

    const bgColors = {
        success: 'bg-green-50 border-green-200',
        error: 'bg-red-50 border-red-200',
        info: 'bg-blue-50 border-blue-200',
    };

    return (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-slide-up">
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border ${bgColors[type]}`}>
                {icons[type]}
                <span className="text-gray-800">{message}</span>
                <button onClick={onClose} className="ml-2 text-gray-500 hover:text-gray-700">
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};

export default Toast;