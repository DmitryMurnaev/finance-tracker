import { Link } from 'react-router-dom';
import { User, MessageSquare, Shield } from 'lucide-react';

const More = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Ещё</h1>
            <div className="space-y-2">
                <Link
                    to="/profile"
                    className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50"
                >
                    <User size={24} className="text-blue-500" />
                    <span className="font-medium">Профиль</span>
                </Link>
                <Link
                    to="/support"
                    className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50"
                >
                    <MessageSquare size={24} className="text-green-500" />
                    <span className="font-medium">Поддержка</span>
                </Link>
                <Link
                    to="/privacy"
                    className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-sm border border-gray-100 hover:bg-gray-50"
                >
                    <Shield size={24} className="text-gray-500" />
                    <span className="font-medium">Конфиденциальность</span>
                </Link>
            </div>
        </div>
    );
};

export default More;