import { cart, calculateCartQuantity, Persistance,  updateCart } from "../../data/cart.js";

describe('loadFromStorage',()=>{
  it('returns the cart if localStorage returns a valid JSON',()=>{
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([
      { productId: '123', quantity: 2, deliveryId: '1' },
      { productId: '321', quantity: 1, deliveryId: '2' }
    ]));

    Persistance.loadFromStorage();

    expect(cart).toEqual([
      { productId: '123', quantity: 2, deliveryId: '1' },
      { productId: '321', quantity: 1, deliveryId: '2' }
    ]);
  });

  it('returns an empty array if the cart is empty or not initialized',()=>{
    spyOn(localStorage, 'getItem').and.returnValue(null);

    Persistance.loadFromStorage();

    expect(cart).toEqual([]);
  });

  it('returns an empty array if localStorage not returns an array',()=>{
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(5));

    Persistance.loadFromStorage();

    expect(cart).toEqual([]);
  });

  it('returns an empty array if localStorage returns a non-valid JSON',()=>{
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(undefined));

    Persistance.loadFromStorage();

    expect(cart).toEqual([]);
  });
});

describe('calculateCartQuantity',()=>{
  it('returns the total of items in the cart',()=>{
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([
      { productId: '123', quantity: 2, deliveryId: '1' },
      { productId: '321', quantity: 1, deliveryId: '2' }
    ]));

    Persistance.loadFromStorage();

    expect(calculateCartQuantity()).toEqual(3);
  });

  it('works with empty cart',()=>{
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([]));

    Persistance.loadFromStorage();

    expect(calculateCartQuantity()).toEqual(0);
  });

  it('works when all products have quantity 0', ()=>{
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([
      { productId: '123', quantity: 0, deliveryId: '1' },
      { productId: '321', quantity: 0, deliveryId: '2' }
    ]));

    Persistance.loadFromStorage();

    expect(calculateCartQuantity()).toEqual(0);
  });

  it('returns 0 when localStorage returns null or undefined',()=>{
    spyOn(localStorage, 'getItem').and.returnValue(undefined);

    Persistance.loadFromStorage();

    expect(calculateCartQuantity()).toEqual(0);
  });

  it('returns 0 when localStorage not returns an array',()=>{
    spyOn(localStorage, 'getItem').and.returnValue(5);

    Persistance.loadFromStorage();

    expect(calculateCartQuantity()).toEqual(0);
  });
});

describe('updateCart',()=>{
  beforeEach(()=>{
    spyOn(Persistance, 'saveStorage');
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([
      { productId: '123', quantity: 2, deliveryId: '1' },
      { productId: '321', quantity: 1, deliveryId: '2' }
    ]));

    Persistance.loadFromStorage();
  });

  it('adds a new product with the correct quantity and deliveryId equal to \'1\' as default',()=>{
    updateCart('456',1);

    expect(cart.length).toEqual(3);
    expect(cart).toEqual([
      { productId: '123', quantity: 2, deliveryId: '1' },
      { productId: '321', quantity: 1, deliveryId: '2' },
      { productId: '456', quantity: 1, deliveryId: '1' }
    ]);
    expect(Persistance.saveStorage).toHaveBeenCalledTimes(1);
  });

  it('modify the quantity of a existing product',()=>{
    updateCart('321',1);

    expect(cart.length).toEqual(2);
    expect(cart).toEqual([
      { productId: '123', quantity: 2, deliveryId: '1' },
      { productId: '321', quantity: 2, deliveryId: '2' }
    ]);
    expect(Persistance.saveStorage).toHaveBeenCalledTimes(1);
  });

  it('doesn\'t add a new product if the quantity is 0',()=>{
    updateCart('456',0);

    expect(cart.length).toEqual(2);
    expect(cart).toEqual([
      { productId: '123', quantity: 2, deliveryId: '1' },
      { productId: '321', quantity: 1, deliveryId: '2' }
    ]);
    expect(Persistance.saveStorage).toHaveBeenCalledTimes(0);
  });
});