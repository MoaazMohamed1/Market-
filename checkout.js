// ==================== Checkout Logic ====================
let appliedDiscount = 0;
let couponApplied = false;

document.addEventListener('DOMContentLoaded', () => {
 checkAuthentication();
 renderOrderSummary();
 loadUserData();
 setupPaymentMethods();
});

function checkAuthentication() {
 const user = JSON.parse(localStorage.getItem('eliteUser'));
 if (!user) {
  Swal.fire({
   title: 'تسجيل الدخول مطلوب',
   text: 'يجب تسجيل الدخول لإتمام عملية الشراء',
   icon: 'info',
   confirmButtonText: 'تسجيل الدخول',
   confirmButtonColor: '#6c5ce7'
  }).then(() => {
   window.location.href = 'login.html?redirect=checkout';
  });
 }
}

function loadUserData() {
 const user = JSON.parse(localStorage.getItem('eliteUser'));
 if (!user) return;
 
 const nameParts = (user.name || '').split(' ');
 document.getElementById('firstName').value = nameParts[0] || '';
 document.getElementById('lastName').value = nameParts.slice(1).join(' ') || '';
 document.getElementById('email').value = user.email || '';
 document.getElementById('phone').value = user.phone || '';
}

function renderOrderSummary() {
 const cart = CartManager.getCart();
 const orderItems = document.getElementById('orderItems');
 
 if (!orderItems) return;
 
 if (cart.length === 0) {
  orderItems.innerHTML = `
            <div class="empty-cart-checkout">
                <i class="fas fa-shopping-bag"></i>
                <p>سلة التسوق فارغة</p>
                <a href="../index.html" class="btn-primary">تصفح المنتجات</a>
            </div>
        `;
  document.querySelector('.btn-place-order').style.display = 'none';
  return;
 }
 
 orderItems.innerHTML = cart.map(item => `
        <div class="order-item">
            <div class="order-item-image">
                <i class="fas ${item.icon}"></i>
            </div>
            <div class="order-item-info">
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-meta">
                    ${item.size ? `المقاس: ${item.size}` : ''}
                    ${item.color ? ` | اللون: ${item.color}` : ''}
                    | الكمية: ${item.quantity}
                </div>
            </div>
            <div class="order-item-price">${item.price * item.quantity} ريال</div>
        </div>
    `).join('');
 
 updateTotals();
}

function updateTotals() {
 const subtotal = CartManager.getCartTotal();
 const shipping = subtotal >= 200 ? 0 : 30;
 const discount = appliedDiscount;
 const grandTotal = subtotal + shipping - discount;
 
 document.getElementById('subtotal').textContent = `${subtotal} ريال`;
 document.getElementById('shipping').textContent = shipping === 0 ? 'مجاني' : `${shipping} ريال`;
 
 const discountRow = document.getElementById('discountRow');
 if (discount > 0) {
  discountRow.style.display = 'flex';
  document.getElementById('discount').textContent = `-${discount} ريال`;
 } else {
  discountRow.style.display = 'none';
 }
 
 document.getElementById('grandTotal').textContent = `${grandTotal} ريال`;
}

function applyCoupon() {
 if (couponApplied) {
  showNotification('تم تطبيق كود الخصم مسبقاً', 'error');
  return;
 }
 
 const code = document.getElementById('couponCode').value.trim().toUpperCase();
 
 // أكواد خصم تجريبية
 const validCoupons = {
  'WELCOME10': 10,
  'ELITE20': 20,
  'SALE50': 50
 };
 
 if (validCoupons[code]) {
  const subtotal = CartManager.getCartTotal();
  appliedDiscount = Math.round(subtotal * validCoupons[code] / 100);
  couponApplied = true;
  updateTotals();
  showNotification(`تم تطبيق الخصم بنسبة ${validCoupons[code]}%`, 'success');
 } else {
  showNotification('كود الخصم غير صالح', 'error');
 }
}

function setupPaymentMethods() {
 document.querySelectorAll('.payment-method input').forEach(input => {
  input.addEventListener('change', function() {
   document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('active'));
   this.closest('.payment-method').classList.add('active');
  });
 });
}

async function placeOrder() {
 const cart = CartManager.getCart();
 
 if (cart.length === 0) {
  showNotification('سلة التسوق فارغة', 'error');
  return;
 }
 
 // التحقق من الحقول
 const firstName = document.getElementById('firstName').value.trim();
 const lastName = document.getElementById('lastName').value.trim();
 const email = document.getElementById('email').value.trim();
 const phone = document.getElementById('phone').value.trim();
 const city = document.getElementById('city').value;
 const address = document.getElementById('address').value.trim();
 
 if (!firstName || !lastName || !email || !phone || !city || !address) {
  showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
  return;
 }
 
 // تعطيل الزر
 const btn = document.querySelector('.btn-place-order');
 btn.disabled = true;
 btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري معالجة الطلب...';
 
 const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
 const notes = document.getElementById('notes').value;
 
 const orderData = {
  customer: {
   name: `${firstName} ${lastName}`,
   email,
   phone,
   city,
   address,
   notes
  },
  items: cart,
  subtotal: CartManager.getCartTotal(),
  shipping: CartManager.getCartTotal() >= 200 ? 0 : 30,
  discount: appliedDiscount,
  total: CartManager.getCartTotal() + (CartManager.getCartTotal() >= 200 ? 0 : 30) - appliedDiscount,
  paymentMethod
 };
 
 try {
  const order = await API.submitOrder(orderData);
  
  // تفريغ السلة
  CartManager.clearCart();
  
  Swal.fire({
   title: 'تم تقديم الطلب بنجاح! 🎉',
   html: `
                <p>رقم الطلب: <strong>#${order.id}</strong></p>
                <p>شكراً لتسوقك معنا. سيتم التواصل معك قريباً لتأكيد الطلب.</p>
                <p>الإجمالي: <strong>${orderData.total} ريال</strong></p>
            `,
   icon: 'success',
   confirmButtonText: 'العودة للمتجر',
   confirmButtonColor: '#6c5ce7'
  }).then(() => {
   window.location.href = '../index.html';
  });
  
 } catch (error) {
  showNotification('حدث خطأ أثناء تقديم الطلب. حاول مرة أخرى.', 'error');
 } finally {
  btn.disabled = false;
  btn.innerHTML = '<i class="fas fa-lock"></i> تأكيد الطلب';
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
 }, 3000);
}