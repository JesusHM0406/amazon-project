export let orders = [];

export function ordersLoadFromStorage(){
  try{
    let ordersJson = localStorage.getItem('orders');

    if(ordersJson){
      orders = JSON.parse(ordersJson);
    } else {
      orders = [];
    }
  } catch(e){
    console.log('Error: not valid JSON, resetting orders ', e);
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
  #orderId = this.#generateOrderId();
  #orderTime = new Date();
  #totalCostCents;
  #products;

  constructor(totalCostCents, products){
    this.#totalCostCents = totalCostCents;
    this.#products = products;
  }

  #generateOrderId() {
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

  addToOrders(){
    orders.push(this);
  }
};