import { orders } from "../../data/orders.js";
import { products } from "../../data/products.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { calculateDeliveryProgress } from "./trackingUtils.js";

export function genereateTrackingHTML(orderId, productId){
  const orderMatched = orders.find(order => order.orderId === orderId);
  
  if(!orderMatched) return `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>
    <div>Sorry, the order doesn't exists, verify the URL</div>`;
  
  const matchedProduct = orderMatched.products.find(product => product.productId === productId);

  const productExists = products.find(product => product.id === productId);

  if(!matchedProduct || !productExists) return `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>
    <div>Sorry, the product doesn't exists in any order, verify the URL</div>`;

  const deliveryDateObj = dayjs(matchedProduct.deliveryDate);
  const deliveryDate = deliveryDateObj.format('dddd, MMMM D');

  const progress = calculateDeliveryProgress(orderMatched.orderTime, matchedProduct.deliveryDate);

  return `
    <div class="order-tracking">
      <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
      </a>

      <div class="delivery-date">
        ${deliveryDate}
      </div>

      <div class="product-info">
        ${productExists.name}
      </div>

      <div class="product-info">
        Quantity: ${matchedProduct.quantity}
      </div>

      <img class="product-image" src="${productExists.image}">

      <div class="progress-labels-container">
        <div class="progress-label">
          Preparing
        </div>
        <div class="progress-label current-status">
          Shipped
        </div>
        <div class="progress-label">
          Delivered
        </div>
      </div>

      <div class="progress-bar-container">
        <div class="progress-bar" data-progress="${progress}"></div>
      </div>
    </div>
  `;
};