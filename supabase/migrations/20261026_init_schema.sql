-- ==============================================================================
-- NoniNature Production Database Schema Migration
-- Designed for Supabase PostgreSQL with Strict RLS and Atomic Order Functions
-- ==============================================================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 1. Profiles & Role Management
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT NOT NULL DEFAULT '',
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'staff')),
    avatar_url TEXT,
    default_address JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 2. Categories
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_en TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description_en TEXT,
    description_bn TEXT,
    image_url TEXT,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 3. Product Attributes & Options (e.g. Size, Weight, Plant Age, Package)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.attributes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    name_en TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.attribute_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    attribute_id UUID NOT NULL REFERENCES public.attributes(id) ON DELETE CASCADE,
    value TEXT NOT NULL,
    label_en TEXT NOT NULL,
    label_bn TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    UNIQUE(attribute_id, value)
);

-- ------------------------------------------------------------------------------
-- 4. Products
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name_en TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    sku TEXT NOT NULL UNIQUE,
    product_type TEXT NOT NULL DEFAULT 'simple' CHECK (product_type IN ('simple', 'variable')),
    description_en TEXT,
    description_bn TEXT,
    details_en TEXT,
    details_bn TEXT,
    regular_price NUMERIC(12, 2) NOT NULL CHECK (regular_price >= 0),
    sale_price NUMERIC(12, 2) CHECK (sale_price IS NULL OR (sale_price >= 0 AND sale_price <= regular_price)),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    low_stock_threshold INT NOT NULL DEFAULT 5 CHECK (low_stock_threshold >= 0),
    is_in_stock BOOLEAN GENERATED ALWAYS AS (stock_quantity > 0) STORED,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    meta_title TEXT,
    meta_description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 5. Product Images
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    display_order INT NOT NULL DEFAULT 0,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 6. Product Variants
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    sku TEXT NOT NULL UNIQUE,
    regular_price NUMERIC(12, 2) NOT NULL CHECK (regular_price >= 0),
    sale_price NUMERIC(12, 2) CHECK (sale_price IS NULL OR (sale_price >= 0 AND sale_price <= regular_price)),
    stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
    image_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_in_stock BOOLEAN GENERATED ALWAYS AS (stock_quantity > 0) STORED,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.variant_attribute_values (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id UUID NOT NULL REFERENCES public.product_variants(id) ON DELETE CASCADE,
    attribute_id UUID NOT NULL REFERENCES public.attributes(id) ON DELETE RESTRICT,
    attribute_option_id UUID NOT NULL REFERENCES public.attribute_options(id) ON DELETE RESTRICT,
    UNIQUE(variant_id, attribute_id)
);

-- ------------------------------------------------------------------------------
-- 7. Inventory Movements (Stock Audit Trail)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE CASCADE,
    change_quantity INT NOT NULL,
    previous_stock INT NOT NULL,
    new_stock INT NOT NULL,
    movement_type TEXT NOT NULL CHECK (movement_type IN ('purchase', 'sale', 'adjustment', 'return', 'cancel')),
    reason TEXT NOT NULL DEFAULT '',
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 8. Orders & Order Items
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_reference TEXT NOT NULL UNIQUE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    guest_info JSONB DEFAULT NULL,
    subtotal NUMERIC(12, 2) NOT NULL CHECK (subtotal >= 0),
    delivery_fee NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (delivery_fee >= 0),
    discount_total NUMERIC(12, 2) NOT NULL DEFAULT 0 CHECK (discount_total >= 0),
    grand_total NUMERIC(12, 2) NOT NULL CHECK (grand_total >= 0),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cod', 'bkash', 'nagad', 'rocket', 'bank')),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'verified', 'failed', 'refunded')),
    fulfillment_status TEXT NOT NULL DEFAULT 'pending' CHECK (fulfillment_status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned')),
    delivery_district TEXT NOT NULL,
    delivery_address TEXT NOT NULL,
    delivery_notes TEXT,
    contact_phone TEXT NOT NULL,
    customer_name TEXT NOT NULL,
    cancellation_reason TEXT,
    cancelled_at TIMESTAMPTZ,
    ip_address TEXT,
    stock_restored BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    variant_id UUID REFERENCES public.product_variants(id) ON DELETE RESTRICT,
    product_name TEXT NOT NULL,
    variant_name TEXT,
    sku TEXT NOT NULL,
    unit_price NUMERIC(12, 2) NOT NULL CHECK (unit_price >= 0),
    quantity INT NOT NULL CHECK (quantity > 0),
    line_total NUMERIC(12, 2) NOT NULL CHECK (line_total >= 0),
    image_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 9. Payments (Manual Mobile Banking & Bank Transfer Submissions)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('cod', 'bkash', 'nagad', 'rocket', 'bank')),
    amount NUMERIC(12, 2) NOT NULL CHECK (amount >= 0),
    sender_phone TEXT,
    transaction_id TEXT,
    bank_account_info TEXT,
    verification_notes TEXT,
    verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    verified_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 10. Site Settings (Key-Value)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.site_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    is_public BOOLEAN NOT NULL DEFAULT false,
    description TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 11. Homepage Hero Slides
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.homepage_slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title_en TEXT NOT NULL,
    title_bn TEXT NOT NULL,
    subtitle_en TEXT,
    subtitle_bn TEXT,
    cta_text_en TEXT NOT NULL DEFAULT 'Shop Now',
    cta_text_bn TEXT NOT NULL DEFAULT 'এখনই কিনুন',
    cta_url TEXT NOT NULL DEFAULT '/shop',
    image_url TEXT NOT NULL,
    display_order INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 12. Delivery Rules (District pricing)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.delivery_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    district_name_en TEXT NOT NULL UNIQUE,
    district_name_bn TEXT NOT NULL,
    delivery_fee NUMERIC(10, 2) NOT NULL CHECK (delivery_fee >= 0),
    estimated_days TEXT NOT NULL DEFAULT '2-4 business days',
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_default BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 13. Audit Logs
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- 14. Product Reviews (Only for genuine ratings)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.product_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    customer_name TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    is_verified_purchase BOOLEAN NOT NULL DEFAULT false,
    is_approved BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ------------------------------------------------------------------------------
-- INDEXES
-- ------------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_product_variants_product ON public.product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_reference ON public.orders(order_reference);
CREATE INDEX IF NOT EXISTS idx_orders_user ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON public.orders(contact_phone);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_order ON public.payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON public.payments(status);
CREATE INDEX IF NOT EXISTS idx_inventory_product ON public.inventory_movements(product_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON public.product_reviews(product_id);

-- ------------------------------------------------------------------------------
-- HELPER FUNCTIONS & TRIGGERS
-- ------------------------------------------------------------------------------

-- Automatic updated_at timestamp function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
DO $$
DECLARE
    tbl text;
BEGIN
    FOR tbl IN 
        SELECT tablename FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename IN ('profiles', 'categories', 'products', 'product_variants', 'orders', 'delivery_rules', 'site_settings')
    LOOP
        EXECUTE format('DROP TRIGGER IF EXISTS trigger_updated_at ON public.%I;', tbl);
        EXECUTE format('CREATE TRIGGER trigger_updated_at BEFORE UPDATE ON public.%I FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();', tbl);
    END LOOP;
END;
$$;

-- Automatic Profile Creation on auth.users Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, phone, role)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
        COALESCE(NEW.raw_user_meta_data->>'phone', ''),
        'customer'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Admin Authorization Check Helper
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = user_id AND role IN ('admin', 'staff')
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- ATOMIC ORDER PLACEMENT FUNCTION
-- Handles stock deduction, order & line items creation in a single transaction
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.place_order_atomic(
    p_order_reference TEXT,
    p_user_id UUID,
    p_guest_info JSONB,
    p_customer_name TEXT,
    p_contact_phone TEXT,
    p_delivery_district TEXT,
    p_delivery_address TEXT,
    p_delivery_notes TEXT,
    p_payment_method TEXT,
    p_delivery_fee NUMERIC,
    p_items JSONB, -- Array of {product_id, variant_id, quantity}
    p_ip_address TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_order_id UUID;
    v_subtotal NUMERIC(12, 2) := 0;
    v_grand_total NUMERIC(12, 2) := 0;
    v_item RECORD;
    v_prod RECORD;
    v_var RECORD;
    v_unit_price NUMERIC(12, 2);
    v_item_name TEXT;
    v_item_var_name TEXT;
    v_item_sku TEXT;
    v_item_image TEXT;
    v_line_total NUMERIC(12, 2);
    v_curr_stock INT;
    v_new_stock INT;
BEGIN
    -- 1. Validate inputs
    IF p_customer_name IS NULL OR length(trim(p_customer_name)) = 0 THEN
        RAISE EXCEPTION 'Customer name is required';
    END IF;
    IF p_contact_phone IS NULL OR length(trim(p_contact_phone)) < 11 THEN
        RAISE EXCEPTION 'A valid Bangladesh phone number is required';
    END IF;
    IF jsonb_array_length(p_items) = 0 THEN
        RAISE EXCEPTION 'Order must contain at least one item';
    END IF;

    -- Check idempotency
    IF EXISTS (SELECT 1 FROM public.orders WHERE order_reference = p_order_reference) THEN
        RAISE EXCEPTION 'Order reference % already exists', p_order_reference;
    END IF;

    -- 2. Validate items and calculate trusted prices from DB
    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(product_id UUID, variant_id UUID, quantity INT)
    LOOP
        IF v_item.quantity <= 0 THEN
            RAISE EXCEPTION 'Quantity must be positive';
        END IF;

        -- Fetch product
        SELECT * INTO v_prod FROM public.products WHERE id = v_item.product_id AND is_active = true FOR UPDATE;
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Product not found or inactive: %', v_item.product_id;
        END IF;

        IF v_item.variant_id IS NOT NULL THEN
            SELECT * INTO v_var FROM public.product_variants WHERE id = v_item.variant_id AND product_id = v_item.product_id AND is_active = true FOR UPDATE;
            IF NOT FOUND THEN
                RAISE EXCEPTION 'Variant not found or inactive: %', v_item.variant_id;
            END IF;

            v_curr_stock := v_var.stock_quantity;
            IF v_curr_stock < v_item.quantity THEN
                RAISE EXCEPTION 'Insufficient stock for % (SKU: %). Requested: %, Available: %', v_prod.name_en, v_var.sku, v_item.quantity, v_curr_stock;
            END IF;

            v_unit_price := COALESCE(v_var.sale_price, v_var.regular_price);
            v_item_name := v_prod.name_en;
            v_item_var_name := 'Variant ' || v_var.sku;
            v_item_sku := v_var.sku;
            v_item_image := COALESCE(v_var.image_url, (SELECT image_url FROM public.product_images WHERE product_id = v_prod.id AND is_primary = true LIMIT 1));
        ELSE
            v_curr_stock := v_prod.stock_quantity;
            IF v_curr_stock < v_item.quantity THEN
                RAISE EXCEPTION 'Insufficient stock for % (SKU: %). Requested: %, Available: %', v_prod.name_en, v_prod.sku, v_item.quantity, v_curr_stock;
            END IF;

            v_unit_price := COALESCE(v_prod.sale_price, v_prod.regular_price);
            v_item_name := v_prod.name_en;
            v_item_var_name := NULL;
            v_item_sku := v_prod.sku;
            v_item_image := (SELECT image_url FROM public.product_images WHERE product_id = v_prod.id AND is_primary = true LIMIT 1);
        END IF;

        v_line_total := v_unit_price * v_item.quantity;
        v_subtotal := v_subtotal + v_line_total;
    END LOOP;

    v_grand_total := v_subtotal + p_delivery_fee;

    -- 3. Create Order
    INSERT INTO public.orders (
        order_reference,
        user_id,
        guest_info,
        customer_name,
        contact_phone,
        delivery_district,
        delivery_address,
        delivery_notes,
        payment_method,
        payment_status,
        fulfillment_status,
        subtotal,
        delivery_fee,
        grand_total,
        ip_address
    ) VALUES (
        p_order_reference,
        p_user_id,
        p_guest_info,
        p_customer_name,
        p_contact_phone,
        p_delivery_district,
        p_delivery_address,
        p_delivery_notes,
        p_payment_method,
        'pending',
        'pending',
        v_subtotal,
        p_delivery_fee,
        v_grand_total,
        p_ip_address
    ) RETURNING id INTO v_order_id;

    -- 4. Create Order Items and Deduct Stock
    FOR v_item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(product_id UUID, variant_id UUID, quantity INT)
    LOOP
        SELECT * INTO v_prod FROM public.products WHERE id = v_item.product_id;

        IF v_item.variant_id IS NOT NULL THEN
            SELECT * INTO v_var FROM public.product_variants WHERE id = v_item.variant_id;
            v_unit_price := COALESCE(v_var.sale_price, v_var.regular_price);
            v_item_sku := v_var.sku;
            v_item_var_name := 'Variant ' || v_var.sku;
            v_item_image := COALESCE(v_var.image_url, (SELECT image_url FROM public.product_images WHERE product_id = v_prod.id AND is_primary = true LIMIT 1));
            v_curr_stock := v_var.stock_quantity;
            v_new_stock := v_curr_stock - v_item.quantity;

            -- Deduct variant stock
            UPDATE public.product_variants SET stock_quantity = v_new_stock WHERE id = v_item.variant_id;
            -- Also deduct from overall product stock
            UPDATE public.products SET stock_quantity = GREATEST(0, stock_quantity - v_item.quantity) WHERE id = v_item.product_id;

            -- Audit stock movement
            INSERT INTO public.inventory_movements (product_id, variant_id, change_quantity, previous_stock, new_stock, movement_type, reason, created_by)
            VALUES (v_item.product_id, v_item.variant_id, -v_item.quantity, v_curr_stock, v_new_stock, 'sale', 'Order: ' || p_order_reference, p_user_id);
        ELSE
            v_unit_price := COALESCE(v_prod.sale_price, v_prod.regular_price);
            v_item_sku := v_prod.sku;
            v_item_var_name := NULL;
            v_item_image := (SELECT image_url FROM public.product_images WHERE product_id = v_prod.id AND is_primary = true LIMIT 1);
            v_curr_stock := v_prod.stock_quantity;
            v_new_stock := v_curr_stock - v_item.quantity;

            -- Deduct product stock
            UPDATE public.products SET stock_quantity = v_new_stock WHERE id = v_item.product_id;

            -- Audit stock movement
            INSERT INTO public.inventory_movements (product_id, variant_id, change_quantity, previous_stock, new_stock, movement_type, reason, created_by)
            VALUES (v_item.product_id, NULL, -v_item.quantity, v_curr_stock, v_new_stock, 'sale', 'Order: ' || p_order_reference, p_user_id);
        END IF;

        v_line_total := v_unit_price * v_item.quantity;

        INSERT INTO public.order_items (
            order_id,
            product_id,
            variant_id,
            product_name,
            variant_name,
            sku,
            unit_price,
            quantity,
            line_total,
            image_url
        ) VALUES (
            v_order_id,
            v_item.product_id,
            v_item.variant_id,
            v_prod.name_en,
            v_item_var_name,
            v_item_sku,
            v_unit_price,
            v_item.quantity,
            v_line_total,
            v_item_image
        );
    END LOOP;

    RETURN jsonb_build_object(
        'success', true,
        'order_id', v_order_id,
        'order_reference', p_order_reference,
        'grand_total', v_grand_total,
        'subtotal', v_subtotal,
        'delivery_fee', p_delivery_fee
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- ATOMIC ORDER CANCELLATION & STOCK RESTORATION
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.cancel_order_atomic(
    p_order_id UUID,
    p_reason TEXT,
    p_cancelled_by UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_order RECORD;
    v_item RECORD;
    v_prod RECORD;
    v_var RECORD;
BEGIN
    SELECT * INTO v_order FROM public.orders WHERE id = p_order_id FOR UPDATE;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Order not found';
    END IF;

    IF v_order.fulfillment_status = 'cancelled' THEN
        RAISE EXCEPTION 'Order is already cancelled';
    END IF;

    -- Only restore stock if not already restored
    IF NOT v_order.stock_restored THEN
        FOR v_item IN SELECT * FROM public.order_items WHERE order_id = p_order_id
        LOOP
            IF v_item.variant_id IS NOT NULL THEN
                SELECT * INTO v_var FROM public.product_variants WHERE id = v_item.variant_id FOR UPDATE;
                UPDATE public.product_variants SET stock_quantity = stock_quantity + v_item.quantity WHERE id = v_item.variant_id;
                UPDATE public.products SET stock_quantity = stock_quantity + v_item.quantity WHERE id = v_item.product_id;

                INSERT INTO public.inventory_movements (product_id, variant_id, change_quantity, previous_stock, new_stock, movement_type, reason, created_by)
                VALUES (v_item.product_id, v_item.variant_id, v_item.quantity, v_var.stock_quantity, v_var.stock_quantity + v_item.quantity, 'cancel', 'Order cancelled: ' || v_order.order_reference, p_cancelled_by);
            ELSE
                SELECT * INTO v_prod FROM public.products WHERE id = v_item.product_id FOR UPDATE;
                UPDATE public.products SET stock_quantity = stock_quantity + v_item.quantity WHERE id = v_item.product_id;

                INSERT INTO public.inventory_movements (product_id, variant_id, change_quantity, previous_stock, new_stock, movement_type, reason, created_by)
                VALUES (v_item.product_id, NULL, v_item.quantity, v_prod.stock_quantity, v_prod.stock_quantity + v_item.quantity, 'cancel', 'Order cancelled: ' || v_order.order_reference, p_cancelled_by);
            END IF;
        END LOOP;
    END IF;

    UPDATE public.orders
    SET fulfillment_status = 'cancelled',
        cancellation_reason = p_reason,
        cancelled_at = timezone('utc'::text, now()),
        stock_restored = true
    WHERE id = p_order_id;

    RETURN jsonb_build_object('success', true, 'message', 'Order cancelled and stock restored');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- SECURE ORDER TRACKING FUNCTION (Guest & Authenticated)
-- Requires matching reference AND contact phone number
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.track_order(
    p_order_reference TEXT,
    p_phone TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_order RECORD;
    v_items JSONB;
    v_payments JSONB;
BEGIN
    SELECT * INTO v_order 
    FROM public.orders 
    WHERE lower(order_reference) = lower(trim(p_order_reference))
      AND right(regexp_replace(contact_phone, '[^0-9]', '', 'g'), 10) = right(regexp_replace(p_phone, '[^0-9]', '', 'g'), 10);

    IF NOT FOUND THEN
        RETURN jsonb_build_object('found', false, 'message', 'No matching order found for this reference and phone number.');
    END IF;

    SELECT jsonb_agg(jsonb_build_object(
        'product_name', product_name,
        'variant_name', variant_name,
        'sku', sku,
        'unit_price', unit_price,
        'quantity', quantity,
        'line_total', line_total,
        'image_url', image_url
    )) INTO v_items FROM public.order_items WHERE order_id = v_order.id;

    SELECT jsonb_agg(jsonb_build_object(
        'payment_method', payment_method,
        'amount', amount,
        'sender_phone', sender_phone,
        'transaction_id', transaction_id,
        'status', status,
        'created_at', created_at
    )) INTO v_payments FROM public.payments WHERE order_id = v_order.id;

    RETURN jsonb_build_object(
        'found', true,
        'order', jsonb_build_object(
            'order_reference', v_order.order_reference,
            'customer_name', v_order.customer_name,
            'contact_phone', v_order.contact_phone,
            'delivery_district', v_order.delivery_district,
            'delivery_address', v_order.delivery_address,
            'payment_method', v_order.payment_method,
            'payment_status', v_order.payment_status,
            'fulfillment_status', v_order.fulfillment_status,
            'subtotal', v_order.subtotal,
            'delivery_fee', v_order.delivery_fee,
            'grand_total', v_order.grand_total,
            'created_at', v_order.created_at,
            'items', COALESCE(v_items, '[]'::jsonb),
            'payments', COALESCE(v_payments, '[]'::jsonb)
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attribute_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.variant_attribute_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.homepage_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.delivery_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_reviews ENABLE ROW LEVEL SECURITY;

-- 1. Profiles
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins full access to profiles" ON public.profiles FOR ALL USING (public.is_admin(auth.uid()));

-- 2. Categories
CREATE POLICY "Public can view active categories" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Admins full access to categories" ON public.categories FOR ALL USING (public.is_admin(auth.uid()));

-- 3. Attributes & Options
CREATE POLICY "Public can view attributes" ON public.attributes FOR SELECT USING (true);
CREATE POLICY "Admins full access to attributes" ON public.attributes FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Public can view attribute options" ON public.attribute_options FOR SELECT USING (true);
CREATE POLICY "Admins full access to attribute options" ON public.attribute_options FOR ALL USING (public.is_admin(auth.uid()));

-- 4. Products & Images
CREATE POLICY "Public can view active products" ON public.products FOR SELECT USING (is_active = true);
CREATE POLICY "Admins full access to products" ON public.products FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Public can view product images" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Admins full access to product images" ON public.product_images FOR ALL USING (public.is_admin(auth.uid()));

-- 5. Product Variants
CREATE POLICY "Public can view active variants" ON public.product_variants FOR SELECT USING (is_active = true);
CREATE POLICY "Admins full access to variants" ON public.product_variants FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Public can view variant attributes" ON public.variant_attribute_values FOR SELECT USING (true);
CREATE POLICY "Admins full access to variant attributes" ON public.variant_attribute_values FOR ALL USING (public.is_admin(auth.uid()));

-- 6. Inventory Movements
CREATE POLICY "Admins can view inventory movements" ON public.inventory_movements FOR SELECT USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins can insert inventory movements" ON public.inventory_movements FOR INSERT WITH CHECK (public.is_admin(auth.uid()));

-- 7. Orders & Order Items
-- Registered users can see their own orders
CREATE POLICY "Users can view own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
);
-- Admins have full access to orders and items
CREATE POLICY "Admins full access to orders" ON public.orders FOR ALL USING (public.is_admin(auth.uid()));
CREATE POLICY "Admins full access to order items" ON public.order_items FOR ALL USING (public.is_admin(auth.uid()));

-- 8. Payments
CREATE POLICY "Users can view payments for own orders" ON public.payments FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = payments.order_id AND orders.user_id = auth.uid())
);
CREATE POLICY "Anyone can submit payment for pending orders" ON public.payments FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.orders WHERE orders.id = payments.order_id AND orders.payment_status = 'pending')
);
CREATE POLICY "Admins full access to payments" ON public.payments FOR ALL USING (public.is_admin(auth.uid()));

-- 9. Site Settings
CREATE POLICY "Public can view public settings" ON public.site_settings FOR SELECT USING (is_public = true);
CREATE POLICY "Admins full access to settings" ON public.site_settings FOR ALL USING (public.is_admin(auth.uid()));

-- 10. Homepage Slides
CREATE POLICY "Public can view active slides" ON public.homepage_slides FOR SELECT USING (is_active = true);
CREATE POLICY "Admins full access to slides" ON public.homepage_slides FOR ALL USING (public.is_admin(auth.uid()));

-- 11. Delivery Rules
CREATE POLICY "Public can view active delivery rules" ON public.delivery_rules FOR SELECT USING (is_active = true);
CREATE POLICY "Admins full access to delivery rules" ON public.delivery_rules FOR ALL USING (public.is_admin(auth.uid()));

-- 12. Audit Logs
CREATE POLICY "Admins can view audit logs" ON public.audit_logs FOR SELECT USING (public.is_admin(auth.uid()));

-- 13. Product Reviews
CREATE POLICY "Public can view approved reviews" ON public.product_reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can submit reviews" ON public.product_reviews FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);
CREATE POLICY "Admins full access to reviews" ON public.product_reviews FOR ALL USING (public.is_admin(auth.uid()));
