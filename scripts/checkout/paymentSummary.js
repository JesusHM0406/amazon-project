import { calculateCartQuantity, cart } from "../../data/cart.js";
import { deliveryOptions } from "../../data/deliverOptions.js";
import { products } from "../../data/products.js";
import { formatCurency } from "../utils/money.js";

export function calculateTotalCosts(){
  let priceCents = 0;
  let shippingPriceCents = 0;

  cart.forEach(cartItem => {
    const matchedProduct = products.find(product => product.id === cartItem.productId);

    if(!matchedProduct){
      return;
    }

    const deliveryOption = deliveryOptions.find(option => option.id === cartItem.deliveryId);

    priceCents += matchedProduct.priceCents * cartItem.quantity;
    shippingPriceCents += deliveryOption.priceCents;
  });

  const beforeTaxCents = priceCents + shippingPriceCents;
  const taxCents = beforeTaxCents * 0.1;
  const totalCents = beforeTaxCents + taxCents;
  const total = formatCurency(totalCents);

  return { priceCents, shippingPriceCents, beforeTaxCents, taxCents, totalCents, total };
};

export function renderPaymentSummary(){
  const { priceCents, shippingPriceCents, beforeTaxCents, taxCents, total } = calculateTotalCosts();

  const cartQuantity = calculateCartQuantity();

  const paymentSummaryHTML = `
    <div class="payment-summary-title">Order Summary</div>

    <div class="payment-summary-row">
      <div>Items (${cartQuantity}):</div>
      <div class="payment-summary-money">$${formatCurency(priceCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Shipping &amp; handling:</div>
      <div class="payment-summary-money">$${formatCurency(shippingPriceCents)}</div>
    </div>

    <div class="payment-summary-row subtotal-row">
      <div>Total before tax:</div>
      <div class="payment-summary-money">$${formatCurency(beforeTaxCents)}</div>
    </div>

    <div class="payment-summary-row">
      <div>Estimated tax (10%):</div>
      <div class="payment-summary-money">$${formatCurency(taxCents)}</div>
    </div>

    <div class="payment-summary-row total-row">
      <div>Order total:</div>
      <div class="payment-summary-money">$${total}</div>
    </div>

    <button class="place-order-button button-primary">
      Place your order
    </button>
  `;

  document.querySelector('.payment-summary').innerHTML = paymentSummaryHTML;
};