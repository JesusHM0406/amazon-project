const docFragment = document.createDocumentFragment();

products.forEach(item => {
  const prodContainerDiv = document.createElement('DIV');
  prodContainerDiv.classList.add('product-container');
  const html = `
    <div class="product-image-container">
      <img class="product-image"
        src="${item.image}">
    </div>

    <div class="product-name limit-text-to-2-lines">${item.name}</div>

    <div class="product-rating-container">
      <img class="product-rating-stars" src="images/ratings/rating-${item.rating.stars * 10}.png">
      <div class="product-rating-count link-primary">${item.rating.count}</div>
    </div>

    <div class="product-price">${(item.priceCents / 100).toFixed(2)}</div>

    <div class="product-quantity-container">
      <select class='select-${item.id}'>
        <option selected value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
        <option value="6">6</option>
        <option value="7">7</option>
        <option value="8">8</option>
        <option value="9">9</option>
        <option value="10">10</option>
      </select>
    </div>

    <div class="product-spacer"></div>

    <div class="added-to-cart">
      <img src="images/icons/checkmark.png">
      Added
    </div>

    <button class="add-to-cart-button button-primary" data-product-id='${item.id}'>Add to Cart</button>
  `;
  prodContainerDiv.innerHTML = html;
  docFragment.appendChild(prodContainerDiv);
});

document.querySelector('.products-grid').appendChild(docFragment);

const addToCartBtns = document.querySelectorAll('.add-to-cart-button');

addToCartBtns.forEach((btn)=>{
  btn.addEventListener('click',()=>{
    const { productId } = btn.dataset;
    const quantityToAdd = Number(document.querySelector(`.select-${productId}`).value);
    let matchedProduct = cart.find(item=> item.product === productId);

    if(matchedProduct) matchedProduct.quantity += quantityToAdd;
    else cart.push({ product: productId, quantity: quantityToAdd });
  });
});