import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supportAPI } from '../services/api';
import { useModal } from '../context/ModalContext';

const Support = () => {
    const { showToast } = useModal();
    const [topic, setTopic] = useState('question');
    const [message, setMessage] = useState('');
    const [contact, setContact] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await supportAPI.sendMessage({ topic, message, contact });
            showToast({ message: 'Сообщение отправлено! Мы свяжемся с вами в ближайшее время.', type: 'success' });
            setMessage('');
            setContact('');
            setTopic('question');
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
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Тема обращения
                    </label>
                    <select
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-base appearance-none"
                        style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20' stroke='%236B7280'%3E%3Cpath strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                            backgroundPosition: 'right 0.75rem center',
                            backgroundRepeat: 'no-repeat',
                            backgroundSize: '1.5em 1.5em',
                            paddingRight: '2.5rem'
                        }}
                    >
                        <option value="question">❓ Вопрос</option>
                        <option value="problem">⚠️ Техническая проблема</option>
                        <option value="wish">✨ Пожелание</option>
                        <option value="other">📝 Другое</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Сообщение
                    </label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Опишите ваш вопрос или проблему..."
                        rows="5"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Контакт для связи (необязательно)
                    </label>
                    <input
                        type="text"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="Email, Telegram или телефон"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                        Если не указать, ответ придёт на ваш email в системе.
                    </p>
                </div>

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