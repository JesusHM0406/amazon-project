export const cart = JSON.parse(localStorage.getItem('cart')) || [];

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
  else cart.push({ productId, quantity: quantityToAdd });

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