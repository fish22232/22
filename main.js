import products from './products.js';

// Отображение товаров
function displayProducts(productsToShow = products) {
    const container = document.getElementById('productsContainer');
    container.innerHTML = productsToShow.map(product => `
        <div class="product-card" data-category="${product.category}">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">${product.price.toLocaleString('ru-RU')} ₸</div>
                <div class="product-actions">
                    <button class="details-btn" onclick="showDetails(${product.id})">
                        <i class="fas fa-info-circle"></i> Подробнее
                    </button>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> В корзину
                    </button>
                    <button class="add-to-wishlist-btn" onclick="addToWishlist(${product.id})">
                        <i class="fas fa-heart"></i> В избранное
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Показ деталей товара
function showDetails(productId) {
    const product = products.find(p => p.id === productId);
    const modal = document.createElement('div');
    modal.className = 'product-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <button class="close-modal" onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
            <div class="modal-body">
                <img src="${product.image}" alt="${product.name}">
                <div class="modal-info">
                    <h2>${product.name}</h2>
                    <p>${product.description}</p>
                    <div class="specs">
                        <h3>Характеристики:</h3>
                        ${Object.entries(product.specs).map(([key, value]) => `
                            <div class="spec-item">
                                <span class="spec-name">${key}:</span>
                                <span class="spec-value">${value}</span>
                            </div>
                        `).join('')}
                    </div>
                    <div class="modal-price">${product.price.toLocaleString('ru-RU')} ₸</div>
                    <button class="add-to-cart-btn" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i> В корзину
                    </button>
                    <button class="add-to-wishlist-btn" onclick="addToWishlist(${product.id})">
                        <i class="fas fa-heart"></i> В избранное
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

// Добавление в корзину
function addToCart(productId) {
    // Проверка авторизации
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const authToken = localStorage.getItem('auth_token');
    if (!currentUser || !authToken) {
        showAddedToCartAnimation('Войдите в аккаунт, чтобы добавить товар в корзину', true);
        return;
    }
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const product = products.find(p => p.id === productId);
    const existingItem = cartItems.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({...product, quantity: 1});
    }
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
    showAddedToCartAnimation();
}

// Обновление счетчика корзины
function updateCartCount() {
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    const count = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = count;
}

// Анимация добавления в корзину
function showAddedToCartAnimation(message = 'Товар добавлен в корзину', isError = false) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    notification.style.background = isError ? '#e74c3c' : '#2ecc71';
    notification.style.position = 'fixed';
    notification.style.left = '50%';
    notification.style.bottom = '60px';
    notification.style.transform = 'translateX(-50%)';
    notification.style.zIndex = '3000';
    notification.style.padding = '18px 32px';
    notification.style.borderRadius = '10px';
    notification.style.fontSize = '17px';
    notification.style.boxShadow = '0 4px 16px rgba(44,62,80,0.15)';
    notification.style.color = '#fff';
    notification.style.opacity = '0.98';
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 2500);
}

// Фильтрация по категориям
function initCategoryFilters() {
    document.querySelectorAll('.category-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const category = e.target.dataset.category;
            const filteredProducts = category === 'all' 
                ? products 
                : products.filter(p => p.category === category);
            displayProducts(filteredProducts);
        });
    });
}

// Сортировка товаров
function sortProducts(type) {
    let sortedProducts = [...products];
    switch(type) {
        case 'price-asc':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-desc':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'brand':
            sortedProducts.sort((a, b) => a.brand.localeCompare(b.brand));
            break;
        case 'popular':
            sortedProducts.sort((a, b) => (b.popular || 0) - (a.popular || 0));
            break;
        case 'new':
            sortedProducts.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
            break;
    }
    displayProducts(sortedProducts);
}

// Поиск товаров
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (!searchInput) return;
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredProducts = products.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm)
        );
        displayProducts(filteredProducts);
    });
}

// Боковое меню
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('active');
}

// Избранное (wishlist)
function addToWishlist(productId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        showAddedToCartAnimation('Войдите, чтобы добавить в избранное', true);
        return;
    }
    const email = currentUser.email;
    let wishlist = JSON.parse(localStorage.getItem('wishlist_' + email) || '[]');
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem('wishlist_' + email, JSON.stringify(wishlist));
        showAddedToCartAnimation('Добавлено в избранное');
    } else {
        showAddedToCartAnimation('Уже в избранном', '#f39c12');
    }
}

function removeFromWishlist(productId) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return;
    const email = currentUser.email;
    let wishlist = JSON.parse(localStorage.getItem('wishlist_' + email) || '[]');
    wishlist = wishlist.filter(id => id !== productId);
    localStorage.setItem('wishlist_' + email, JSON.stringify(wishlist));
}

function getWishlist() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return [];
    const email = currentUser.email;
    return JSON.parse(localStorage.getItem('wishlist_' + email) || '[]');
}

// Отзывы и рейтинги (заглушка, UI и хранение реализовать отдельно)
function addReview(productId, rating, text) {
    let reviews = JSON.parse(localStorage.getItem('reviews_' + productId) || '[]');
    reviews.push({rating, text, date: Date.now()});
    localStorage.setItem('reviews_' + productId, JSON.stringify(reviews));
}

function getReviews(productId) {
    return JSON.parse(localStorage.getItem('reviews_' + productId) || '[]');
}

// Инициализация страницы
function initPage() {
    displayProducts();
    updateCartCount();
    initCategoryFilters();
    initSearch();
}

// Экспорт функций для глобального использования
window.addToCart = addToCart;
window.showDetails = showDetails;
window.toggleSidebar = toggleSidebar;
window.sortProducts = sortProducts;
window.addToWishlist = addToWishlist;
window.removeFromWishlist = removeFromWishlist;
window.getWishlist = getWishlist;

// Запуск инициализации при загрузке страницы
document.addEventListener('DOMContentLoaded', initPage);