// ==================== Main Application ====================
document.addEventListener('DOMContentLoaded', () => {
    // إنشاء كائن عرض المنتجات
    const productsDisplay = new ProductsDisplay();
    
    // تحميل المنتجات
    productsDisplay.loadProducts('all', 1);
    
    // تحديث عداد السلة والمفضلة
    CartManager.updateCartCount();
    WishlistManager.updateWishlistCount();
    
    // تحديث قائمة المستخدم
    updateUserMenu();
    
    // إعداد التصفية
    setupFilters(productsDisplay);
    
    // إعداد البحث
    setupSearch(productsDisplay);
    
    // إعداد الترتيب
    setupSorting(productsDisplay);
    
    // إعداد زر تحميل المزيد
    setupLoadMore(productsDisplay);
    
    // إعداد القائمة الجانبية
    setupMobileMenu();
    
    // إعداد السلة
    setupCart();
    
    // إعداد المفضلة
    setupWishlist();
    
    // إعداد Swiper
    initSwiper();
    
    // إعداد النشرة البريدية
    setupNewsletter();
});

// ==================== تحديث قائمة المستخدم ====================
async function updateUserMenu() {
    const user = await API.getUserProfile();
    const userInfo = document.getElementById('userInfo');
    const userLinks = document.querySelector('.user-links');
    
    if (!userInfo || !userLinks) return;
    
    if (user) {
        userInfo.innerHTML = `
            <span>مرحباً، ${user.name}</span>
        `;
        userLinks.innerHTML = `
            <a href="#"><i class="fas fa-user"></i> حسابي</a>
            <a href="#"><i class="fas fa-box"></i> طلباتي</a>
            <a href="#" onclick="logout()"><i class="fas fa-sign-out-alt"></i> تسجيل الخروج</a>
        `;
    }
}

// ==================== تسجيل الخروج ====================
function logout() {
    API.logout();
    window.location.reload();
}

// ==================== التصفية ====================
function setupFilters(productsDisplay) {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.dataset.category;
            productsDisplay.loadProducts(category, 1);
        });
    });
    
    // روابط الفئات
    document.querySelectorAll('.category-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.dataset.category;
            document.querySelector(`.filter-btn[data-category="${category}"]`)?.click();
            
            // التمرير إلى قسم المنتجات
            document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
        });
    });
}

// ==================== البحث ====================
function setupSearch(productsDisplay) {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (!searchInput) return;
    
    const performSearch = async () => {
        const query = searchInput.value.trim();
        if (query) {
            const results = await API.searchProducts(query);
            const grid = document.getElementById('productsGrid');
            if (grid) {
                grid.innerHTML = productsDisplay.renderProducts(results);
            }
        } else {
            productsDisplay.loadProducts('all', 1);
        }
    };
    
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') performSearch();
    });
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
}

// ==================== الترتيب ====================
function setupSorting(productsDisplay) {
    const sortSelect = document.getElementById('sortSelect');
    if (!sortSelect) return;
    
    sortSelect.addEventListener('change', async () => {
        const value = sortSelect.value;
        const data = await API.getProducts(productsDisplay.currentCategory, 1, 100);
        let products = data.products;
        
        switch(value) {
            case 'price-asc':
                products.sort((a, b) => a.price - b.price);
                break;
            case 'price-desc':
                products.sort((a, b) => b.price - a.price);
                break;
            case 'rating':
                products.sort((a, b) => b.rating - a.rating);
                break;
            case 'newest':
                products.sort((a, b) => b.id - a.id);
                break;
        }
        
        const grid = document.getElementById('productsGrid');
        if (grid) {
            grid.innerHTML = productsDisplay.renderProducts(products);
        }
    });
}

// ==================== تحميل المزيد ====================
function setupLoadMore(productsDisplay) {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    if (!loadMoreBtn) return;
    
    loadMoreBtn.addEventListener('click', () => {
        const nextPage = productsDisplay.currentPage + 1;
        productsDisplay.loadProducts(productsDisplay.currentCategory, nextPage, true);
    });
}

// ==================== القائمة الجانبية ====================
function setupMobileMenu() {
    const menuBtn = document.getElementById('mobileMenuBtn');
    const navList = document.querySelector('.nav-list');
    
    if (menuBtn && navList) {
        menuBtn.addEventListener('click', () => {
            navList.classList.toggle('active');
        });
    }
}

// ==================== إعداد السلة ====================
function setupCart() {
    const cartBtn = document.getElementById('cartBtn');
    const closeCartBtn = document.getElementById('closeCartBtn');
    const cartOverlay = document.getElementById('cartOverlay');
    
    if (cartBtn) cartBtn.addEventListener('click', openCart);
    if (closeCartBtn) closeCartBtn.addEventListener('click', closeCart);
    if (cartOverlay) cartOverlay.addEventListener('click', closeCart);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeCart();
    });
}

function openCart() {
    document.getElementById('cartOverlay').classList.add('active');
    document.getElementById('cartModal').classList.add('active');
    renderCart();
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    document.getElementById('cartOverlay').classList.remove('active');
    document.getElementById('cartModal').classList.remove('active');
    document.body.style.overflow = '';
}

function renderCart() {
    const cartBody = document.getElementById('cartBody');
    const cartFooter = document.getElementById('cartFooter');
    const cart = CartManager.getCart();
    
    if (!cartBody || !cartFooter) return;
    
    if (cart.length === 0) {
        cartBody.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-bag"></i>
                <p>سلة التسوق فارغة</p>
                <button class="btn-primary" onclick="closeCart()">تصفح المنتجات</button>
            </div>
        `;
        cartFooter.innerHTML = '';
        return;
    }
    
    cartBody.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <i class="fas ${item.icon}"></i>
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${item.name}</div>
                ${item.size ? `<small style="color: var(--gray-color);">المقاس: ${item.size}</small>` : ''}
                ${item.color ? `<small style="color: var(--gray-color);">اللون: ${item.color}</small>` : ''}
                <div class="cart-item-price">${item.price} ريال</div>
                <div class="quantity-control">
                    <button class="qty-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1}, '${item.size || ''}', '${item.color || ''}')">-</button>
                    <span style="font-weight: 700; min-width: 30px; text-align: center;">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1}, '${item.size || ''}', '${item.color || ''}')">+</button>
                </div>
            </div>
            <button class="remove-item-btn" onclick="removeCartItem(${item.id}, '${item.size || ''}', '${item.color || ''}')">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
    `).join('');
    
    const total = CartManager.getCartTotal();
    const count = CartManager.getCartCount();
    
    cartFooter.innerHTML = `
        <div class="cart-total">
            <span>المجموع (${count} منتج)</span>
            <span>${total} ريال</span>
        </div>
        <button class="btn-checkout" onclick="proceedToCheckout()">
            <i class="fas fa-lock"></i> إتمام الشراء
        </button>
        <button class="btn-clear" onclick="clearCartItems()">
            <i class="fas fa-trash"></i> تفريغ السلة
        </button>
    `;
}

function updateCartQuantity(productId, quantity, size, color) {
    CartManager.updateQuantity(productId, quantity, size || null, color || null);
    renderCart();
}

function removeCartItem(productId, size, color) {
    CartManager.removeFromCart(productId, size || null, color || null);
    renderCart();
    showNotification('تم حذف المنتج من السلة', 'success');
}

function clearCartItems() {
    Swal.fire({
        title: 'هل أنت متأكد؟',
        text: 'سيتم حذف جميع المنتجات من السلة',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'نعم، افرغ السلة',
        cancelButtonText: 'إلغاء',
        confirmButtonColor: '#e17055'
    }).then((result) => {
        if (result.isConfirmed) {
            CartManager.clearCart();
            renderCart();
            showNotification('تم تفريغ السلة بنجاح', 'success');
        }
    });
}

function proceedToCheckout() {
    const user = JSON.parse(localStorage.getItem('eliteUser'));
    if (!user) {
        Swal.fire({
            title: 'تسجيل الدخول مطلوب',
            text: 'يجب تسجيل الدخول لإتمام عملية الشراء',
            icon: 'info',
            showCancelButton: true,
            confirmButtonText: 'تسجيل الدخول',
            cancelButtonText: 'إلغاء',
            confirmButtonColor: '#6c5ce7'
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.href = 'pages/login.html?redirect=checkout';
            }
        });
        return;
    }
    
    window.location.href = 'pages/checkout.html';
}

function addToCartProduct(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    
    CartManager.addToCart(product);
    
    const btn = document.querySelector(`[data-product-id="${productId}"]`);
    if (btn) {
        btn.classList.add('added');
        btn.innerHTML = '<i class="fas fa-check"></i> تمت الإضافة';
        setTimeout(() => {
            btn.classList.remove('added');
            btn.innerHTML = '<i class="fas fa-shopping-cart"></i> أضف إلى السلة';
        }, 1500);
    }
    
    showNotification(`تمت إضافة "${product.name}" إلى السلة`, 'success');
}

// ==================== إعداد المفضلة ====================
function setupWishlist() {
    const wishlistIcon = document.getElementById('wishlistIcon');
    const wishlistBtn = document.getElementById('wishlistBtn');
    const closeWishlistBtn = document.getElementById('closeWishlistBtn');
    const wishlistOverlay = document.getElementById('wishlistOverlay');
    
    if (wishlistIcon) wishlistIcon.addEventListener('click', openWishlist);
    if (wishlistBtn) wishlistBtn.addEventListener('click', openWishlist);
    if (closeWishlistBtn) closeWishlistBtn.addEventListener('click', closeWishlist);
    if (wishlistOverlay) wishlistOverlay.addEventListener('click', closeWishlist);
}

function openWishlist() {
    document.getElementById('wishlistOverlay').classList.add('active');
    document.getElementById('wishlistModal').classList.add('active');
    renderWishlist();
    document.body.style.overflow = 'hidden';
}

function closeWishlist() {
    document.getElementById('wishlistOverlay').classList.remove('active');
    document.getElementById('wishlistModal').classList.remove('active');
    document.body.style.overflow = '';
}

function renderWishlist() {
    const wishlistBody = document.getElementById('wishlistBody');
    const wishlist = WishlistManager.getWishlist();
    
    if (!wishlistBody) return;
    
    if (wishlist.length === 0) {
        wishlistBody.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-heart"></i>
                <p>قائمة المفضلة فارغة</p>
                <button class="btn-primary" onclick="closeWishlist()">تصفح المنتجات</button>
            </div>
        `;
        return;
    }
    
    wishlistBody.innerHTML = wishlist.map(product => `
        <div class="cart-item">
            <div class="cart-item-image">
                <i class="fas ${product.icon}"></i>
            </div>
            <div class="cart-item-details">
                <div class="cart-item-name">${product.name}</div>
                <div class="cart-item-price">${product.price} ريال</div>
                <button class="btn-primary" style="padding: 8px 15px; font-size: 14px; margin-top: 5px;" 
                        onclick="addToCartProduct(${product.id})">
                    <i class="fas fa-shopping-cart"></i> أضف للسلة
                </button>
            </div>
            <button class="remove-item-btn" onclick="removeWishlistItem(${product.id})">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
    `).join('');
}

function removeWishlistItem(productId) {
    WishlistManager.removeFromWishlist(productId);
    renderWishlist();
    showNotification('تم حذف المنتج من المفضلة', 'success');
}

function toggleWishlistProduct(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    
    const isNowFavorite = WishlistManager.toggleWishlist(product);
    showNotification(
        isNowFavorite ? 'تمت إضافة المنتج إلى المفضلة ❤️' : 'تم إزالة المنتج من المفضلة',
        'success'
    );
    
    // إعادة عرض المنتجات لتحديث أيقونة القلب
    const productsDisplay = new ProductsDisplay();
    productsDisplay.loadProducts(productsDisplay.currentCategory, productsDisplay.currentPage);
}

function shareProduct(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;
    
    if (navigator.share) {
        navigator.share({
            title: product.name,
            text: `${product.name} - ${product.price} ريال`,
            url: `${window.location.origin}/pages/product-details.html?id=${productId}`
        });
    } else {
        const url = `${window.location.origin}/pages/product-details.html?id=${productId}`;
        navigator.clipboard.writeText(url).then(() => {
            showNotification('تم نسخ رابط المنتج 📋', 'success');
        });
    }
}

// ==================== Swiper ====================
function initSwiper() {
    if (typeof Swiper !== 'undefined') {
        // البانر الرئيسي
        new Swiper('.hero-slider', {
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            effect: 'fade',
            fadeEffect: {
                crossFade: true
            },
        });
        
        // تقييمات العملاء
        const testimonialSwiper = document.querySelector('.testimonials-slider');
        if (testimonialSwiper) {
            new Swiper('.testimonials-slider', {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                autoplay: {
                    delay: 4000,
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                breakpoints: {
                    768: {
                        slidesPerView: 2,
                    }
                }
            });
        }
    }
}

// ==================== النشرة البريدية ====================
function setupNewsletter() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input').value;
        
        Swal.fire({
            title: 'تم الاشتراك بنجاح! 🎉',
            text: `سيتم إرسال آخر العروض إلى ${email}`,
            icon: 'success',
            confirmButtonText: 'حسناً',
            confirmButtonColor: '#00b894'
        });
        
        form.reset();
    });
}

// ==================== الإشعارات ====================
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    notification.textContent = message;
    notification.className = `notification ${type} show`;
    
    clearTimeout(notification._timeout);
    notification._timeout = setTimeout(() => {
        notification.classList.remove('show');
    }, 2500);
}