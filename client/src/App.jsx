import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
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

function App() {
    const [activeTab, setActiveTab] = useState('home');

    return (
        <AuthProvider>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                    element={
                        <ProtectedRoute>
                            <AppLayout
                                activeTab={activeTab}
                                setActiveTab={setActiveTab}
                            />
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
        </AuthProvider>
    );
}

export default App;