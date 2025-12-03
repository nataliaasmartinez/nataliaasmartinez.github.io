document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const submitButton = document.getElementById('submit-button');
    const phoneInput = document.getElementById('phone');
    const formContainer = contactForm ? contactForm.parentNode : null;
    const FIXED_PREFIX = '+370 6';
    const MAX_MOBILE_DIGITS = 8; // The 6xx xxxxx part

    if (!contactForm || !formContainer || !phoneInput) {
        // Essential elements must exist
        console.error('One or more form elements not found.');
        return;
    }
    
    // Disable the submit button initially
    submitButton.disabled = true;

    // --- DOM Elements for Result Display & Popup (Omitted for brevity, but exist) ---
    const resultsContainer = document.getElementById('submission-results-container') || document.createElement('div');
    if (!document.getElementById('submission-results-container')) {
        resultsContainer.id = 'submission-results-container';
        resultsContainer.style.cssText = 'margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); text-align: left; max-width: 600px; margin: 20px auto 0 auto;';
        formContainer.appendChild(resultsContainer);
    }
    
    const confirmationPopup = document.getElementById('submission-confirmation') || document.createElement('div');
    if (!document.getElementById('submission-confirmation')) {
        confirmationPopup.id = 'submission-confirmation';
        confirmationPopup.textContent = 'Form submitted successfully!';
        document.body.appendChild(confirmationPopup);
    }
    
    // --- Validation Rules (Required for Task) ---
    const validationRules = {
        name: { 
            required: true, 
            pattern: /^[A-Za-zА-Яа-я\s'-]+$/, 
            error: 'Name can only contain letters, spaces, or hyphens.'
        },
        surname: { 
            required: true, 
            pattern: /^[A-Za-zА-Яа-я\s'-]+$/, 
            error: 'Surname can only contain letters, spaces, or hyphens.'
        },
        email: { 
            required: true, 
            pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
            error: 'Invalid email format (e.g., user@example.com).' 
        },
        phone: {
            required: true,
            pattern: /^\+370\s6\d{2}\s\d{5}$/, 
            error: 'Invalid format. Must be +370 6xx xxxxx.'
        },
        address: {
            required: true,
            minlength: 5, 
            error: 'Address must be at least 5 characters long.'
        }
    };

    // --- Validation Function (Omitted for brevity, but needed) ---
    function validateField(input) {
        // ... (validateField logic must be present here) ...
        const fieldName = input.id;
        const value = input.value.trim();
        const rules = validationRules[fieldName];
        let isValid = true;
        let errorMessage = '';

        if (!rules) return true;

        if (rules.required && value === '') {
            isValid = false;
            errorMessage = 'This field is required.';
        } 
        else if (rules.pattern && !rules.pattern.test(value)) {
            isValid = false;
            errorMessage = rules.error;
        } 
        else if (rules.minlength && value.length < rules.minlength) {
            isValid = false;
            errorMessage = rules.error;
        }
        
        // --- Visible Feedback ---
        const errorElementId = `error-${fieldName}`;
        let errorDisplay = document.getElementById(errorElementId);

        if (!errorDisplay) {
            errorDisplay = document.createElement('small');
            errorDisplay.id = errorElementId;
            errorDisplay.className = 'error-message-text';
            input.parentNode.appendChild(errorDisplay);
        }

        if (isValid) {
            input.classList.remove('is-invalid');
            input.classList.add('is-valid');
            errorDisplay.textContent = '';
        } else {
            input.classList.remove('is-valid');
            input.classList.add('is-invalid');
            errorDisplay.textContent = errorMessage;
        }

        return isValid;
    }
    
    // --- Total Form Validity Check ---
    function checkFormValidity() {
        // ... (checkFormValidity logic remains the same) ...
        let isFormValid = true;
        
        for (const fieldId in validationRules) {
            const input = document.getElementById(fieldId);
            if (input && !validateField(input)) {
                isFormValid = false;
            }
        }
        
        const ratingInputs = document.querySelectorAll('.rating-input');
        ratingInputs.forEach(input => {
             if (!input.checkValidity()) {
                 isFormValid = false;
             }
        });
        
        submitButton.disabled = !isFormValid;
    }

    // --- FINAL PHONE MASKING LOGIC (The definitive fix) ---
    if (phoneInput) {
        phoneInput.setAttribute('maxlength', 15);
        
        // Ensure initial value is set correctly
        if (!phoneInput.value.startsWith(FIXED_PREFIX)) {
             phoneInput.value = FIXED_PREFIX;
        }

        phoneInput.addEventListener('input', function(e) {
            let start = this.selectionStart;
            let end = this.selectionEnd;

            // 1. Remove non-digits from the input, keeping only the 8 mobile digits
            let digits = this.value.substring(FIXED_PREFIX.length).replace(/\D/g, '').substring(0, MAX_MOBILE_DIGITS); 
            
            let maskedValue = FIXED_PREFIX;

            // 2. Apply the 'xx xxxxx' mask
            if (digits.length > 0) {
                // First 2 digits (xx)
                maskedValue += digits.substring(0, 2); 
            }
            if (digits.length > 2) {
                // Add space and next 5 digits (xxxxx)
                maskedValue += ' ' + digits.substring(2, 7);
            }
            
            this.value = maskedValue;

            // 3. Ensure cursor stays at the end (simplest way to handle masking and cursor)
            this.selectionStart = this.selectionEnd = maskedValue.length;

            validateField(this);
            checkFormValidity();
        });

        // Prevent deletion of the prefix
        phoneInput.addEventListener('keydown', function(e) {
            if (e.target.selectionStart <= FIXED_PREFIX.length && (e.key === 'Backspace' || e.key === 'Delete')) {
                e.preventDefault();
            }
        });

        // Initial validation run
        validateField(phoneInput);
        checkFormValidity();
    }

    // --- Attach Real-time Validation Listeners ---
    const fieldsToValidate = ['name', 'surname', 'email', 'address'];
    fieldsToValidate.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener('input', function() {
                validateField(this);
                checkFormValidity();
            });
            validateField(input);
        }
    });
    
    // Initial check on load to set the button state
    checkFormValidity();
    
    // --- Form Submission (Omitted for brevity, but exists) ---
    contactForm.addEventListener('submit', function(event) {
        // ... (Submit logic remains the same) ...
        event.preventDefault();

        checkFormValidity();
        if (submitButton.disabled) {
            alert("Please correct the errors in the form before submitting.");
            return;
        }

        const formData = new FormData(contactForm);
        let data = {};
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        // Task 1: Print the object in the browser console
        console.groupCollapsed('--- FORM SUBMISSION DATA OBJECT ---');
        console.log(data); 
        console.groupEnd();

        // Calculate the average rating (Task 2 & 3)
        const rating1 = +data.rating1 || 0; 
        const rating2 = +data.rating2 || 0;
        const rating3 = +data.rating3 || 0;
        
        const sum = rating1 + rating2 + rating3;
        const average = (sum / 3).toFixed(1);

        let colorClass = '';
        if (average >= 7) {
            colorClass = 'average-green';
        } else if (average >= 4) {
            colorClass = 'average-orange';
        } else {
            colorClass = 'average-red';
        }
        
        // Display the data list
        let dataListHTML = '<h4 style="text-align: center; border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 10px;">Submission Details</h4><ul style="list-style-type: none; padding-left: 0; max-width: 400px; margin: 0 auto; text-align: left;">';
        
        const labels = {
            name: 'Name', surname: 'Surname', email: 'Email', phone: 'Phone number', 
            address: 'Address', rating1: 'Design Rating', rating2: 'Usefulness Rating', 
            rating3: 'Clarity Rating'
        };

        for (const key in data) {
            const label = labels[key] || key;
            dataListHTML += `<li style="margin-bottom: 5px;"><strong>${label}:</strong> ${data[key]}</li>`;
        }
        dataListHTML += '</ul>';

        const userName = `${data.name} ${data.surname}`;
        const averageHTML = `<p style="margin-top: 15px; font-size: 1.2em; text-align: center;">
            <strong>${userName}:</strong> <span class="average-display ${colorClass}">${average}</span>
        </p>`;

        resultsContainer.innerHTML = dataListHTML + averageHTML;

        // Show a success confirmation (Task 4)
        confirmationPopup.style.display = 'block';
        
        setTimeout(() => {
            confirmationPopup.style.display = 'none';
        }, 3000); 

        // Reset the form and validation state
        contactForm.reset();
        document.querySelectorAll('.is-valid, .is-invalid').forEach(el => el.classList.remove('is-valid', 'is-invalid'));
        document.querySelectorAll('.error-message-text').forEach(el => el.textContent = '');
        checkFormValidity();
    });
});
