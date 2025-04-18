document.addEventListener('DOMContentLoaded', function() {
    // Set current year in footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();

    // Form submission handling
    const form = document.getElementById('sellForm');
    const formStatus = document.getElementById('formStatus');
    const submitBtn = document.getElementById('submitBtn');

    if (form) {
        form.addEventListener('submit', async function(event) {
            event.preventDefault();
            
            submitBtn.disabled = true;
            submitBtn.textContent = 'Submitting...';
            formStatus.style.display = 'none';

            try {
                const formData = new FormData(form);
                
                const response = await fetch(form.action, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    formStatus.textContent = 'Thank you for your submission! We will contact you soon.';
                    formStatus.className = 'form-status success';
                    formStatus.style.display = 'block';
                    form.reset();
                } else {
                    throw new Error('Form submission failed');
                }
            } catch (error) {
                console.error('Error:', error);
                formStatus.textContent = 'There was a problem with your submission. Please try again or contact us directly.';
                formStatus.className = 'form-status error';
                formStatus.style.display = 'block';
            } finally {
                submitBtn.disabled = false;
                submitBtn.textContent = 'Submit';
                
                // Scroll to show status message
                formStatus.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }

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
    const itemDescription = categoryElement.querySelector('.description').textContent;
    const itemPrice = categoryElement.querySelector('.price').textContent;

    const bidAmount = prompt(`Enter your bid for ${itemName} (${itemPrice}):`);
    
    if (bidAmount) {
        const subject = `Bid for ${itemName}`;
        const body = `Hello CHRONICS EMPIRE,\n\nI would like to place a bid for:\n\n` +
                     `Item: ${itemName}\nDescription: ${itemDescription}\n` +
                     `Asking Price: ${itemPrice}\nMy Bid: KES ${bidAmount}\n\n` +
                     `Please let me know if my bid is acceptable.\n\nThank you.`;
        
        window.location.href = `mailto:danychege28@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
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