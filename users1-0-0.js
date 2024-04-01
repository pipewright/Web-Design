async function fetchAndDisplayUsers() {
    const usersTabContainer = document.getElementById('users-tab-container'); // Ensure this is in your HTML
    const usersContainer = document.getElementById('users-container'); // Ensure this is in your HTML

    // Clear existing users display
    while (usersContainer.firstChild) {
        usersContainer.removeChild(usersContainer.firstChild);
    }

    while (usersTabContainer.firstChild) {
        usersTabContainer.removeChild(usersTabContainer.firstChild);
    }

    try {
        const usersSnapshot = await db.collection('users').get();
        usersSnapshot.forEach(doc => {
            const user = doc.data();
            // Assuming 'dateCreated' is stored as a Firestore Timestamp object or a Unix timestamp
            // Convert it to a readable date format
            const formattedDateCreated = user.dateCreated ? new Date(user.dateCreated.seconds * 1000).toLocaleDateString("en-US") : 'Unknown';
            
            buildUserBlock(doc.id, user.fullName, user.email, user.phoneNumber, formattedDateCreated);
        });
    } catch (error) {
        console.error("Error fetching users: ", error);
    }
}

function buildUserBlock(userId, fullName, email, phoneNumber, dateCreated) {
    let userRowContainer = document.createElement('div');
    userRowContainer.className = 'user-row-container';

    // User Name
    let userNameBlock = createDOMElement('div', 'text-div-25-vertical', '', userRowContainer);
    createDOMElement('div', 'text-bold', fullName, userNameBlock);
    createDOMElement('div', 'text-light', email, userNameBlock);

    // Date Created
    let dateCreateBlock = createDOMElement('div', 'text-div-15', '', userRowContainer);
    createDOMElement('div', 'text-light', dateCreated, dateCreateBlock);


    // Phone Number
    let phoneNumberBlock = createDOMElement('div', 'text-div-20', '', userRowContainer);
    createDOMElement('div', 'text-light', phoneNumber, phoneNumberBlock);

    // User ID
    let userIDBlock = createDOMElement('div', 'text-div-30', '', userRowContainer);
    createDOMElement('div', 'text-light', userId, userIDBlock);

    // Actions
    let actionsBlock = createDOMElement('div', 'text-div-10', '', userRowContainer);

    // Append the original container
    document.getElementById('users-container').appendChild(userRowContainer);

    // Clone and append the clone to the second container
    let cloneUserRowContainer = userRowContainer.cloneNode(true);
    document.getElementById('users-tab-container').appendChild(cloneUserRowContainer);
}


fetchAndDisplayUsers();
