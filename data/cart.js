export const cart = [];

export function addToCart(productId, selectedQuantity) {
  let matchingItem;
    cart.forEach((item) => {
      if(productId === item.productId) {
        matchingItem = item;
      }
    })

    if(matchingItem) matchingItem.quantity += selectedQuantity;
    else {
      cart.push({
        productId,
        quantity: selectedQuantity
      })
    }

}