import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action is permanent and cannot be undone."
    );

    if (confirmDelete) {
      setIsDeleting(true);
      try {
        // Placeholder for backend API call
        // await api.delete('/auth/delete-account');
        
        // Temporarily just logging out the user
        alert("Account deletion requested. (Backend implementation required for permanent deletion)");
        logout();
        navigate('/signup');
      } catch (error) {
        console.error("Failed to delete account:", error);
        alert("An error occurred while trying to delete your account.");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account preferences and security.</p>
      </div>

      {/* Account Settings Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">Account Management</h2>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-6">
            <div>
              <h3 className="text-md font-medium text-gray-900">Log Out</h3>
              <p className="text-sm text-gray-500">Securely log out of your current session.</p>
            </div>
            <button 
              onClick={handleLogout}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors"
            >
              Log Out
            </button>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-2">
            <div>
              <h3 className="text-md font-medium text-red-600">Delete Account</h3>
              <p className="text-sm text-gray-500">Permanently remove your account and all associated data.</p>
            </div>
            <button 
              onClick={handleDeleteAccount}
              disabled={isDeleting}
              className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
            >
              {isDeleting ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;