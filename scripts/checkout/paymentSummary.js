import { calculateCartQuantity, cart } from "../../data/cart.js";
import { deliveryOptions } from "../../data/deliverOptions.js";
import { products } from "../../data/products.js";
import { formatCurency } from "../utils/money.js";

function renderPaymentSummary(){
  let priceCents = 0;
  let shippingPriceCents = 0;

  cart.forEach(cartItem => {
    const matchedProduct = products.find(product => product.id === cartItem.productId);
    const deliveryOption = deliveryOptions.find(option => option.id === matchedProduct.id);

    priceCents += matchedProduct.priceCents;
    shippingPriceCents += deliveryOption.priceCents;
  });

  const beforeTaxCents = priceCents + shippingPriceCents;
  const taxCents = beforeTaxCents*0.1;
  const totalCents = beforeTaxCents + taxCents;
  const total = formatCurency(totalCents);
}