import { cart } from "../../data/cart.js";
import { calculateDeliveryDate } from "../../data/deliverOptions.js";
import { Order, addToOrders } from "../../data/orders.js";
import { findDeliveryOption } from "./orderSummary.js";
import { calculateTotalCosts } from "./paymentSummary.js";

export function paymentCreateNewOrder(createFunc = Order.createNewOrder, addFunc = addToOrders){
  if(cart.length === 0){
    return;
  }

  const products = cart.map(product => {
    const matchedOption = findDeliveryOption(product.deliveryId);
    const deliveryDate = calculateDeliveryDate(matchedOption);

    return { productId: product.productId, quantity: product.quantity, deliveryDate };
  });

  const { totalCents } = calculateTotalCosts();

  const newOrder = createFunc(totalCents, products);

  addFunc(newOrder);
};