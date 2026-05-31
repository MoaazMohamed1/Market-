// ==================== Cart Management ====================
class CartManager {
 static getCart() {
  return JSON.parse(localStorage.getItem('eliteCart')) || [];
 }
 
 static saveCart(cart) {
  localStorage.setItem('eliteCart', JSON.stringify(cart));
  this.updateCartCount();
 }
 
 static addToCart(product, quantity = 1, size = null, color = null) {
  const cart = this.getCart();
  const existingIndex = cart.findIndex(item =>
   item.id === product.id &&
   item.size === size &&
   item.color === color
  );
  
  if (existingIndex > -1) {
   cart[existingIndex].quantity += quantity;
  } else {
   cart.push({
    ...product,
    quantity,
    size,
    color
   });
  }
  
  this.saveCart(cart);
  return cart;
 }
 
 static removeFromCart(productId, size = null, color = null) {
  let cart = this.getCart();
  cart = cart.filter(item =>
   !(item.id === productId && item.size === size && item.color === color)
  );
  this.saveCart(cart);
  return cart;
 }
 
 static updateQuantity(productId, quantity, size = null, color = null) {
  const cart = this.getCart();
  const item = cart.find(item =>
   item.id === productId &&
   item.size === size &&
   item.color === color
  );
  
  if (item) {
   item.quantity = quantity;
   if (item.quantity <= 0) {
    return this.removeFromCart(productId, size, color);
   }
  }
  
  this.saveCart(cart);
  return cart;
 }
 
 static clearCart() {
  this.saveCart([]);
 }
 
 static getCartTotal() {
  const cart = this.getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
 }
 
 static getCartCount() {
  const cart = this.getCart();
  return cart.reduce((total, item) => total + item.quantity, 0);
 }
 
 static updateCartCount() {
  const count = this.getCartCount();
  document.querySelectorAll('.cart-count').forEach(el => {
   el.textContent = count;
   el.style.animation = 'none';
   el.offsetHeight;
   el.style.animation = 'pulse 0.3s ease';
  });
 }
}

// ==================== Wishlist Management ====================
class WishlistManager {
 static getWishlist() {
  return JSON.parse(localStorage.getItem('eliteWishlist')) || [];
 }
 
 static saveWishlist(wishlist) {
  localStorage.setItem('eliteWishlist', JSON.stringify(wishlist));
  this.updateWishlistCount();
 }
 
 static addToWishlist(product) {
  const wishlist = this.getWishlist();
  if (!wishlist.find(item => item.id === product.id)) {
   wishlist.push(product);
   this.saveWishlist(wishlist);
   return true;
  }
  return false;
 }
 
 static removeFromWishlist(productId) {
  let wishlist = this.getWishlist();
  wishlist = wishlist.filter(item => item.id !== productId);
  this.saveWishlist(wishlist);
  return wishlist;
 }
 
 static isInWishlist(productId) {
  const wishlist = this.getWishlist();
  return wishlist.some(item => item.id === productId);
 }
 
 static toggleWishlist(product) {
  if (this.isInWishlist(product.id)) {
   this.removeFromWishlist(product.id);
   return false;
  } else {
   this.addToWishlist(product);
   return true;
  }
 }
 
 static getWishlistCount() {
  return this.getWishlist().length;
 }
 
 static updateWishlistCount() {
  const count = this.getWishlistCount();
  document.querySelectorAll('.wishlist-count').forEach(el => {
   el.textContent = count;
  });
 }
}