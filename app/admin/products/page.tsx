'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useI18n } from '../../../lib/i18n/context';
import { formatPrice } from '../../../lib/utils/formatters';
import { mockProducts, mockCategories } from '../../../lib/mock-data';
import { Product } from '../../../types/database';
import { Plus, Edit2, Trash2, Check, X, Search, Package } from 'lucide-react';

export default function AdminProductsPage() {
  const { language, t } = useI18n();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  const filteredProducts = products.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.name_en.toLowerCase().includes(q) ||
      p.name_bn.toLowerCase().includes(q) ||
      p.sku.toLowerCase().includes(q)
    );
  });

  const handleOpenCreate = () => {
    setEditingProduct({
      id: `prod-${Date.now()}`,
      name_en: '',
      name_bn: '',
      slug: '',
      sku: '',
      product_type: 'simple',
      category_id: mockCategories[0].id,
      regular_price: 500,
      sale_price: 450,
      stock_quantity: 50,
      low_stock_threshold: 10,
      is_active: true,
      is_featured: false,
      description_en: '',
      description_bn: '',
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditingProduct({ ...p });
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name_en || !editingProduct?.sku) return;

    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === editingProduct.id);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], ...editingProduct } as Product;
        return updated;
      } else {
        return [editingProduct as Product, ...prev];
      }
    });

    setIsEditing(false);
    setEditingProduct(null);
  };

  const handleDelete = (id: string) => {
    if (confirm(language === 'bn' ? 'আপনি কি নিশ্চিত এই পণ্যটি ডিলিট করতে চান?' : 'Are you sure you want to delete this product?')) {
      setProducts((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-forest-950">
            {language === 'bn' ? 'পণ্য ব্যবস্থাপনা' : 'Product Management'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'bn'
              ? 'সাধারণ ও ভ্যারিয়েশন পণ্য তৈরি, মূল্য এবং স্টক পরিচালনা'
              : 'Add, update, and manage simple and variable noni products'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-900 text-ivory rounded-xl text-xs font-semibold hover:bg-forest-800 transition-colors self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'bn' ? 'নতুন পণ্য যোগ করুন' : 'Add New Product'}</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-3">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={language === 'bn' ? 'নাম বা SKU দিয়ে খুঁজুন...' : 'Search by name or SKU...'}
          className="w-full text-xs outline-none bg-transparent"
        />
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              <tr>
                <th className="p-4 pl-6">Product</th>
                <th className="p-4">SKU</th>
                <th className="p-4">Type</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredProducts.map((p) => {
                const activePrice = p.sale_price !== null ? p.sale_price : p.regular_price;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-4 pl-6 flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-50 rounded-lg p-1 border border-slate-200 flex items-center justify-center flex-shrink-0">
                        <Image
                          src={p.images?.[0]?.image_url || '/images/logo.png'}
                          alt={p.name_en}
                          width={32}
                          height={32}
                          className="object-contain"
                        />
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{p.name_en}</p>
                        <p className="text-[11px] text-slate-400">{p.name_bn}</p>
                      </div>
                    </td>
                    <td className="p-4 font-mono">{p.sku}</td>
                    <td className="p-4 capitalize">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.product_type === 'variable' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-700'
                      }`}>
                        {p.product_type}
                      </span>
                    </td>
                    <td className="p-4 font-bold text-slate-900 font-serif">
                      {formatPrice(activePrice, language)}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.stock_quantity <= p.low_stock_threshold
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {p.stock_quantity}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {p.is_active ? 'Active' : 'Draft'}
                      </span>
                    </td>
                    <td className="p-4 pr-6 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 hover:bg-slate-100 text-slate-700 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Edit / Create Modal */}
      {isEditing && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="font-bold font-serif text-lg text-slate-900">
                {editingProduct.id?.startsWith('prod-')
                  ? language === 'bn' ? 'নতুন পণ্য ফর্ম' : 'New Product Form'
                  : language === 'bn' ? 'পণ্য সম্পাদনা' : 'Edit Product'}
              </h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="p-1.5 hover:bg-slate-100 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase">Name (English) *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name_en || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name_en: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-leaf"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase">Name (বাংলা) *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name_bn || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name_bn: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-leaf"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase">SKU *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.sku || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 font-mono outline-none focus:ring-2 focus:ring-leaf"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase">Regular Price (৳)</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editingProduct.regular_price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, regular_price: Number(e.target.value) })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-leaf"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase">Sale Price (৳)</label>
                  <input
                    type="number"
                    min="0"
                    value={editingProduct.sale_price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sale_price: e.target.value ? Number(e.target.value) : null })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-leaf"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase">Stock Quantity</label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={editingProduct.stock_quantity || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock_quantity: Number(e.target.value) })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-leaf"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-slate-700 uppercase">Low Stock Threshold</label>
                  <input
                    type="number"
                    min="0"
                    value={editingProduct.low_stock_threshold || 5}
                    onChange={(e) => setEditingProduct({ ...editingProduct, low_stock_threshold: Number(e.target.value) })}
                    className="w-full border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-leaf"
                  />
                </div>
              </div>

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_active || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_active: e.target.checked })}
                    className="accent-leaf w-4 h-4"
                  />
                  <span className="font-semibold text-slate-800">Active</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_featured || false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_featured: e.target.checked })}
                    className="accent-leaf w-4 h-4"
                  />
                  <span className="font-semibold text-slate-800">Featured</span>
                </label>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-5 py-2.5 border border-slate-200 rounded-xl font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-forest-900 text-ivory rounded-xl font-bold hover:bg-forest-800 transition-colors shadow-md"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
