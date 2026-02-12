import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { User, LogOut, ChevronDown } from 'lucide-react';

const UserMenu = () => {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);

    const getInitials = () => {
        if (user?.name) {
            return user.name
                .split(' ')
                .map(word => word[0])
                .join('')
                .toUpperCase()
                .slice(0, 2);
        }
        return user?.email?.slice(0, 2).toUpperCase() || 'U';
    };

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 transition"
            >
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium text-sm">
                    {getInitials()}
                </div>
                <span className="hidden sm:inline text-sm font-medium text-gray-700">
                    {user?.name || user?.email?.split('@')[0]}
                </span>
                <ChevronDown
                    size={16}
                    className={`text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
                />
            </button>

            {open && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg py-2 z-50 animate-fadeIn">
                        <div className="px-4 py-2 border-b border-gray-100">
                            <p className="text-sm font-medium text-gray-900">
                                {user?.name || 'Пользователь'}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                                {user?.email}
                            </p>
                        </div>
                        <Link
                            to="/profile"
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 w-full"
                            onClick={() => setOpen(false)}
                        >
                            <User size={16} className="text-gray-500" />
                            Профиль
                        </Link>
                        <button
                            onClick={() => {
                                logout();
                                setOpen(false);
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                        >
                            <LogOut size={16} />
                            Выйти
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default UserMenu;