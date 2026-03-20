import { useEffect, useRef } from 'react';
import { Calendar } from 'lucide-react';

const FlowbiteDatePicker = ({ value, onChange, disabled = false, placeholder = "Выберите дату" }) => {
    const inputRef = useRef(null);
    const datepickerInstance = useRef(null);

    useEffect(() => {
        // Динамический импорт Flowbite
        const initDatepicker = async () => {
            if (inputRef.current && !datepickerInstance.current) {
                try {
                    const { Datepicker } = await import('flowbite');

                    datepickerInstance.current = new Datepicker(inputRef.current, {
                        format: 'dd.mm.yyyy',
                        autohide: true,
                        orientation: 'bottom',
                        buttons: true,
                        autoSelectToday: 0,
                        onHide: () => {
                            // Обновляем значение после выбора
                            if (inputRef.current && onChange) {
                                onChange(inputRef.current.value);
                            }
                        }
                    });
                } catch (error) {
                    console.error('Ошибка инициализации Datepicker:', error);
                }
            }
        };

        initDatepicker();

        return () => {
            if (datepickerInstance.current) {
                datepickerInstance.current.destroy?.();
                datepickerInstance.current = null;
            }
        };
    }, []);

    // Обновляем значение при изменении извне
    useEffect(() => {
        if (inputRef.current && value !== inputRef.current.value) {
            inputRef.current.value = value || '';
        }
    }, [value]);

    return (
        <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Calendar size={20} className="text-gray-400 dark:text-gray-500" />
            </div>
            <input
                ref={inputRef}
                type="text"
                defaultValue={value || ''}
                disabled={disabled}
                placeholder={placeholder}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-gray-200"
            />
        </div>
    );
};

export default FlowbiteDatePicker;