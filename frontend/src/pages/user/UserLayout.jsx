import React from 'react';
import { Outlet } from 'react-router-dom';
import UserSidebar from '../../components/user/UserSidebar';
import { useAppContext } from '../../context/AppContext';
import Navbar from '../../components/Navbar';

const UserLayout = () => {
    const { navigate, setToken, user } = useAppContext();

    const logout = () => {
        setToken(null);
        navigate("/");
    };

    return (
        <>
            <Navbar />

            <div className='flex h-[calc(100vh-70px)] bg-gray-50'>
                <UserSidebar />
                <div className="flex-1 overflow-auto">
                    <Outlet />
                </div>
            </div>  
        </>
    );
};

export default UserLayout;