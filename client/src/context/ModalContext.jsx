import React, { createContext, useContext, useState, useCallback } from 'react';

const ModalContext = createContext();

export const useModal = () => useContext(ModalContext);

export const ModalProvider = ({ children }) => {
    const [confirmState, setConfirmState] = useState({
        isOpen: false,
        title: '',
        message: '',
        onConfirm: null,
        onCancel: null,
    });

    const [toastState, setToastState] = useState({
        isOpen: false,
        message: '',
        type: 'info', // 'success', 'error', 'info'
        duration: 3000,
    });

    const showConfirm = useCallback(({ title = 'Подтверждение', message, onConfirm, onCancel }) => {
        setConfirmState({
            isOpen: true,
            title,
            message,
            onConfirm: onConfirm || (() => {}),
            onCancel: onCancel || (() => {}),
        });
    }, []);

    const hideConfirm = useCallback(() => {
        setConfirmState(prev => ({ ...prev, isOpen: false }));
    }, []);

    const showToast = useCallback(({ message, type = 'info', duration = 3000 }) => {
        setToastState({ isOpen: true, message, type, duration });
    }, []);

    const hideToast = useCallback(() => {
        setToastState(prev => ({ ...prev, isOpen: false }));
    }, []);

    return (
        <ModalContext.Provider
            value={{
                confirmState,
                showConfirm,
                hideConfirm,
                toastState,
                showToast,
                hideToast,
            }}
        >
            {children}
        </ModalContext.Provider>
    );
};