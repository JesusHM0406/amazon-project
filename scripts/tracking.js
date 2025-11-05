import { calculateDeliveryProgress } from "./tracking/trackingUtils.js";
import { orders } from "../data/orders.js";

console.log(calculateDeliveryProgress(orders[0].orderTime, orders[0].products[0].deliveryDate));

console.log(orders);