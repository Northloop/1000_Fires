import React, { useState } from 'react';
import { DollarSign, CreditCard, Receipt, Download, PlusCircle } from 'lucide-react';
import { Transaction, User } from '../types';
import { canManageFinances } from '../lib/rbac';
import { MOCK_TRANSACTIONS } from '../constants';

interface FinanceModuleProps {
  currentUser: User;
  budgetTotal: number;
  budgetSpent: number;
}

const FinanceModule: React.FC<FinanceModuleProps> = ({ currentUser, budgetTotal, budgetSpent }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(MOCK_TRANSACTIONS);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showReimburseModal, setShowReimburseModal] = useState(false);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const hasAccess = canManageFinances(currentUser);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call to Stripe/Payment Gateway
    const newTransaction: Transaction = {
      id: `t${Date.now()}`,
      date: new Date().toISOString(),
      amount: parseFloat(amount),
      description: description || 'Camp Dues Payment',
      type: 'DUES',
      status: 'COMPLETED',
      requestedBy: currentUser.name
    };
    
    setTimeout(() => {
      setTransactions([newTransaction, ...transactions]);
      setShowPaymentModal(false);
      setAmount('');
      setDescription('');
    }, 1000);
  };

  const handleReimbursement = (e: React.FormEvent) => {
    e.preventDefault();
    const newTransaction: Transaction = {
      id: `t${Date.now()}`,
      date: new Date().toISOString(),
      amount: parseFloat(amount),
      description: description || 'Expense Reimbursement',
      type: 'EXPENSE',
      status: 'PENDING',
      requestedBy: currentUser.name
    };
    setTransactions([newTransaction, ...transactions]);
    setShowReimburseModal(false);
    setAmount('');
    setDescription('');
  };

  return (
    <div className="space-y-6">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-night-800 p-6 rounded-xl border border-white/5">
          <p className="text-gray-400 text-sm">Total Budget</p>
          <h3 className="text-3xl font-bold text-white mt-2">${budgetTotal.toLocaleString()}</h3>
        </div>
        <div className="bg-night-800 p-6 rounded-xl border border-white/5">
          <p className="text-gray-400 text-sm">Spent So Far</p>
          <h3 className="text-3xl font-bold text-brand-500 mt-2">${budgetSpent.toLocaleString()}</h3>
        </div>
        <div className="bg-night-800 p-6 rounded-xl border border-white/5">
          <p className="text-gray-400 text-sm">Remaining</p>
          <h3 className="text-3xl font-bold text-green-500 mt-2">${(budgetTotal - budgetSpent).toLocaleString()}</h3>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap gap-4">
        <button 
          onClick={() => setShowPaymentModal(true)}
          className="flex items-center bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <CreditCard className="w-4 h-4 mr-2" /> Pay Dues
        </button>
        <button 
          onClick={() => setShowReimburseModal(true)}
          className="flex items-center bg-night-800 hover:bg-white/5 text-white border border-white/10 px-4 py-2 rounded-lg font-medium transition-colors"
        >
          <Receipt className="w-4 h-4 mr-2" /> Request Reimbursement
        </button>
        {hasAccess && (
          <button className="flex items-center bg-night-800 hover:bg-white/5 text-white border border-white/10 px-4 py-2 rounded-lg font-medium transition-colors ml-auto">
            <Download className="w-4 h-4 mr-2" /> Export Report
          </button>
        )}
      </div>

      {/* Transactions List */}
      <div className="bg-night-800 rounded-xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/5">
          <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-gray-400 text-xs uppercase">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Description</th>
                <th className="px-6 py-3">User</th>
                <th className="px-6 py-3">Type</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 text-gray-400">{new Date(tx.date).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-white font-medium">{tx.description}</td>
                  <td className="px-6 py-4 text-gray-400">{tx.requestedBy}</td>
                  <td className="px-6 py-4">
                    <span className={`
                      px-2 py-1 rounded text-xs font-medium border
                      ${tx.type === 'DUES' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                        tx.type === 'EXPENSE' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 
                        'bg-blue-500/10 text-blue-500 border-blue-500/20'}
                    `}>
                      {tx.type}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`
                      flex items-center text-xs
                      ${tx.status === 'COMPLETED' ? 'text-green-500' : 'text-yellow-500'}
                    `}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${tx.status === 'COMPLETED' ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
                      {tx.status}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right font-mono ${tx.type === 'EXPENSE' ? 'text-orange-400' : 'text-white'}`}>
                    {tx.type === 'EXPENSE' ? '-' : '+'}${tx.amount.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-night-800 rounded-xl max-w-md w-full border border-white/10 p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-white mb-4">Pay Camp Dues</h3>
            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Amount ($)</label>
                <input 
                  type="number" 
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-night-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder="250.00"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Card Details (Secured by Stripe)</label>
                <div className="bg-night-900 border border-white/10 rounded-lg px-4 py-2 flex items-center">
                   <CreditCard className="w-4 h-4 text-gray-500 mr-2" />
                   <input 
                     type="text" 
                     className="bg-transparent w-full text-white outline-none text-sm"
                     placeholder="Card number"
                     disabled
                   />
                </div>
                <p className="text-xs text-gray-500 mt-1 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  PCI Compliant - End-to-End Encryption
                </p>
              </div>
              <div className="flex gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowPaymentModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Pay Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reimbursement Modal */}
      {showReimburseModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
           <div className="bg-night-800 rounded-xl max-w-md w-full border border-white/10 p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-white mb-4">Request Reimbursement</h3>
            <form onSubmit={handleReimbursement} className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Description</label>
                <input 
                  type="text" 
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-night-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder="e.g. Generator Fuel"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Amount ($)</label>
                <input 
                  type="number" 
                  required
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full bg-night-900 border border-white/10 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-brand-500 outline-none"
                  placeholder="0.00"
                />
              </div>
              
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                <p className="text-xs text-yellow-500">
                  Note: Uploading receipts is disabled in offline mode. Please save your physical receipts.
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button 
                  type="button" 
                  onClick={() => setShowReimburseModal(false)}
                  className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg font-medium"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FinanceModule;