import { cart, calculateCartQuantity, } from "../../data/cart.js";
import { handleSaveQuantity, handleUpdateDeliveryOption, hanldeDeleteLink, showEditingQuantityContainer } from "./orderSummaryEvents.js";
import { renderAllSections } from "../checkout.js";
import { createOrderSummaryHTML } from "./orderSummaryHTML.js";
import { deliveryOptions } from "../../data/deliverOptions.js";

export function findDeliveryOption(deliveryId){
  const optionExists = deliveryOptions.some(option => option.id === deliveryId);

  if(!optionExists){
    return deliveryOptions[0];
  }

  return deliveryOptions.find(option => option.id === deliveryId);
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
      const { productId } = link.dataset;
      const productExists = cart.some(cartItem => cartItem.productId === productId);
      
      console.log(productExists);
      if(!productExists){
        alert(`Attempted to update non-existent product ID: ${productId}`);
        renderAllSections(); // This is to reset the products
        return;
      }
      handleSaveQuantity(link);
      renderAllSections();
    });
  });

  document.querySelectorAll('.delete-quantity-link').forEach(link=>{
    link.addEventListener('click', ()=> {
      hanldeDeleteLink(link)
      renderAllSections();
    });
  });
}

export function renderOrderSummary(){
  document.querySelector('.order-summary').innerHTML = createOrderSummaryHTML();
};