import { cartHelpers } from "../../data/cart.js";
import { products } from "../../data/products.js";
import { renderOrdersHeader } from "../orders/ordersHTML.js";

export function handleBuyAgainEvent(productId, addToCartFunc = cartHelpers.updateCart){
  const productExists = products.some(product => product.id === productId);
  if (!productExists){
    console.warn('It seems that you tried to add an inexistent product');
    return;
  }
  addToCartFunc(productId, 1);
  renderOrdersHeader();
};

export function atachOrdersEvents(){
  const buyAgainBtns = document.querySelectorAll('.buy-again-button');

  buyAgainBtns.forEach(btn =>{
    btn.addEventListener('click',()=>{
      const { productId } = btn.dataset;
      handleBuyAgainEvent(productId);
    });
  });

  document.querySelectorAll('.track-package-button').forEach(btn => {
    btn.addEventListener('click',()=>{
      window.location.href = 'tracking.html';
    });
  });
};