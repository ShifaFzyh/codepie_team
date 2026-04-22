// ── Helper: Tampilkan Error ───────────────────────────────
function showError(input, errorEl, message) {
    input.closest('.form-group').classList.add('error');
    errorEl.textContent = message;
    errorEl.classList.add('show');
}

// ── Helper: Hapus Error ───────────────────────────────────
function clearError(input, errorEl) {
    input.closest('.form-group').classList.remove('error');
    errorEl.textContent = '';
    errorEl.classList.remove('show');
}

// ── Validasi Email ────────────────────────────────────────
function validateEmail(emailInput, emailError) {
    const email = emailInput.value.trim();

    if (!email) {
        showError(emailInput, emailError, 'Email tidak boleh kosong.');
        return false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showError(emailInput, emailError, 'Format email tidak valid.');
        return false;
    }

    clearError(emailInput, emailError);
    return true;
}

// ── Validasi Password ─────────────────────────────────────
function validatePassword(passwordInput, passwordError) {
    const password = passwordInput.value.trim();

    if (!password) {
        showError(passwordInput, passwordError, 'Password tidak boleh kosong.');
        return false;
    } else if (password.length < 5) {
        showError(passwordInput, passwordError, 'Password minimal 5 karakter.');
        return false;
    }

    clearError(passwordInput, passwordError);
    return true;
}

// ── Validasi Form Keseluruhan ─────────────────────────────
function validateLoginForm(emailInput, passwordInput, emailError, passwordError) {
    const isEmailValid = validateEmail(emailInput, emailError);
    const isPasswordValid = validatePassword(passwordInput, passwordError);
    return isEmailValid && isPasswordValid;
}