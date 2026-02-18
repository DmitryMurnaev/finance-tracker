import { Outlet } from 'react-router-dom';
import GlassNavigation from '../UI/GlassNavigation';

const AppLayout = ({ isMenuOpen, onAddClick, activeTab, setActiveTab }) => {
    return (
        <div className="min-h-screen bg-gray-50 pb-32">
            <Outlet context={{ isMenuOpen, onAddClick, activeTab, setActiveTab }} />
            <GlassNavigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onAddClick={onAddClick}
                isMenuOpen={isMenuOpen}
            />
        </div>
    );
};

export default AppLayout;