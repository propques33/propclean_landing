document.addEventListener('DOMContentLoaded', () => {
    // Counter Functionality
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const increment = target / 200;

            if (count < target) {
                counter.innerText = Math.ceil(count + increment);
                setTimeout(updateCount, 20);
            } else {
                counter.innerText = target.toLocaleString();
            }
        };
        updateCount();
    });

    // Modal Functionality
    const emailInput = document.getElementById('emailInput');
    const sendOtpButton = document.getElementById('sendOtpButton');
    const otpInput = document.getElementById('otpInput');
    const verifyOtpButton = document.getElementById('verifyOtpButton');
    const emailVerificationForm = document.getElementById('emailVerificationForm');
    const otpVerificationForm = document.getElementById('otpVerificationForm');
    const emailInputMain = document.getElementById('emailInputMain'); // Read-only email in the main form
    let generatedOtp = ''; // Store generated OTP
    let verifiedEmail = ''; 
    const formModal = document.getElementById('formModal');
    const startTrialLink = document.getElementById('startTrialButton');
    const bookTrialLink = document.getElementById('bookTrialButton');
    const closeButton = document.querySelector('.close-button');
    const demoForm = document.getElementById('demoForm');
    const thankYouSection = document.getElementById('thankYouSection');
    const goHomeBtn = document.getElementById('goHomeBtn');

    thankYouSection.style.display = 'none'; 

    // Function to open the modal
    function openModal(event) {
        event.preventDefault(); // Prevent link navigation
        formModal.style.display = 'flex'; // Ensure modal is displayed
    }

    // Function to close the modal
    function closeModal() {
        formModal.style.display = 'none';
        thankYouSection.style.display = 'none'; 
    }

    // Function to generate a random 6-digit OTP
    function generateOtp() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Function to send OTP to email using EmailJS
    async function sendOtpToEmail(email) {
        generatedOtp = generateOtp(); // Generate OTP
        const templateParams = {
            to_email: email,
            otp: generatedOtp, // Pass OTP to the template
        };

        try {
            const emailResponse = await emailjs.send(
                'service_vf8hgx9', // Your EmailJS service ID
                'template_pnxo1sz', // Your EmailJS OTP template ID
                templateParams
            );
            console.log('OTP sent successfully!', emailResponse.status, emailResponse.text);
            alert('OTP sent to your email.');

            // Show the OTP verification form
            otpVerificationForm.style.display = 'block';

        } catch (error) {
            console.error('Error sending OTP:', error);
            alert('Failed to send OTP. Please try again.');
        }
    }

    // Send OTP when "Verify Email" button is clicked
    sendOtpButton.addEventListener('click', (event) => {
        event.preventDefault();
        const email = emailInput.value.trim();

        if (email && email.includes('@')) {
            if (email !== verifiedEmail) {
                // If email has changed, send OTP and reset previous verification
                sendOtpToEmail(email);
            } else {
                alert('This email is already verified.');
            }
        } else {
            alert('Please enter a valid email.');
        }
    });

    // Function to verify the OTP
    function verifyOtp(userOtp) {
        if (userOtp === generatedOtp) {
            alert('OTP verified successfully!');
            verifiedEmail = emailInput.value.trim(); // Store the verified email

            // Hide OTP verification form and show the main form
            otpVerificationForm.style.display = 'none';
            emailVerificationForm.style.display = 'none';
            demoForm.style.display = 'block';

            // Set the verified email in the readonly email field
            emailInputMain.value = verifiedEmail;

        } else {
            alert('Invalid OTP. Please try again.');
        }
    }

    // Verify OTP when the "Verify OTP" button is clicked
    verifyOtpButton.addEventListener('click', (event) => {
        event.preventDefault();
        const userOtp = otpInput.value.trim();
        verifyOtp(userOtp);
    });

    // Function to reset the form if the email changes (to re-verify the email)
    emailInput.addEventListener('input', () => {
        // Reset the verified email if the email field is modified
        if (verifiedEmail && emailInput.value.trim() !== verifiedEmail) {
            otpVerificationForm.style.display = 'none';
            demoForm.style.display = 'none';
            verifiedEmail = ''; // Clear the verified email status
        }
    });

    // Event listeners for links
    startTrialButton.addEventListener('click', openModal);
    bookTrialButton.addEventListener('click', openModal);
    closeButton.addEventListener('click', closeModal);

    // Close modal on clicking outside of it
    window.addEventListener('click', (event) => {
        if (event.target === formModal) {
            closeModal();
        }
    });

    // Send Email on Form Submission
    demoForm.addEventListener('submit', async(event) => {
        event.preventDefault(); // Prevent page reload
        
        // Get current date in desired format (e.g., YYYY-MM-DD)
        const leadDate = new Date().toISOString().split('T')[0];

        const templateParams = {
            name: demoForm.name.value,
            company: demoForm.company.value,
            email: demoForm.email.value,
            contact: demoForm.contact.value,
            city: demoForm.city.value,
            country: demoForm.country.value,
            num_properties: demoForm.num_properties.value,
            pms: demoForm.pms.value,
            lead_date: leadDate
        };

        try {
            // Step 1: Send data via EmailJS
            const emailResponse = await emailjs.send(
                'service_vf8hgx9',  // Replace with your actual EmailJS service ID
                'template_2dw0krc', // Replace with your actual EmailJS template ID
                templateParams
            );
            // console.log('EmailJS Success!', emailResponse.status, emailResponse.text);
            // alert('Email sent successfully!');

            // Step 2: Send data to Make Webhook
            const webhookURL = 'https://hook.eu2.make.com/6ywydf77dknp53aefb43er7vscenifri'; // Replace with your actual Make Webhook URL
            const webhookResponse = await fetch(webhookURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(templateParams),
            });

            if (webhookResponse.ok) {
                console.log('Data sent to Make successfully!');
                // alert('Form submitted successfully!');
            } else {
                throw new Error('Failed to send data to Make.');
            }

            // Reset the form and close the modal after successful submission
             // Step 3: Show the Thank You section after successful submission
            //  formModal.style.display = 'none'; // Close the form modal
            //  thankYouSection.style.display = 'flex';
            window.location.href = 'thankyou.html';

        } catch (error) {
            console.error('Error during submission:', error);
            alert('Failed to submit the form. Please try again.');
        }
    });
    goHomeBtn.addEventListener('click', () => {
        thankYouSection.style.display = 'none'; // Hide Thank You section
    });
});

        // Use EmailJS to send the email
//         emailjs.send('service_vf8hgx9', 'template_2dw0krc', templateParams)
//             .then((response) => {
//                 console.log('SUCCESS!', response.status, response.text);
//                 alert('Email sent successfully!');
//                 demoForm.reset(); // Reset the form after submission
//                 closeModal(); // Close the modal after sending
//             })
//             .catch((error) => {
//                 console.error('Email sending failed:', error);
//                 alert('Failed to send email. Please try again.');
//             });
//     });
// });