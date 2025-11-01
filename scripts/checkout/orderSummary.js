import { cart, calculateCartQuantity } from "../../data/cart.js";
import { products } from "../../data/products.js";
import { calculateDeliveryDate, deliveryOptions } from "../../data/deliverOptions.js";
import { handleSaveQuantity, handleUpdateDeliveryOption, hanldeDeleteLink, showEditingQuantityContainer } from "./orderSummaryEvents.js";
import { renderPaymentSummary } from "./paymentSummary.js";
import { renderAllSections } from "../checkout.js";

export function findDeliveryOption(deliveryId){
  const optionExists = deliveryOptions.some(option => option.id === deliveryId);

  if(!optionExists){
    return deliveryOptions[0];
  }

  return deliveryOptions.find(option => option.id === deliveryId);
};

function createOrderSummaryHTML(){
  let orderSummaryHTML = '';

  cart.forEach(cartItem => {
    const matchedProduct = products.find(productItem => productItem.id === cartItem.productId);

    const { deliveryId } = cartItem; 
    const deliveryOption = findDeliveryOption(deliveryId);
    let deliveryDate = calculateDeliveryDate(deliveryOption);

    orderSummaryHTML += `
      <div class="cart-item-container ${cartItem.isEditing ? 'is-editing' : ''}">
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

              <span class="update-quantity-link link-primary" data-product-id="${matchedProduct.id}">Update</span>
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

  return orderSummaryHTML;
};

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
};

export function renderHeader(){
  document.querySelector('.return-to-home-link').textContent = calculateCartQuantity();
};

export function atachOrderSummaryEventListeners(){
  document.querySelectorAll('.delivery-option').forEach(option => option.addEventListener('click', ()=> {
    handleUpdateDeliveryOption(option)
    renderAllSections();
  }));

  document.querySelectorAll('.update-quantity-link').forEach(link=>{
    link.addEventListener('click', ()=> {
      const { productId } = link.dataset;
      showEditingQuantityContainer(productId);
      renderAllSections();
    });
  });

  document.querySelectorAll('.save-quantity-link').forEach(link=>{
    link.addEventListener('click', ()=> {
      handleSaveQuantity(link);
      renderAllSections();
    });
  });

  document.querySelectorAll('.delete-quantity-link').forEach(link=>{
    link.addEventListener('click', ()=> {
      hanldeDeleteLink(link)
      renderHeader();
      renderPaymentSummary();
    });
  });
}

export function renderOrderSummary(){
  document.querySelector('.order-summary').innerHTML = createOrderSummaryHTML();
};