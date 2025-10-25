'use client';

import { useState } from 'react';
import { FileText, Download, Plus, Trash2, Calculator } from 'lucide-react';

/**
 * Invoice Generator
 * Create professional invoices instantly
 * 
 * Features:
 * - Professional templates
 * - Automatic calculations
 * - Tax and discount support
 * - Multiple currencies
 * - PDF export
 * - Logo upload
 * 
 * Session: 2025-10-25 - Saturday
 */

interface LineItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
}

interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  from: {
    name: string;
    email: string;
    address: string;
  };
  to: {
    name: string;
    email: string;
    address: string;
  };
  items: LineItem[];
  taxRate: number;
  discount: number;
  notes: string;
  currency: string;
}

const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CAD', symbol: '$', name: 'Canadian Dollar' },
];

export default function InvoiceGenerator() {
  const [invoice, setInvoice] = useState<InvoiceData>({
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    from: { name: '', email: '', address: '' },
    to: { name: '', email: '', address: '' },
    items: [{ id: '1', description: '', quantity: 1, rate: 0 }],
    taxRate: 0,
    discount: 0,
    notes: '',
    currency: 'USD',
  });

  const currency = CURRENCIES.find(c => c.code === invoice.currency) || CURRENCIES[0];

  const addItem = () => {
    setInvoice(prev => ({
      ...prev,
      items: [...prev.items, {
        id: Date.now().toString(),
        description: '',
        quantity: 1,
        rate: 0,
      }],
    }));
  };

  const removeItem = (id: string) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.filter(item => item.id !== id),
    }));
  };

  const updateItem = (id: string, field: keyof LineItem, value: any) => {
    setInvoice(prev => ({
      ...prev,
      items: prev.items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const calculateSubtotal = () => {
    return invoice.items.reduce((sum, item) => sum + (item.quantity * item.rate), 0);
  };

  const calculateTax = () => {
    return (calculateSubtotal() - invoice.discount) * (invoice.taxRate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() - invoice.discount + calculateTax();
  };

  const exportToPDF = async () => {
    try {
      const response = await fetch('/api/tools/invoice-generator/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoice,
          subtotal: calculateSubtotal(),
          tax: calculateTax(),
          total: calculateTotal(),
        }),
      });

      if (!response.ok) throw new Error('Failed to export');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `invoice-${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting:', error);
      alert('Failed to export. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-slate-900 dark:to-emerald-900 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Invoice Generator</h1>
              <p className="text-slate-600 dark:text-slate-400">Create professional invoices instantly</p>
            </div>
          </div>
          <button
            onClick={exportToPDF}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export PDF
          </button>
        </div>

        {/* Invoice Form */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 mb-6">
          {/* Header Info */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Invoice Number
              </label>
              <input
                type="text"
                value={invoice.invoiceNumber}
                onChange={(e) => setInvoice(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Currency
              </label>
              <select
                value={invoice.currency}
                onChange={(e) => setInvoice(prev => ({ ...prev, currency: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {CURRENCIES.map(curr => (
                  <option key={curr.code} value={curr.code}>
                    {curr.symbol} {curr.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Invoice Date
              </label>
              <input
                type="date"
                value={invoice.date}
                onChange={(e) => setInvoice(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={invoice.dueDate}
                onChange={(e) => setInvoice(prev => ({ ...prev, dueDate: e.target.value }))}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* From/To */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">From</h3>
              <input
                type="text"
                placeholder="Your Name/Company"
                value={invoice.from.name}
                onChange={(e) => setInvoice(prev => ({
                  ...prev,
                  from: { ...prev.from, name: e.target.value }
                }))}
                className="w-full px-3 py-2 mb-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="email"
                placeholder="your@email.com"
                value={invoice.from.email}
                onChange={(e) => setInvoice(prev => ({
                  ...prev,
                  from: { ...prev.from, email: e.target.value }
                }))}
                className="w-full px-3 py-2 mb-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <textarea
                placeholder="Your Address"
                value={invoice.from.address}
                onChange={(e) => setInvoice(prev => ({
                  ...prev,
                  from: { ...prev.from, address: e.target.value }
                }))}
                rows={2}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Bill To</h3>
              <input
                type="text"
                placeholder="Client Name/Company"
                value={invoice.to.name}
                onChange={(e) => setInvoice(prev => ({
                  ...prev,
                  to: { ...prev.to, name: e.target.value }
                }))}
                className="w-full px-3 py-2 mb-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="email"
                placeholder="client@email.com"
                value={invoice.to.email}
                onChange={(e) => setInvoice(prev => ({
                  ...prev,
                  to: { ...prev.to, email: e.target.value }
                }))}
                className="w-full px-3 py-2 mb-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <textarea
                placeholder="Client Address"
                value={invoice.to.address}
                onChange={(e) => setInvoice(prev => ({
                  ...prev,
                  to: { ...prev.to, address: e.target.value }
                }))}
                rows={2}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="mb-6">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Items</h3>
            <div className="space-y-2">
              {invoice.items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-12 gap-2">
                  <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    className="col-span-5 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="number"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                    className="col-span-2 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="number"
                    placeholder="Rate"
                    value={item.rate}
                    onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                    className="col-span-2 px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <div className="col-span-2 flex items-center justify-between px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg">
                    <span className="text-sm font-medium text-slate-900 dark:text-white">
                      {currency.symbol}{(item.quantity * item.rate).toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    disabled={invoice.items.length === 1}
                    className="col-span-1 flex items-center justify-center p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addItem}
              className="mt-3 px-4 py-2 bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 rounded-lg hover:bg-emerald-200 dark:hover:bg-emerald-800 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>

          {/* Totals */}
          <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
            <div className="max-w-xs ml-auto space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Subtotal:</span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {currency.symbol}{calculateSubtotal().toFixed(2)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Discount"
                  value={invoice.discount || ''}
                  onChange={(e) => setInvoice(prev => ({ ...prev, discount: parseFloat(e.target.value) || 0 }))}
                  className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <div className="flex items-center justify-end text-sm">
                  <span className="font-medium text-slate-900 dark:text-white">
                    -{currency.symbol}{invoice.discount.toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Tax %"
                  value={invoice.taxRate || ''}
                  onChange={(e) => setInvoice(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                  className="px-3 py-2 text-sm bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <div className="flex items-center justify-end text-sm">
                  <span className="font-medium text-slate-900 dark:text-white">
                    {currency.symbol}{calculateTax().toFixed(2)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between text-lg font-bold border-t border-slate-200 dark:border-slate-700 pt-3">
                <span className="text-slate-900 dark:text-white">Total:</span>
                <span className="text-emerald-600 dark:text-emerald-400">
                  {currency.symbol}{calculateTotal().toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Notes / Payment Terms
            </label>
            <textarea
              value={invoice.notes}
              onChange={(e) => setInvoice(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Payment due within 30 days..."
              rows={3}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
