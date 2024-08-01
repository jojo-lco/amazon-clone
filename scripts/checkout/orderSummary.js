import { cart, removeFromCart, saveToStorage, updateDeliveryOption } from '../../data/cart.js';
import { getProduct } from '../../data/products.js';
import { formatCurrency } from '../utils/money.js';
import { deliveryOptions, getDeliveryOption, calculateDeliveryDate } from '../../data/deliveryOptions.js'
import { renderPaymentSummary } from './paymentSummary.js';
import { renderCheckoutHeader } from './checkoutHeader.js';


export function renderOrderSummary() {

  let cartSummaryHTML = '';
  cart.forEach((cartItem) => {

    const { productId } = cartItem; 

    const matchingProduct = getProduct(productId);
    

    const deliveryOptionId = cartItem.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);

   const dateString = calculateDeliveryDate(deliveryOption);

  let html = `
    <div class="cart-item-container
       js-cart-item-container 
      js-cart-item-container-${matchingProduct.id}">
        <div class="delivery-date">
          Delivery date: ${dateString}
        </div>

        <div class="cart-item-details-grid">
          <img class="product-image"
            src="${matchingProduct.image}">

          <div class="cart-item-details">
            <div class="product-name js-product-name-${matchingProduct.id}">
              ${matchingProduct.name}
            </div>
            <div class="product-price">
              ${matchingProduct.getPrice()}
            </div>
            <div class="product-quantity js-product-quantity-${matchingProduct.id}">
            <span>
              Quantity: <span class="quantity-label js-quantity-label">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-quality-link" data-product-id="${matchingProduct.id}">
              Update
            </span>
            <input class="quantity-input js-quantity-input">
            <span class="save-quantity-link link-primary js-save-quantity-link">Save
            </span>
            <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${matchingProduct.id}" 
            data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          ${deliveryOptionsHTML(matchingProduct, cartItem)}
        </div>
      </div>
    </div>
    `
    cartSummaryHTML += html;
  })

  function deliveryOptionsHTML(matchingProduct, cartItem) {
    let html = '';

    deliveryOptions.forEach(deliveryOption => {
      const dateString = calculateDeliveryDate(deliveryOption);

      const priceString = deliveryOption.priceCents === 0 ? 'FREE' : `$${formatCurrency(deliveryOption.priceCents)} -`;

      const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

      html += `<div 
                class="delivery-option js-delivery-option
                js-delivery-option-${matchingProduct.id}-${deliveryOption.id}"
                data-product-id="${matchingProduct.id}"
                data-delivery-option-id="${deliveryOption.id}">
          <input type="radio"
          ${isChecked ? 'checked' : ''}
            class="delivery-option-input js-delivery-option-input-${matchingProduct.id}-${deliveryOption.id}"
            name="delivery-option-${matchingProduct.id}">
          <div>
            <div class="delivery-option-date">
              ${dateString}
            </div>
            <div class="delivery-option-price">
              ${priceString} Shipping
            </div>
          </div>
        </div>`
  })
    return html;
  }

  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const { productId } = link.dataset;
      removeFromCart(productId);

      renderOrderSummary();
      renderCheckoutHeader();
      renderPaymentSummary();
    })
  })

    document.querySelectorAll('.js-update-quality-link').forEach((link) => {
      link.addEventListener('click', () => {
      const { productId } = link.dataset;
      
      const container = document.querySelector(`.js-cart-item-container-${productId}`)
      
      container.classList.add('is-editing-quantity');
      
      updateItemQuantity(productId, container);

      renderCheckoutHeader();
      })
    })

    function updateItemQuantity(productId, container) {
      document.querySelector('.js-save-quantity-link').addEventListener('click', () => {
        const inputQuantity = Number(document.querySelector('.js-quantity-input').value);

        cart.forEach((cartItem) => {
          if(cartItem.productId === productId && inputQuantity >= 0 && inputQuantity < 1000) cartItem.quantity = inputQuantity;
        })

        saveToStorage();

        renderOrderSummary();
        renderCheckoutHeader();
        renderPaymentSummary();

      })
    }

    document.querySelectorAll('.js-delivery-option').forEach((element) => {
      element.addEventListener('click', () => {
        const { productId, deliveryOptionId } = element.dataset;
        updateDeliveryOption(productId, deliveryOptionId)
        
        renderOrderSummary();
        renderPaymentSummary();
      })
    })
  }

 
