import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';

const UserMenu = () => {
    const { user, logout } = useAuth();
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition"
            >
                <User size={20} />
                <span className="hidden sm:inline">
                    {user?.name || user?.email?.split('@')[0]}
                </span>
            </button>
            {open && (
                <>
                    {/* Затемнение фона для закрытия по клику вне меню */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                        <Link
                            to="/profile"
                            className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-100 w-full"
                            onClick={() => setOpen(false)}
                        >
                            <User size={16} /> Профиль
                        </Link>
                        <button
                            onClick={() => {
                                logout();
                                setOpen(false);
                            }}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                        >
                            <LogOut size={16} /> Выйти
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default UserMenu;