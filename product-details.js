// ==================== Product Details Logic ====================
document.addEventListener('DOMContentLoaded', () => {
    loadProductDetails();
    setupCartModal();
    CartManager.updateCartCount();
});

async function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (!productId) {
        showError('المنتج غير موجود');
        return;
    }
    
    try {
        const product = await API.getProductById(productId);
        renderProductDetails(product);
        loadRelatedProducts(product);
    } catch (error) {
        showError(error.message);
    }
}

function renderProductDetails(product) {
    const container = document.getElementById('productDetails');
    if (!container) return;
    
    const isInWishlist = WishlistManager.isInWishlist(product.id);
    
    document.title = `${product.name} - متجر النخبة`;
    
    container.innerHTML = `
        <div class="product-details">
            <!-- Gallery -->
            <div class="product-gallery">
                <div class="main-image" id="mainImage">
                    <i class="fas ${product.icon}"></i>
                </div>
                <div class="thumbnail-list">
                    ${product.images.map((img, index) => `
                        <div class="thumbnail ${index === 0 ? 'active' : ''}" 
                             onclick="changeMainImage('${img}', this)">
                            <i class="fas ${img}"></i>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Info -->
            <div class="product-info-details">
                <div class="product-breadcrumb">
                    <a href="../index.html">الرئيسية</a> / 
                    <a href="../index.html#products">المنتجات</a> / 
                    <span>${product.name}</span>
                </div>
                
                ${product.badge ? `<div class="product-badge ${product.badge}" style="position: static; display: inline-block; margin-bottom: 10px;">${product.badgeText}</div>` : ''}
                
                <h1 class="product-title-details">${product.name}</h1>
                
                <div class="product-rating-details">
                    <div class="stars">
                        ${generateStarsHTML(product.rating)}
                    </div>
                    <span class="rating-count">(${product.reviews} تقييم)</span>
                </div>
                
                <div class="product-price-details">
                    <span class="price-current">${product.price} ريال</span>
                    ${product.oldPrice ? `
                        <span class="price-old">${product.oldPrice} ريال</span>
                        <span class="discount-badge-details">خصم ${Math.round((1 - product.price / product.oldPrice) * 100)}%</span>
                    ` : ''}
                </div>
                
                <p class="product-description">${product.description}</p>
                
                <div class="product-options">
                    ${product.sizes.length > 0 ? `
                        <div class="option-group">
                            <h4>المقاس:</h4>
                            <div class="size-options">
                                ${product.sizes.map((size, i) => `
                                    <button class="size-option ${i === 0 ? 'selected' : ''}" 
                                            onclick="selectSize('${size}', this)">${size}</button>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    ${product.colors.length > 0 ? `
                        <div class="option-group">
                            <h4>اللون:</h4>
                            <div class="color-options">
                                ${product.colors.map((color, i) => `
                                    <button class="color-option ${i === 0 ? 'selected' : ''}" 
                                            style="background: ${getColorValue(color)};"
                                            onclick="selectColor('${color}', this)"
                                            title="${color}"></button>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    <div class="quantity-selector">
                        <h4>الكمية:</h4>
                        <div class="quantity-btns">
                            <button onclick="changeQuantity(-1)">-</button>
                            <span id="quantityDisplay">1</span>
                            <button onclick="changeQuantity(1)">+</button>
                        </div>
                    </div>
                </div>
                
                <div class="stock-info in-stock">
                    <i class="fas fa-check-circle"></i>
                    <span>${product.stock > 0 ? `متوفر في المخزون (${product.stock} قطعة)` : 'نفذ من المخزون'}</span>
                </div>
                
                <div class="product-actions-details">
                    <button class="btn-add-to-cart-large" onclick="addToCartWithOptions(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
                        <i class="fas fa-shopping-cart"></i> أضف إلى السلة
                    </button>
                    <button class="btn-wishlist-large ${isInWishlist ? 'favorited' : ''}" 
                            onclick="toggleWishlistProduct(${product.id})">
                        <i class="${isInWishlist ? 'fas' : 'far'} fa-heart"></i>
                    </button>
                </div>
                
                <div class="product-features">
                    <h4>المميزات:</h4>
                    <ul class="features-list">
                        ${product.features.map(f => `
                            <li><i class="fas fa-check-circle"></i> ${f}</li>
                        `).join('')}
                    </ul>
                </div>
            </div>
        </div>
    `;
}

async function loadRelatedProducts(product) {
    const container = document.getElementById('relatedProducts');
    if (!container) return;
    
    try {
        const related = await API.getRelatedProducts(product.id, 4);
        
        container.innerHTML = related.map(p => `
            <div class="product-card clickable" onclick="window.location.href='product-details.html?id=${p.id}'">
                ${p.badge ? `<div class="product-badge ${p.badge}">${p.badgeText}</div>` : ''}
                <div class="product-image-container">
                    <i class="fas ${p.icon}"></i>
                </div>
                <div class="product-info">
                    <h3 class="product-name">${p.name}</h3>
                    <div class="product-rating">
                        ${generateStarsHTML(p.rating)}
                        <span>(${p.reviews})</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">${p.price} ريال</span>
                        ${p.oldPrice ? `<span class="old-price">${p.oldPrice} ريال</span>` : ''}
                    </div>
                    <button class="add-to-cart-btn" onclick="event.stopPropagation(); addToCartProduct(${p.id})">
                        <i class="fas fa-shopping-cart"></i> أضف إلى السلة
                    </button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Error loading related products:', error);
    }
}

// ==================== Helper Functions ====================
let selectedSize = null;
let selectedColor = null;
let currentQuantity = 1;

function changeMainImage(icon, thumbnail) {
    const mainImage = document.getElementById('mainImage');
    if (mainImage) {
        mainImage.innerHTML = `<i class="fas ${icon}"></i>`;
    }
    
    document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('active'));
    if (thumbnail) thumbnail.classList.add('active');
}

function selectSize(size, btn) {
    selectedSize = size;
    document.querySelectorAll('.size-option').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
}

function selectColor(color, btn) {
    selectedColor = color;
    document.querySelectorAll('.color-option').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
}

function changeQuantity(delta) {
    currentQuantity = Math.max(1, currentQuantity + delta);
    const display = document.getElementById('quantityDisplay');
    if (display) display.textContent = currentQuantity;
}

function addToCartWithOptions(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    
    // تحديد المقاس واللون الافتراضي إذا لم يختر المستخدم
    const size = selectedSize || (product.sizes.length > 0 ? product.sizes[0] : null);
    const color = selectedColor || (product.colors.length > 0 ? product.colors[0] : null);
    
    CartManager.addToCart(product, currentQuantity, size, color);
    
    const btn = document.querySelector('.btn-add-to-cart-large');
    if (btn) {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check"></i> تمت الإضافة بنجاح';
        btn.style.background = 'var(--success-color)';
        setTimeout(() => {
            btn.innerHTML = originalHTML;
            btn.style.background = '';
        }, 1500);
    }
    
    showNotification(`تمت إضافة "${product.name}" إلى السلة`, 'success');
}

function toggleWishlistProduct(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    
    const isNowFavorite = WishlistManager.toggleWishlist(product);
    
    const btn = document.querySelector('.btn-wishlist-large');
    if (btn) {
        btn.classList.toggle('favorited', isNowFavorite);
        btn.querySelector('i').className = isNowFavorite ? 'fas fa-heart' : 'far fa-heart';
    }
    
    showNotification(
        isNowFavorite ? 'تمت إضافة المنتج إلى المفضلة ❤️' : 'تم إزالة المنتج من المفضلة',
        'success'
    );
}

function addToCartProduct(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    
    CartManager.addToCart(product);
    showNotification(`تمت إضافة "${product.name}" إلى السلة`, 'success');
}

function generateStarsHTML(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) stars += '<i class="fas fa-star"></i>';
    if (halfStar) stars += '<i class="fas fa-star-half-alt"></i>';
    for (let i = fullStars + (halfStar ? 1 : 0); i < 5; i++) stars += '<i class="far fa-star"></i>';
    
    return stars;
}

function getColorValue(colorName) {
    const colorMap = {
        'أسود': '#2d3436',
        'أبيض': '#ffffff',
        'أزرق': '#0984e3',
        'أحمر': '#e17055',
        'بني': '#8B4513',
        'رمادي': '#636e72',
        'فضي': '#b2bec3',
        'ذهبي': '#f9ca24',
        'وردي': '#fd79a8',
        'كحلي': '#2c3e50',
        'أزرق ملكي': '#1e3799'
    };
    return colorMap[colorName] || '#ccc';
}

function showError(message) {
    const container = document.getElementById('productDetails');
    if (container) {
        container.innerHTML = `
            <div class="loading-spinner" style="color: var(--danger-color);">
                <i class="fas fa-exclamation-circle"></i>
                <p>${message}</p>
                <a href="../index.html" class="btn-primary" style="margin-top: 20px;">العودة للمتجر</a>
            </div>
        `;
    }
}

function showNotification(message, type) {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    clearTimeout(notification._timeout);
    notification._timeout = setTimeout(() => {
        notification.classList.remove('show');
    }, 2500);
}

// Cart Modal
function setupCartModal() {
    document.getElementById('cartBtn')?.addEventListener('click', openCart);
    document.getElementById('closeCartBtn')?.addEventListener('click', closeCart);
    document.getElementById('cartOverlay')?.addEventListener('click', closeCart);
}

function openCart() {
    document.getElementById('cartOverlay').classList.add('active');
    document.getElementById('cartModal').classList.add('active');
    renderCartModal();
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    document.getElementById('cartOverlay').classList.remove('active');
    document.getElementById('cartModal').classList.remove('active');
    document.body.style.overflow = '';
}

function renderCartModal() {
    const cartBody = document.getElementById('cartBody');
    const cartFooter = document.getElementById('cartFooter');
    const cart = CartManager.getCart();
    
    if (!cartBody || !cartFooter) return;
    
    if (cart.length === 0) {
        cartBody.innerHTML = `<div class="empty-cart"><i class="fas fa-shopping-bag"></i><p>سلة التسوق فارغة</p></div>`;
        cartFooter.innerHTML = '';
        return;
    }
    
    cartBody.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image"><i class="fas ${item.icon}"></i></div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                ${item.size ? `<small>المقاس: ${item.size}</small>` : ''}
                ${item.color ? `<small>اللون: ${item.color}</small>` : ''}
                <div class="cart-item-price">${item.price} ريال</div>
                <div class="quantity-control">
                    <button class="qty-btn" onclick="updateCartItemQty(${item.id}, ${item.quantity - 1}, '${item.size || ''}', '${item.color || ''}')">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateCartItemQty(${item.id}, ${item.quantity + 1}, '${item.size || ''}', '${item.color || ''}')">+</button>
                </div>
            </div>
            <button class="remove-item-btn" onclick="removeCartItemModal(${item.id}, '${item.size || ''}', '${item.color || ''}')">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
    `).join('');
    
    const total = CartManager.getCartTotal();
    cartFooter.innerHTML = `
        <div class="cart-total"><span>المجموع</span><span>${total} ريال</span></div>
        <button class="btn-checkout" onclick="window.location.href='checkout.html'">إتمام الشراء</button>
        <button class="btn-clear" onclick="clearCartModal()">تفريغ السلة</button>
    `;
}

function updateCartItemQty(id, qty, size, color) {
    CartManager.updateQuantity(id, qty, size || null, color || null);
    renderCartModal();
}

function removeCartItemModal(id, size, color) {
    CartManager.removeFromCart(id, size || null, color || null);
    renderCartModal();
}

function clearCartModal() {
    CartManager.clearCart();
    renderCartModal();
}