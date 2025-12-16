const btnOpenForm = document.querySelector(".btn-open-form");
const formOverlay = document.getElementById("formOverlay");
const btnClose = document.getElementById("btnClose");
const feedbackForm = document.getElementById("feedbackForm");
const btnSubmit = document.getElementById("btnSubmit");
const formMessage = document.getElementById("formMessage");

const STORAGE_KEY = "feedbackFormData";
const FORM_SUBMIT_URL = "https://formcarry.com/s/STVF7PqkDUr";
let isFormOpen = false;
let messageTimer = null;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9\s\-()]{10,}$/;

function openForm() {
    "use strict";
    formOverlay.style.display = "flex";
    isFormOpen = true;
    history.pushState({formOpen: true}, "", "#feedback-form");
    restoreFormData();
}

function closeForm() {
    "use strict";
    formOverlay.style.display = "none";
    isFormOpen = false;
    if (history.state && history.state.formOpen) {
        history.back();
    }
    hideMessage();
}

function saveFormData() {
    "use strict";
    const formData = {
        consent: document.getElementById("consent").checked,
        email: document.getElementById("email").value,
        fullName: document.getElementById("fullName").value,
        message: document.getElementById("message").value,
        organization: document.getElementById("organization").value,
        phone: document.getElementById("phone").value
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
}

function restoreFormData() {
    "use strict";
    const savedData = localStorage.getItem(STORAGE_KEY);
    let organizationField;
    
    if (savedData) {
        const formData = JSON.parse(savedData);
        
        document.getElementById("fullName").value = formData.fullName || "";
        document.getElementById("email").value = formData.email || "";
        document.getElementById("phone").value = formData.phone || "";
        organizationField = document.getElementById("organization");
        organizationField.value = formData.organization || "";
        document.getElementById("message").value = formData.message || "";
        document.getElementById("consent").checked = formData.consent || false;
    }
}

function clearFormData() {
    "use strict";
    localStorage.removeItem(STORAGE_KEY);
}

function showMessage(message, isSuccess) {
    "use strict";
    let className;
    
    if (messageTimer) {
        clearTimeout(messageTimer);
        messageTimer = null;
    }
    formMessage.textContent = message;
    className = "message " + (isSuccess ? "success" : "error") +
        " message-visible";
    formMessage.className = className;
    if (isSuccess) {
        messageTimer = setTimeout(function () {
            hideMessage();
        }, 10000);
    }
}

function hideMessage() {
    "use strict";
    if (messageTimer) {
        clearTimeout(messageTimer);
        messageTimer = null;
    }
    formMessage.classList.remove("message-visible");
}

function validateFullName() {
    "use strict";
    const fullName = document.getElementById("fullName").value.trim();
    const field = document.getElementById("fullName");
    
    if (!fullName) {
        field.style.borderColor = "#e74c3c";
        return "ФИО обязательно для заполнения";
    }
    
    field.style.borderColor = "#2ecc71";
    return null;
}

function validateEmail() {
    "use strict";
    const email = document.getElementById("email").value.trim();
    const field = document.getElementById("email");
    
    if (!email) {
        field.style.borderColor = "#e74c3c";
        return "Email обязателен для заполнения";
    }
    
    if (!EMAIL_REGEX.test(email)) {
        field.style.borderColor = "#e74c3c";
        return "Введите корректный email адрес";
    }
    
    field.style.borderColor = "#2ecc71";
    return null;
}

function validatePhone() {
    "use strict";
    const phone = document.getElementById("phone").value.trim();
    const field = document.getElementById("phone");
    if (!phone) {
        field.style.borderColor = "#e74c3c";
        return "Телефон обязателен для заполнения";
    }
    if (!PHONE_REGEX.test(phone)) {
        field.style.borderColor = "#e74c3c";
        return "Телефон должен содержать только цифры и +";
    }
    field.style.borderColor = "#2ecc71";
    return null;
}

function validateOrganization() {
    "use strict";
    const organization = document.getElementById("organization").value.trim();
    const field = document.getElementById("organization");
    
    if (!organization) {
        field.style.borderColor = "#e74c3c";
        return "Организация обязательна для заполнения";
    }
    field.style.borderColor = "#2ecc71";
    return null;
}

function validateMessage() {
    "use strict";
    const message = document.getElementById("message").value.trim();
    const field = document.getElementById("message");
    
    if (!message) {
        field.style.borderColor = "#e74c3c";
        return "Сообщение обязательно для заполнения";
    }
    field.style.borderColor = "#2ecc71";
    return null;
}

function validateConsent() {
    "use strict";
    const consent = document.getElementById("consent").checked;
    const field = document.getElementById("consent");
    
    if (!consent) {
        field.parentElement.style.color = "#e74c3c";
        return "Необходимо согласие";
    }
    
    field.parentElement.style.color = "#2c3e50";
    return null;
}

function validateForm() {
    "use strict";
    const errors = [
        validateFullName(),
        validateEmail(),
        validatePhone(),
        validateOrganization(),
        validateMessage(),
        validateConsent()
    ];
    
    return errors.filter(function (error) {
        return error !== null;
    });
}

async function submitForm(event) {
    "use strict";
    event.preventDefault();
    const errors = validateForm();
    
    if (errors.length > 0) {
        showMessage(errors[0], false);
        return;
    }
    btnSubmit.disabled = true;
    btnSubmit.textContent = "Отправка...";
    const formData = new FormData(feedbackForm);
    
    console.log("Отправка данных на Formcarry...");
    const response = await fetch(FORM_SUBMIT_URL, {
        body: formData,
        method: "POST"
    });
    
    console.log("Статус ответа:", response.status);
    if (response.status !== 0) { 
        console.log("Данные успешно доставлены на Formcarry!");
        showMessage("Данные успешно отправлены", true);
        feedbackForm.reset();
        clearFormData();
        resetFieldStyles();
        
    } else {
        console.error("Сетевая ошибка");
        showMessage("Ошибка отправки данных", false);
    }
    btnSubmit.disabled = false;
    btnSubmit.textContent = "Отправить";
}

function resetFieldStyles() {
    "use strict";
    const fields = feedbackForm.querySelectorAll("input, textarea");
    let i = 0;
    
    while (i < fields.length) {
        fields[i].style.borderColor = "#ddd";
        i += 1;
    }
    document.getElementById("consent").parentElement.style.color = "#2c3e50";
}

btnOpenForm.addEventListener("click", openForm);
btnClose.addEventListener("click", closeForm);
feedbackForm.addEventListener("submit", submitForm);

feedbackForm.addEventListener("input", saveFormData);
document.getElementById("fullName").addEventListener("blur", validateFullName);
document.getElementById("email").addEventListener("blur", validateEmail);
document.getElementById("phone").addEventListener("blur", validatePhone);
document.getElementById("organization").addEventListener("blur", validateOrganization);
document.getElementById("message").addEventListener("blur", validateMessage);
document.getElementById("consent").addEventListener("change", validateConsent);
document.getElementById("consent").addEventListener("change", saveFormData);

window.addEventListener("popstate", function () {
    "use strict";
    if (isFormOpen) {
        closeForm();
    }
});
formOverlay.addEventListener("click", function (event) {
    "use strict";
    if (event.target === formOverlay) {
        closeForm();
    }
});
document.addEventListener("DOMContentLoaded", function () {
    "use strict";
    if (window.location.hash === "#feedback-form") {
        openForm();
    }
});
feedbackForm.setAttribute("novalidate", "novalidate");