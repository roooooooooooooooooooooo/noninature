'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Product } from '../../types/database';
import { useI18n } from '../../lib/i18n/context';
import { useCart } from '../../lib/cart/context';
import { formatPrice } from '../../lib/utils/formatters';
import { ShoppingBag, ArrowRight, Check, AlertCircle } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { language, t } = useI18n();
  const { addItem } = useCart();

  const title = language === 'bn' ? product.name_bn : product.name_en;
  const description = language === 'bn' ? product.description_bn : product.description_en;

  const primaryImage =
    product.images?.find((img) => img.is_primary)?.image_url ||
    product.images?.[0]?.image_url ||
    '/images/logo.png';

  const isOutOfStock = product.stock_quantity <= 0;
  const isLowStock = product.stock_quantity > 0 && product.stock_quantity <= product.low_stock_threshold;
  const activePrice = product.sale_price !== null ? product.sale_price : product.regular_price;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.product_type === 'variable') {
      // Direct user to product page to choose variant
      window.location.href = `/product/${product.slug}`;
      return;
    }

    addItem({
      id: product.id,
      product_id: product.id,
      variant_id: null,
      name_en: product.name_en,
      name_bn: product.name_bn,
      sku: product.sku,
      price: activePrice,
      regular_price: product.regular_price,
      max_stock: product.stock_quantity,
      image_url: primaryImage,
    });
  };

  return (
    <div className="group bg-white rounded-2xl border border-forest-100/90 hover:border-forest-300 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Image Container with Badges */}
        <Link href={`/product/${product.slug}`} className="block relative aspect-square bg-forest-50/50 overflow-hidden p-6 flex items-center justify-center">
          <Image
            src={primaryImage}
            alt={title}
            width={300}
            height={300}
            className="object-contain max-h-52 w-auto group-hover:scale-105 transition-transform duration-500"
          />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
            {product.sale_price && product.sale_price < product.regular_price && (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-gold text-forest-950 shadow-sm">
                {language === 'bn'
                  ? `৳${Math.round(product.regular_price - product.sale_price)} ছাড়`
                  : `Save ৳${Math.round(product.regular_price - product.sale_price)}`}
              </span>
            )}
            {isOutOfStock ? (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-red-100 text-red-800 border border-red-200">
                {t.outOfStock}
              </span>
            ) : isLowStock ? (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
                {t.lowStock}
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-leaf/15 text-leaf-dark border border-leaf/30">
                {t.inStock}
              </span>
            )}
          </div>
        </Link>

        {/* Product Details */}
        <div className="p-5 space-y-2">
          {product.category && (
            <p className="text-[11px] uppercase tracking-wider font-semibold text-leaf">
              {language === 'bn' ? product.category.name_bn : product.category.name_en}
            </p>
          )}

          <Link href={`/product/${product.slug}`} className="block">
            <h3 className="text-base font-bold text-forest-950 group-hover:text-leaf transition-colors line-clamp-1">
              {title}
            </h3>
          </Link>

          <p className="text-xs text-botanicalDark/70 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Bottom Price & Action */}
      <div className="p-5 pt-0">
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-lg font-bold text-forest-900">
            {formatPrice(activePrice, language)}
          </span>
          {product.sale_price && product.sale_price < product.regular_price && (
            <span className="text-xs text-gray-400 line-through">
              {formatPrice(product.regular_price, language)}
            </span>
          )}
        </div>

        {isOutOfStock ? (
          <button
            type="button"
            disabled
            className="w-full py-2.5 px-4 rounded-xl bg-gray-100 text-gray-400 text-xs font-semibold cursor-not-allowed text-center"
          >
            {t.outOfStock}
          </button>
        ) : product.product_type === 'variable' ? (
          <Link
            href={`/product/${product.slug}`}
            className="w-full py-2.5 px-4 rounded-xl bg-forest-50 hover:bg-forest-900 text-forest-900 hover:text-ivory text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border border-forest-200 hover:border-forest-900 shadow-sm"
          >
            <span>{t.selectVariation}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleQuickAdd}
            className="w-full py-2.5 px-4 rounded-xl bg-forest-900 hover:bg-forest-800 text-ivory text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md active:scale-95"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{t.addToCart}</span>
          </button>
        )}
      </div>
    </div>
  );
}
