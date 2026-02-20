import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supportAPI } from '../services/api';
import { useModal } from '../context/ModalContext';

const Support = () => {
    const { showToast } = useModal();
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await supportAPI.sendMessage(message);
            showToast({ message: 'Сообщение отправлено! Мы ответим вам в ближайшее время.', type: 'success' });
            setMessage('');
        } catch {
            showToast({ message: 'Ошибка отправки. Попробуйте позже.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4">
            <div className="flex items-center gap-2 mb-4">
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg">
                    <ArrowLeft size={20} />
                </button>
                <h1 className="text-2xl font-bold">Поддержка</h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Напишите ваш вопрос или предложение..."
                    rows="5"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-3 rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50"
                >
                    {loading ? 'Отправка...' : 'Отправить'}
                </button>
            </form>
        </div>
    );
};

export default Support;