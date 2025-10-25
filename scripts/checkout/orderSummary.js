import { cart, updateDeliveryOption } from "../../data/cart.js";
import { products } from "../../data/products.js";
import { deliveryOptions } from "../../data/deliverOptions.js";
import dayjs from "https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js";

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
                Quantity: <span class="quantity-label">${cartItem.quantity}</span>
              </span>

              <span class="update-quantity-link link-primary">Update</span>

              <span class="delete-quantity-link link-primary">Delete</span>
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
        const today = dayjs();
        let deliveryDate = today.add(option.days, 'days');
        deliveryDate = deliveryDate.format('dddd, MMMM D');
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
      renderOrderSummary();
    });
  });
};