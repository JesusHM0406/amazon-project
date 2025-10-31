import { cart, calculateCartQuantity, Persistance,  cartHelpers, addToCart, updateDeliveryOption, updateCartItemQuantity, removeFromCart } from "../../data/cart.js";

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
    spyOn(localStorage, 'setItem');
    spyOn(Persistance, 'saveStorage');
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([
      { productId: '123', quantity: 2, deliveryId: '1' },
      { productId: '321', quantity: 1, deliveryId: '2' }
    ]));

    Persistance.loadFromStorage();
  });

  it('adds a new product with the correct quantity and deliveryId equal to \'1\' as default',()=>{
    cartHelpers.updateCart('456',1);

    expect(cart.length).toEqual(3);
    expect(cart).toEqual([
      { productId: '123', quantity: 2, deliveryId: '1' },
      { productId: '321', quantity: 1, deliveryId: '2' },
      { productId: '456', quantity: 1, deliveryId: '1' }
    ]);
    expect(Persistance.saveStorage).toHaveBeenCalledTimes(1);
  });

  it('modify the quantity of a existing product',()=>{
    cartHelpers.updateCart('321',1);

    expect(cart.length).toEqual(2);
    expect(cart).toEqual([
      { productId: '123', quantity: 2, deliveryId: '1' },
      { productId: '321', quantity: 2, deliveryId: '2' }
    ]);
    expect(Persistance.saveStorage).toHaveBeenCalledTimes(1);
  });

  it('doesn\'t add a new product if the quantity is 0',()=>{
    cartHelpers.updateCart('456',0);

    expect(cart.length).toEqual(2);
    expect(cart).toEqual([
      { productId: '123', quantity: 2, deliveryId: '1' },
      { productId: '321', quantity: 1, deliveryId: '2' }
    ]);
    expect(Persistance.saveStorage).toHaveBeenCalledTimes(0);
  });
});

describe('displayAddedMessage',()=>{
  let mockElement;

  beforeEach(() => {
    jasmine.clock().install();
    mockElement = {
        classList: {
            add: jasmine.createSpy('add'),
            remove: jasmine.createSpy('remove')
        }
    };

    spyOn(document, 'querySelector').and.returnValue(mockElement);
  });

  afterEach(()=>{
    jasmine.clock().uninstall();
  });

  it('shows the added message', () => {
    const productId = '123';
    const expectedSelector = `.added-${productId}`;

    cartHelpers.displayAddedMessage(productId, 1);

    expect(document.querySelector).toHaveBeenCalledWith(expectedSelector);

    expect(mockElement.classList.add).toHaveBeenCalledWith('added-visible');
  });

  it('remove the message after 1 second',()=>{
    cartHelpers.displayAddedMessage('123',1);

    jasmine.clock().tick(999);
    expect(mockElement.classList.remove).not.toHaveBeenCalled();

    jasmine.clock().tick(1);
    expect(mockElement.classList.remove).toHaveBeenCalledWith('added-visible');
  });
});

describe('updateUI',()=>{

  beforeEach(()=>{
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([
      { productId: '123', quantity: 5, deliveryId: '1' },
      { productId: '321', quantity: 1, deliveryId: '2' }
    ]));

    document.querySelector('.tests-container').innerHTML = `
      <div class="cart-quantity"></div>
      <select class='select-123'>
        <option selected value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
      </select>
    `;

    Persistance.loadFromStorage();

    cartHelpers.updateUI('123');
  });

  afterEach(()=>{
    document.querySelector('.tests-container').innerHTML = '';
  });

  it('update cart quantity on the page',()=>{
    expect(document.querySelector('.cart-quantity').textContent).toEqual('6');
  });

  it('resets select value to 1',()=>{
    expect(document.querySelector('.select-123').value).toEqual('1');
  })
});

describe('addToCart (orchestador)',()=>{
  beforeEach(()=>{
    spyOn(cartHelpers, 'updateCart');
    spyOn(cartHelpers, 'displayAddedMessage');
    spyOn(cartHelpers, 'updateUI');
  });

  afterEach(()=>{
    document.querySelector('.tests-container').innerHTML = '';
  })

  it('calls the other functions in order',()=>{
    document.querySelector('.tests-container').innerHTML = `
      <div class="cart-quantity"></div>
      <select class='select-123'>
        <option selected value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
      </select>
    `;

    addToCart('123', 1);

    expect(cartHelpers.updateCart).toHaveBeenCalledBefore(cartHelpers.displayAddedMessage);
    expect(cartHelpers.updateCart).toHaveBeenCalledBefore(cartHelpers.updateUI);

    expect(cartHelpers.displayAddedMessage).toHaveBeenCalledBefore(cartHelpers.updateUI);
  });

  it('do nothing if the quantity is invalid',()=>{
    document.querySelector('.tests-container').innerHTML = `
      <div class="cart-quantity"></div>
      <input type="text" class="select-123" value="hello">
    `;

    addToCart('123', 1);

    expect(cartHelpers.updateCart).not.toHaveBeenCalled();
  });
});

describe('updateDeliveryOption',()=>{
  beforeEach(()=>{
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([
      { productId: '123', quantity: 5, deliveryId: '1' },
      { productId: '321', quantity: 3, deliveryId: '2' }
    ]));
    spyOn(Persistance, 'saveStorage');

    Persistance.loadFromStorage();
  });

  it('update the delivery option correctly',()=>{
    updateDeliveryOption('123','3');

    expect(cart.length).toEqual(2);
    expect(cart[0].deliveryId).toEqual('3');
    expect(Persistance.saveStorage).toHaveBeenCalledTimes(1);
    expect(cart[1].deliveryId).toEqual('2');
  });

  it('do nothing if the product doesn\'t exists in the cart',()=>{
    updateDeliveryOption('456','1');

    expect(cart.length).toEqual(2);
    expect(cart[0].deliveryId).toEqual('1');
    expect(Persistance.saveStorage).not.toHaveBeenCalled();
    expect(cart[1].deliveryId).toEqual('2');
  });
});

describe('updateCartItemQuantity',()=>{
  beforeEach(()=>{
    spyOn(Persistance, 'saveStorage');
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([
      { productId: '123', quantity: 5, deliveryId: '1' },
      { productId: '321', quantity: 3, deliveryId: '2' }
    ]));

    Persistance.loadFromStorage();
  });

  it('updates the quantity of an existing product',()=>{
    updateCartItemQuantity('123',2);

    expect(cart.length).toEqual(2);
    expect(cart[0].quantity).toEqual(2);
    expect(cart[1].quantity).toEqual(3);
  });

  it('save the updated cart in the storage',()=>{
    updateCartItemQuantity('123',2);

    expect(Persistance.saveStorage).toHaveBeenCalledTimes(1);
  });

  it('do nothing if the product id doesn\'t exists in the cart',()=>{
    updateCartItemQuantity('456',2);

    expect(cart.length).toEqual(2);
    expect(cart[0].quantity).toEqual(5);
    expect(cart[1].quantity).toEqual(3);
    expect(Persistance.saveStorage).not.toHaveBeenCalled();
  });
});

describe('removeFromCart',()=>{
  beforeEach(()=>{
    spyOn(Persistance, 'saveStorage');
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([
      { productId: '123', quantity: 5, deliveryId: '1' },
      { productId: '321', quantity: 3, deliveryId: '2' },
      { productId: '456', quantity: 1, deliveryId: '1' }
    ]));

    Persistance.loadFromStorage();
  });

  it('remove the product from the cart',()=>{
    removeFromCart('123');

    expect(cart.length).toEqual(2);
    expect(cart).toEqual([
      { productId: '321', quantity: 3, deliveryId: '2' },
      { productId: '456', quantity: 1, deliveryId: '1' }
    ]);
    expect(Persistance.saveStorage).toHaveBeenCalledTimes(1);
  });

  it('handles the case when all products are removed',()=>{
    removeFromCart('123');
    removeFromCart('321');
    removeFromCart('456');

    expect(cart).toEqual([]);
  });

  it('do nothing if the product id doesn\'t exists in the cart',()=>{
    removeFromCart('654');

    expect(cart.length).toEqual(3);
    expect(cart).toEqual([
      { productId: '123', quantity: 5, deliveryId: '1' },
      { productId: '321', quantity: 3, deliveryId: '2' },
      { productId: '456', quantity: 1, deliveryId: '1' }
    ]);
  });
});