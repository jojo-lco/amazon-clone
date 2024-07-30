import { cart } from '../../data/cart.js'

export function renderCheckoutHeader() {
  let cartQuantity = 0;
      cart.forEach((item) => {
        cartQuantity += item.quantity;
      })

  const checkoutHeaderHTML = `
    Checkout (<a class="return-to-home-link js-return-to-home-link"
    href="amazon.html"></a>)`

  document.querySelector('.js-checkout-header-middle-section').innerHTML = checkoutHeaderHTML; 
  
  document.querySelector('.js-return-to-home-link').innerHTML = 
  cartQuantity === 1 ? `${cartQuantity} item` : `${cartQuantity} items`;         
}