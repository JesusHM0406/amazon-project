import { calculateCartQuantity } from "../data/cart.js";
import { genereateTrackingHTML } from "./tracking/trackingHTML.js";

const thisURL = new URL(window.location.href);
const params = new URLSearchParams(thisURL.search);
const orderId = params.get('orderId');
const productId = params.get('id');

function renderTrackingPage(orderId, productId){
  document.querySelector('.main').innerHTML = genereateTrackingHTML(orderId, productId);
};

document.querySelector('.cart-quantity').textContent = calculateCartQuantity();

renderTrackingPage(orderId, productId);