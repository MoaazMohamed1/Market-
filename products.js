// ==================== Products Display ====================
class ProductsDisplay {
 constructor() {
  this.currentPage = 1;
  this.currentCategory = 'all';
  this.productsPerPage = 8;
  this.isLoading = false;
 }
 
 async loadProducts(category = 'all', page = 1, append = false) {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  
  this.isLoading = true;
  if (!append) {
   grid.innerHTML = `
                <div class="loading-spinner">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>جاري تحميل المنتجات...</p>
                </div>
            `;
  }
  
  try {
   const data = await API.getProducts(category, page, this.productsPerPage);
   
   if (append) {
    grid.insertAdjacentHTML('beforeend', this.renderProducts(data.products));
   } else {
    grid.innerHTML = this.renderProducts(data.products);
   }
   
   // إظهار/إخفاء زر تحميل المزيد
   const loadMoreBtn = document.getElementById('loadMoreBtn');
   if (loadMoreBtn) {
    loadMoreBtn.style.display = data.hasMore ? 'inline-flex' : 'none';
   }
   
   this.currentPage = page;
   this.currentCategory = category;
   
  } catch (error) {
   grid.innerHTML = `
                <div class="loading-spinner" style="color: var(--danger-color);">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>حدث خطأ في تحميل المنتجات</p>
                </div>
            `;
  } finally {
   this.isLoading = false;
  }
 }
 
 renderProducts(products) {
  if (products.length === 0) {
   return `
                <div class="loading-spinner">
                    <i class="fas fa-box-open"></i>
                    <p>لا توجد منتجات في هذه الفئة</p>
                </div>
            `;
  }
  
  return products.map(product => this.renderProductCard(product)).join('');
 }
 
 renderProductCard(product) {
  const isInWishlist = WishlistManager.isInWishlist(product.id);
  
  return `
            <div class="product-card clickable" data-category="${product.category}">
                ${product.badge ? `<div class="product-badge ${product.badge}">${product.badgeText}</div>` : ''}
                <div class="product-image-container" onclick="window.location.href='pages/product-details.html?id=${product.id}'">
                    <i class="fas ${product.icon}"></i>
                    <div class="product-actions">
                        <button class="action-btn ${isInWishlist ? 'favorited' : ''}" 
                                onclick="event.stopPropagation(); toggleWishlistProduct(${product.id})" 
                                title="${isInWishlist ? 'إزالة من المفضلة' : 'أضف للمفضلة'}">
                            <i class="${isInWishlist ? 'fas' : 'far'} fa-heart"></i>
                        </button>
                        <button class="action-btn" 
                                onclick="event.stopPropagation(); shareProduct(${product.id})" 
                                title="مشاركة">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-category">${this.getCategoryName(product.category)}</div>
                    <h3 class="product-name">
                        <a href="pages/product-details.html?id=${product.id}">${product.name}</a>
                    </h3>
                    <div class="product-rating">
                        ${this.generateStars(product.rating)}
                        <span>(${product.reviews})</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">${product.price} ريال</span>
                        ${product.oldPrice ? `<span class="old-price">${product.oldPrice} ريال</span>` : ''}
                    </div>
                    <button class="add-to-cart-btn" data-product-id="${product.id}" 
                            onclick="event.stopPropagation(); addToCartProduct(${product.id})">
                        <i class="fas fa-shopping-cart"></i> أضف إلى السلة
                    </button>
                </div>
            </div>
        `;
 }
 
 getCategoryName(category) {
  const names = {
   'electronics': 'إلكترونيات',
   'men-fashion': 'ملابس رجالية',
   'women-fashion': 'ملابس نسائية',
   'accessories': 'إكسسوارات',
   'home': 'منزل ومطبخ'
  };
  return names[category] || category;
 }
 
 generateStars(rating) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  let stars = '';
  
  for (let i = 0; i < fullStars; i++) {
   stars += '<i class="fas fa-star"></i>';
  }
  if (halfStar) {
   stars += '<i class="fas fa-star-half-alt"></i>';
  }
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
  for (let i = 0; i < emptyStars; i++) {
   stars += '<i class="far fa-star"></i>';
  }
  
  return stars;
 }
}