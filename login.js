document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault(); // Prevent form from refreshing

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const errorMessage = document.getElementById('errorMessage');

    // Clear previous error messages
    errorMessage.innerText = '';

    // 🔹 Prevent empty fields
    if (!username || !password) {
        errorMessage.innerText = '⚠️ Please enter both username and password.';
        return;
    }

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const result = await response.json();

        if (result.success) {
            localStorage.setItem('loggedIn', 'true'); // Store login state
            window.location.href = 'index.html'; // ✅ Redirect to career page
        } else {
            errorMessage.innerText = '❌ Invalid username or password!';
        }
    } catch (error) {
        console.error('Login Error:', error);
        errorMessage.innerText = '⚠️ Server error! Please try again later.';
    }
});

// ✅ Toggle Password Visibility (Optional Feature)
document.getElementById('togglePassword').addEventListener('click', function () {
    const passwordField = document.getElementById('password');
    passwordField.type = passwordField.type === 'password' ? 'text' : 'password';
});


