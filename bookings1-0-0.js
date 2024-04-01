




async function fetchAndDisplayChairReservations() {
    const bookingsContainer = document.getElementById('bookings-container'); // Ensure this is in your HTML

    // Clear existing bookings display
    while (bookingsContainer.firstChild) {
        bookingsContainer.removeChild(bookingsContainer.firstChild);
    }

    try {
        const ordersSnapshot = await db.collection('orders').get();
        let chairReservations = [];
        ordersSnapshot.forEach(doc => {
            const order = doc.data();
            // Filter for chair reservations and extract necessary details
            const chairs = order.cartItems.filter(item => item.chairIndex !== undefined);
            if (chairs.length > 0) {
                chairs.forEach(chair => {
                    chairReservations.push({
                        chairIndex: chair.chairIndex,
                        startDate: chair.startDate, // Start date as Unix timestamp
                        endDate: chair.endDate, // End date as Unix timestamp
                        customerEmail: order.customerID, // Temporarily store customerID
                        totalCost: order.totalCost,
                        additionalItemsCount: order.cartItems.filter(item => item.chairIndex === undefined).length // Count of non-chair items
                    });
                });
            }
        });

        // Sort chair reservations by 'datePurchased' in descending order (most recent first)
        chairReservations.sort((a, b) => b.startDate - a.startDate);

        for (const reservation of chairReservations) {
            const customerEmail = await fetchCustomerEmailById(reservation.customerEmail); // Fetch customer email
            // Convert Unix timestamps to readable date format
            const formattedStartDate = new Date(reservation.startDate * 1000).toLocaleDateString("en-US");
            const formattedEndDate = new Date(reservation.endDate * 1000).toLocaleDateString("en-US");

            buildBookingBlock(
                `Chair ${reservation.chairIndex}`,
                formattedStartDate,
                formattedEndDate,
                reservation.additionalItemsCount,
                reservation.totalCost,
                customerEmail
            );
        }
    } catch (error) {
        console.error("Error fetching chair reservations: ", error);
    }
}


function buildBookingBlock(chairNumber, startDate, endDate, additionalItemsCount, total, customerEmail) {
    let bookingRowContainer = createDOMElement('div', 'row-container', '', document.getElementById('bookings-container'));

    // Chair Numbers
    let chairNumberBlock = createDOMElement('div', 'text-div-20', '', bookingRowContainer);
    createDOMElement('div', 'text-light', `${chairNumber}`, chairNumberBlock);

    // Start - End Date
    let startEndBlock = createDOMElement('div', 'text-div-20', '', bookingRowContainer);
    createDOMElement('div', 'text-light', `${startDate} - ${endDate}`, startEndBlock);

    // Additional Items (Count of other products ordered)
    let additionalBlock = createDOMElement('div', 'text-div-20', '', bookingRowContainer);
    createDOMElement('div', 'text-light', `${additionalItemsCount}`, additionalBlock);

    // Customer Email
    let customerEmailBlock = createDOMElement('div', 'text-div-30', '', bookingRowContainer);
    createDOMElement('div', 'text-light', `${customerEmail}`, customerEmailBlock);

    // Order Total
    let orderTotalBlock = createDOMElement('div', 'text-div-10', '', bookingRowContainer);
    let roundedTotal = parseFloat(total).toFixed(2);
    createDOMElement('div', 'text-light', `$${roundedTotal}`, orderTotalBlock);
}

fetchAndDisplayChairReservations()
