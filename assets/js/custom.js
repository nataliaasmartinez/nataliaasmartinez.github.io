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
        const name = input.id;
        const value = input.value.trim();
        const rules = validationRules[name];
        let isValid = true;
        let errorMessage = '';

        if (!rules) return true;

        if (rules.required && value === '') {
            isValid = false;
            errorMessage = 'This field is required.';
        } else if (rules.pattern && !rules.pattern.test(value)) {
            isValid = false;
            errorMessage = rules.error;
        } else if (rules.minlength && value.length < rules.minlength) {
            isValid = false;
            errorMessage = rules.error;
        }

        const errorId = `error-${name}`;
        let errorDisplay = document.getElementById(errorId);

        if (!errorDisplay) {
            errorDisplay = document.createElement('small');
            errorDisplay.id = errorId;
            errorDisplay.className = 'error-message-text';
            input.parentNode.appendChild(errorDisplay);
        }

        if (isValid) {
            input.classList.add('is-valid');
            input.classList.remove('is-invalid');
            errorDisplay.textContent = '';
        } else {
            input.classList.add('is-invalid');
            input.classList.remove('is-valid');
            errorDisplay.textContent = errorMessage;
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
        phoneInput.value = FIXED_PREFIX;
    }

    phoneInput.addEventListener('input', function () {

        let digits = this.value.substring(FIXED_PREFIX.length)
            .replace(/\D/g, '')
            .substring(0, MAX_MOBILE_DIGITS);

        let masked = FIXED_PREFIX;

        if (digits.length > 0) masked += digits.substring(0, 2);
        if (digits.length > 2) masked += ' ' + digits.substring(2, 7);

        this.value = masked;

        // **ESTO ES LO QUE ESTABA ROTO — AHORA CORREGIDO**
        this.selectionStart = this.selectionEnd = this.value.length;
    });

    phoneInput.addEventListener('blur', function () {
        if (this.value === FIXED_PREFIX) {
            this.value = '';
            this.classList.remove('is-valid');
        }
    });

    contactForm.addEventListener('input', checkFormValidity);

    // ----- SUBMIT -----
    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();

        const data = {
            name: document.getElementById('name').value,
            surname: document.getElementById('surname').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            rating1: Number(document.getElementById('rate1').value),
            rating2: Number(document.getElementById('rate2').value),
            rating3: Number(document.getElementById('rate3').value)

        };

        console.log(data);

        const avg = ((data.rating1 + data.rating2 + data.rating3) / 3).toFixed(1);

        let color = 'red';
        if (avg > 4 && avg <= 7) color = 'orange';
        if (avg > 7) color = 'green';

        resultsContainer.innerHTML = `
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

