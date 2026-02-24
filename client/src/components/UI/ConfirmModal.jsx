import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

const ConfirmModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onCancel();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onCancel]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50">
            <div
                ref={modalRef}
                className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6 shadow-xl dark:shadow-gray-900"
            >
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{title}</h3>
                    <button onClick={onCancel} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                        <X size={24} />
                    </button>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6">{message}</p>
                <div className="flex gap-3">
                    <button
                        onClick={onCancel}
                        className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onCancel();
                        }}
                        className="flex-1 py-3 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition dark:bg-red-600 dark:hover:bg-red-700"
                    >
                        Удалить
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;