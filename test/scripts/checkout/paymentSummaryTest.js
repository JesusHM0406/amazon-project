import { Persistance } from "../../../data/cart.js";
import { calculateTotalCosts } from "../../../scripts/checkout/paymentSummary.js";
import { formatCurency } from "../../../scripts/utils/money.js";

const TEST_CART = [
  // This are socks
  { productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6', quantity: 2, deliveryId: '1', isEditing: false },
  // This is a basketball
  { productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d', quantity: 1, deliveryId: '2', isEditing: false }
];

describe('calculateTotalCosts',()=>{
  beforeEach(()=>{
    
  });

  it('calculate the costs of the products in the cart',()=>{
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(TEST_CART));
    Persistance.loadFromStorage();

    const objectCosts = calculateTotalCosts();
    const expectedCents = 4275;
    const expectedShippingPrice = 499;
    const expectedBeforeTax = expectedCents + expectedShippingPrice;
    const expectedTax = expectedBeforeTax * 0.1;
    const expectedTotal = formatCurency(expectedBeforeTax + expectedTax);

    expect(objectCosts.priceCents).toEqual(expectedCents);
    expect(objectCosts.shippingPriceCents).toEqual(expectedShippingPrice);
    expect(objectCosts.beforeTaxCents).toEqual(expectedBeforeTax);
    expect(objectCosts.taxCents).toEqual(expectedTax);
    expect(objectCosts.total).toEqual(expectedTotal);
  });

  it('returns all costs in 0 if the cart is empty',()=>{
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([]));
    Persistance.loadFromStorage();
    
    const objectCosts = calculateTotalCosts();

    expect(objectCosts).toEqual({ priceCents: 0, shippingPriceCents: 0, beforeTaxCents: 0, taxCents: 0, totalCents: 0,total: '0.00' });
  });
});