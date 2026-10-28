'use client';

import React, { useState } from 'react';
import { useI18n } from '../../../lib/i18n/context';
import { mockCategories } from '../../../lib/mock-data';
import { Category } from '../../../types/database';
import { Plus, Edit2, Trash2, X, Layers } from 'lucide-react';

export default function AdminCategoriesPage() {
  const { language } = useI18n();
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [isEditing, setIsEditing] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);

  const handleOpenCreate = () => {
    setEditingCategory({
      id: `cat-${Date.now()}`,
      name_en: '',
      name_bn: '',
      slug: '',
      description_en: '',
      description_bn: '',
      display_order: categories.length + 1,
      is_active: true,
    });
    setIsEditing(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditingCategory({ ...c });
    setIsEditing(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory?.name_en || !editingCategory?.slug) return;

    setCategories((prev) => {
      const idx = prev.findIndex((c) => c.id === editingCategory.id);
      if (idx > -1) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], ...editingCategory } as Category;
        return updated;
      }
      return [...prev, editingCategory as Category];
    });

    setIsEditing(false);
    setEditingCategory(null);
  };

  const handleDelete = (id: string) => {
    if (confirm(language === 'bn' ? 'ক্যাটাগরিটি মুছে ফেলতে চান?' : 'Delete category?')) {
      setCategories((prev) => prev.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-forest-950">
            {language === 'bn' ? 'ক্যাটাগরি ব্যবস্থাপনা' : 'Category Management'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            {language === 'bn'
              ? 'বাংলা ও ইংরেজিতে পণ্যের বিভাগ তৈরি ও প্রদর্শন ক্রম নির্ধারণ'
              : 'Add and organize product categories with bilingual titles'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-forest-900 text-ivory rounded-xl text-xs font-semibold hover:bg-forest-800 transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'bn' ? 'নতুন ক্যাটাগরি' : 'Add Category'}</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50 border-b border-slate-100 text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
            <tr>
              <th className="p-4 pl-6">Category Name</th>
              <th className="p-4">Slug</th>
              <th className="p-4">Order</th>
              <th className="p-4">Status</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {categories.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="p-4 pl-6">
                  <p className="font-bold text-slate-900">{c.name_en}</p>
                  <p className="text-[11px] text-slate-400">{c.name_bn}</p>
                </td>
                <td className="p-4 font-mono">{c.slug}</td>
                <td className="p-4">{c.display_order}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    c.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {c.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="p-4 pr-6 text-right space-x-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(c)}
                    className="p-1.5 hover:bg-slate-100 text-slate-700 rounded-lg transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(c.id)}
                    className="p-1.5 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isEditing && editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="font-bold font-serif text-lg text-slate-900">
                {language === 'bn' ? 'ক্যাটাগরি সম্পাদনা' : 'Edit Category'}
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
              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Name (English) *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name_en || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name_en: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-leaf"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Name (বাংলা) *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.name_bn || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, name_bn: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-leaf"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700 uppercase">Slug (URL) *</label>
                <input
                  type="text"
                  required
                  value={editingCategory.slug || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl p-2.5 font-mono outline-none focus:ring-2 focus:ring-leaf"
                />
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
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
