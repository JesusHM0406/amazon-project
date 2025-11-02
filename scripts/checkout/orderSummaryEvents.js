import * as cartModule from "../../data/cart.js";

export function handleUpdateDeliveryOption(option, updateDeliveryFunc = cartModule.updateDeliveryOption){
  const { productId, deliveryId } = option.dataset;
  updateDeliveryFunc(productId, deliveryId);
};

export function showEditingQuantityContainer(productId){
  cartModule.cartHelpers.toggleIsEditing(productId, true);
};

export function handleSaveQuantity(link){
  let newQuantity = Number(link.previousElementSibling.value);

  if(isNaN(newQuantity) || newQuantity <= 0){
    alert('Attempted to update an item quantity with 0 or a non-number value. Deleting product.');
    cartModule.removeFromCart(productId);
    return;
  }

  cartModule.updateCartItemQuantity(productId, newQuantity);

  cartModule.cartHelpers.toggleIsEditing(productId, false);
};

export function hanldeDeleteLink(link){
  const { productId } = link.dataset;
  cartModule.removeFromCart(productId);
};