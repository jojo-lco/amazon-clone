import { orders } from "../data/orders.js"
import { getProduct } from "../data/products.js";
import { formatCurrency } from "./utils/money.js";
import { loadProductsFetch } from "../data/products.js";
import { loadCartFetch } from "../data/cart.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';

async function loadPage() {
  try {
    await Promise.all([
            loadProductsFetch(),
            loadCartFetch()
         ])

  } catch (error) {
    console.log('Unexpected error. Please try again later')
  }
  
  renderOrdersPage();
}
loadPage(); 

console.log(orders);

function renderOrdersPage() {
  let html = '';

  orders.forEach((order) => {
    const orderDateString = dayjs(`${order.orderTime}`).format('MMMM D');

    html += 
    `<div class="order-header">
            <div class="order-header-left-section">
              <div class="order-date">
                <div class="order-header-label">Order Placed:</div>
                <div>${orderDateString}</div>
              </div>
              <div class="order-total">
                <div class="order-header-label">Total:</div>
                <div>$${formatCurrency(order.totalCostCents)}</div>
              </div>
            </div>

            <div class="order-header-right-section">
              <div class="order-header-label">Order ID:</div>
              <div>${order.id}</div>
            </div>
          </div>`

    order.products.forEach((product) => {
      const { productId } = product;
      
      const matchingProduct = getProduct(productId);

      const dateString = dayjs(`${product.estimatedDeliveryTime}`).format('MMMM D');

      html += `  
          

          <div class="order-details-grid">
            <div class="product-image-container">
              <img src="${matchingProduct.image}">
            </div>

            <div class="product-details">
              <div class="product-name">
                ${matchingProduct.name}
              </div>
              <div class="product-delivery-date">
                Arriving on: ${dateString}
              </div>
              <div class="product-quantity">
                Quantity: ${product.quantity}
              </div>
              <button class="buy-again-button button-primary">
                <img class="buy-again-icon" src="images/icons/buy-again.png">
                <span class="buy-again-message">Buy it again</span>
              </button>
            </div>

            <div class="product-actions">
              <a href="tracking.html?orderId=${order.id}&productId=${productId}">
                <button class="track-package-button button-secondary">
                  Track package
                </button>
              </a>
            </div>
          </div>` 
          
          
    })
    
    
  })

document.querySelector('.js-order-container').innerHTML = html;


}