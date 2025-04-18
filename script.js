document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Form Submission Handler
document.getElementById('sellForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const form = this;
    const submitBtn = document.getElementById('submitBtn');
    const formStatus = document.getElementById('formStatus');
    
    // UI Feedback
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    formStatus.textContent = '';
    formStatus.className = '';

    try {
        const formData = new FormData(form);
        
        // Add Formspree-specific fields
        formData.append('_replyto', formData.get('email')); // Auto-reply field
        formData.append('_cc', 'danychege28@gmail.com'); // CC your email
        
        const response = await fetch(form.action, {
            method: 'POST',
            body: formData,
            headers: {
                'Accept': 'application/json'
            }
        });

        if (response.ok) {
            formStatus.textContent = '✅ Thank you! Your submission was received. We\'ll contact you soon.';
            formStatus.className = 'form-status success';
            form.reset();
        } else {
            const error = await response.json();
            throw new Error(error.error || 'Submission failed. Please try again.');
        }
    } catch (error) {
        console.error('Form error:', error);
        formStatus.textContent = `❌ Error: ${error.message}`;
        formStatus.className = 'form-status error';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit';
    }
});

// File Upload Handler for Formspree
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('sellForm');
    const fileInput = document.getElementById('itemImages');
    const formStatus = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');

    // Client-side file validation (5MB limit)
    if (fileInput) {
        fileInput.addEventListener('change', function() {
            const files = this.files;
            let isValid = true;
            
            for (let file of files) {
                if (file.size > 5 * 1024 * 1024) { // 5MB in bytes
                    formStatus.textContent = `❌ ${file.name} is too large (max 5MB)`;
                    formStatus.className = 'form-status error';
                    isValid = false;
                    this.value = ''; // Clear invalid files
                    break;
                }
                
                if (!file.type.match('image.*')) {
                    formStatus.textContent = `❌ ${file.name} is not an image file`;
                    formStatus.className = 'form-status error';
                    isValid = false;
                    this.value = '';
                    break;
                }
            }
            
            if (isValid && files.length > 0) {
                formStatus.textContent = `✅ ${files.length} file(s) ready to upload`;
                formStatus.className = 'form-status success';
            }
        });
    }

    // Form submission handler
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // UI Feedback
            submitBtn.disabled = true;
            submitBtn.textContent = 'Uploading...';
            formStatus.textContent = '⏳ Uploading files, please wait...';
            formStatus.className = 'form-status';

            try {
                const formData = new FormData(form);
                
                // Required Formspree file upload headers
                formData.append('_file_options', JSON.stringify({
                    formspree: "_self",
                    size: 5 * 1024 * 1024 // 5MB limit
                }));
                
                formData.append('_subject', 'New Item Submission with Images');
                formData.append('_replyto', formData.get('email'));

                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                const result = await response.json();

                if (response.ok) {
                    formStatus.innerHTML = `
                        ✅ Success!<br>
                        We've received ${fileInput.files.length} image(s).<br>
                        We'll contact you at ${formData.get('email')} soon.
                    `;
                    formStatus.className = 'form-status success';
                    form.reset();
                } else {
                    throw new Error(result.error || 'Upload failed');
                }
            } catch (error) {
                console.error('Upload error:', error);
                formStatus.innerHTML = `
                    ❌ Error: ${error.message}<br>
                    Please try again or contact us directly.
                `;
                formStatus.className = 'form-status error';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit';
            }
        });
    }
});

// Image preview function (optional)
function setupImagePreviews() {
    const fileInput = document.getElementById('itemImages');
    const previewContainer = document.createElement('div');
    previewContainer.className = 'image-previews';
    fileInput.after(previewContainer);

    fileInput.addEventListener('change', function() {
        previewContainer.innerHTML = '';
        Array.from(this.files).forEach(file => {
            if (!file.type.match('image.*')) return;
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const preview = document.createElement('div');
                preview.className = 'image-preview';
                preview.innerHTML = `
                    <img src="${e.target.result}" alt="Preview">
                    <span>${file.name}</span>
                `;
                previewContainer.appendChild(preview);
            }
            reader.readAsDataURL(file);
        });
    });
}

// Call this if you want image previews
// setupImagePreviews();

    
    // Bid Form Submission
    document.getElementById('bidForm').addEventListener('submit', async function(e) {
        e.preventDefault();

        const form = this;
        const submitBtn = document.getElementById('bidSubmitBtn');
        const formStatus = document.getElementById('bidFormStatus');

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
        formStatus.textContent = '';

        try {
            const formData = new FormData(form);
            const response = await fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                formStatus.textContent = '✅ Bid submitted successfully!';
                formStatus.className = 'form-status success';
                form.reset();
            } else {
                throw new Error('Submission failed.');
            }
        } catch (err) {
            formStatus.textContent = `❌ Error: ${err.message}`;
            formStatus.className = 'form-status error';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit Bid';
        }
    });


    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});


function bidItem(button) {
    const categoryElement = button.closest('.category');
    const itemName = categoryElement.querySelector('h3').textContent;
    const itemPrice = categoryElement.querySelector('.price').textContent;

    document.getElementById('bidItemName').value = itemName;
    document.getElementById('bidItemPrice').value = itemPrice;

    document.getElementById('bidModal').style.display = 'flex';
}

function closeBidModal() {
    document.getElementById('bidModal').style.display = 'none';
}


function changeImage(thumbnailElement, newImageSrc) {
    // Remove active class from all thumbnails
    const thumbnails = thumbnailElement.parentElement.querySelectorAll('.thumbnail');
    thumbnails.forEach(thumb => thumb.classList.remove('active'));
    
    // Add active class to clicked thumbnail
    thumbnailElement.classList.add('active');
    
    // Change main image
    const mainImageContainer = thumbnailElement.closest('.image-gallery').querySelector('.main-image');
    mainImageContainer.innerHTML = `<img src="${newImageSrc}" alt="${thumbnailElement.alt}" loading="lazy">`;
    
    // Add hover effect to new image
    mainImageContainer.querySelector('img').style.transition = 'transform 0.5s ease';
    mainImageContainer.querySelector('img').addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.03)';
    });
    mainImageContainer.querySelector('img').addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });
}