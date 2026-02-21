import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ModalProvider } from './context/ModalContext';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Plans from './pages/Plans';
import More from './pages/More';
import Support from './pages/Support';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/Layout/AppLayout';
import IndexRedirect from './pages/IndexRedirect';
import OfflineDetector from './components/UI/OfflineDetector';

function App() {
    const [activeTab, setActiveTab] = useState('home'); // ✅ состояние для вкладок
    const [showWelcome, setShowWelcome] = useState(
        !localStorage.getItem('welcomeShown')
    );

    const handleWelcomeFinish = () => {
        localStorage.setItem('welcomeShown', 'true');
        setShowWelcome(false);
    };

    console.log('welcomeShown:', localStorage.getItem('welcomeShown'));
    console.log('showWelcome:', showWelcome);

    return (
        <AuthProvider>
            <ModalProvider>
                <Routes>
                    {showWelcome ? (
                        <Route path="/" element={<Welcome onFinish={handleWelcomeFinish} />} />
                    ) : (
                        <Route path="/" element={<IndexRedirect />} />
                    )}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route
                        element={
                            <ProtectedRoute>
                                <AppLayout activeTab={activeTab} setActiveTab={setActiveTab} />
                            </ProtectedRoute>
                        }
                    >
                        <Route path="/home" element={<Home />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/plans" element={<Plans />} />
                        <Route path="/more" element={<More />} />
                        <Route path="/support" element={<Support />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
                <OfflineDetector/>
            </ModalProvider>
        </AuthProvider>
    );
}

export default App;