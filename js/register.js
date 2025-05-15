function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

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

function handleRegister(e) {
    e.preventDefault();

    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        showNotification('Пароли не совпадают', 'error');
        return;
    }

    // Получаем существующих пользователей
    const users = JSON.parse(localStorage.getItem('users') || '[]');

    // Проверяем, не существует ли уже пользователь с таким email
    if (users.some(user => user.email === email)) {
        showNotification('Пользователь с таким email уже существует', 'error');
        return;
    }

    // Создаем нового пользователя
    const newUser = {
        name: name,
        surname: surname,
        email: email,
        password: password
    };

    // Добавляем пользователя в хранилище
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    showNotification('Регистрация успешна!');

    // Перенаправляем на страницу входа
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}