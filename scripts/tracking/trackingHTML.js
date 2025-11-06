import { orders } from "../../data/orders.js";
import { products } from "../../data/products.js";

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

  return `
    <div class="order-tracking">
      <a class="back-to-orders-link link-primary" href="orders.html">
        View all orders
      </a>

      <div class="delivery-date">
        ${matchedProduct.deliveryDate}
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
        <div class="progress-bar"></div>
      </div>
    </div>
  `;
};