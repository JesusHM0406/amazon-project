export let cart = JSON.parse(localStorage.getItem('cart')) || [];

function saveStorage(){
  localStorage.setItem('cart',JSON.stringify(cart));
}

export function calculateCartQuantity(){
  return cart.reduce((acc, act)=>{ return acc + act.quantity },0);
}

export function addToCart(productId,timeoutId){
  const quantityToAdd = Number(document.querySelector(`.select-${productId}`).value);
  const addedMessage = document.querySelector(`.added-${productId}`);
  let matchedProduct = cart.find(item=> item.productId === productId);

  if(matchedProduct) matchedProduct.quantity += quantityToAdd;
  else cart.push({ productId, quantity: quantityToAdd, deliveryId: '1' });

  const cartQuantity = calculateCartQuantity();

  addedMessage.classList.add('added-visible');
  if(timeoutId) clearTimeout(timeoutId);

  timeoutId = setTimeout(()=>{
    addedMessage.classList.remove('added-visible');
  },1000);

  document.querySelector('.cart-quantity').textContent = cartQuantity;

  document.querySelector(`.select-${productId}`).value = 1;

  saveStorage();
};

export function updateDeliveryOption(productId,deliveryId){
  const matchedProduct = cart.find(cartItem=>cartItem.productId === productId);
  if (matchedProduct){
    matchedProduct.deliveryId = deliveryId;
    saveStorage();
  }
}

export function updateCartItemQuantity(productId, newQuantity){
  const matchedProduct = cart.find(cartItem => cartItem.productId === productId);
  matchedProduct.quantity = newQuantity;
  saveStorage();
}

export function removeFromCart(productId){
  cart = cart.filter(cartItem => cartItem.productId !== productId);
  saveStorage();
}