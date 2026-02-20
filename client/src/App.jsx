import { useState, useEffect } from 'react';
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

console.log('welcomeShown:', localStorage.getItem('welcomeShown'));
console.log('showWelcome:', showWelcome);

function App() {
    const [showWelcome, setShowWelcome] = useState(
        !localStorage.getItem('welcomeShown')
    );

    const handleWelcomeFinish = () => {
        localStorage.setItem('welcomeShown', 'true');
        setShowWelcome(false);
    };

    return (
        <AuthProvider>
            <ModalProvider>
                <Routes>
                    {showWelcome ? (
                        <Route path="/" element={<Welcome onFinish={handleWelcomeFinish} />} />
                    ) : (
                    //     <Route path="/" element={<IndexRedirect />} />
                    // )}
                    <Route path="/" element={<Welcome onFinish={handleWelcomeFinish} />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/privacy" element={<Privacy />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route
                        element={
                            <ProtectedRoute>
                                <AppLayout />
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
            </ModalProvider>
        </AuthProvider>
    );
}

export default App;