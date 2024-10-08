import { cart, addToCart } from '../data/cart.js';
import { products, loadProducts } from '../data/products.js';

loadProducts(renderProductsGrid);

function renderProductsGrid() {
  updateCartQuantity();

  let productsHTML = '';

  const url = new URL(window.location.href);
  const search = url.searchParams.get('search');

  let filteredProducts = products;

  if(search){
    filteredProducts = products.filter((product) => {
      let matchingKeyword = false;

      product.keywords.forEach((keyword) => {
        if(keyword.toLowerCase().includes(search.toLowerCase())) matchingKeyword = true;
      })
      return matchingKeyword || product.name.toLowerCase().includes(search.toLowerCase());
    });
  }

  filteredProducts.forEach((product) => {
    productsHTML += `
      <div class="product-container">
              <div class="product-image-container">
                <img class="product-image"
                  src="${product.image}">
              </div>

              <div class="product-name limit-text-to-2-lines">
                ${product.name}
              </div>

              <div class="product-rating-container">
                <img class="product-rating-stars"
                  src="${product.getStarsURL()}">
                <div class="product-rating-count link-primary">
                  ${product.rating.count}
                </div>
              </div>

              <div class="product-price">
                ${product.getPrice()}
              </div>

              <div class="product-quantity-container">
                <select class="js-select-quantity">
                  <option value="1">1</option>
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

              ${product.extraInfoHTML()}

              <div class="product-spacer"></div>

              <div class="added-to-cart js-added-to-cart-${product.id}">
                <img src="images/icons/checkmark.png">
                Added
              </div>

              <button class="add-to-cart-button button-primary js-add-to-cart-button"
              data-product-id="${product.id}">
                Add to Cart
              </button>
            </div>`;
  })



  document.querySelector('.js-products-grid').innerHTML = productsHTML;

  function updateCartQuantity() {
    let cartQuantity = 0;
      cart.forEach((item) => {
        cartQuantity += item.quantity;
      })

      document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
  }

  document.querySelectorAll('.js-add-to-cart-button').forEach((buttonElement) => {
    buttonElement.addEventListener('click', () => {
      const selectedQuantity = Number(document.querySelector('.js-select-quantity').value);

      const { productId } = buttonElement.dataset;

      addToCart(productId, selectedQuantity);

      updateCartQuantity();

      const addedMessage = document.querySelector(`.js-added-to-cart-${productId}`)

      addedMessage.classList.add('display-added')

      let timeoutId;

      if(timeoutId) clearTimeout(timeoutId);
      else {
        timeoutId = setTimeout(() => {
          addedMessage.classList.remove('display-added');
        }, 2000)
      }

    
    })
  })

  document.querySelector('.js-search-button').addEventListener('click', () => {
    const search = document.querySelector('.js-search-bar').value;
    window.location.href = `amazon.html?search=${search}`
  })
};
