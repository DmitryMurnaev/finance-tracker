import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ModalProvider, useModal } from './context/ModalContext';
import ConfirmModal from './components/UI/ConfirmModal';
import Toast from './components/UI/Toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Plans from './pages/Plans';
import More from './pages/More';
import Support from './pages/Support';
import Privacy from './pages/Privacy';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/Layout/AppLayout';

function ModalContainer() {
    const { confirmState, hideConfirm, toastState, hideToast } = useModal();
    return (
        <>
            <ConfirmModal
                isOpen={confirmState.isOpen}
                title={confirmState.title}
                message={confirmState.message}
                onConfirm={confirmState.onConfirm}
                onCancel={hideConfirm}
            />
            <Toast
                isOpen={toastState.isOpen}
                message={toastState.message}
                type={toastState.type}
                duration={toastState.duration}
                onClose={hideToast}
            />
        </>
    );
}

function App() {
    const [activeTab, setActiveTab] = useState('home');

    return (
        <AuthProvider>
            <ModalProvider>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        element={
                            <ProtectedRoute>
                                <AppLayout activeTab={activeTab} setActiveTab={setActiveTab} />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="/" element={<Home />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/plans" element={<Plans />} />
                        <Route path="/more" element={<More />} />
                        <Route path="/support" element={<Support />} />
                        <Route path="/privacy" element={<Privacy />} />
                    </Route>
                </Routes>
                <ModalContainer />
            </ModalProvider>
        </AuthProvider>
    );
}

export default App;