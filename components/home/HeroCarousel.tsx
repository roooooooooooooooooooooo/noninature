'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useI18n } from '../../lib/i18n/context';
import { mockHomepageSlides } from '../../lib/mock-data';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

export default function HeroCarousel() {
  const { language } = useI18n();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = mockHomepageSlides;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-forest-950 via-forest-900 to-forest-800 text-ivory min-h-[460px] sm:min-h-[520px] flex items-center">
      {/* Botanical Organic Background Patterns */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#287A3D_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />

      {/* Slide Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-800/80 border border-gold/40 text-gold text-xs font-semibold tracking-wide backdrop-blur-sm">
              <Sparkles className="w-3.5 h-3.5 text-gold animate-spin-slow" />
              <span>
                {language === 'bn' ? '১০০% প্রাকৃতিক ও অর্গানিক নোনি পণ্য' : '100% Pure Botanical Organic Noni'}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold font-serif tracking-tight text-ivory leading-tight">
              {language === 'bn' ? slide.title_bn : slide.title_en}
            </h1>

            <p className="text-base sm:text-lg text-ivory/80 max-w-xl mx-auto lg:mx-0 leading-relaxed font-light">
              {language === 'bn' ? slide.subtitle_bn : slide.subtitle_en}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
              <Link
                href={slide.cta_url}
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-gold hover:bg-gold-light text-forest-950 font-bold text-sm tracking-wide shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>{language === 'bn' ? slide.cta_text_bn : slide.cta_text_en}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                href="/noni-benefits"
                className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-forest-800/80 hover:bg-forest-700/80 text-ivory font-semibold text-sm border border-forest-600/80 transition-all flex items-center justify-center"
              >
                {language === 'bn' ? 'নোনির বৈজ্ঞানিক উপকারিতা' : 'Botanical Benefits'}
              </Link>
            </div>
          </div>

          {/* Graphical Botanical Showcase */}
          <div className="lg:col-span-5 flex justify-center relative">
            <div className="relative w-72 sm:w-96 rounded-3xl bg-gradient-to-tr from-forest-800/80 to-leaf/30 border border-leaf/40 backdrop-blur-md p-4 flex flex-col items-center shadow-2xl overflow-hidden group">
              <div className="relative h-64 sm:h-72 w-full mb-3 overflow-hidden rounded-2xl shadow-lg bg-forest-900">
                <Image
                  src={slide.image_url || '/images/slides/slide-1.webp'}
                  alt={language === 'bn' ? slide.title_bn : slide.title_en}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
              </div>
              <div className="text-center w-full flex items-center justify-between px-2 pt-1">
                <span className="text-xs font-serif font-bold text-ivory tracking-wide block">
                  Morinda Citrifolia
                </span>
                <span className="text-[11px] text-gold font-semibold bg-forest-950/60 px-2.5 py-0.5 rounded-full border border-gold/30">
                  {language === 'bn' ? '১০০% অর্গানিক নোনি' : 'Pure Organic Noni'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <button
        type="button"
        onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/40 text-ivory border border-white/10 transition-colors z-20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/20 hover:bg-black/40 text-ivory border border-white/10 transition-colors z-20"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
        {slides.map((_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentSlide(idx)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              currentSlide === idx ? 'w-8 bg-gold' : 'bg-white/40 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
