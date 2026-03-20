import { useState, useEffect } from 'react';
import { planAPI } from '../services/api';
import PlanCard from '../components/Plans/PlanCard';
import PlanForm from '../components/Plans/PlanForm';
import ContributeForm from '../components/Plans/ContributeForm';
import { useModal } from '../context/ModalContext';

const Plans = () => {
    const { showConfirm, showToast } = useModal();
    const [plans, setPlans] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isContributeOpen, setIsContributeOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPlans();

        // Слушаем глобальное событие для открытия формы из нижнего меню
        const handleOpenForm = () => {
            handleAddClick();
        };

        window.addEventListener('openPlanForm', handleOpenForm);
        return () => window.removeEventListener('openPlanForm', handleOpenForm);
    }, []);

    const fetchPlans = async () => {
        setLoading(true);
        try {
            const data = await planAPI.getPlans();
            setPlans(data);
        } catch (err) {
            console.error('Ошибка загрузки планов', err);
            showToast({ message: 'Не удалось загрузить планы', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleAddClick = () => {
        setSelectedPlan(null);
        setIsFormOpen(true);
    };

    const handleEditClick = (plan) => {
        setSelectedPlan(plan);
        setIsFormOpen(true);
    };

    const handleContributeClick = (plan) => {
        setSelectedPlan(plan);
        setIsContributeOpen(true);
    };

    const handleSave = async (planData, planId) => {
        try {
            if (planId) {
                await planAPI.updatePlan(planId, planData);
                showToast({ message: 'Цель обновлена', type: 'success' });
            } else {
                await planAPI.createPlan(planData);
                showToast({ message: 'Цель создана', type: 'success' });
            }
            await fetchPlans();
        } catch (err) {
            showToast({ message: 'Ошибка сохранения', type: 'error' });
        }
    };

    const handleContribute = async (amount, accountId, description) => {
        try {
            await planAPI.contributeToPlan(selectedPlan.id, { amount, account_id: accountId, description });
            await fetchPlans();
            showToast({ message: 'Средства внесены', type: 'success' });
        } catch (err) {
            showToast({ message: 'Ошибка внесения', type: 'error' });
        }
    };

    const handleDelete = async (id) => {
        showConfirm({
            title: 'Удаление цели',
            message: 'Вы уверены, что хотите удалить эту цель?',
            onConfirm: async () => {
                try {
                    await planAPI.deletePlan(id);
                    await fetchPlans();
                    showToast({ message: 'Цель удалена', type: 'success' });
                } catch {
                    showToast({ message: 'Ошибка удаления', type: 'error' });
                }
            },
        });
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold dark:text-gray-100 mb-4">Планы</h1>

            {loading ? (
                <div className="text-center py-10 dark:text-gray-100">Загрузка...</div>
            ) : plans.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    <p className="mb-4">У вас ещё нет целей</p>
                    <button onClick={handleAddClick} className="text-blue-500 underline">
                        Создать первую цель
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 min-[480px]:grid-cols-2 lg:grid-cols-3 gap-4">
                    {plans.map(plan => (
                        <PlanCard
                            key={plan.id}
                            plan={plan}
                            onEdit={handleEditClick}
                            onDelete={handleDelete}
                            onContribute={handleContributeClick}
                        />
                    ))}
                </div>
            )}

            <PlanForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                onSave={handleSave}
                editingPlan={selectedPlan}
            />
            <ContributeForm
                isOpen={isContributeOpen}
                onClose={() => setIsContributeOpen(false)}
                onContribute={handleContribute}
                plan={selectedPlan}
            />
        </div>
    );
};

export default Plans;