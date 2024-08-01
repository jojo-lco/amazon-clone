class Cart {
  cartItems;
  localstorageKey;

  constructor(localstorageKey) {
    this.localstorageKey = localstorageKey;
    this.loadFromStorage();
  }

  loadFromStorage() {
    this.cartItems = JSON.parse(localStorage.getItem(this.localstorageKey));
  
    if(!this.cartItems) {
      this.cartItems = [{
        productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
        quantity: 2, 
        deliveryOptionId: '1'
      },
      {
        productId: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
        quantity: 1,
        deliveryOptionId: '2'
      }];
    }
  }

  saveToStorage() {
    localStorage.setItem(this.localstorageKey, JSON.stringify(this.cartItems));
  }

  addToCart(productId, selectedQuantity) {
    let matchingItem;
  
    this.cartItems.forEach((item) => {
        if(productId === item.productId) {
          matchingItem = item;
        }
      })
  
      if(matchingItem) matchingItem.quantity += selectedQuantity;
      else {
        this.cartItems.push({
          productId,
          quantity: selectedQuantity,
          deliveryOptionId: '1'
        })
      }
  
      this.saveToStorage();
  }

  removeFromCart(productId) {
    const newCart = this.cartItems.filter(cartItem =>  cartItem.productId !== productId);
  
    this.cartItems = newCart;
  
    this.saveToStorage();
  }

  updateDeliveryOption(productId, deliveryOptionId) {
    let matchingItem;
  
      this.cartItems.forEach((item) => {
        if(productId === item.productId) {
          matchingItem = item;
        }
      })
  
      matchingItem.deliveryOptionId = deliveryOptionId;
  
      this.saveToStorage();
  }
}


const cart = new Cart('cart-oop');
const businessCart = new Cart('cart-business');



console.log(cart);
console.log(businessCart);
console.log(businessCart instanceof Cart)