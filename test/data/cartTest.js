import { cart, calculateCartQuantity, loadFromStorage } from "../../data/cart.js";

describe('loadFromStorage',()=>{
  it('returns the cart if localStorage returns a valid JSON',()=>{
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([
      { productId: '123', quantity: 2, deliveryId: '1' },
      { productId: '321', quantity: 1, deliveryId: '2' }
    ]));

    loadFromStorage();

    expect(cart).toEqual([
      { productId: '123', quantity: 2, deliveryId: '1' },
      { productId: '321', quantity: 1, deliveryId: '2' }
    ]);
  });

  it('returns an empty array if the cart is empty or not initialized',()=>{
    spyOn(localStorage, 'getItem').and.returnValue(null);

    loadFromStorage();

    expect(cart).toEqual([]);
  });

  it('returns an empty array if localStorage not returns an array',()=>{
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(5));

    loadFromStorage();

    expect(cart).toEqual([]);
  });

  it('returns an empty array if localStorage returns a non-valid JSON',()=>{
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(undefined));

    loadFromStorage();

    expect(cart).toEqual([]);
  });
})