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
                <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
                    <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Поддержка</h1>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Тема обращения
                    </label>
                    <select
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                    >
                        <option value="question">❓ Вопрос</option>
                        <option value="problem">⚠️ Техническая проблема</option>
                        <option value="wish">✨ Пожелание</option>
                        <option value="other">📝 Другое</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Сообщение
                    </label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Опишите ваш вопрос или проблему..."
                        rows="5"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Контакт для связи (необязательно)
                    </label>
                    <input
                        type="text"
                        value={contact}
                        onChange={(e) => setContact(e.target.value)}
                        placeholder="Email, Telegram или телефон"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
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