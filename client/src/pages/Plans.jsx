import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { planAPI } from '../services/api';
import { getPlanIconById, getPlanColorById } from '../config/plansConfig';
import PlanCard from '../components/Plans/PlanCard';
import PlanForm from '../components/Plans/PlanForm';
import ContributeForm from '../components/Plans/ContributeForm';

const Plans = () => {
    const [plans, setPlans] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isContributeOpen, setIsContributeOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        setLoading(true);
        try {
            const data = await planAPI.getPlans();
            setPlans(data);
        } catch (err) {
            console.error('Ошибка загрузки планов', err);
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
        if (planId) {
            await planAPI.updatePlan(planId, planData);
        } else {
            await planAPI.createPlan(planData);
        }
        await fetchPlans();
    };

    const handleContribute = async (amount, accountId, description) => {
        await planAPI.contributeToPlan(selectedPlan.id, { amount, account_id: accountId, description });
        await fetchPlans();
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Удалить цель?')) return;
        await planAPI.deletePlan(id);
        await fetchPlans();
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Планы</h1>
                <button
                    onClick={handleAddClick}
                    className="bg-blue-500 text-white p-3 rounded-full shadow-lg hover:bg-blue-600 transition"
                >
                    <Plus size={24} />
                </button>
            </div>

            {loading ? (
                <div className="text-center py-10">Загрузка...</div>
            ) : plans.length === 0 ? (
                <div className="text-center py-10 text-gray-500">
                    <p className="mb-4">У вас ещё нет целей</p>
                    <button onClick={handleAddClick} className="text-blue-500 underline">
                        Создать первую цель
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
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