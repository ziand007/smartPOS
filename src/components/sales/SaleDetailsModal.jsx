import React from 'react';
import { FiX, FiPrinter } from 'react-icons/fi';

const SaleDetailsModal = ({ isOpen, onClose, sale }) => {
  if (!isOpen || !sale) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full dark:bg-gray-800">
          <div className="px-4 pt-5 pb-4 bg-white dark:bg-gray-800 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                Sale Details
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={handlePrint}
                  className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                >
                  <FiPrinter className="w-6 h-6" />
                </button>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <FiX className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="print:text-black">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold">POS System</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Receipt #{sale.receiptNumber}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formatDate(sale.createdAt)}
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Customer:</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {sale.customer?.name || 'Walk-in Customer'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Cashier:</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {sale.user?.name || 'System User'}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment Method:</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {sale.paymentMethod === 'E_WALLET' ? 'E-Wallet' : sale.paymentMethod.charAt(0) + sale.paymentMethod.slice(1).toLowerCase()}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Date:</p>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {formatDate(sale.createdAt)}
                  </p>
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-md font-medium text-gray-800 dark:text-white mb-2">Items</h4>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Item
                        </th>
                        <th scope="col" className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Qty
                        </th>
                        <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Price
                        </th>
                        <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {sale.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {item.product.name}
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {item.product.sku}
                            </div>
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-center text-gray-900 dark:text-white">
                            {item.quantity}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                            {formatCurrency(item.unitPrice)}
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm text-right text-gray-900 dark:text-white">
                            {formatCurrency(item.subtotal)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Subtotal:</span>
                  <span className="text-sm text-gray-900 dark:text-white">
                    {formatCurrency(sale.items.reduce((sum, item) => sum + item.subtotal, 0))}
                  </span>
                </div>
                {sale.discount > 0 && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Discount:</span>
                    <span className="text-sm text-red-600 dark:text-red-400">-{formatCurrency(sale.discount)}</span>
                  </div>
                )}
                {sale.tax > 0 && (
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tax:</span>
                    <span className="text-sm text-gray-900 dark:text-white">{formatCurrency(sale.tax)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                  <span className="text-base font-bold text-gray-900 dark:text-white">Total Amount:</span>
                  <span className="text-base font-bold text-gray-900 dark:text-white">{formatCurrency(sale.totalAmount)}</span>
                </div>
              </div>
              
              <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                Thank you for your business!
              </div>
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 sm:px-6 sm:flex sm:flex-row-reverse print:hidden">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleDetailsModal;