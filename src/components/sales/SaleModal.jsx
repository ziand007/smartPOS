import React, { useState, useEffect } from 'react';
import { FiX, FiPlus, FiMinus } from 'react-icons/fi';

const SaleModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    customerId: '',
    customerName: '',
    paymentMethod: 'CASH',
    discount: 0,
    tax: 0,
    items: []
  });

  // Mock products for demonstration
  const [products, setProducts] = useState([
    { id: '1', name: 'Wireless Bluetooth Headphones', sku: 'PROD-001', price: 99.99, stockQty: 50 },
    { id: '2', name: 'Coffee Mug - Ceramic', sku: 'PROD-002', price: 12.99, stockQty: 100 },
    { id: '3', name: 'Notebook - A5 Lined', sku: 'PROD-003', price: 8.50, stockQty: 75 },
    { id: '4', name: 'USB-C Cable - 6ft', sku: 'PROD-004', price: 15.99, stockQty: 30 },
    { id: '5', name: 'Water Bottle - Stainless Steel', sku: 'PROD-005', price: 24.99, stockQty: 25 }
  ]);

  // Mock customers for demonstration
  const [customers, setCustomers] = useState([
    { id: '1', name: 'John Doe' },
    { id: '2', name: 'Jane Smith' }
  ]);

  const [selectedProductId, setSelectedProductId] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState({});
  const [subtotal, setSubtotal] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    calculateTotals();
  }, [formData.items, formData.discount, formData.tax]);

  const calculateTotals = () => {
    const itemsSubtotal = formData.items.reduce((sum, item) => sum + item.subtotal, 0);
    setSubtotal(itemsSubtotal);
    
    const discountAmount = parseFloat(formData.discount) || 0;
    const taxAmount = parseFloat(formData.tax) || 0;
    
    setTotalAmount(itemsSubtotal - discountAmount + taxAmount);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'customerId') {
      const selectedCustomer = customers.find(c => c.id === value);
      setFormData({
        ...formData,
        customerId: value,
        customerName: selectedCustomer ? selectedCustomer.name : ''
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleProductChange = (e) => {
    setSelectedProductId(e.target.value);
    setQuantity(1);
  };

  const handleQuantityChange = (e) => {
    setQuantity(Math.max(1, parseInt(e.target.value) || 1));
  };

  const addProductToSale = () => {
    if (!selectedProductId || quantity < 1) {
      setErrors({ ...errors, product: 'Please select a product and quantity' });
      return;
    }

    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    if (quantity > product.stockQty) {
      setErrors({ ...errors, quantity: `Only ${product.stockQty} available in stock` });
      return;
    }

    // Check if product already in items
    const existingItemIndex = formData.items.findIndex(item => item.productId === selectedProductId);
    
    if (existingItemIndex >= 0) {
      // Update existing item
      const updatedItems = [...formData.items];
      const existingItem = updatedItems[existingItemIndex];
      const newQuantity = existingItem.quantity + quantity;
      
      if (newQuantity > product.stockQty) {
        setErrors({ ...errors, quantity: `Cannot add more. Only ${product.stockQty} available in stock` });
        return;
      }
      
      updatedItems[existingItemIndex] = {
        ...existingItem,
        quantity: newQuantity,
        subtotal: parseFloat((newQuantity * product.price).toFixed(2))
      };
      
      setFormData({
        ...formData,
        items: updatedItems
      });
    } else {
      // Add new item
      const newItem = {
        productId: product.id,
        product: product,
        quantity: quantity,
        unitPrice: product.price,
        subtotal: parseFloat((quantity * product.price).toFixed(2))
      };
      
      setFormData({
        ...formData,
        items: [...formData.items, newItem]
      });
    }
    
    // Reset selection
    setSelectedProductId('');
    setQuantity(1);
    setErrors({});
  };

  const removeItem = (index) => {
    const updatedItems = [...formData.items];
    updatedItems.splice(index, 1);
    setFormData({
      ...formData,
      items: updatedItems
    });
  };

  const validate = () => {
    const newErrors = {};
    if (formData.items.length === 0) {
      newErrors.items = 'Please add at least one product';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSave({
        customerId: formData.customerId || null,
        customer: formData.customerId ? { id: formData.customerId, name: formData.customerName } : null,
        paymentMethod: formData.paymentMethod,
        discount: parseFloat(formData.discount) || 0,
        tax: parseFloat(formData.tax) || 0,
        totalAmount: totalAmount,
        items: formData.items
      });
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full dark:bg-gray-800">
          <div className="px-4 pt-5 pb-4 bg-white dark:bg-gray-800 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-white">
                New Sale
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Customer
                  </label>
                  <select
                    name="customerId"
                    value={formData.customerId}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Walk-in Customer</option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Payment Method
                  </label>
                  <select
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="CASH">Cash</option>
                    <option value="CARD">Card</option>
                    <option value="E_WALLET">E-Wallet</option>
                  </select>
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <h4 className="text-md font-medium text-gray-800 dark:text-white mb-2">Add Products</h4>
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Product
                    </label>
                    <select
                      value={selectedProductId}
                      onChange={handleProductChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="">Select Product</option>
                      {products.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.name} - {formatCurrency(product.price)} ({product.stockQty} in stock)
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="w-24">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Qty
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={handleQuantityChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={addProductToSale}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <FiPlus className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                {errors.product && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.product}</p>}
                {errors.quantity && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.quantity}</p>}
              </div>

              <div className="mt-4">
                <h4 className="text-md font-medium text-gray-800 dark:text-white mb-2">Sale Items</h4>
                {formData.items.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Product
                          </th>
                          <th scope="col" className="px-4 py-2 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Qty
                          </th>
                          <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Unit Price
                          </th>
                          <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Subtotal
                          </th>
                          <th scope="col" className="px-4 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {formData.items.map((item, index) => (
                          <tr key={index}>
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                              {item.product.name}
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
                            <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                              <button
                                type="button"
                                onClick={() => removeItem(index)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                              >
                                <FiMinus className="h-5 w-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    No items added to this sale yet.
                  </div>
                )}
                {errors.items && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.items}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Discount Amount
                  </label>
                  <input
                    type="number"
                    name="discount"
                    min="0"
                    step="0.01"
                    value={formData.discount}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tax Amount
                  </label>
                  <input
                    type="number"
                    name="tax"
                    min="0"
                    step="0.01"
                    value={formData.tax}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Subtotal:</span>
                  <span className="text-sm text-gray-900 dark:text-white">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Discount:</span>
                  <span className="text-sm text-red-600 dark:text-red-400">-{formatCurrency(parseFloat(formData.discount) || 0)}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tax:</span>
                  <span className="text-sm text-gray-900 dark:text-white">{formatCurrency(parseFloat(formData.tax) || 0)}</span>
                </div>
                <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                  <span className="text-base font-bold text-gray-900 dark:text-white">Total Amount:</span>
                  <span className="text-base font-bold text-gray-900 dark:text-white">{formatCurrency(totalAmount)}</span>
                </div>
              </div>

              <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                <button
                  type="submit"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:col-start-2 sm:text-sm"
                >
                  Complete Sale
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:col-start-1 sm:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SaleModal;