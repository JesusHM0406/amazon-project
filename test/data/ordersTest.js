import * as ordersModule from "../../data/orders.js";
import * as cartModule from "../../data/cart.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { paymentCreateNewOrder } from "../../scripts/checkout/paymentSummaryEvents.js";
import { generateProductHTML, renderOrdersPage } from "../../scripts/orders/ordersHTML.js";

describe('ordersLoadFromStorage',()=>{
  it('load the valid data',()=>{

    const mockOrderTime = dayjs().toISOString();

    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([
      { orderId: '133',
        orderTime: mockOrderTime,
        totalCostCents: 5050,
        products: [
          { productId: '234', quantity: 2, deliveryDate: 'December 15' }
        ]
      }
    ]));

    ordersModule.ordersLoadFromStorage();

    expect(ordersModule.orders.length).toEqual(1);
    expect(ordersModule.orders[0] instanceof ordersModule.Order).toEqual(true);
    expect(ordersModule.orders[0].totalCostCents).toEqual(5050);
    expect(ordersModule.orders[0].products.length).toEqual(1);
    expect(ordersModule.orders[0].products[0].productId).toEqual('234');
    expect(ordersModule.orders[0].orderTime).toBeDefined();
  });

  it('returns an empty array if the JSON is invalid',()=>{
    spyOn(localStorage, 'getItem').and.returnValue(null);

    ordersModule.ordersLoadFromStorage();

    expect(ordersModule.orders.length).toEqual(0);
    expect(ordersModule.orders).toEqual([]);
  });
});

describe('createNewOrder',()=>{
  it('returns a new order with an orderId as string and an orderTime as an Dayjs object', ()=>{
    const newOrder = ordersModule.Order.createNewOrder(5050, [{productId: '123', quantity:1, deliveryDate: 'December 15'}]);

    expect(typeof newOrder.orderId).toEqual('string');
    expect(newOrder.orderId.trim().length).toEqual(36);

    expect(newOrder.orderTime instanceof dayjs).toEqual(true);
  });
});

describe('fromJSON',()=>{
  it('returns an instance of Order class and orderTime as an instance of Dayjs',()=>{
    const data = { orderId:'123', orderTime: 'December 15', totalCostCents: 5050, products:{ productId: '123', quantity:1, deliveryDate: 'December 15' } }
  
  expect(ordersModule.Order.fromJSON(data) instanceof ordersModule.Order).toEqual(true);
  expect(ordersModule.Order.fromJSON(data).orderTime instanceof dayjs).toEqual(true);
  });
});

describe('addToOrders',()=>{
  it('add a new order to orders array and calls ordersSaveStorage',()=>{
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([]));
    ordersModule.ordersLoadFromStorage();

    expect(ordersModule.orders.length).toEqual(0);

    const spy = jasmine.createSpy('ordersSaveStorage');
    const newOrder = ordersModule.Order.createNewOrder(5050, [{productId: '123', quantity:1, deliveryDate: 'December 15'}]);

    ordersModule.addToOrders(newOrder, spy);

    expect(ordersModule.orders.length).toEqual(1);
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('doesn\'t add the order if is not an instance of Order class',()=>{
    spyOn(localStorage, 'setItem');
    spyOn(ordersModule, 'ordersSaveStorage');
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([]));
    ordersModule.ordersLoadFromStorage();

    expect(ordersModule.orders.length).toEqual(0);

    const spy = jasmine.createSpy('ordersSaveStorage');
    const newOrder = [ '123', 'December 15', 5050, [{productId: '123', quantity:1, deliveryDate: 'December 15'}]];

    ordersModule.addToOrders(newOrder, spy);

    expect(ordersModule.orders.length).toEqual(0);
    expect(spy).toHaveBeenCalledTimes(0);
  });
});

describe('paymentCreateNewOrder',()=>{
  it('it calls Order.createNewOrder and addToOrders if the context is correct',()=>{
    jasmine.clock().install();
    const mockDate = new Date('November 3, 2025');
    jasmine.clock().mockDate(mockDate);

    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([
      { productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6', quantity: 2, deliveryId: '3', isEditing: false },
      { productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d', quantity: 4, deliveryId: '3', isEditing: false }
    ]));

    cartModule.Persistance.loadFromStorage();

    const expectedProducts = [
      { productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6', quantity: 2, deliveryDate: '2025-11-04T06:00:00.000Z' },
      { productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d', quantity: 4, deliveryDate: '2025-11-04T06:00:00.000Z' }
    ];
    let expectedTotal = 10560 + 999 + 999;
    expectedTotal += expectedTotal * 0.1;

    const spyCreate = jasmine.createSpy('createNewOrder');
    const spyAdd = jasmine.createSpy('addToOrders');

    paymentCreateNewOrder(spyCreate, spyAdd);

    expect(spyCreate).toHaveBeenCalledWith(expectedTotal, expectedProducts);
    expect(spyAdd).toHaveBeenCalledTimes(1);

    jasmine.clock().uninstall();
  });

  it('it doesn\'t calls Order.createNewOrder and addToOrders if the cart is empty',()=>{
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([]));

    cartModule.Persistance.loadFromStorage();

    const spyCreate = jasmine.createSpy('createNewOrder');
    const spyAdd = jasmine.createSpy('addToOrders');

    paymentCreateNewOrder(spyCreate, spyAdd);

    expect(spyCreate).not.toHaveBeenCalled();
    expect(spyAdd).not.toHaveBeenCalled();
  });
});

describe('generateProductHTML',()=>{
  it('returns an string that contains data-product-id with the id of the product and the correct tracking link',()=>{
    const product = { productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6', quantity: 2, deliveryId: '3', isEditing: false };

    const result = generateProductHTML(product, '123');

    expect(result).toContain('data-product-id="e43638ce-6aa0-4b85-b27f-e1d07eb678c6"');
    expect(result).toContain('href="tracking.html?orderId=123&id=e43638ce-6aa0-4b85-b27f-e1d07eb678c6"');
  });

  it('returns an empty string if the product id is inexistent in products',()=>{
    const product = { productId: 'hello', quantity: 2, deliveryId: '3', isEditing: false };

    const result = generateProductHTML(product, '123');

    expect(result).toEqual('');
  });
});

describe('renderOrdersPage',()=>{
  it('calls generateProductHTML for every order',()=>{
    const mockOrderTime = dayjs().toISOString();

    document.querySelector('.tests-container').innerHTML = `
      <div class="orders-grid"></div>
      <div class="cart-quantity"></div>
    `;

    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([
      { orderId: '133',
        orderTime: mockOrderTime,
        totalCostCents: 5050,
        products: [
          { productId: '234', quantity: 2, deliveryDate: 'December 15' }
        ]
      },
      { orderId: '231',
        orderTime: mockOrderTime,
        totalCostCents: 1050,
        products: [
          { productId: '354', quantity: 5, deliveryDate: 'December 16' }
        ]
      },
      { orderId: '678',
        orderTime: mockOrderTime,
        totalCostCents: 4020,
        products: [
          { productId: '234', quantity: 1, deliveryDate: 'December 17' }
        ]
      }
    ]));

    ordersModule.ordersLoadFromStorage();

    const spy = jasmine.createSpy('generateProductsHTML');

    renderOrdersPage(spy);

    expect(spy).toHaveBeenCalledTimes(3);
    expect(document.querySelector('.order-container')).not.toEqual(null);
    expect(document.querySelectorAll('.order-container').length).toEqual(3);
  
    document.querySelector('.tests-container').innerHTML = '';
  });
});

describe('removeProductFromOrder',()=>{
  beforeEach(()=>{
    const mockOrderTime = dayjs().toISOString();

    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify([
      { orderId: '133',
        orderTime: mockOrderTime,
        totalCostCents: 5050,
        products: [
          { productId: '234', quantity: 2, deliveryDate: 'December 15' }
        ]
      }, 
      { orderId: '456',
        orderTime: mockOrderTime,
        totalCostCents: 4050,
        products: [
          { productId: '542', quantity: 1, deliveryDate: 'December 11' }
        ]
      }
    ]));
    ordersModule.ordersLoadFromStorage();
  });

  it('removes an order of the array',()=>{
    const spy = jasmine.createSpy('saveFunc');

    ordersModule.removeProductFromOrder('133', '234', spy);

    expect(ordersModule.orders.length).toEqual(1);
    expect(ordersModule.orders[0].orderId).toEqual('456');
    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('removes an order of the array',()=>{
    const spy = jasmine.createSpy('saveFunc');

    ordersModule.removeProductFromOrder('167', 'hello' ,spy);

    expect(ordersModule.orders.length).toEqual(2);
    expect(ordersModule.orders[0].orderId).toEqual('133');
    expect(ordersModule.orders[1].orderId).toEqual('456');
  });
});