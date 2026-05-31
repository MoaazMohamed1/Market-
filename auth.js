// ==================== Auth Logic ====================
document.addEventListener('DOMContentLoaded', () => {
    // تسجيل الدخول
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // التسجيل
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // تبديل إظهار كلمة المرور
    document.querySelectorAll('.toggle-password').forEach(btn => {
        btn.addEventListener('click', togglePasswordVisibility);
    });
});

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // تحقق بسيط
    if (!email || !password) {
        showAuthError('يرجى إدخال البريد الإلكتروني وكلمة المرور');
        return;
    }
    
    // تعطيل الزر
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري تسجيل الدخول...';
    
    try {
        const user = await API.login(email, password);
        
        Swal.fire({
            title: 'تم تسجيل الدخول بنجاح!',
            text: `مرحباً ${user.name}`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });
        
        // التوجيه
        setTimeout(() => {
            const urlParams = new URLSearchParams(window.location.search);
            const redirect = urlParams.get('redirect');
            if (redirect === 'checkout') {
                window.location.href = 'checkout.html';
            } else {
                window.location.href = '../index.html';
            }
        }, 2000);
        
    } catch (error) {
        showAuthError(error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> تسجيل الدخول';
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    
    // تحقق
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
        showAuthError('يرجى ملء جميع الحقول');
        return;
    }
    
    if (password.length < 8) {
        showAuthError('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
        return;
    }
    
    if (password !== confirmPassword) {
        showAuthError('كلمات المرور غير متطابقة');
        return;
    }
    
    if (!/^05\d{8}$/.test(phone)) {
        showAuthError('رقم الهاتف غير صحيح');
        return;
    }
    
    // تعطيل الزر
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> جاري إنشاء الحساب...';
    
    try {
        const user = await API.register({
            name: `${firstName} ${lastName}`,
            email,
            phone,
            password
        });
        
        Swal.fire({
            title: 'تم إنشاء الحساب بنجاح!',
            text: `مرحباً ${user.name}`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });
        
        setTimeout(() => {
            window.location.href = '../index.html';
        }, 2000);
        
    } catch (error) {
        showAuthError(error.message);
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> إنشاء حساب';
    }
}

function togglePasswordVisibility(e) {
    const targetId = e.currentTarget.dataset.target;
    const input = document.getElementById(targetId);
    const icon = e.currentTarget.querySelector('i');
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
    }
}

function showAuthError(message) {
    Swal.fire({
        title: 'خطأ',
        text: message,
        icon: 'error',
        confirmButtonText: 'حسناً',
        confirmButtonColor: '#e17055'
    });
}