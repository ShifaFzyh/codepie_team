// ===============================
// FORM UTILS
// ===============================

// ambil value input
function getInputValue(id) {
    const el = document.getElementById(id);
    return el ? el.value.trim() : "";
}

// kirim request login
async function sendLoginRequest(email, password) {
    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
    });

    return response;
}

// handle response dari server
async function handleLoginResponse(response, successMessage) {
    if (response.redirected) {
        successMessage.classList.add('show');

        setTimeout(() => {
            window.location.href = response.url;
        }, 1000);
    } else {
        const text = await response.text();
        alert(text);
    }
}