-- ==============================================================================
-- NoniNature Seed Data
-- Realistic sample categories, products, attributes, delivery rules and settings
-- ==============================================================================

-- 1. Insert Initial Delivery Rules for Bangladesh
INSERT INTO public.delivery_rules (district_name_en, district_name_bn, delivery_fee, estimated_days, is_active, is_default)
VALUES
('Inside Dhaka', 'ঢাকার ভেতরে', 70.00, '24-48 Hours', true, false),
('Outside Dhaka (All Districts)', 'ঢাকার বাইরে (সকল জেলা)', 130.00, '2-4 Days', true, true),
('Chattogram', 'চট্টগ্রাম', 120.00, '2-3 Days', true, false),
('Sylhet', 'সিলেট', 120.00, '2-3 Days', true, false),
('Rajshahi', 'রাজশাহী', 120.00, '2-3 Days', true, false),
('Khulna', 'খুলনা', 120.00, '2-3 Days', true, false),
('Barishal', 'বরিশাল', 120.00, '2-3 Days', true, false),
('Rangpur', 'রংপুর', 130.00, '3-4 Days', true, false),
('Mymensingh', 'ময়মনসিংহ', 110.00, '2-3 Days', true, false)
ON CONFLICT (district_name_en) DO NOTHING;

-- 2. Insert Public & Private Site Settings
INSERT INTO public.site_settings (key, value, is_public, description)
VALUES
('general_settings', '{
    "brand_name_en": "NoniNature",
    "brand_name_bn": "নোনি নেচার",
    "tagline_en": "Pure Botanical Wellness from Morinda Citrifolia",
    "tagline_bn": "বিশুদ্ধ প্রাকৃতিক নোনি ফলের ঔষধি ও পুষ্টিগুণ",
    "contact_phone": "+880 1711-223344",
    "contact_email": "support@noninature.com",
    "office_address_en": "House 14, Road 5, Dhanmondi, Dhaka-1205, Bangladesh",
    "office_address_bn": "বাড়ি ১৪, রোড ৫, ধানমন্ডি, ঢাকা-১২০৫, বাংলাদেশ",
    "free_shipping_threshold": 2000,
    "announcement_en": "🌿 Special Offer: Free delivery across Bangladesh on orders over ৳2,000!",
    "announcement_bn": "🌿 বিশেষ অফার: ২,০০০ টাকার বেশি অর্ডারে সারাদেশে ফ্রি ডেলিভারি!"
}'::jsonb, true, 'General store and contact information'),

('payment_settings', '{
    "cod_enabled": true,
    "bkash_enabled": true,
    "bkash_number": "01711223344",
    "bkash_type": "Personal (Send Money)",
    "bkash_instructions_en": "Go to your bKash app -> Send Money -> Enter 01711223344 -> Enter exact order amount -> Use Order Reference as reference. After payment, submit your Sender Phone & TrxID.",
    "bkash_instructions_bn": "আপনার বিকাশ অ্যাপে যান -> Send Money নির্বাচন করুন -> 01711223344 নম্বরে সঠিক টাকার পরিমাণ পাঠান -> রেফারেন্সে অর্ডার রেফারেন্স দিন। পেমেন্ট শেষে সেন্ডার নম্বর ও TrxID প্রদান করুন।",
    "nagad_enabled": true,
    "nagad_number": "01811223344",
    "nagad_type": "Personal (Send Money)",
    "nagad_instructions_en": "Nagad App/USSD *167# -> Send Money -> 01811223344 -> Exact amount. Submit Sender number & TrxID.",
    "nagad_instructions_bn": "নগদ অ্যাপ বা *১৬৭# ডায়াল করে Send Money -> 01811223344 নম্বরে টাকা পাঠান। এরপর সেন্ডার নম্বর ও ট্রানজেকশন আইডি সাবমিট করুন।",
    "rocket_enabled": true,
    "rocket_number": "01911223344-9",
    "rocket_type": "Personal (Send Money)",
    "rocket_instructions_en": "Rocket App/USSD *322# -> Send Money -> 019112233449. Submit Sender number & TrxID.",
    "rocket_instructions_bn": "রকেট অ্যাপ বা *৩২২# ডায়াল করে Send Money -> 019112233449 নম্বরে টাকা পাঠান। ট্রানজেকশন আইডি প্রদান করুন।",
    "bank_enabled": true,
    "bank_name": "City Bank PLC",
    "bank_account_name": "NoniNature Agro Enterprise",
    "bank_account_number": "1234567890123",
    "bank_branch": "Dhanmondi Branch, Dhaka",
    "bank_instructions_en": "Deposit or Transfer to City Bank A/C: 1234567890123. Submit deposit slip reference/TrxID.",
    "bank_instructions_bn": "সিটি ব্যাংক একাউন্টে ডিপোজিট বা ট্রান্সফার করুন। একাউন্ট নং: 1234567890123। জমা স্লিপ রেফারেন্স প্রদান করুন।"
}'::jsonb, true, 'Payment gateway and manual mobile banking configuration'),

('social_links', '{
    "facebook": "https://facebook.com/noninaturebd",
    "youtube": "https://youtube.com/@noninaturebd",
    "instagram": "https://instagram.com/noninaturebd",
    "whatsapp": "+8801711223344"
}'::jsonb, true, 'Social media links')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 3. Insert Homepage Botanical Hero Slides
INSERT INTO public.homepage_slides (title_en, title_bn, subtitle_en, subtitle_bn, cta_text_en, cta_text_bn, cta_url, image_url, display_order, is_active)
VALUES
(
    '100% Pure Organic Noni Products',
    '১০০% খাঁটি প্রাকৃতিক নোনি ফল ও পণ্য',
    'Sourced directly from our pesticide-free organic farms in Bangladesh. Experience nature’s rich antioxidants.',
    'কীটনাশকমুক্ত দেশীয় খামার থেকে সংগৃহীত। প্রকৃতির অনন্য অ্যান্টিঅক্সিডেন্ট সমৃদ্ধ নোনি জুস, চারা ও পণ্য।',
    'Shop All Products',
    'পণ্যসমূহ দেখুন',
    '/shop',
    '/images/slides/slide-1.webp',
    1,
    true
),
(
    'Plant Your Own Noni Tree at Home',
    'আপনার ছাদবাগান বা আঙ্গিনায় রোপণ করুন নোনি চারা',
    'High-yielding, vigorous grafted seedlings ready for home gardens and commercial farming.',
    'উন্নত জাতের রোগমুক্ত কলম চারা। ছাদে টবে বা জমিতে চাষের উপযোগী।',
    'View Plants & Seedlings',
    'নোনি চারা দেখুন',
    '/category/seedlings-plants',
    '/images/slides/slide-2.webp',
    2,
    true
);

-- 4. Insert Categories
INSERT INTO public.categories (id, name_en, name_bn, slug, description_en, description_bn, image_url, display_order, is_active)
VALUES
(
    '11111111-1111-1111-1111-111111111111',
    'Noni Juice & Extracts',
    'নোনি জুস ও নির্যাস',
    'noni-juice',
    'Aged and cold-pressed pure Morinda citrifolia noni juice loaded with botanical antioxidants.',
    'ঐতিহ্যবাহী পদ্ধতিতে সংরক্ষিত এবং কোল্ড-প্রেসড ১০০% বিশুদ্ধ নোনি ফলের জুস।',
    '/images/categories/juice.webp',
    1,
    true
),
(
    '22222222-2222-2222-2222-222222222222',
    'Raw & Dried Noni',
    'কাঁচা ও শুকনা নোনি',
    'raw-dried-noni',
    'Sun-dried organic noni slices and whole fruit for tea and daily herbal supplementation.',
    'রোদে শুকানো প্রাকৃতিক নোনি ফলের টুকরা ও আস্ত ফল, ভেষজ চা তৈরিতে উপযোগী।',
    '/images/categories/dried.webp',
    2,
    true
),
(
    '33333333-3333-3333-3333-333333333333',
    'Noni Seedlings & Trees',
    'নোনি গাছ ও চারা',
    'seedlings-plants',
    'Healthy, acclimatized Morinda citrifolia saplings and grafted trees for home or commercial farming in Bangladesh.',
    'বাংলাদেশের আবহাওয়ায় সহজে বর্ধনশীল উন্নত জাতের সুস্থ ও সবল নোনি গাছের চারা।',
    '/images/categories/seedlings.webp',
    3,
    true
),
(
    '44444444-4444-4444-4444-444444444444',
    'Herbal Skincare & Wellness',
    'ভেষজ স্কিনকেয়ার ও সুস্থতা',
    'skincare-wellness',
    'Botanical noni creams, herbal soaps, and soothing lotions for healthy skin glow.',
    'নোনি ফলের পুষ্টিকর উপাদানে সমৃদ্ধ প্রাকৃতিক স্কিনকেয়ার ক্রিম ও ভেষজ সাবান।',
    '/images/categories/skincare.webp',
    4,
    true
)
ON CONFLICT (id) DO NOTHING;

-- 5. Insert Reusable Attributes & Options
INSERT INTO public.attributes (id, code, name_en, name_bn)
VALUES
('aaaaaaaa-1111-1111-1111-111111111111', 'volume', 'Volume / Size', 'বোতল সাইজ'),
('bbbbbbbb-2222-2222-2222-222222222222', 'weight', 'Net Weight', 'ওজন'),
('cccccccc-3333-3333-3333-333333333333', 'plant_age', 'Plant Age', 'চারার বয়স')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.attribute_options (id, attribute_id, value, label_en, label_bn, display_order)
VALUES
('a1111111-0000-0000-0000-000000000001', 'aaaaaaaa-1111-1111-1111-111111111111', '500ml', '500 ml Bottle', '৫০০ মিলি বোতল', 1),
('a2222222-0000-0000-0000-000000000002', 'aaaaaaaa-1111-1111-1111-111111111111', '1000ml', '1 Litre Bottle', '১ লিটার বোতল', 2),
('b1111111-0000-0000-0000-000000000001', 'bbbbbbbb-2222-2222-2222-222222222222', '100g', '100 Gram Pack', '১০০ গ্রাম প্যাকেট', 1),
('b2222222-0000-0000-0000-000000000002', 'bbbbbbbb-2222-2222-2222-222222222222', '250g', '250 Gram Pack', '২৫০ গ্রাম প্যাকেট', 2),
('b3333333-0000-0000-0000-000000000003', 'bbbbbbbb-2222-2222-2222-222222222222', '500g', '500 Gram Pack', '৫০০ গ্রাম প্যাকেট', 3),
('c1111111-0000-0000-0000-000000000001', 'cccccccc-3333-3333-3333-333333333333', '6m', '6 Months Seedling (1-1.5 ft)', '৬ মাস বয়সী চারা (১-১.৫ ফুট)', 1),
('c2222222-0000-0000-0000-000000000002', 'cccccccc-3333-3333-3333-333333333333', '1y', '1 Year Grafted Tree (2-3 ft)', '১ বছরের কলম চারা (২-৩ ফুট)', 2)
ON CONFLICT (id) DO NOTHING;

-- 6. Insert Products
-- Product 1: Pure Organic Noni Juice (Variable)
INSERT INTO public.products (
    id, category_id, name_en, name_bn, slug, sku, product_type,
    description_en, description_bn, details_en, details_bn,
    regular_price, sale_price, stock_quantity, low_stock_threshold,
    is_active, is_featured, meta_title, meta_description
) VALUES (
    'e1111111-1111-1111-1111-111111111111',
    '11111111-1111-1111-1111-111111111111',
    'Premium Pure Organic Noni Juice',
    'প্রিমিয়াম ১০০% পিউর অর্গানিক নোনি জুস',
    'premium-pure-organic-noni-juice',
    'NN-JUICE-01',
    'variable',
    'Naturally fermented 100% pure Morinda Citrifolia juice without any added artificial sugar, preservatives, or colors.',
    'কোনোরকম রাসায়নিক, কৃত্রিম চিনি বা রঙ ছাড়া ১০০% প্রাকৃতিক নোনি ফলের নির্ভেজাল জুস। শরীরকে সতেজ ও কর্মচঞ্চল রাখতে প্রতিদিন সকালে সেবনযোগ্য।',
    'Ingredients: 100% Organic Noni Fruit Juice. Sourced: Local Agro Farms, Bangladesh. Suggested use: 30ml daily on an empty stomach diluted in lukewarm water.',
    'উপাদান: ১০০% অর্গানিক নোনি ফলের জুস। উৎস: নিজস্ব খামার, বাংলাদেশ। সেবনবিধি: প্রতিদিন সকালে খালি পেটে ৩০ মিলি জুস কুসুম গরম পানিতে মিশিয়ে পান করুন।',
    850.00,
    750.00,
    100,
    10,
    true,
    true,
    'Buy Pure Organic Noni Juice in Bangladesh | NoniNature',
    'Pure Morinda Citrifolia noni juice in Bangladesh. 100% natural, no preservatives, nationwide Cash on Delivery.'
) ON CONFLICT (id) DO NOTHING;

-- Variants for Product 1
INSERT INTO public.product_variants (id, product_id, sku, regular_price, sale_price, stock_quantity, image_url, is_active)
VALUES
('f1111111-1111-1111-1111-111111111111', 'e1111111-1111-1111-1111-111111111111', 'NN-JUICE-500ML', 850.00, 750.00, 60, '/images/products/juice-500ml.webp', true),
('f2222222-2222-2222-2222-222222222222', 'e1111111-1111-1111-1111-111111111111', 'NN-JUICE-1000ML', 1600.00, 1390.00, 40, '/images/products/juice-1000ml.webp', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.variant_attribute_values (variant_id, attribute_id, attribute_option_id)
VALUES
('f1111111-1111-1111-1111-111111111111', 'aaaaaaaa-1111-1111-1111-111111111111', 'a1111111-0000-0000-0000-000000000001'),
('f2222222-2222-2222-2222-222222222222', 'aaaaaaaa-1111-1111-1111-111111111111', 'a2222222-0000-0000-0000-000000000002')
ON CONFLICT DO NOTHING;

-- Product 2: Sun-Dried Noni Slices (Variable)
INSERT INTO public.products (
    id, category_id, name_en, name_bn, slug, sku, product_type,
    description_en, description_bn, details_en, details_bn,
    regular_price, sale_price, stock_quantity, low_stock_threshold,
    is_active, is_featured, meta_title, meta_description
) VALUES (
    'e2222222-2222-2222-2222-222222222222',
    '22222222-2222-2222-2222-222222222222',
    'Sun-Dried Organic Noni Slices',
    'রোদে শুকানো অর্গানিক নোনি ফলের টুকরা',
    'sun-dried-organic-noni-slices',
    'NN-DRIED-01',
    'variable',
    'Hygienically dehydrated ripe noni slices. Ideal for brewing antioxidant-rich noni herbal tea or infusing with honey.',
    'স্বাস্থ্যসম্মতভাবে সৌরতাপে শুকানো পাকা নোনি ফল। ভেষজ চা তৈরি অথবা মধুর সাথে ভিজিয়ে খাওয়ার জন্য অতুলনীয়।',
    'Net Weight Options: 100g, 250g. Storage: Store in a cool, dry airtight glass jar.',
    'প্যাকেট সাইজ: ১০০ গ্রাম, ২৫০ গ্রাম। সংরক্ষণ: শুকনা ও শীতল স্থানে কাচের পাত্রে রাখুন।',
    400.00,
    350.00,
    80,
    15,
    true,
    true,
    'Sun-Dried Noni Fruit Slices | NoniNature Bangladesh',
    'Buy organic sun-dried noni slices for herbal tea in Bangladesh with cash on delivery.'
) ON CONFLICT (id) DO NOTHING;

-- Variants for Product 2
INSERT INTO public.product_variants (id, product_id, sku, regular_price, sale_price, stock_quantity, image_url, is_active)
VALUES
('f3333333-3333-3333-3333-333333333333', 'e2222222-2222-2222-2222-222222222222', 'NN-DRIED-100G', 400.00, 350.00, 50, '/images/products/dried-100g.webp', true),
('f4444444-4444-4444-4444-444444444444', 'e2222222-2222-2222-2222-222222222222', 'NN-DRIED-250G', 900.00, 780.00, 30, '/images/products/dried-250g.webp', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.variant_attribute_values (variant_id, attribute_id, attribute_option_id)
VALUES
('f3333333-3333-3333-3333-333333333333', 'bbbbbbbb-2222-2222-2222-222222222222', 'b1111111-0000-0000-0000-000000000001'),
('f4444444-4444-4444-4444-444444444444', 'bbbbbbbb-2222-2222-2222-222222222222', 'b2222222-0000-0000-0000-000000000002')
ON CONFLICT DO NOTHING;

-- Product 3: Organic Noni Tree / Seedling (Variable)
INSERT INTO public.products (
    id, category_id, name_en, name_bn, slug, sku, product_type,
    description_en, description_bn, details_en, details_bn,
    regular_price, sale_price, stock_quantity, low_stock_threshold,
    is_active, is_featured, meta_title, meta_description
) VALUES (
    'e3333333-3333-3333-3333-333333333333',
    '33333333-3333-3333-3333-333333333333',
    'Healthy Grafted Noni Tree Sapling',
    'উন্নত জাতের কলম নোনি চারা গাছ',
    'healthy-grafted-noni-tree-sapling',
    'NN-PLANT-01',
    'variable',
    'Acclimatized, disease-free Morinda Citrifolia seedlings grown in organic soil mix. Starts flowering and fruiting in 12-18 months.',
    'বিশেষভাবে পরিচর্যাকৃত রোগমুক্ত উন্নত জাতের নোনি কলম চারা। টবে বা মাটিতে লাগালে ১২-১৮ মাসের মধ্যে ফল ধরতে শুরু করে।',
    'Care Guide: Requires direct sunlight 5-6 hours daily. Water moderately when topsoil dries. Delivered in secure nursery polybags.',
    'যত্ন ও পরিচর্যা: দিনে ৫-৬ ঘণ্টা রোদে রাখুন। মাটি শুকিয়ে এলে পরিমিত পানি দিন। নিরাপদ প্যাকেজিংয়ে পাঠানো হয়।',
    350.00,
    290.00,
    50,
    10,
    true,
    true,
    'Buy Noni Plant Sapling Online in Bangladesh | NoniNature',
    'Healthy noni tree saplings with fast nationwide shipping across Bangladesh.'
) ON CONFLICT (id) DO NOTHING;

-- Variants for Product 3
INSERT INTO public.product_variants (id, product_id, sku, regular_price, sale_price, stock_quantity, image_url, is_active)
VALUES
('f5555555-5555-5555-5555-555555555555', 'e3333333-3333-3333-3333-333333333333', 'NN-PLANT-6M', 350.00, 290.00, 30, '/images/products/plant-6m.webp', true),
('f6666666-6666-6666-6666-666666666666', 'e3333333-3333-3333-3333-333333333333', 'NN-PLANT-1Y', 650.00, 550.00, 20, '/images/products/plant-1y.webp', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.variant_attribute_values (variant_id, attribute_id, attribute_option_id)
VALUES
('f5555555-5555-5555-5555-555555555555', 'cccccccc-3333-3333-3333-333333333333', 'c1111111-0000-0000-0000-000000000001'),
('f6666666-6666-6666-6666-666666666666', 'cccccccc-3333-3333-3333-333333333333', 'c2222222-0000-0000-0000-000000000002')
ON CONFLICT DO NOTHING;

-- Product 4: Noni Botanical Herbal Soap (Simple)
INSERT INTO public.products (
    id, category_id, name_en, name_bn, slug, sku, product_type,
    description_en, description_bn, details_en, details_bn,
    regular_price, sale_price, stock_quantity, low_stock_threshold,
    is_active, is_featured, meta_title, meta_description
) VALUES (
    'e4444444-4444-4444-4444-444444444444',
    '44444444-4444-4444-4444-444444444444',
    'Noni Botanical Deep Cleanse Soap',
    'নোনি বোটানিক্যাল ভেষজ সাবান',
    'noni-botanical-deep-cleanse-soap',
    'NN-SOAP-100G',
    'simple',
    'Handmade artisanal cold-process herbal soap enriched with pure noni fruit pulp, cold-pressed virgin coconut oil, and vitamin E.',
    'হাতে তৈরি অর্গানিক কোল্ড-প্রসেস ভেষজ সাবান। এতে রয়েছে কাঁচা নোনি নির্যাস, ভার্জিন নারিকেল তেল ও ভিটামিন-ই যা ত্বককে রাখে মসৃণ ও উজ্জ্বল।',
    'Net weight: 100g. Free of parabens, sulfates, and synthetic perfumes. 100% biodegradable.',
    'নেট ওজন: ১০০ গ্রাম। প্যারাবেন ও কৃত্রিম সুগন্ধিমুক্ত শতভাগ প্রাকৃতিক উপাদান।',
    220.00,
    180.00,
    120,
    20,
    true,
    true,
    'Handmade Noni Herbal Soap | NoniNature BD',
    'Artisanal noni soap crafted in Bangladesh for gentle botanical cleansing.'
) ON CONFLICT (id) DO NOTHING;

-- 7. Insert Product Images
INSERT INTO public.product_images (product_id, image_url, alt_text, display_order, is_primary)
VALUES
('e1111111-1111-1111-1111-111111111111', '/images/products/juice-bottle.webp', 'Organic Noni Juice Bottle', 1, true),
('e1111111-1111-1111-1111-111111111111', '/images/products/juice-pour.webp', 'Pouring Fresh Noni Juice', 2, false),
('e2222222-2222-2222-2222-222222222222', '/images/products/dried-slices.webp', 'Dried Noni Fruit Slices', 1, true),
('e3333333-3333-3333-3333-333333333333', '/images/products/noni-seedling.webp', 'Potted Noni Sapling', 1, true),
('e4444444-4444-4444-4444-444444444444', '/images/products/noni-soap.webp', 'Handmade Noni Soap Bar', 1, true)
ON CONFLICT DO NOTHING;
