document.getElementById('sellForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const formData = new FormData();
    formData.append('itemName', document.getElementById('itemName').value);
    formData.append('itemDescription', document.getElementById('itemDescription').value);

    const files = document.getElementById('itemImages').files;
    for (let i = 0; i < files.length; i++) {
        formData.append('itemImages', files[i]);
    }

    fetch('http://localhost:5000/api/items', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        alert('Item submitted successfully');
        console.log(data);
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

function buyItem(button) {
    // Find the parent category container
    const categoryElement = button.closest('.category');

    // Get the item's category, description, and price
    const category = categoryElement.querySelector('h3').innerText;
    const description = categoryElement.querySelector('.description').innerText.replace('Description: ', '');
    const price = categoryElement.querySelector('.price').innerText.replace('Asking Price: ', '');

    // Seller's email
    const sellerEmail = "danychege28@gmail.com";

    // Construct the email subject and body
    const subject = `Inquiry to Buy ${category}`;
    const body = `Hello,\n\nI am interested in buying the following item:\n\nCategory: ${category}\nDescription: ${description}\nPrice: ${price}\n\nPlease let me know how to proceed.\n\nThank you.`;

    // Open the email client with the pre-filled details
    window.location.href = `mailto:${sellerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// Function to handle bidding on an item
function bidItem(button) {
    // Get the parent category element
    const categoryElement = button.closest('.category');

    // Extract item details
    const itemName = categoryElement.querySelector('h3').innerText;
    const itemDescription = categoryElement.querySelector('.description').innerText.replace('Description: ', '');
    const itemPrice = categoryElement.querySelector('.price').innerText.replace('Asking Price: ', '');

    // Prompt the client to enter their bid amount
    const bidAmount = prompt(`Enter your bid for ${itemName} (${itemPrice}):`);

    if (bidAmount) {
        // Seller's email
        const sellerEmail = "danychege28@gmail.com";

        // Construct the email subject and body
        const subject = `Bid for ${itemName}`;
        const body = `Hello,\n\nI would like to place a bid for the following item:\n\n` +
                     `Item Name: ${itemName}\nDescription: ${itemDescription}\n` +
                     `Asking Price: ${itemPrice}\nMy Bid: KES ${bidAmount}\n\n` +
                     `Please let me know if my bid is accepted.\n\nThank you.`;

        // Open the email client with the pre-filled details
        window.location.href = `mailto:${sellerEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    } else {
        alert('Bid canceled.');
    }
}
