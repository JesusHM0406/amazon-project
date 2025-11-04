import * as ordersModule from "../../data/orders.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

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
    console.log(ordersModule.orders[0]);

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