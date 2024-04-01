


async function fetchAndDisplayOrders() {
    const ordersContainer = document.getElementById('orders-container'); // Ensure this is in your HTML

    // Clear existing orders display
    while (ordersContainer.firstChild) {
        ordersContainer.removeChild(ordersContainer.firstChild);
    }

    try {
        const ordersSnapshot = await db.collection('orders').get();
        const orders = [];
        ordersSnapshot.forEach(doc => {
            const order = doc.data();
            order.id = doc.id; // Optionally capture the document ID if needed
            orders.push(order);
        });

        // Update the total orders count
        ordersSummaryText.innerHTML = `${orders.length}`;

        // Sort orders by 'datePurchased' in descending order (most recent first)
        orders.sort((a, b) => b.datePurchased - a.datePurchased);

        // After sorting, build the order blocks
        orders.forEach(async (order) => {
            const customerEmail = await fetchCustomerEmailById(order.customerID); // Fetch customer email

            // Aggregate chair numbers
            let chairNumbers = order.cartItems
                .filter(item => item.chairIndex !== undefined)
                .map(item => `Chair ${item.chairIndex}`)
                .join(', ');

            // Build an order block for each product item
            order.cartItems.forEach((item) => {
                if (item.title !== undefined) {
                    buildOrderBlock(item.title, item.image, item.quantity, order.totalCost, order.datePurchased, customerEmail, chairNumbers);
                }
            });
        });
    } catch (error) {
        console.error("Error fetching orders: ", error);
    }
}




function buildOrderBlock(title, image, quantity, total, dateOrdered, customerEmail, chairNumbers) {
    let orderRowContainer = createDOMElement('div', 'row-container', '', document.getElementById('orders-container'));

    // Product Image and Title
    let productBlock = createDOMElement('div', 'text-div-20', '', orderRowContainer);
    createDOMElement('img', 'product-image', image, productBlock);
    createDOMElement('div', 'text-light', title, productBlock);

    // Quantity
    let quantityBlock = createDOMElement('div', 'text-div-10', '', orderRowContainer);
    createDOMElement('div', 'text-light', `${quantity}`, quantityBlock);

    // Total Cost - Rounded to 2 decimal places
    let roundedTotal = parseFloat(total).toFixed(2); // Round the total to 2 decimal places
    let totalBlock = createDOMElement('div', 'text-div-10', '', orderRowContainer);
    createDOMElement('div', 'text-light', `$${roundedTotal}`, totalBlock);

    // Date Ordered - Format the date
    let formattedDate = new Date(dateOrdered * 1000).toLocaleDateString("en-US"); // Convert Unix timestamp to Date and format
    let dateOrderedBlock = createDOMElement('div', 'text-div-20', '', orderRowContainer);
    createDOMElement('div', 'text-light', `${formattedDate}`, dateOrderedBlock);

    // Customer Email
    let customerEmailBlock = createDOMElement('div', 'text-div-30', '', orderRowContainer);
    createDOMElement('div', 'text-light', `${customerEmail}`, customerEmailBlock);

    // Chair Numbers
    let chairNumberBlock = createDOMElement('div', 'text-div-10', '', orderRowContainer);
    createDOMElement('div', 'text-light', `${chairNumbers}`, chairNumberBlock);
}




async function fetchCustomerEmailById(customerID) {
    // Placeholder for fetching customer email by ID
    // Example:
    const customerDoc = await db.collection('users').doc(customerID).get();
    if (customerDoc.exists) {
        return customerDoc.data().email; // Assuming 'email' is the field name
    } else {
        return 'No Email Found'; // Fallback
    }
}

fetchAndDisplayOrders()
