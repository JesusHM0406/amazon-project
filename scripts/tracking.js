import { calculateCartQuantity } from "../data/cart.js";
import { genereateTrackingHTML, renderProgressBar } from "./tracking/trackingHTML.js";
import { orders, removeProductFromOrder } from "../data/orders.js";
import { products } from "../data/products.js";
import { calculateDeliveryProgress } from "./tracking/trackingUtils.js";

function renderTrackingPage(){
  const thisURL = new URL(window.location.href);
  const params = new URLSearchParams(thisURL.search);
  const orderId = params.get('orderId');
  const productId = params.get('id');

  const order = orders.find(order => order.orderId === orderId);
  
  if(!order) {
    window.location.href = 'orders.html';
    return;
  };

  const matchedProduct = order.products.find(product => product.productId === productId);
  const productExists = products.find(product => product.id === productId);
  
  if(!matchedProduct || !productExists) {
    window.location.href = 'orders.html';
    return;
  };

  const progress = calculateDeliveryProgress(order.orderTime, matchedProduct.deliveryDate);

  if(progress === 100){
    removeProductFromOrder(orderId, productId);
    window.location.href = 'orders.html';
    return;
  };

  document.querySelector('.main').innerHTML = genereateTrackingHTML(orderId, productId);
};

document.querySelector('.cart-quantity').textContent = calculateCartQuantity();

renderTrackingPage();
renderProgressBar();