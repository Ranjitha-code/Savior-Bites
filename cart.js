function addToCart(category) {
    const cartData = JSON.parse(localStorage.getItem('cartData')) || [];
//    const inputs = document.querySelectorAll(`input[data-product]`);
    const inputs = document.querySelectorAll(`input[data-category="${category}"]`);


    inputs.forEach(input => {
        // Get the product's name and price
        const productName = input.dataset.product;
        const price = parseInt(input.dataset.price);

        // Parse the current input value as the new quantity
        const newQuantity = parseInt(input.value);

        // Check if the product already exists in the cart
        const existingProduct = cartData.find(item => item.product === productName);

        if (existingProduct) 
        {
            // If the new quantity is different, update the cart
            if (existingProduct.quantity !== newQuantity) 
            {
                if (newQuantity > 0) 
                {
                    existingProduct.quantity = newQuantity; // Update the quantity
                } 
                else 
                {
                        // Remove the product if the new quantity is 0
                    const productIndex = cartData.indexOf(existingProduct);
                    if (productIndex > -1) 
                    {
                        cartData.splice(productIndex, 1);
                    }
                }
            }
        } 
        else if (newQuantity > 0) 
        {
            // Add a new product to the cart if it doesn't already exist and quantity > 0
            cartData.push({ product: productName, price: price, quantity: newQuantity });
        }
    });

    // Save updated cart data back to localStorage
    localStorage.setItem('cartData', JSON.stringify(cartData));

    // Optional: Log the updated cart data for debugging
   // console.log('Updated cartData:', cartData);

   displayCartItems();
}


function displayCartItems() {
    const cartData = JSON.parse(localStorage.getItem('cartData')) || [];
    const cartItemsContainer = document.getElementById('cart-container');
    const cartItemsContainerMobile = document.getElementById('cart-container-mobile');

    // Ensure cartData is an array
    if (!Array.isArray(cartData)) {
        console.error('cartData is not an array. Initializing as an empty array.');
        cartData = []; 
    }

    // Clear existing items in both containers
    cartItemsContainer.innerHTML = '';
    cartItemsContainerMobile.innerHTML = '';

    // Initialize total variable
    let total = 0;

    // Start building the table structure
    let cartItemHTML = `
    <div style="overflow-x: auto;"> <!-- Enable horizontal scroll for small screens -->
        <table style="width: 100%; table-layout: fixed;"> <!-- Fixed layout to prevent shrinking -->
            <thead>
                <tr>
                    <th style="width: 30%; text-align: left; padding: 8px;">Product</th> <!-- Adjust width as needed -->
                    <th style="width: 20%; text-align: center;">Price</th>
                    <th style="width: 15%; text-align: center;">Quantity</th>
                    <th style="width: 20%; text-align: center;">Subtotal</th>
                    <th style="width: 15%; text-align: center;">Action</th>
                </tr>
            </thead>
            <tbody>
`;

// Check if the cart is empty
if (cartData.length === 0) {
    const emptyCartMessage = `
        <p style="font-size: 2em; display: flex; min-height: 150px; align-items: center; justify-content: center;">
            Your cart is empty!
        </p>
    `;
    cartItemsContainer.innerHTML = emptyCartMessage;
    cartItemsContainerMobile.innerHTML = emptyCartMessage;
    updateCartQuantity();
    return;
} else {
    cartData.forEach((item, index) => {
        const subtotal = item.price * item.quantity;
        total += subtotal;

        cartItemHTML += `
            <tr>
                <td style="max-width: 150px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                    ${item.product}&nbsp;
                </td>
                <td style="text-align: center;"> ₹${item.price}&nbsp;</td>
                <td style="text-align: center;">${item.quantity}&nbsp;</td>
                <td style="text-align: center;">₹${subtotal}</td>
                <td style="text-align: center;">
                    <button class="remove-btn" onclick="removeFromCart(${index})">×</button>
                </td>
            </tr>
        `;
    });
}

// Close the table structure
cartItemHTML += `
            </tbody>
        </table>
    </div>
`;

// Add the total and checkout button in the cart-footer section if the cart is not empty
if (cartData.length > 0) {
    cartItemHTML += `
        <div class="cart-footer">
            <h2><strong>Total: ₹${total}</strong></h2>
            <button type="button" class="elementor-button" onclick="window.location.href='checkout.html';" style="margin-top: 10px;">
                Checkout
            </button>
        </div>
    `;
}

    // Display the table and footer in both desktop and mobile containers
    cartItemsContainer.innerHTML = cartItemHTML;
    cartItemsContainerMobile.innerHTML = cartItemHTML;

    // Store the total in localStorage for access on the checkout page
    localStorage.setItem('cartTotal', total);

    updateCartQuantity(); // Update the cart quantity display
}



// update the cart quantity above Cart Icon 

function updateCartQuantity() {
    const cartData = JSON.parse(localStorage.getItem('cartData')) || [];
    const totalQuantity = cartData.reduce((acc, item) => acc + item.quantity, 0); // Calculate total quantity
    
    // Select all elements with the cart quantity display class
    const cartQuantityDisplays = document.querySelectorAll('.elementor-button-icon-qty');
    
    // Update each display with the calculated total quantity
    cartQuantityDisplays.forEach(display => {
        display.textContent = totalQuantity;
    });
}



// Initialize cart on page load

/*document.addEventListener('DOMContentLoaded', displayCartItems); */


// Initialize cart on page load

document.addEventListener('DOMContentLoaded', () => {
    /*console.log('DOMContentLoaded event fired'); for error checking purpose*/
    displayCartItems();
    updateCartQuantity(); // Set initial quantity display on page load
});



// Function to remove items from cart

function removeFromCart(index) {
    const cartData = JSON.parse(localStorage.getItem('cartData')) || [];
    cartData.splice(index, 1);                                                          // Remove the item at the specified index
    localStorage.setItem('cartData', JSON.stringify(cartData));                        // Update localStorage
    displayCartItems();                                                               // Refresh the cart display
}



// Toggle Cart Sidebar

/*
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    cartSidebar.classList.toggle('open');
}
*/

function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartSidebarMobile = document.getElementById('cart-sidebar-mobile');
    const isCartOpen = document.body.classList.contains('cart-open');
    
    // Check screen width to apply responsive behavior
    if (window.innerWidth <= 1024) {
        // Mobile screen behavior
        document.body.classList.toggle('cart-open', !isCartOpen);
        cartSidebarMobile.classList.toggle('open');
    } else {
        // Laptop/Desktop screen behavior
        cartSidebar.classList.toggle('open');
    }
}


//Checkout


document.addEventListener('DOMContentLoaded', () => {
    // Retrieve and display the cart total on the checkout page
    const cartTotal = localStorage.getItem('cartTotal') || 0;
    document.getElementById('cart-total').textContent = cartTotal;
});

// Check if each field is valid using reportValidity()
function validateForm() {
    const nameField = document.getElementById('form-field-fullname');
    const phoneField = document.getElementById('form-field-PhoneNo');
    const addressField = document.getElementById('form-field-address');
    const pincodeField = document.getElementById('form-field-pincode');

    if (!nameField.value.trim()) {
        nameField.setCustomValidity("Please enter your full name.");
    } else {
        nameField.setCustomValidity("");
    }
    if (!phoneField.value.trim()) {
        phoneField.setCustomValidity("Please enter your 10-digit phone number.");
    } else {
        phoneField.setCustomValidity("");
    }
    if (!addressField.value.trim()) {
        addressField.setCustomValidity("Please enter your address.");
    } else {
        addressField.setCustomValidity("");
    }
    if (!pincodeField.value.trim()) {
        pincodeField.setCustomValidity("Please enter your 6-digit pin code.");
    } else {
        pincodeField.setCustomValidity("");
    }

    return nameField.reportValidity() && phoneField.reportValidity() &&
           addressField.reportValidity() && pincodeField.reportValidity();
}

// Function to initiate payment via PhonePe
function initiatePayment() {
    const totalAmount = localStorage.getItem('cartTotal');
    const upiLink = `upi://pay?pa=amithalex5251@oksbi&pn=YourName&am=${totalAmount}&cu=INR`;
    window.location.href = upiLink;
}

// Function to clear the cart
function clearCart() {
/*    localStorage.removeItem('cartData');
    localStorage.removeItem('cartTotal');
    document.getElementById('cart-container').innerHTML = '';
    document.getElementById('cart-total').textContent = '0';    */
    alert("Thank you for your purchase!");
}

// Function to send an email using EmailJS
function sendEmail(billingDetails, cartData, totalAmount) {
    const templateParams = {
        user_name: billingDetails.name,
        user_phone: billingDetails.phone,
        user_address: billingDetails.address,
        user_pincode: billingDetails.pincode,
        cart_data: JSON.stringify(cartData, null, 2), // Formats cart data nicely in the email
        total_amount: totalAmount
    };

    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", templateParams)
    .then(response => {
        console.log("Email sent successfully:", response.status, response.text);
    })
    .catch(error => console.error("Failed to send email:", error));
}

// Function to handle the checkout process
function checkout() {
    if (!validateForm()) return;

    const cartData = JSON.parse(localStorage.getItem('cartData')) || [];
    const billingDetails = {
        name: document.getElementById('form-field-fullname').value,
        phone: document.getElementById('form-field-PhoneNo').value,
        address: document.getElementById('form-field-address').value,
        pincode: document.getElementById('form-field-pincode').value
    };
    const totalAmount = localStorage.getItem('cartTotal');

    fetch('/checkout', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ cartData, billingDetails }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Checkout data sent:', data);
        alert('Order placed successfully! Now proceeding to payment.');

        // Send confirmation email after checkout
        sendEmail(billingDetails, cartData, totalAmount);

        // Initiate payment
        initiatePayment();

        // Clear the cart after checkout and payment initiation
        clearCart();
    })
    .catch(error => console.error('Error:', error));
}

// Attach checkout function to Place Order button
document.getElementById('place_order').addEventListener('click', (e) => {
    e.preventDefault();
    checkout();
});
