import { renderOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { calculateCartQuantity } from "../data/cart.js";

export function renderHeader(){
  document.querySelector('.return-to-home-link').textContent = calculateCartQuantity();
}

renderHeader();
renderPaymentSummary();
renderOrderSummary();