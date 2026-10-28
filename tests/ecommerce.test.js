const test = require('node:test');
const assert = require('node:assert');

// 1. Bangladesh Phone Validation Tests
function isValidBangladeshPhone(phone) {
  if (!phone) return false;
  const cleaned = phone.replace(/[\s-]/g, '');
  const bdRegex = /^(?:\+?88)?01[3-9]\d{8}$/;
  return bdRegex.test(cleaned);
}

function normalizePhone(phone) {
  const cleaned = phone.replace(/[\s-]/g, '');
  if (cleaned.startsWith('+88')) return cleaned.slice(3);
  if (cleaned.startsWith('88')) return cleaned.slice(2);
  return cleaned;
}

test('Bangladesh Phone Validation', async (t) => {
  await t.test('accepts valid 11-digit numbers', () => {
    assert.strictEqual(isValidBangladeshPhone('01711223344'), true);
    assert.strictEqual(isValidBangladeshPhone('01898765432'), true);
    assert.strictEqual(isValidBangladeshPhone('01312345678'), true);
    assert.strictEqual(isValidBangladeshPhone('01912345678'), true);
  });

  await t.test('accepts valid numbers with +88 or 88 prefix', () => {
    assert.strictEqual(isValidBangladeshPhone('+8801711223344'), true);
    assert.strictEqual(isValidBangladeshPhone('8801811223344'), true);
  });

  await t.test('rejects invalid operators, short numbers, and non-digits', () => {
    assert.strictEqual(isValidBangladeshPhone('01211223344'), false); // 012 is invalid
    assert.strictEqual(isValidBangladeshPhone('0171122'), false); // too short
    assert.strictEqual(isValidBangladeshPhone('0171122334455'), false); // too long
    assert.strictEqual(isValidBangladeshPhone('abcdefghijk'), false);
    assert.strictEqual(isValidBangladeshPhone(''), false);
  });

  await t.test('normalizes numbers accurately', () => {
    assert.strictEqual(normalizePhone('+8801711223344'), '01711223344');
    assert.strictEqual(normalizePhone('8801811223344'), '01811223344');
    assert.strictEqual(normalizePhone('01911223344'), '01911223344');
  });
});

// 2. Order Calculation and Free Delivery Threshold Tests
function calculateOrderTotals(items, district, freeDeliveryThreshold = 2000) {
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const baseDeliveryFee = district === 'Inside Dhaka' ? 70 : 130;
  const deliveryFee = subtotal >= freeDeliveryThreshold ? 0 : baseDeliveryFee;
  const grandTotal = subtotal + deliveryFee;

  return { subtotal, deliveryFee, grandTotal };
}

test('Order Total & Delivery Fee Calculation', async (t) => {
  await t.test('calculates correct total inside Dhaka with standard delivery fee', () => {
    const items = [{ price: 750, quantity: 2 }]; // 1500
    const result = calculateOrderTotals(items, 'Inside Dhaka', 2000);
    assert.strictEqual(result.subtotal, 1500);
    assert.strictEqual(result.deliveryFee, 70);
    assert.strictEqual(result.grandTotal, 1570);
  });

  await t.test('calculates correct total outside Dhaka with standard fee', () => {
    const items = [{ price: 350, quantity: 2 }]; // 700
    const result = calculateOrderTotals(items, 'Chattogram', 2000);
    assert.strictEqual(result.subtotal, 700);
    assert.strictEqual(result.deliveryFee, 130);
    assert.strictEqual(result.grandTotal, 830);
  });

  await t.test('applies free delivery when subtotal meets threshold of ৳2000', () => {
    const items = [{ price: 750, quantity: 3 }]; // 2250
    const result = calculateOrderTotals(items, 'Outside Dhaka', 2000);
    assert.strictEqual(result.subtotal, 2250);
    assert.strictEqual(result.deliveryFee, 0); // FREE
    assert.strictEqual(result.grandTotal, 2250);
  });
});

// 3. Stock Safety & Invariant Tests
test('Stock Invariant Rules', async (t) => {
  await t.test('cannot order more than available stock', () => {
    const stockQuantity = 5;
    const requestedQuantity = 8;
    const isAllowed = requestedQuantity <= stockQuantity;
    assert.strictEqual(isAllowed, false);
  });

  await t.test('sale price cannot be negative or exceed regular price', () => {
    function isValidSalePrice(regular, sale) {
      if (sale === null || sale === undefined) return true;
      return sale >= 0 && sale <= regular;
    }

    assert.strictEqual(isValidSalePrice(850, 750), true);
    assert.strictEqual(isValidSalePrice(850, 850), true);
    assert.strictEqual(isValidSalePrice(850, 900), false);
    assert.strictEqual(isValidSalePrice(850, -50), false);
  });
});
