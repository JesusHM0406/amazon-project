import { cart, removeFromCart, updateCartItemQuantity, updateDeliveryOption } from "../../data/cart.js";
import { findDeliveryOption } from "./orderSummary.js";
import { calculateDeliveryDate } from "../../data/deliverOptions.js";

export function handleUpdateDeliveryOption(option){
  const { productId, deliveryId } = option.dataset;
  updateDeliveryOption(productId, deliveryId);
};

export function handleUpdateDeliveryOptionUI(option){
  const { deliveryId } = option.dataset;
  const deliveryOption = findDeliveryOption(deliveryId);
  const deliveryDate = calculateDeliveryDate(deliveryOption);
  const cartItemContainer = option.closest('.cart-item-container');
  const deliveryOptionsContainer = option.closest('.delivery-options');

  const deliverOptionsInputs = deliveryOptionsContainer.querySelectorAll('.delivery-option-input');
  
  deliverOptionsInputs.forEach(input => input.removeAttribute('checked'));

  option.querySelector('.delivery-option-input').setAttribute('checked','true');

  cartItemContainer.children[0].textContent = `Delivery date: ${deliveryDate}`;
};

export function showEditingQuantityContainer(link){
  link.closest('.cart-item-container').classList.add('is-editing');
};

export function handleSaveQuantity(link){
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
      return;
    }

    updateCartItemQuantity(productId, newQuantity);

    quantityLabel.textContent = newQuantity;
    link.closest('.cart-item-container').classList.remove('is-editing');
  } catch (e){
    console.warn(e);
  }
};

export function hanldeDeleteLink(link){
  const { productId } = link.dataset;
  removeFromCart(productId);
  const cartItemContainer = link.closest('.cart-item-container');
  cartItemContainer.remove();
};