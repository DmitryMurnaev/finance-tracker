import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const IndexRedirect = () => {
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    useEffect(() => {
        if (loading) return;
        if (user) {
            navigate('/home');
        } else {
            if (!localStorage.getItem('welcomeShown')) {
                navigate('/welcome');
            } else {
                navigate('/login');
            }
        }
    }, [user, loading, navigate]);

    return null;
};

export default IndexRedirect;