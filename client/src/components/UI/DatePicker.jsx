import { useState, useRef, useEffect } from 'react';
import { Calendar } from 'lucide-react';

const DatePicker = ({ value, onChange, disabled = false, placeholder = "Выберите дату" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [tempDate, setTempDate] = useState(value || '');
    const pickerRef = useRef(null);
    const calendarRef = useRef(null);

    const formatDisplayDate = (dateString) => {
        if (!dateString) return placeholder;
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Автоскролл к календарю при открытии
    useEffect(() => {
        if (isOpen && calendarRef.current) {
            // Небольшая задержка, чтобы DOM успел обновиться
            setTimeout(() => {
                calendarRef.current.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }, 100);
        }
    }, [isOpen]);

    const handleConfirm = () => {
        onChange(tempDate);
        setIsOpen(false);
    };

    const handleCancel = () => {
        setTempDate(value);
        setIsOpen(false);
    };

    const getDaysInMonth = (year, month) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const generateCalendar = () => {
        const today = new Date();
        const year = tempDate ? new Date(tempDate).getFullYear() : today.getFullYear();
        const month = tempDate ? new Date(tempDate).getMonth() : today.getMonth();

        const daysInMonth = getDaysInMonth(year, month);
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const startDay = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

        const days = [];
        for (let i = 0; i < startDay; i++) {
            days.push(null);
        }
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(i);
        }

        const weeks = [];
        for (let i = 0; i < days.length; i += 7) {
            weeks.push(days.slice(i, i + 7));
        }

        const monthNames = [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ];

        return { days: weeks, year, month, monthName: monthNames[month] };
    };

    const changeMonth = (delta) => {
        const currentDate = tempDate ? new Date(tempDate) : new Date();
        currentDate.setMonth(currentDate.getMonth() + delta);
        setTempDate(currentDate.toISOString().split('T')[0]);
    };

    const selectDate = (day) => {
        const newDate = tempDate ? new Date(tempDate) : new Date();
        newDate.setDate(day);
        setTempDate(newDate.toISOString().split('T')[0]);
    };

    const { days, year, monthName } = generateCalendar();
    const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    const currentMonth = tempDate ? new Date(tempDate).getMonth() + 1 : new Date().getMonth() + 1;
    const currentYear = tempDate ? new Date(tempDate).getFullYear() : new Date().getFullYear();

    return (
        <div className="relative w-full" ref={pickerRef}>
            {/* Кнопка выбора даты */}
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                className={`w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 flex items-center justify-between ${!disabled ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'}`}
            >
                <span className={`text-sm ${value ? 'text-gray-900 dark:text-gray-100' : 'text-gray-500 dark:text-gray-400'}`}>
                    {formatDisplayDate(value)}
                </span>
                <Calendar size={20} className="text-gray-400 dark:text-gray-500" />
            </button>

            {/* Календарь */}
            {isOpen && (
                <div
                    ref={calendarRef}
                    className="absolute z-[9999] mt-2 left-0 right-0 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700"
                >
                    <div className="p-4">
                        {/* Навигация */}
                        <div className="flex justify-between items-center mb-4">
                            <button
                                type="button"
                                onClick={() => changeMonth(-1)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
                            >
                                ←
                            </button>
                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                                {monthName} {year}
                            </span>
                            <button
                                type="button"
                                onClick={() => changeMonth(1)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-gray-600 dark:text-gray-300"
                            >
                                →
                            </button>
                        </div>

                        {/* Дни недели */}
                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {weekDays.map(day => (
                                <div key={day} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Календарь */}
                        <div className="space-y-1">
                            {days.map((week, weekIndex) => (
                                <div key={weekIndex} className="grid grid-cols-7 gap-1">
                                    {week.map((day, dayIndex) => {
                                        const isSelected = day && tempDate === `${year}-${String(currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                        return (
                                            <button
                                                key={dayIndex}
                                                type="button"
                                                onClick={() => day && selectDate(day)}
                                                disabled={!day}
                                                className={`
                                                    text-center py-2 rounded-lg text-sm
                                                    ${!day ? 'invisible' : ''}
                                                    ${isSelected
                                                    ? 'bg-blue-500 text-white'
                                                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                                }
                                                `}
                                            >
                                                {day}
                                            </button>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>

                        {/* Кнопки */}
                        <div className="flex gap-2 mt-4 pt-2 border-t border-gray-200 dark:border-gray-700">
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex-1 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition"
                            >
                                Отмена
                            </button>
                            <button
                                type="button"
                                onClick={handleConfirm}
                                className="flex-1 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                            >
                                Выбрать
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DatePicker;