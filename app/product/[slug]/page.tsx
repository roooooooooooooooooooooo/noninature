'use client';

import React, { useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '../../../components/product/ProductCard';
import { useI18n } from '../../../lib/i18n/context';
import { useCart } from '../../../lib/cart/context';
import { formatPrice } from '../../../lib/utils/formatters';
import { mockProducts } from '../../../lib/mock-data';
import {
  ChevronRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Plus,
  Minus,
  ShoppingBag,
  Zap,
  Check,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { language, t } = useI18n();
  const { addItem } = useCart();

  const product = mockProducts.find((p) => p.slug === slug);

  // Selected variant state
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(
    product?.variants && product.variants.length > 0 ? product.variants[0].id : null
  );
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold font-serif text-forest-950">
          {language === 'bn' ? 'পণ্যটি পাওয়া যায়নি' : 'Product Not Found'}
        </h2>
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-forest-900 text-ivory text-xs font-semibold"
        >
          <span>{t.continueShopping}</span>
        </Link>
      </div>
    );
  }

  const selectedVariant = product.variants?.find((v) => v.id === selectedVariantId) || null;

  // Active pricing and stock
  const currentPrice = selectedVariant
    ? selectedVariant.sale_price !== null
      ? selectedVariant.sale_price
      : selectedVariant.regular_price
    : product.sale_price !== null
    ? product.sale_price
    : product.regular_price;

  const currentRegularPrice = selectedVariant
    ? selectedVariant.regular_price
    : product.regular_price;

  const currentSku = selectedVariant ? selectedVariant.sku : product.sku;
  const currentStock = selectedVariant ? selectedVariant.stock_quantity : product.stock_quantity;
  const isOutOfStock = currentStock <= 0;
  const isLowStock = currentStock > 0 && currentStock <= product.low_stock_threshold;

  // Images
  const galleryImages = product.images && product.images.length > 0
    ? product.images.map((img) => img.image_url)
    : ['/images/logo.png'];

  if (selectedVariant?.image_url && !galleryImages.includes(selectedVariant.image_url)) {
    galleryImages.unshift(selectedVariant.image_url);
  }

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const cartItemId = selectedVariant ? `${product.id}_${selectedVariant.id}` : product.id;
    addItem(
      {
        id: cartItemId,
        product_id: product.id,
        variant_id: selectedVariant?.id || null,
        name_en: product.name_en,
        name_bn: product.name_bn,
        variant_name_en: selectedVariant?.attribute_values?.[0]?.label_en,
        variant_name_bn: selectedVariant?.attribute_values?.[0]?.label_bn,
        sku: currentSku,
        price: currentPrice,
        regular_price: currentRegularPrice,
        max_stock: currentStock,
        image_url: galleryImages[0],
      },
      quantity
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  // Related products
  const relatedProducts = mockProducts.filter((p) => p.id !== product.id).slice(0, 3);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-forest-700">
        <Link href="/" className="hover:text-forest-900">{t.home}</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/shop" className="hover:text-forest-900">{t.shop}</Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href={`/category/${product.category.slug}`} className="hover:text-forest-900">
              {language === 'bn' ? product.category.name_bn : product.category.name_en}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="font-semibold text-forest-950 truncate max-w-xs">
          {language === 'bn' ? product.name_bn : product.name_en}
        </span>
      </nav>

      {/* Main Product Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative aspect-square bg-white rounded-3xl border border-forest-100 p-8 flex items-center justify-center overflow-hidden shadow-sm">
            <Image
              src={galleryImages[activeImageIndex] || '/images/logo.png'}
              alt={product.name_en}
              width={450}
              height={450}
              className="object-contain max-h-96 w-auto transition-all duration-300"
              priority
            />

            {/* Savings Badge */}
            {currentPrice < currentRegularPrice && (
              <div className="absolute top-4 left-4 bg-gold text-forest-950 px-3 py-1 rounded-full text-xs font-extrabold shadow-md">
                {language === 'bn'
                  ? `৳${Math.round(currentRegularPrice - currentPrice)} ছাড়`
                  : `Save ৳${Math.round(currentRegularPrice - currentPrice)}`}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl bg-white border p-2 flex items-center justify-center transition-all ${
                    activeImageIndex === idx
                      ? 'border-leaf ring-2 ring-leaf/30 shadow-md'
                      : 'border-forest-100 hover:border-forest-300'
                  }`}
                >
                  <Image
                    src={img}
                    alt="Thumbnail"
                    width={60}
                    height={60}
                    className="object-contain max-h-16 w-auto"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Purchase Controls */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            {product.category && (
              <span className="text-xs uppercase font-bold tracking-widest text-leaf">
                {language === 'bn' ? product.category.name_bn : product.category.name_en}
              </span>
            )}
            <h1 className="text-2xl sm:text-4xl font-bold font-serif text-forest-950 leading-tight">
              {language === 'bn' ? product.name_bn : product.name_en}
            </h1>
            <p className="text-xs text-forest-600 font-mono">
              {t.sku}: <span className="font-bold">{currentSku}</span>
            </p>
          </div>

          {/* Price & Stock Status */}
          <div className="p-4 bg-forest-50/70 rounded-2xl border border-forest-100 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-forest-950 font-serif">
                {formatPrice(currentPrice, language)}
              </span>
              {currentPrice < currentRegularPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {formatPrice(currentRegularPrice, language)}
                </span>
              )}
            </div>

            <div>
              {isOutOfStock ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
                  {t.outOfStock}
                </span>
              ) : isLowStock ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
                  {t.lowStock} ({currentStock} {language === 'bn' ? 'টি অবশিষ্ট' : 'left'})
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-leaf/15 text-leaf-dark border border-leaf/30">
                  {t.inStock} ({currentStock} {language === 'bn' ? 'টি উপলব্ধ' : 'available'})
                </span>
              )}
            </div>
          </div>

          {/* Description Excerpt */}
          <p className="text-sm text-botanicalDark/80 leading-relaxed">
            {language === 'bn' ? product.description_bn : product.description_en}
          </p>

          {/* Variant Selector (If Variable Product) */}
          {product.product_type === 'variable' && product.variants && product.variants.length > 0 && (
            <div className="space-y-3 pt-2 border-t border-forest-100">
              <label className="text-xs font-bold uppercase tracking-wider text-forest-900 block">
                {language === 'bn' ? 'প্যাকেজ / সাইজ নির্বাচন করুন:' : 'Select Variation / Size:'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                {product.variants.map((v) => {
                  const opt = v.attribute_values?.[0];
                  const label = language === 'bn' ? opt?.label_bn : opt?.label_en;
                  const isSelected = selectedVariantId === v.id;
                  const vPrice = v.sale_price !== null ? v.sale_price : v.regular_price;

                  return (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => setSelectedVariantId(v.id)}
                      className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                        isSelected
                          ? 'border-leaf bg-leaf/10 ring-2 ring-leaf shadow-sm'
                          : 'border-forest-200 bg-white hover:border-forest-400'
                      }`}
                    >
                      <span className="text-xs font-bold text-forest-950">{label || v.sku}</span>
                      <span className="text-xs font-semibold text-leaf mt-1">
                        {formatPrice(vPrice, language)}
                      </span>
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-leaf text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-4 pt-4 border-t border-forest-100">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-forest-900">
                {t.quantity}:
              </span>
              <div className="flex items-center border border-forest-200 bg-white rounded-xl overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  className="px-3 py-2 text-forest-700 hover:bg-forest-50 disabled:opacity-40"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 py-2 text-sm font-bold text-botanicalDark">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.min(currentStock, prev + 1))}
                  disabled={quantity >= currentStock || isOutOfStock}
                  className="px-3 py-2 text-forest-700 hover:bg-forest-50 disabled:opacity-40"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className="w-full py-3.5 px-6 rounded-2xl bg-forest-900 hover:bg-forest-800 disabled:bg-gray-200 disabled:text-gray-400 text-ivory font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{t.addToCart}</span>
              </button>

              <button
                type="button"
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full py-3.5 px-6 rounded-2xl bg-gold hover:bg-gold-light disabled:bg-gray-200 disabled:text-gray-400 text-forest-950 font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <Zap className="w-4 h-4 text-forest-900" />
                <span>{t.buyNow}</span>
              </button>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-forest-100 text-center text-xs text-forest-800">
            <div className="p-3 bg-forest-50/50 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-leaf mx-auto mb-1" />
              <span>{language === 'bn' ? '১০০% খাঁটি পণ্য' : '100% Genuine'}</span>
            </div>
            <div className="p-3 bg-forest-50/50 rounded-xl">
              <Truck className="w-4 h-4 text-leaf mx-auto mb-1" />
              <span>{language === 'bn' ? 'সারাদেশে ক্যাশ অন ডেলিভারি' : 'Cash on Delivery'}</span>
            </div>
            <div className="p-3 bg-forest-50/50 rounded-xl">
              <RotateCcw className="w-4 h-4 text-leaf mx-auto mb-1" />
              <span>{language === 'bn' ? 'সহজ রিটার্ন পলিসি' : 'Safe Guarantee'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Botanical Specifications & Usage Instructions */}
      <section className="bg-white rounded-3xl border border-forest-100 p-6 sm:p-10 space-y-6 shadow-sm">
        <h3 className="text-xl font-bold font-serif text-forest-950 border-b border-forest-100 pb-4">
          {t.specifications}
        </h3>
        <div className="prose prose-sm max-w-none text-botanicalDark/80 leading-relaxed">
          <p className="whitespace-pre-line text-sm">
            {language === 'bn' ? product.details_bn : product.details_en}
          </p>
        </div>

        <div className="p-4 bg-ivory rounded-2xl border border-ivory-dark flex items-start gap-3 text-xs text-forest-800">
          <Sparkles className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
          <p>
            {language === 'bn'
              ? 'ঘোষণা: এটি প্রাকৃতিক খাদ্য সম্পূরক ও কৃষিজাত পণ্য। এটি কোনো প্রকার প্রেসক্রিপশন ওষুধের বিকল্প হিসেবে প্রচারিত নয়।'
              : 'Botanical Disclaimer: Natural agricultural supplement for dietary wellness. Not intended to diagnose, cure, or substitute prescribed medical treatment.'}
          </p>
        </div>
      </section>

      {/* Related Products */}
      <section className="space-y-6">
        <h3 className="text-xl font-bold font-serif text-forest-950 border-b border-forest-100 pb-4">
          {t.relatedProducts}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedProducts.map((rel) => (
            <ProductCard key={rel.id} product={rel} />
          ))}
        </div>
      </section>
    </div>
  );
}
