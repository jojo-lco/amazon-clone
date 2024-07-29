import { cart, removeFromCart, saveToStorage } from '../data/cart.js';
import { products } from '../data/products.js';
import { formatCurrency } from './utils/money.js';

displayCartQuantity();

let cartSummaryHTML = '';
cart.forEach((cartItem) => {

  const { productId } = cartItem; 

  let matchingProduct;
  products.forEach((product) => {
    if(product.id === productId) matchingProduct = product;
  })
  
 let html = `
  <div class="cart-item-container 
        js-cart-item-container-${matchingProduct.id}">
            <div class="delivery-date">
              Delivery date: Tuesday, June 21
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src="${matchingProduct.image}">

              <div class="cart-item-details">
                <div class="product-name">
                  ${matchingProduct.name}
                </div>
                <div class="product-price">
                  $${formatCurrency(matchingProduct.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label js-quantity-label">${cartItem.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-quality-link" data-product-id="${matchingProduct.id}">
                    Update
                  </span>
                  <input class="quantity-input js-quantity-input">
                  <span class="save-quantity-link link-primary js-save-quantity-link">Save
                  </span>
                  <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                <div class="delivery-option">
                  <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      Tuesday, June 21
                    </div>
                    <div class="delivery-option-price">
                      FREE Shipping
                    </div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      Wednesday, June 15
                    </div>
                    <div class="delivery-option-price">
                      $4.99 - Shipping
                    </div>
                  </div>
                </div>
                <div class="delivery-option">
                  <input type="radio"
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      Monday, June 13
                    </div>
                    <div class="delivery-option-price">
                      $9.99 - Shipping
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  `
  cartSummaryHTML += html;
})
document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

document.querySelectorAll('.js-delete-link').forEach((link) => {
  link.addEventListener('click', () => {
    const { productId } = link.dataset;
    removeFromCart(productId);

    const container = document.querySelector(`.js-cart-item-container-${productId}`)
    
    container.remove();

    displayCartQuantity();
  })
})

function displayCartQuantity() {
  let cartQuantity = 0;
    cart.forEach((item) => {
      cartQuantity += item.quantity;
    })

    document.querySelector('.js-return-to-home-link').innerHTML = 
    cartQuantity === 1 ? `${cartQuantity} item` : `${cartQuantity} items`;
    
}

  document.querySelectorAll('.js-update-quality-link').forEach((link) => {
    link.addEventListener('click', () => {
    const { productId } = link.dataset;
    
    const container = document.querySelector(`.js-cart-item-container-${productId}`)
    
    container.classList.add('is-editing-quantity');
    
    updateItemQuantity(productId, container);

    displayCartQuantity()
    })
  })

  function updateItemQuantity(productId, container) {
    document.querySelector('.js-save-quantity-link').addEventListener('click', () => {
      const inputQuantity = Number(document.querySelector('.js-quantity-input').value);

      cart.forEach((cartItem) => {
        if(cartItem.productId === productId && inputQuantity >= 0 && inputQuantity < 1000) cartItem.quantity = inputQuantity;
      })

      saveToStorage();

      document.querySelector('.js-quantity-label').innerHTML = inputQuantity;

      container.classList.remove('is-editing-quantity');
    })
  }

