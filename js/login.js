// Функция переключения видимости пароля
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const icon = document.querySelector('.toggle-password i');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Показ уведомлений
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    notification.style.display = 'block';

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Получение списка пользователей
function getUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
}

// Обработка формы входа
function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const users = getUsers();

    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Создаем токен авторизации
        const token = btoa(JSON.stringify({
            userId: user.email,
            name: user.name,
            exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 дней
        }));

        // Сохраняем данные в localStorage
        localStorage.setItem('auth_token', token);
        localStorage.setItem('currentUser', JSON.stringify({
            name: user.name,
            email: user.email
        }));

        showNotification('Вход выполнен успешно!');

        // Перенаправляем в личный кабинет
        setTimeout(() => {
            window.location.href = 'personal-account.html';
        }, 1000);
    } else {
        showNotification('Неверный email или пароль', 'error');
    }
}

// Проверка авторизации при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('auth_token');
    if (token) {
        try {
            const tokenData = JSON.parse(atob(token));
            if (tokenData.exp > Date.now()) {
                // Если токен действителен, перенаправляем в личный кабинет
                window.location.href = 'personal-account.html';
            }
        } catch (e) {
            localStorage.removeItem('auth_token');
        }
    }
});