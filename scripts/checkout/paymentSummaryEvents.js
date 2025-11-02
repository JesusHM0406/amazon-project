import { cart } from "../../data/cart.js";
import { calculateDeliveryDate } from "../../data/deliverOptions.js";
import { Order } from "../../data/orders.js";
import { findDeliveryOption } from "./orderSummary.js";
import { calculateTotalCosts } from "./paymentSummary.js";

export function createNewOrder(){
  const emptyArray = [];

  if(cart === emptyArray){
    return;
  }

  const products = cart.map(product => {
    const matchedOption = findDeliveryOption(product.deliveryId);
    const deliveryDate = calculateDeliveryDate(matchedOption);

    return { productId: product.productId, quantity: product.quantity, deliveryDate };
  });

  const { totalCents } = calculateTotalCosts();

  const newOrder = new Order(totalCents, products);

  newOrder.addToOrders();
};