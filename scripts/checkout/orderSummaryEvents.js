import * as cartModule from "../../data/cart.js";

export function handleUpdateDeliveryOption(option, updateDeliveryFunc = cartModule.updateDeliveryOption){
  const { productId, deliveryId } = option.dataset;
  updateDeliveryFunc(productId, deliveryId);
};

export function showEditingQuantityContainer(
  productId,
  toggleFunc = cartModule.cartHelpers.toggleIsEditing
  ){
    toggleFunc(productId, true);
};

export function handleSaveQuantity(
  link,
  productId,
  removeFunc = cartModule.removeFromCart,
  updateCartItemQuantityFunc = cartModule.updateCartItemQuantity,
  toggleFunc = cartModule.cartHelpers.toggleIsEditing
  ){
  let newQuantity = Number(link.previousElementSibling.value);

  if(isNaN(newQuantity) || newQuantity <= 0){
    alert('Attempted to update an item quantity with 0 or a non-number value. Deleting product.');
    removeFunc(productId);
    return;
  }

  updateCartItemQuantityFunc(productId, newQuantity);

  toggleFunc(productId, false);
};

export function hanldeDeleteLink(
  link,
  removeFunc = cartModule.removeFromCart
  ){
  const { productId } = link.dataset;
  removeFunc(productId);
};