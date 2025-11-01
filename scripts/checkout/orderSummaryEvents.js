import { cart, removeFromCart, updateCartItemQuantity, updateDeliveryOption } from "../../data/cart.js";

export function handleUpdateDeliveryOption(option){
  const { productId, deliveryId } = option.dataset;
  updateDeliveryOption(productId, deliveryId);
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