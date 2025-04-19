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

// Load items when page opens
document.addEventListener('DOMContentLoaded', function() {
    loadItems();
    setupAdminPanel();
  });
  
  // ======================
  // ADMIN PANEL FUNCTIONS
  // ======================
  
  function setupAdminPanel() {
    const form = document.getElementById('adminItemForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      addItemViaAdmin();
    });
    refreshItemsList();
  }
  
  function addItemViaAdmin() {
    // Get form values
    const title = document.getElementById('adminItemTitle').value;
    const price = parseFloat(document.getElementById('adminItemPrice').value);
    const description = document.getElementById('adminItemDesc').value;
    const imageFiles = document.getElementById('adminItemImages').files;
  
    // Validate
    if (!title || !price || !description || imageFiles.length === 0) {
      alert("Please fill all fields and upload at least one image!");
      return;
    }
  
    // Convert images to Base64
    const imagePromises = Array.from(imageFiles).map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });
  
    // Save item
    Promise.all(imagePromises).then(images => {
      const newItem = {
        title,
        price,
        description,
        images
      };
  
      const existingItems = JSON.parse(localStorage.getItem('marketplaceItems')) || [];
      existingItems.push(newItem);
      localStorage.setItem('marketplaceItems', JSON.stringify(existingItems));
  
      // Refresh displays
      loadItems();
      refreshItemsList();
      document.getElementById('adminItemForm').reset();
    });
  }
  
  function refreshItemsList() {
    const items = JSON.parse(localStorage.getItem('marketplaceItems')) || [];
    const container = document.getElementById('itemsList');
    container.innerHTML = '';
  
    items.forEach((item, index) => {
      const itemDiv = document.createElement('div');
      itemDiv.style.background = 'rgba(255,255,255,0.1)';
      itemDiv.style.padding = '10px';
      itemDiv.style.margin = '5px 0';
      itemDiv.style.borderRadius = '5px';
      itemDiv.style.display = 'flex';
      itemDiv.style.justifyContent = 'space-between';
      
      itemDiv.innerHTML = `
        <div>
          <strong>${item.title}</strong> (KES ${item.price})
        </div>
        <button onclick="deleteItem(${index})" style="background: #ff4444; color: white; border: none; padding: 2px 10px; border-radius: 3px; cursor: pointer;">Delete</button>
      `;
      container.appendChild(itemDiv);
    });
  }
  
  function deleteItem(index) {
    const items = JSON.parse(localStorage.getItem('marketplaceItems')) || [];
    items.splice(index, 1);
    localStorage.setItem('marketplaceItems', JSON.stringify(items));
    loadItems();
    refreshItemsList();
  }
  function deleteItem(index) {
    if (!confirm("Permanently delete this item?")) return;
    
    // Rest of the delete logic...
  }
  
  // ======================
  // MAIN PAGE FUNCTIONS
  // ======================
  
  function loadItems() {
    const storedItems = localStorage.getItem('marketplaceItems');
    if (storedItems) {
      const items = JSON.parse(storedItems);
      renderItems(items);
    }
  }
  
  function renderItems(items) {
    const categoryList = document.querySelector('.category-list');
    if (!categoryList) return;
    
    categoryList.innerHTML = items.map(item => `
      <div class="category">
        <h3>${item.title}</h3>
        <div class="image-gallery">
          <div class="main-image">
            <img src="${item.images[0]}" alt="${item.title}" loading="lazy">
          </div>
          <div class="thumbnail-container">
            ${item.images.map(img => `
              <img src="${img}" alt="${item.title}" class="thumbnail" onclick="changeImage(this, '${img}')">
            `).join('')}
          </div>
        </div>
        <p class="description">${item.description}</p>
        <p class="price">KES ${item.price.toLocaleString()}</p>
        <button onclick="bidItem(this)">Bid</button>
      </div>
    `).join('');
  }

  // Add these functions:

// 1. Delete Function (Fixed)
function deleteItem(index) {
    if (!confirm("Delete this item permanently?")) return;
    
    let items = JSON.parse(localStorage.getItem('marketplaceItems')) || [];
    
    // Remove the item
    items.splice(index, 1);
    
    // Save back to storage
    localStorage.setItem('marketplaceItems', JSON.stringify(items));
    
    // Refresh displays
    loadItems();
    refreshItemsList();
  }
  
  // 2. Refresh Item List (Fixed)
  function refreshItemsList() {
    const items = JSON.parse(localStorage.getItem('marketplaceItems')) || [];
    const container = document.getElementById('itemsList');
    container.innerHTML = '';
  
    items.forEach((item, index) => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'admin-item';
      itemDiv.innerHTML = `
        <span>${item.title} (KES ${item.price})</span>
        <button onclick="deleteItem(${index})">Delete</button>
      `;
      container.appendChild(itemDiv);
    });
  }
  
//   // 3. Initialize Admin Panel
function initAdminPanel() {
    document.addEventListener('keydown', (e) => {
      // Ctrl+Shift+D combination
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
        const panel = document.getElementById('adminPanel');
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
        refreshItemsList();
        e.preventDefault(); // Prevent browser "bookmark" shortcut
      }
    });
  }
  
  // Call this when page loads
  document.addEventListener('DOMContentLoaded', function() {
    loadItems();
    initAdminPanel();
  });


// 1. Edit Button in Item List
function refreshItemsList() {
    const items = JSON.parse(localStorage.getItem('marketplaceItems')) || [];
    const container = document.getElementById('itemsList');
    container.innerHTML = '';
  
    items.forEach((item, index) => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'admin-item';
      itemDiv.innerHTML = `
        <span>${item.title} (KES ${item.price})</span>
        <div>
          <button onclick="startEdit(${index})">Edit</button>
          <button onclick="deleteItem(${index})">Delete</button>
        </div>
      `;
      container.appendChild(itemDiv);
    });
  }
  
  // 2. Start Editing an Item
  function startEdit(index) {
    const items = JSON.parse(localStorage.getItem('marketplaceItems')) || [];
    const item = items[index];
    
    document.getElementById('editItemIndex').value = index;
    document.getElementById('editItemTitle').value = item.title;
    document.getElementById('editItemPrice').value = item.price;
    document.getElementById('editItemDesc').value = item.description;
    
    document.getElementById('editItemForm').style.display = 'block';
    document.getElementById('itemsList').style.display = 'none';
  }
  
  // 3. Cancel Editing
  function cancelEdit() {
    document.getElementById('editItemForm').style.display = 'none';
    document.getElementById('itemsList').style.display = 'block';
    document.getElementById('editForm').reset();
  }
  
  // 4. Save Edited Item
  document.getElementById('editForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const index = document.getElementById('editItemIndex').value;
    const title = document.getElementById('editItemTitle').value;
    const price = parseFloat(document.getElementById('editItemPrice').value);
    const description = document.getElementById('editItemDesc').value;
    const imageFiles = document.getElementById('editItemImages').files;
  
    const items = JSON.parse(localStorage.getItem('marketplaceItems')) || [];
    const item = items[index];
  
    // Update basic fields
    item.title = title;
    item.price = price;
    item.description = description;
  
    // Process new images if added
    if (imageFiles.length > 0) {
      const imagePromises = Array.from(imageFiles).map(file => {
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target.result);
          reader.readAsDataURL(file);
        });
      });
  
      Promise.all(imagePromises).then(newImages => {
        item.images = [...item.images, ...newImages].slice(0, 3); // Keep max 3 images
        saveAndRefresh(items);
      });
    } else {
      saveAndRefresh(items);
    }
  });
  
  function saveAndRefresh(items) {
    localStorage.setItem('marketplaceItems', JSON.stringify(items));
    loadItems();
    refreshItemsList();
    cancelEdit();
  }