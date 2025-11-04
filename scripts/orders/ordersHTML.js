import { calculateCartQuantity } from "../../data/cart.js";
import { formatCurency } from "./../utils/money.js";
import { orders } from "../../data/orders.js";
import { products } from "../../data/products.js";

export function generateProductHTML(product, orderId){
  const matchedProduct = products.find(item => item.id === product.productId);

  if(!matchedProduct){
    return '';
  }

  return `
    <div class="product-image-container">
      <img src="${matchedProduct.image}">
    </div>

    <div class="product-details">
      <div class="product-name">${matchedProduct.name}</div>
      <div class="product-delivery-date">Arriving on: ${product.deliveryDate}</div>
      <div class="product-quantity">Quantity: ${product.quantity}</div>
      <button class="buy-again-button button-primary" data-product-id="${product.productId}">
        <img class="buy-again-icon" src="images/icons/buy-again.png">
        <span class="buy-again-message">Buy it again</span>
      </button>
    </div>

    <div class="product-actions">
      <a href="tracking.html?orderId=${orderId}&id=${product.productId}">
        <button class="track-package-button button-secondary">
          Track package
        </button>
      </a>
    </div>
  `;
}

export function renderOrdersPage(){
  let ordersHTML = '';

  if(orders.length === 0){
    ordersHTML = `
      <h2 class="empty-orders-string">There are no pending orders. You can go to the <a href="amazon.html">main page<a> to add new products to your cart and then place a new order <a href="checkout.html">here</a>.</h2>
    `;
    document.querySelector('.orders-grid').innerHTML = ordersHTML;
    return;
  }

  orders.forEach(order =>{;
    const orderTotal = formatCurency(order.totalCostCents);
    const orderProducts = order.products;

    const productsHTML = orderProducts.map(product => generateProductHTML(product, order.orderId)).join('');

    ordersHTML += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${order.orderTime.format('MMMM D')}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>$${orderTotal}</div>
            </div>
          </div>

          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.orderId}</div>
          </div>
        </div>

        <div class="order-details-grid">
          ${productsHTML}
        </div>
      </div>
    `;
  });

  document.querySelector('.orders-grid').innerHTML = ordersHTML;
  renderOrdersHeader();
};

export function renderOrdersHeader(){
  document.querySelector('.cart-quantity').textContent = calculateCartQuantity()
};