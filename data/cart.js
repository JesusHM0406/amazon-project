export let cart;

loadFromStorage();

export function loadFromStorage(){
  try{
    let cartJson = localStorage.getItem('cart');

    if(cartJson){
      cart = JSON.parse(cartJson);
    } else {
      cart = [];
    }
  } catch(e){
    console.log('Error: not valid JSON, resetting the cart ', e);
    cart = [];
  }

  if(!Array.isArray(cart)){
    cart = [];
  }
}

function saveStorage(){
  localStorage.setItem('cart',JSON.stringify(cart));
}

export function calculateCartQuantity(){
  return cart.reduce((acc, act)=>{ return acc + act.quantity },0);
}

function updateCart(productId,quantity){
  const matchedProduct = cart.find(cartItem => cartItem.productId === productId);

  if(matchedProduct){
    matchedProduct.quantity += quantity; 
  } else{
    cart.push({productId, quantity, deliveryId: '1'})
  }
  saveStorage();  
}

function displayAddedMessage(productId, timeoutId){
  const addedMessage = document.querySelector(`.added-${productId}`);

  addedMessage.classList.add('added-visible');
  if(timeoutId) clearTimeout(timeoutId);

  timeoutId = setTimeout(()=>{
    addedMessage.classList.remove('added-visible');
  },1000);
}

function updateUI(productId){
  document.querySelector('.cart-quantity').textContent = calculateCartQuantity();

  document.querySelector(`.select-${productId}`).value = 1;
}

export function addToCart(productId,timeoutId){
  try {
    const quantityToAdd = Number(document.querySelector(`.select-${productId}`).value);

    if(isNaN(quantityToAdd)){
      throw new Error('Please enter a valid number')
    }

    updateCart(productId,quantityToAdd);

    displayAddedMessage(productId,timeoutId);

    updateUI(productId);
  } catch(e){
    console.log(e);
  }
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