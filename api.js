// ==================== API Simulation ====================
// محاكاة جلب البيانات من سيرفر خارجي

const API_BASE_URL = 'https://api.elitestore.com/v1';

// بيانات المنتجات
const productsData = [
    {
        id: 1,
        name: "حذاء رياضي بريميوم",
        slug: "premium-sports-shoes",
        category: "men-fashion",
        price: 349,
        oldPrice: 499,
        icon: "fa-shoe-prints",
        rating: 4.8,
        reviews: 128,
        badge: "sale",
        badgeText: "خصم 30%",
        description: "حذاء رياضي عصري مصنوع من أجود الخامات. مثالي للجري والتمارين الرياضية. تصميم مريح مع نعل مطاطي عالي الجودة.",
        images: ["fa-shoe-prints", "fa-shoe-prints", "fa-shoe-prints"],
        sizes: ["39", "40", "41", "42", "43", "44"],
        colors: ["أسود", "أبيض", "أزرق"],
        stock: 50,
        features: ["خفيف الوزن", "مقاوم للماء", "نعل مطاطي", "تهوية ممتازة"]
    },
    {
        id: 2,
        name: "ساعة ذكية X1",
        slug: "smart-watch-x1",
        category: "electronics",
        price: 899,
        oldPrice: 1199,
        icon: "fa-clock",
        rating: 4.9,
        reviews: 256,
        badge: "new",
        badgeText: "جديد",
        description: "ساعة ذكية متطورة بشاشة AMOLED ومستشعرات متعددة. تدعم تتبع النشاط واللياقة البدنية والنوم.",
        images: ["fa-clock", "fa-clock", "fa-clock"],
        sizes: [],
        colors: ["فضي", "ذهبي", "أسود"],
        stock: 30,
        features: ["شاشة AMOLED", "مقاومة للماء", "عمر بطارية 7 أيام", "GPS مدمج"]
    },
    {
        id: 3,
        name: "حقيبة ظهر جلدية",
        slug: "leather-backpack",
        category: "men-fashion",
        price: 259,
        oldPrice: null,
        icon: "fa-bag-shopping",
        rating: 4.7,
        reviews: 89,
        badge: null,
        badgeText: null,
        description: "حقيبة ظهر مصنوعة من الجلد الطبيعي الفاخر. تصميم عملي يناسب الاستخدام اليومي والعمل.",
        images: ["fa-bag-shopping", "fa-bag-shopping", "fa-bag-shopping"],
        sizes: [],
        colors: ["بني", "أسود"],
        stock: 25,
        features: ["جلد طبيعي", "جيب للابتوب", "أحزمة مبطنة", "مقاومة للماء"]
    },
    {
        id: 4,
        name: "سماعات بلوتوث لاسلكية",
        slug: "wireless-bluetooth-headphones",
        category: "electronics",
        price: 449,
        oldPrice: 599,
        icon: "fa-headphones",
        rating: 4.6,
        reviews: 312,
        badge: "sale",
        badgeText: "خصم 25%",
        description: "سماعات بلوتوث مع عزل ممتاز للضوضاء وصوت عالي الجودة. بطارية تدوم حتى 30 ساعة.",
        images: ["fa-headphones", "fa-headphones", "fa-headphones"],
        sizes: [],
        colors: ["أسود", "أبيض", "أزرق"],
        stock: 100,
        features: ["عزل الضوضاء", "بطارية 30 ساعة", "ميكروفون مدمج", "قابلة للطي"]
    },
    {
        id: 5,
        name: "نظارة شمسية كلاسيكية",
        slug: "classic-sunglasses",
        category: "accessories",
        price: 189,
        oldPrice: null,
        icon: "fa-glasses",
        rating: 4.5,
        reviews: 67,
        badge: null,
        badgeText: null,
        description: "نظارة شمسية بتصميم كلاسيكي أنيق. حماية كاملة من الأشعة فوق البنفسجية.",
        images: ["fa-glasses", "fa-glasses", "fa-glasses"],
        sizes: [],
        colors: ["أسود", "بني", "فضي"],
        stock: 75,
        features: ["حماية UV400", "إطار خفيف", "عدسات مستقطبة", "حقيبة فاخرة"]
    },
    {
        id: 6,
        name: "قلم ذكي متطور",
        slug: "advanced-smart-pen",
        category: "electronics",
        price: 159,
        oldPrice: 199,
        icon: "fa-pen",
        rating: 4.4,
        reviews: 45,
        badge: "sale",
        badgeText: "خصم 20%",
        description: "قلم ذكي يدعم جميع الشاشات التي تعمل باللمس. دقة عالية وحساسية ضغط.",
        images: ["fa-pen", "fa-pen", "fa-pen"],
        sizes: [],
        colors: ["أبيض", "أسود"],
        stock: 200,
        features: ["حساسية ضغط", "بطارية قابلة للشحن", "متوافق مع جميع الأجهزة", "تصميم مريح"]
    },
    {
        id: 7,
        name: "كوب حراري أنيق",
        slug: "stylish-thermal-mug",
        category: "accessories",
        price: 79,
        oldPrice: null,
        icon: "fa-mug-hot",
        rating: 4.3,
        reviews: 156,
        badge: null,
        badgeText: null,
        description: "كوب حراري يحافظ على درجة حرارة المشروبات لمدة تصل إلى 8 ساعات. تصميم أنيق وعصري.",
        images: ["fa-mug-hot", "fa-mug-hot", "fa-mug-hot"],
        sizes: ["350ml", "500ml"],
        colors: ["أسود", "أبيض", "أزرق", "وردي"],
        stock: 150,
        features: ["عزل حراري", "غطاء محكم", "سهل التنظيف", "صديق للبيئة"]
    },
    {
        id: 8,
        name: "محفظة جلد طبيعي",
        slug: "genuine-leather-wallet",
        category: "accessories",
        price: 219,
        oldPrice: 299,
        icon: "fa-wallet",
        rating: 4.7,
        reviews: 92,
        badge: "sale",
        badgeText: "خصم 27%",
        description: "محفظة جلد طبيعي 100% مع جيوب متعددة للبطاقات والنقود. تصميم كلاسيكي أنيق.",
        images: ["fa-wallet", "fa-wallet", "fa-wallet"],
        sizes: [],
        colors: ["بني", "أسود", "كحلي"],
        stock: 60,
        features: ["جلد طبيعي", "حماية RFID", "جيوب متعددة", "هدية مثالية"]
    },
    {
        id: 9,
        name: "تيشيرت قطني عصري",
        slug: "modern-cotton-tshirt",
        category: "men-fashion",
        price: 129,
        oldPrice: null,
        icon: "fa-tshirt",
        rating: 4.2,
        reviews: 234,
        badge: "new",
        badgeText: "جديد",
        description: "تيشيرت قطني 100% ناعم ومريح. تصميم عصري يناسب جميع الأذواق.",
        images: ["fa-tshirt", "fa-tshirt", "fa-tshirt"],
        sizes: ["S", "M", "L", "XL", "XXL"],
        colors: ["أبيض", "أسود", "رمادي", "أزرق"],
        stock: 300,
        features: ["قطن 100%", "مريح", "قابل للغسل", "متوفر بألوان متعددة"]
    },
    {
        id: 10,
        name: "سماعة أذن لاسلكية",
        slug: "wireless-earbuds",
        category: "electronics",
        price: 599,
        oldPrice: 799,
        icon: "fa-ear-listen",
        rating: 4.8,
        reviews: 189,
        badge: "sale",
        badgeText: "خصم 25%",
        description: "سماعات أذن لاسلكية مع علبة شحن. صوت نقي وتقنية إلغاء الضوضاء.",
        images: ["fa-ear-listen", "fa-ear-listen", "fa-ear-listen"],
        sizes: [],
        colors: ["أبيض", "أسود"],
        stock: 80,
        features: ["إلغاء الضوضاء", "علبة شحن", "مقاومة للماء", "تحكم باللمس"]
    },
    {
        id: 11,
        name: "حزام جلد طبيعي",
        slug: "genuine-leather-belt",
        category: "men-fashion",
        price: 149,
        oldPrice: null,
        icon: "fa-belt",
        rating: 4.5,
        reviews: 56,
        badge: null,
        badgeText: null,
        description: "حزام جلد طبيعي فاخر مع إبزيم معدني. إضافة أنيقة لأي إطلالة.",
        images: ["fa-belt", "fa-belt", "fa-belt"],
        sizes: ["90cm", "100cm", "110cm", "120cm"],
        colors: ["بني", "أسود"],
        stock: 90,
        features: ["جلد طبيعي", "إبزيم متين", "قابل للتعديل", "تصميم كلاسيكي"]
    },
    {
        id: 12,
        name: "شاحن لاسلكي سريع",
        slug: "fast-wireless-charger",
        category: "electronics",
        price: 99,
        oldPrice: 149,
        icon: "fa-charging-station",
        rating: 4.6,
        reviews: 178,
        badge: "sale",
        badgeText: "خصم 34%",
        description: "شاحن لاسلكي سريع متوافق مع جميع الهواتف الذكية. تصميم أنيق وآمن.",
        images: ["fa-charging-station", "fa-charging-station", "fa-charging-station"],
        sizes: [],
        colors: ["أسود", "أبيض"],
        stock: 120,
        features: ["شحن سريع", "حماية من الحرارة", "متوافق مع جميع الأجهزة", "تصميم نحيف"]
    },
    // منتجات نسائية
    {
        id: 13,
        name: "فستان سهرة أنيق",
        slug: "elegant-evening-dress",
        category: "women-fashion",
        price: 599,
        oldPrice: 899,
        icon: "fa-person-dress",
        rating: 4.9,
        reviews: 89,
        badge: "sale",
        badgeText: "خصم 33%",
        description: "فستان سهرة فاخر بتصميم أنيق. مثالي للمناسبات الخاصة والحفلات.",
        images: ["fa-person-dress", "fa-person-dress", "fa-person-dress"],
        sizes: ["S", "M", "L", "XL"],
        colors: ["أسود", "أحمر", "أزرق ملكي"],
        stock: 40,
        features: ["قماش فاخر", "تصميم عصري", "مريح", "مناسب للحفلات"]
    },
    {
        id: 14,
        name: "حقيبة يد نسائية",
        slug: "women-handbag",
        category: "women-fashion",
        price: 349,
        oldPrice: 499,
        icon: "fa-handbag",
        rating: 4.7,
        reviews: 123,
        badge: "sale",
        badgeText: "خصم 30%",
        description: "حقيبة يد نسائية أنيقة مصنوعة من الجلد الفاخر. مناسبة للاستخدام اليومي.",
        images: ["fa-handbag", "fa-handbag", "fa-handbag"],
        sizes: [],
        colors: ["أسود", "بني", "وردي", "أبيض"],
        stock: 55,
        features: ["جلد فاخر", "مساحة واسعة", "أحزمة قابلة للتعديل", "إغلاق آمن"]
    },
    {
        id: 15,
        name: "طقم مجوهرات فضي",
        slug: "silver-jewelry-set",
        category: "accessories",
        price: 449,
        oldPrice: null,
        icon: "fa-gem",
        rating: 4.8,
        reviews: 67,
        badge: "new",
        badgeText: "جديد",
        description: "طقم مجوهرات من الفضة الخالصة. يتضمن عقد وأقراط وسوار.",
        images: ["fa-gem", "fa-gem", "fa-gem"],
        sizes: [],
        colors: ["فضي", "ذهبي"],
        stock: 35,
        features: ["فضة خالصة", "تصميم فاخر", "هدية مثالية", "علبة هدايا"]
    }
];

// محاكاة API
class API {
    static async getProducts(category = 'all', page = 1, limit = 8) {
        // محاكاة تأخير الشبكة
        await new Promise(resolve => setTimeout(resolve, 500));
        
        let filtered = productsData;
        if (category !== 'all') {
            filtered = productsData.filter(p => p.category === category);
        }
        
        const start = (page - 1) * limit;
        const end = start + limit;
        const paginatedProducts = filtered.slice(start, end);
        
        return {
            products: paginatedProducts,
            total: filtered.length,
            page,
            totalPages: Math.ceil(filtered.length / limit),
            hasMore: end < filtered.length
        };
    }
    
    static async getProductBySlug(slug) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const product = productsData.find(p => p.slug === slug);
        if (!product) throw new Error('المنتج غير موجود');
        return product;
    }
    
    static async getProductById(id) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const product = productsData.find(p => p.id === id);
        if (!product) throw new Error('المنتج غير موجود');
        return product;
    }
    
    static async searchProducts(query) {
        await new Promise(resolve => setTimeout(resolve, 300));
        const q = query.toLowerCase();
        return productsData.filter(p => 
            p.name.toLowerCase().includes(q) || 
            p.category.toLowerCase().includes(q) ||
            (p.description && p.description.toLowerCase().includes(q))
        );
    }
    
    static async getRelatedProducts(productId, limit = 4) {
        const product = productsData.find(p => p.id === productId);
        if (!product) return [];
        
        return productsData
            .filter(p => p.category === product.category && p.id !== productId)
            .slice(0, limit);
    }
    
    static async getUserProfile() {
        const user = localStorage.getItem('eliteUser');
        return user ? JSON.parse(user) : null;
    }
    
    static async login(email, password) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // محاكاة تسجيل الدخول
        const users = JSON.parse(localStorage.getItem('eliteUsers') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (!user) {
            throw new Error('البريد الإلكتروني أو كلمة المرور غير صحيحة');
        }
        
        const userData = { ...user };
        delete userData.password;
        localStorage.setItem('eliteUser', JSON.stringify(userData));
        
        return userData;
    }
    
    static async register(userData) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const users = JSON.parse(localStorage.getItem('eliteUsers') || '[]');
        
        if (users.find(u => u.email === userData.email)) {
            throw new Error('البريد الإلكتروني مستخدم بالفعل');
        }
        
        const newUser = {
            id: Date.now(),
            ...userData,
            createdAt: new Date().toISOString()
        };
        
        users.push(newUser);
        localStorage.setItem('eliteUsers', JSON.stringify(users));
        
        const userResponse = { ...newUser };
        delete userResponse.password;
        
        return userResponse;
    }
    
    static logout() {
        localStorage.removeItem('eliteUser');
    }
    
    static async submitOrder(orderData) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const orders = JSON.parse(localStorage.getItem('eliteOrders') || '[]');
        const order = {
            id: Date.now(),
            ...orderData,
            status: 'pending',
            createdAt: new Date().toISOString()
        };
        
        orders.push(order);
        localStorage.setItem('eliteOrders', JSON.stringify(orders));
        
        return order;
    }
}