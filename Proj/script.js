"use strict";

const FORM_SUBMIT_URL = "https://formcarry.com/s/STVF7PqkDUr";
const STORAGE_KEY = "contactFormData";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9\s\-()]{10,}$/;

const mobileMenuToggle = document.getElementById("mobileMenuToggle");
const mobileMenu = document.getElementById("mobileMenu");
const contactForm = document.getElementById("contactForm");
const btnSubmit = document.getElementById("btnSubmit");
const formMessage = document.getElementById("formMessage");

let messageTimer = null;

function initMobileMenu() {
    if (!mobileMenuToggle || !mobileMenu) {
        return;
    }
    
    const overlay = document.createElement("div");
    overlay.className = "mobile-menu-overlay";
    document.body.appendChild(overlay);
    
    function toggleMenu() {
        mobileMenuToggle.classList.toggle("active");
        mobileMenu.classList.toggle("active");
        overlay.classList.toggle("active");
        document.body.style.overflow = mobileMenu.classList.contains("active") ? "hidden" : "";
    }
    
    mobileMenuToggle.addEventListener("click", toggleMenu);
    overlay.addEventListener("click", toggleMenu);
    
    const mobileMenuLinks = mobileMenu.querySelectorAll("a");
    mobileMenuLinks.forEach(function(link) {
        link.addEventListener("click", function() {
            if (mobileMenu.classList.contains("active")) {
                toggleMenu();
            }
        });
    });
}

function saveFormData() {
    const formData = {
        fullName: document.getElementById("fullName").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        message: document.getElementById("message").value,
        consent: document.getElementById("consent").checked
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
}

function restoreFormData() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
        try {
            const formData = JSON.parse(savedData);
            document.getElementById("fullName").value = formData.fullName || "";
            document.getElementById("email").value = formData.email || "";
            document.getElementById("phone").value = formData.phone || "";
            document.getElementById("message").value = formData.message || "";
            document.getElementById("consent").checked = formData.consent || false;
        } catch (e) {
            console.error("Ошибка при восстановлении данных формы:", e);
        }
    }
}

function clearFormData() {
    localStorage.removeItem(STORAGE_KEY);
}

function validateFullName() {
    const fullName = document.getElementById("fullName").value.trim();
    const field = document.getElementById("fullName");
    
    if (!fullName) {
        field.style.borderColor = "#e74c3c";
        return "ФИО обязательно для заполнения";
    }
    
    field.style.borderColor = "#4CAF50";
    return null;
}

function validateEmail() {
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
    
    field.style.borderColor = "#4CAF50";
    return null;
}

function validatePhone() {
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
    
    field.style.borderColor = "#4CAF50";
    return null;
}

function validateMessage() {
    const message = document.getElementById("message").value.trim();
    const field = document.getElementById("message");
    
    if (!message) {
        field.style.borderColor = "#e74c3c";
        return "Комментарий обязателен для заполнения";
    }
    
    field.style.borderColor = "#4CAF50";
    return null;
}

function validateConsent() {
    const consent = document.getElementById("consent").checked;
    
    if (!consent) {
        return "Необходимо согласие на обработку персональных данных";
    }
    
    return null;
}

function validateForm() {
    const errors = [
        validateFullName(),
        validateEmail(),
        validatePhone(),
        validateMessage(),
        validateConsent()
    ];
    
    return errors.filter(function(error) {
        return error !== null;
    });
}

function showMessage(message, isSuccess) {
    if (messageTimer) {
        clearTimeout(messageTimer);
        messageTimer = null;
    }
    
    formMessage.textContent = message;
    formMessage.className = "form-message " + (isSuccess ? "success" : "error");
    
    if (isSuccess) {
        messageTimer = setTimeout(function() {
            hideMessage();
        }, 10000);
    }
}

function hideMessage() {
    if (messageTimer) {
        clearTimeout(messageTimer);
        messageTimer = null;
    }
    formMessage.className = "form-message";
}

function resetFieldStyles() {
    const fields = contactForm.querySelectorAll("input, textarea");
    fields.forEach(function(field) {
        field.style.borderColor = "#ddd";
    });
}

// Отправка формы
function submitForm(event) {
    event.preventDefault();
    
    const errors = validateForm();
    if (errors.length > 0) {
        showMessage(errors[0], false);
        return;
    }
    
    btnSubmit.disabled = true;
    btnSubmit.textContent = "Отправка...";
    
    setTimeout(function() {
        showMessage("Данные успешно отправлены", true);
        contactForm.reset();
        clearFormData();
        resetFieldStyles();
        btnSubmit.disabled = false;
        btnSubmit.textContent = "СВЯЖИТЕСЬ С НАМИ";
    }, 1000);
}

function initSmoothScroll() {
    const links = document.querySelectorAll("a[href^='#']");
    
    links.forEach(function(link) {
        link.addEventListener("click", function(event) {
            const href = link.getAttribute("href");
            if (href === "#" || href === "") {
                return;
            }
            
            const target = document.querySelector(href);
            if (target) {
                event.preventDefault();
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });
}

function initFAQ() {
    const faqItems = document.querySelectorAll(".faq-item");
    
    faqItems.forEach(function(item) {
        const question = item.querySelector(".faq-question");
        
        question.addEventListener("click", function() {
            const isActive = item.classList.contains("faq-active");
            
            faqItems.forEach(function(faqItem) {
                faqItem.classList.remove("faq-active");
            });
            
            if (!isActive) {
                item.classList.add("faq-active");
            }
        });
    });
}

function initReviewsCarousel() {
    const prevBtn = document.getElementById("prevReview");
    const nextBtn = document.getElementById("nextReview");
    
    if (!prevBtn || !nextBtn) {
        return;
    }
    
    let currentReview = 0;
    const reviews = [
        {
            logo: "img/logo.png",
            text: '"Отличная команда профессионалов! Работа выполнена качественно и в срок."',
            author: "— Компания CIEL"
        },
        {
            logo: "img/cableman_ru.png",
            text: '"Отличная команда профессионалов! Работа выполнена качественно и в срок."',
            author: "— Компания Cableman"
        },
        {
            logo: "img/farbors_ru.jpg",
            text: '"Отличная команда профессионалов! Работа выполнена качественно и в срок."',
            author: "— Компания Farbors"
        },
        {
            logo: "img/nashagazeta_ch.png",
            text: '"Отличная команда профессионалов! Работа выполнена качественно и в срок."',
            author: "— Компания Наша газета"
        },
        {
            logo: "img/lpcma_rus_v4.jpg",
            text: '"Отличная команда профессионалов! Работа выполнена качественно и в срок."',
            author: "— Компания LPCMA"
        }
    ];
    
    function updateReview() {
        const reviewCard = document.querySelector(".review-card");
        if (reviewCard && reviews[currentReview]) {
            const review = reviews[currentReview];
            reviewCard.querySelector(".review-logo img").src = review.logo;
            reviewCard.querySelector(".review-text").textContent = review.text;
            reviewCard.querySelector(".review-author").textContent = review.author;
        }
    }
    
    updateReview();
    
    if (prevBtn) {
        prevBtn.addEventListener("click", function() {
            currentReview = (currentReview - 1 + reviews.length) % reviews.length;
            updateReview();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener("click", function() {
            currentReview = (currentReview + 1) % reviews.length;
            updateReview();
        });
    }
}

function initHeroButton() {
    const heroBtn = document.getElementById("heroTariffsBtn");
    
    if (heroBtn) {
        heroBtn.addEventListener("click", function() {
            const tariffsSection = document.getElementById("tariffs");
            if (tariffsSection) {
                tariffsSection.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", function() {
    initMobileMenu();
    initSmoothScroll();
    initFAQ();
    initReviewsCarousel();
    initHeroButton();
    restoreFormData();
    
    const fullNameField = document.getElementById("fullName");
    const emailField = document.getElementById("email");
    const phoneField = document.getElementById("phone");
    const messageField = document.getElementById("message");
    
    if (fullNameField) {
        fullNameField.addEventListener("blur", validateFullName);
    }
    if (emailField) {
        emailField.addEventListener("blur", validateEmail);
    }
    if (phoneField) {
        phoneField.addEventListener("blur", validatePhone);
    }
    if (messageField) {
        messageField.addEventListener("blur", validateMessage);
    }
    
    if (contactForm) {
        contactForm.addEventListener("input", saveFormData);
        const consentField = document.getElementById("consent");
        if (consentField) {
            consentField.addEventListener("change", saveFormData);
        }
        
        contactForm.addEventListener("submit", submitForm);
        
        contactForm.setAttribute("novalidate", "novalidate");
    }
});

