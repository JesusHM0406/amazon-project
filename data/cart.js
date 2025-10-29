export let cart;
export const Persistance = {
  loadFromStorage(){
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
  },
  saveStorage(){
    localStorage.setItem('cart',JSON.stringify(cart));
  }
};

Persistance.loadFromStorage();

export function calculateCartQuantity(){
  return cart.reduce((acc, act)=>{ return acc + act.quantity },0);
}

export function updateCart(productId,quantity){
  const matchedProduct = cart.find(cartItem => cartItem.productId === productId);

  if(quantity === 0) return;

  if(matchedProduct){
    matchedProduct.quantity += quantity; 
  } else{
    cart.push({productId, quantity, deliveryId: '1'})
  }
  Persistance.saveStorage();  
}

export function displayAddedMessage(productId, timeoutId){
  const addedMessage = document.querySelector(`.added-${productId}`);

  addedMessage.classList.add('added-visible');
  if(timeoutId) clearTimeout(timeoutId);

  timeoutId = setTimeout(()=>{
    addedMessage.classList.remove('added-visible');
  },1000);
}

export function updateUI(productId){
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
    Persistance.saveStorage();
  }
}

export function updateCartItemQuantity(productId, newQuantity){
  const matchedProduct = cart.find(cartItem => cartItem.productId === productId);
  matchedProduct.quantity = newQuantity;
  Persistance.saveStorage();
}

export function removeFromCart(productId){
  cart = cart.filter(cartItem => cartItem.productId !== productId);
  Persistance.saveStorage();
}