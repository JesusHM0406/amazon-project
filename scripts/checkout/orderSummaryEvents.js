import { cart, cartHelpers, removeFromCart, updateCartItemQuantity, updateDeliveryOption } from "../../data/cart.js";
import { renderAllSections } from "../checkout.js";

export function handleUpdateDeliveryOption(option){
  const { productId, deliveryId } = option.dataset;
  updateDeliveryOption(productId, deliveryId);
};

export function showEditingQuantityContainer(productId){
  cartHelpers.toggleIsEditing(productId, true);
};

export function handleSaveQuantity(link){
  let newQuantity = Number(link.previousElementSibling.value);
  const { productId } = link.dataset;

  const productExists = cart.some(cartItem => cartItem.productId === productId);

  if(!productExists){
    alert(`Attempted to update non-existent product ID: ${productId}`);
    renderAllSections(); // This is to reset the products
    return;
  }

  if(isNaN(newQuantity) || newQuantity <= 0){
    alert('Attempted to update an item quantity with 0 or a non-number value. Deleting product.');
    removeFromCart(productId);
    return;
  }

  updateCartItemQuantity(productId, newQuantity);

  cartHelpers.toggleIsEditing(productId, false);
};

export function hanldeDeleteLink(link){
  const { productId } = link.dataset;
  removeFromCart(productId);
  const cartItemContainer = link.closest('.cart-item-container');
  cartItemContainer.remove();
};