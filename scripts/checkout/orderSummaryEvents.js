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
};