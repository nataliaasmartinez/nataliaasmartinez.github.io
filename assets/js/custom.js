document.addEventListener('DOMContentLoaded', () => {

    const contactForm = document.getElementById('contactForm');
    const submitButton = document.getElementById('submitBtn');
    const phoneInput = document.getElementById('phone');
    const formContainer = contactForm ? contactForm.parentNode : null;
    const FIXED_PREFIX = '+370 6';
    const MAX_MOBILE_DIGITS = 8;

    if (!contactForm || !formContainer || !phoneInput) {
        console.error('One or more form elements not found.');
        return;
    }

    submitButton.disabled = true;

    // ----- RESULTS BOX -----
    const resultsContainer = document.getElementById('formResult');

    // ----- POPUP -----
    const confirmationPopup = document.getElementById('successPopup');

    // ----- VALIDATION RULES -----
    const validationRules = {
        name: {
            required: true,
            pattern: /^[A-Za-zÀ-ÿ\s'-]+$/,
            error: 'Name can only contain letters.'
        },
        surname: {
            required: true,
            pattern: /^[A-Za-zÀ-ÿ\s'-]+$/,
            error: 'Surname can only contain letters.'
        },
        email: {
            required: true,
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            error: 'Invalid email format.'
        },
        phone: {
            required: true,
            pattern: /^\+370\s6\d{2}\s\d{5}$/,
            error: 'Format must be +370 6xx xxxxx.'
        },
        address: {
            required: true,
            minlength: 5,
            error: 'Address must have at least 5 characters.'
        }
    };

    // ----- VALIDATION FUNCTION -----
    function validateField(input) {
        const { id, value } = input;
        const rule = validationRules[id];
        const errorDisplay = document.getElementById(`${id}-error`);

        if (!rule) return true;

        let isValid = true;
        let errorMessage = '';

        if (rule.required && !value.trim()) {
            isValid = false;
            errorMessage = 'This field is required.';
        } else if (rule.pattern && !rule.pattern.test(value.trim())) {
            isValid = false;
            errorMessage = rule.error;
        } else if (rule.minlength && value.trim().length < rule.minlength) {
            isValid = false;
            errorMessage = rule.error;
        }

        if (isValid) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
            if (errorDisplay) errorDisplay.textContent = '';
        } else {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            if (errorDisplay) errorDisplay.textContent = errorMessage;
        }

        return isValid;
    }

    function checkFormValidity() {
        let isValid = true;

        for (const id in validationRules) {
            const input = document.getElementById(id);
            if (input && !validateField(input)) {
                isValid = false;
            }
        }

        document.querySelectorAll('.rating-input').forEach(input => {
            if (!input.checkValidity()) isValid = false;
        });

        submitButton.disabled = !isValid;
    }

    // ----- PHONE MASK -----
    phoneInput.setAttribute('maxlength', 15);

    if (!phoneInput.value.startsWith(FIXED_PREFIX)) {
        phoneInput.value = FIXED_PREFIX + ' ';
    }

    phoneInput.addEventListener('keydown', (event) => {
        const key = event.key;

        if (['ArrowLeft', 'ArrowRight', 'Tab', 'Backspace', 'Delete', 'Home', 'End'].includes(key)) {
            return;
        }

        if (key === ' ' || key === '+') {
            event.preventDefault();
            return;
        }

        if (!/^\d$/.test(key)) {
            event.preventDefault();
            return;
        }

        const digitsOnly = phoneInput.value.replace(/\D/g, '');

        if (digitsOnly.length >= FIXED_PREFIX.replace(/\D/g, '').length + MAX_MOBILE_DIGITS) {
            event.preventDefault();
        }
    });

    phoneInput.addEventListener('input', () => {
        if (!phoneInput.value.startsWith(FIXED_PREFIX)) {
            phoneInput.value = FIXED_PREFIX + ' ';
        }

        let digitsOnly = phoneInput.value.replace(/\D/g, '');
        digitsOnly = digitsOnly.slice(0, FIXED_PREFIX.replace(/\D/g, '').length + MAX_MOBILE_DIGITS);

        let formatted = FIXED_PREFIX;
        const extraDigits = digitsOnly.slice(FIXED_PREFIX.replace(/\D/g, '').length);

        if (extraDigits.length > 0) {
            formatted += ' ' + extraDigits.slice(0, 2);
        }
        if (extraDigits.length > 2) {
            formatted += ' ' + extraDigits.slice(2);
        }

        phoneInput.value = formatted;
        validateField(phoneInput);
        checkFormValidity();
    });

    // ----- EVENTS FOR VALIDATION -----
    Object.keys(validationRules).forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', () => {
                validateField(input);
                checkFormValidity();
            });
        }
    });

    document.querySelectorAll('.rating-input').forEach(input => {
        input.addEventListener('input', () => {
            if (input.value < 1) input.value = 1;
            if (input.value > 10) input.value = 10;
            checkFormValidity();
        });
    });

    // ----- SUBMISSION RESULT -----
    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();

        checkFormValidity();

        if (submitButton.disabled) {
            return;
        }

        const data = {
            name: document.getElementById('name').value.trim(),
            surname: document.getElementById('surname').value.trim(),
            email: document.getElementById('email').value.trim(),
            phone: document.getElementById('phone').value.trim(),
            address: document.getElementById('address').value.trim(),
            rating1: Number(document.getElementById('rate1').value),
            rating2: Number(document.getElementById('rate2').value),
            rating3: Number(document.getElementById('rate3').value)
        };

        console.log(data);

        const avg = ((data.rating1 + data.rating2 + data.rating3) / 3).toFixed(1);

        let color = 'green';
        if (avg < 4) {
            color = 'red';
        } else if (avg <= 7) {
            color = 'orange';
        }

        resultsContainer.innerHTML = `
            <h4>Submission Results</h4>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Surname:</strong> ${data.surname}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <p><strong>Address:</strong> ${data.address}</p>
            <p style="margin-top:10px; color:${color}; font-weight:bold;">
                ${data.name} ${data.surname}: ${avg}
            </p>
        `;

        confirmationPopup.classList.add('show');
        setTimeout(() => confirmationPopup.classList.remove('show'), 2500);
    });

});

