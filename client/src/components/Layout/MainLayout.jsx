import React from 'react';
import { Outlet } from 'react-router-dom';
import GlassNavigation from '../UI/GlassNavigation';

const MainLayout = ({ onAddClick, isMenuOpen }) => {
    return (
        <div className="min-h-screen bg-gray-50 pb-32">
            <Outlet context={{ onAddClick, isMenuOpen }} />
            <GlassNavigation onAddClick={onAddClick} isMenuOpen={isMenuOpen} />
        </div>
    );
};

export default MainLayout;