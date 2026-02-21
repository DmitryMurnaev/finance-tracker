import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import GlassNavigation from '../UI/GlassNavigation';

const AppLayout = ({ activeTab, setActiveTab }) => {
    const [showTypeMenu, setShowTypeMenu] = useState(false);

    return (
        <div className="min-h-screen pb-32">
            <Outlet context={{ activeTab, setActiveTab, showTypeMenu, setShowTypeMenu }} />
            <GlassNavigation
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                showTypeMenu={showTypeMenu}
                setShowTypeMenu={setShowTypeMenu}
            />
        </div>
    );
};

export default AppLayout;