document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const successMessage = document.getElementById('successMessage');
    const passwordInput = document.getElementById('password');
    const emailInput = document.getElementById('email');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const loginBtn = form.querySelector('.login-btn');

    // ── Password Toggle ───────────────────────────────────
    const toggle = document.getElementById('passwordToggle');
    const eyeIcon = document.querySelector('.eye-icon');

    if (toggle) {
        toggle.addEventListener('click', function () {
            const isPassword = passwordInput.type === 'password';
            passwordInput.type = isPassword ? 'text' : 'password';
            eyeIcon.classList.toggle('show-password', isPassword);
        });
    }

    // ── Validasi Real-time saat mengetik ──────────────────
    emailInput.addEventListener('input', () => {
        if (emailInput.value.trim() !== '') clearError(emailInput, emailError);
    });

    passwordInput.addEventListener('input', () => {
        if (passwordInput.value.trim() !== '') clearError(passwordInput, passwordError);
    });

    // ── Submit Form ───────────────────────────────────────
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Jalankan validasi dari validation.js
        const isValid = validateLoginForm(emailInput, passwordInput, emailError, passwordError);
        if (!isValid) return;

        // Loading state
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;

        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        try {
            const response = await sendLoginRequest(email, password);
            await handleLoginResponse(response, successMessage);
        } catch (error) {
            console.error(error);
            showError(passwordInput, passwordError, 'Email atau password salah.');
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
        }
    });
});