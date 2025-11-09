import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

export let orders = [];

export function ordersLoadFromStorage(){
  try{
    let ordersJson = localStorage.getItem('orders');

    if(ordersJson){
      const ordersParsed = JSON.parse(ordersJson);
      orders = ordersParsed.map(data => Order.fromJSON(data));
    } else {
      orders = [];
    }
  } catch(e){
    console.warn('Error: not valid JSON, resetting orders ');
    console.warn(e);
    orders = [];
  }

  if(!Array.isArray(orders)){
    orders = [];
  }
};

export function ordersSaveStorage(){
  localStorage.setItem('orders',JSON.stringify(orders));
};

export class Order{
  #orderId;
  #orderTime;
  #totalCostCents;
  #products;

  constructor(orderId, orderTime, totalCostCents, products){
    this.#orderId = orderId;
    this.#orderTime = orderTime;
    this.#totalCostCents = totalCostCents;
    this.#products = products;
  }
  
  static createNewOrder(totalCostCents, products){
    const orderId = Order.#generateOrderId();
    const orderTime = dayjs();

    return new Order(orderId, orderTime, totalCostCents, products);
  }

  static fromJSON(data){
    const orderTime = dayjs(data.orderTime);

    return new Order(data.orderId, orderTime, data.totalCostCents, data.products);
  }

  toJSON(){
    return { 
      orderId: this.#orderId,
      orderTime: this.#orderTime.toISOString(),
      totalCostCents: this.#totalCostCents,
      products: this.#products
    };
  }

  static #generateOrderId() {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    } else {
      // Fallback to Math.random
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
  }

  get products(){
    return this.#products;
  }

  get totalCostCents(){
    return this.#totalCostCents;
  }

  get orderTime(){
    return this.#orderTime;
  }

  get orderId(){
    return this.#orderId;
  }
};

export function addToOrders(order, saveFunc = ordersSaveStorage){
  if(!(order instanceof Order)){
    console.warn('It seems that you are trying to save an invalid order, try again');
    return;
  }
  orders.push(order);
  saveFunc();
};

export function removeOrder(orderId, saveFunc = ordersSaveStorage){
  orders = orders.filter(order => order.orderId !== orderId);
  saveFunc()
};

ordersLoadFromStorage();