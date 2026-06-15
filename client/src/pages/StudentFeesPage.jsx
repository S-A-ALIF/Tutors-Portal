import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const StudentFeesPage = () => {
    const { user } = useAuth();

    // MOCK DATA: For UI display
    const pendingFees = [
        { id: 1, month: 'June 2026', amount: 3500, dueDate: '2026-06-10', status: 'overdue' },
        { id: 2, month: 'July 2026', amount: 3500, dueDate: '2026-07-10', status: 'pending' },
    ];

    const feeHistory = [
        { id: 3, month: 'May 2026', amount: 3500, paidOn: '2026-05-08', receiptNo: 'RC-9982', method: 'bKash' },
        { id: 4, month: 'April 2026', amount: 3500, paidOn: '2026-04-09', receiptNo: 'RC-9412', method: 'Cash' },
    ];

    const totalDue = pendingFees.reduce((sum, fee) => sum + fee.amount, 0);

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 h-full">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Fees & Payments</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage your tuition fees and view payment history.</p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <p className="text-sm font-medium text-gray-500 mb-1">Total Due</p>
                    <p className="text-3xl font-bold text-red-600">৳ {totalDue.toLocaleString()}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <p className="text-sm font-medium text-gray-500 mb-1">Pending Months</p>
                    <p className="text-3xl font-bold text-gray-800">{pendingFees.length}</p>
                </div>
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-xl shadow-sm border border-indigo-600 text-white flex flex-col justify-center">
                    <button className="w-full bg-white text-indigo-600 font-semibold py-2.5 rounded-lg shadow-sm hover:bg-gray-50 transition-colors">
                        Pay Now via bKash
                    </button>
                    <p className="text-xs text-indigo-100 text-center mt-3 opacity-80">Other methods: Nagad, Bank Transfer</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pending Fees */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-800">Pending Fees</h2>
                    </div>
                    <ul className="divide-y divide-gray-100">
                        {pendingFees.map(fee => (
                            <li key={fee.id} className="p-6 flex justify-between items-center">
                                <div>
                                    <p className="font-semibold text-gray-900">{fee.month} Tuition</p>
                                    <p className={`text-sm mt-1 font-medium ${fee.status === 'overdue' ? 'text-red-500' : 'text-orange-500'}`}>
                                        Due: {new Date(fee.dueDate).toLocaleDateString()} {fee.status === 'overdue' && '(Overdue)'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-gray-900">৳ {fee.amount}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Fee History */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
                        <h2 className="text-lg font-semibold text-gray-800">Payment History</h2>
                    </div>
                    <ul className="divide-y divide-gray-100">
                        {feeHistory.map(fee => (
                            <li key={fee.id} className="p-6">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <p className="font-semibold text-gray-900">{fee.month} Tuition</p>
                                        <p className="text-sm text-gray-500 mt-1">Paid via {fee.method}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold text-gray-900">৳ {fee.amount}</p>
                                        <span className="inline-block mt-1 px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                                            Completed
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
                                    <p className="text-xs text-gray-400">Date: {new Date(fee.paidOn).toLocaleDateString()}</p>
                                    <button className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                                        Download Receipt
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default StudentFeesPage;
