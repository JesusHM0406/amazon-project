import { cart, updateDeliveryOption, updateCartItemQuantity, removeFromCart } from "../../data/cart.js";
import { products } from "../../data/products.js";
import { calculateDeliveryDate, deliveryOptions } from "../../data/deliverOptions.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";
import { renderHeader } from "../checkout.js";
import { renderPaymentSummary } from "./paymentSummary.js";

export function renderOrderSummary(){
  let orderSummaryHTML = '';
  cart.forEach(cartItem => {
    const matchedProduct = products.find(productItem => productItem.id === cartItem.productId);

    const { deliveryId } = cartItem;
    const today = dayjs();
    const dateDays = deliveryOptions.find(option=> option.id === deliveryId).days;
    let deliveryDate = today.add(dateDays, 'days');
    deliveryDate = deliveryDate.format('dddd, MMMM D');

    orderSummaryHTML += `
      <div class="cart-item-container">
        <div class="delivery-date">Delivery date: ${deliveryDate}</div>

        <div class="cart-item-details-grid">
          <img class="product-image" src="${matchedProduct.image}">

          <div class="cart-item-details">
            <div class="product-name">${matchedProduct.name}</div>

            <div class="product-price">$${(matchedProduct.priceCents / 100).toFixed(2)}</div>

            <div class="product-quantity">
              <span>
                Quantity: <span class="quantity-label quantity-label-${matchedProduct.id}">${cartItem.quantity}</span>
              </span>

              <span class="update-quantity-link link-primary">Update</span>
              <div class="updating-quantity-container">
                <input type="number" class="quantity-input" min="1">
                <span class="save-quantity-link link-primary" data-product-id="${matchedProduct.id}">Save</span>
              </div>

              <span class="delete-quantity-link link-primary" data-product-id="${matchedProduct.id}">Delete</span>
            </div>
          </div>

          <div class="delivery-options">
            <div class="delivery-options-title">Choose a delivery option:</div>

            ${createOptionsHTML(matchedProduct.id)}

          </div>
        </div>
      </div>
    `;
  });
  document.querySelector('.order-summary').innerHTML = orderSummaryHTML;

  function createOptionsHTML(productId){
    let optionsHTML = '';
    
    deliveryOptions.forEach(option=>{
      const matchedProduct = cart.find(cartItem => cartItem.productId === productId);

      if(matchedProduct){
        let deliveryDate = calculateDeliveryDate(option);
        const matchedOption = matchedProduct.deliveryId;
        const priceString = option.priceCents === 0 ? 'FREE' : `$${option.priceCents / 100} -`;

        optionsHTML += `
        <div class="delivery-option" data-product-id="${productId}" data-delivery-id="${option.id}">
          <input type="radio" ${matchedOption === option.id ? 'checked' : ''} class="delivery-option-input" name="delivery-option-${productId}">

          <div>
            <div class="delivery-option-date">${deliveryDate}</div>
            <div class="delivery-option-price">${priceString} Shipping</div>
          </div>
        </div>
        `;
      }
    });

    return optionsHTML;
  }

  document.querySelectorAll('.delivery-option').forEach(option=>{
    option.addEventListener('click',()=>{
      const { productId,deliveryId } = option.dataset;
      updateDeliveryOption(productId, deliveryId);
      renderPaymentSummary();
      renderOrderSummary();
    });
  });

  document.querySelectorAll('.update-quantity-link').forEach(link=>{
    link.addEventListener('click',()=>{
      link.closest('.cart-item-container').classList.add('is-editing');
    });
  });

  document.querySelectorAll('.save-quantity-link').forEach(link=>{
    link.addEventListener('click',()=>{
      let newQuantity = Number(link.previousElementSibling.value);
      const { productId } = link.dataset;

      try{
        const productExists = cart.some(cartItem => cartItem.productId === productId);

        if(!productExists){
          throw new Error(`Attempted to update non-existent product ID: ${productId}. Exiting.`);
        }

        const cartItemContainer = link.closest('.cart-item-container');
        const originalValue = Number(document.querySelector(`.quantity-label-${productId}`).value);

        if(isNaN(newQuantity)){
          link.previousElementSibling.value = originalValue;
          link.previousElementSibling.setAttribute('type','number');
          cartItemContainer.classList.remove('is-editing');
          return;
        }

        const quantityLabel = document.querySelector(`.quantity-label-${productId}`);

        if(newQuantity <= 0){
          removeFromCart(productId);
          cartItemContainer.remove();
          renderHeader();
          renderPaymentSummary();
          return;
        }

        updateCartItemQuantity(productId, newQuantity);

        quantityLabel.textContent = newQuantity;
        link.closest('.cart-item-container').classList.remove('is-editing');

        renderHeader();
        renderPaymentSummary();
      } catch (e){
        console.warn(e);
      }
    });
  });

  document.querySelectorAll('.delete-quantity-link').forEach(link=>{
    link.addEventListener('click',()=>{
      const { productId } = link.dataset;
      removeFromCart(productId);
      renderHeader();
      renderPaymentSummary();
      renderOrderSummary();
    });
  });
};