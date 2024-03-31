
const addProductButton = document.getElementById('add-product-button')
const createProductModal = document.getElementById('create-product-modal')
const closeProductModal = document.getElementById('close-product-modal')

addProductButton.addEventListener('click', () => {
    createProductModal.style.display = 'flex'
})

closeProductModal.addEventListener('click', () => {
    createProductModal.style.display = 'none'
})

const tabsMapping = {
    'tab-dashboard': 'dashboard-tab-body',
    'tab-users': 'users-tab-body',
    'tab-products': 'products-tab-body',
    'tab-orders': 'orders-tab-body',
    'tab-chairs': 'chairs-tab-body',
    'tab-bookings': 'bookings-tab-body',
  };

  // Utility function to hide all tab content containers
function hideAllTabContents() {
    Object.values(tabsMapping).forEach(tabContentId => {
        const tabContent = document.getElementById(tabContentId);
        if (tabContent) {
        tabContent.style.display = 'none';
        }
    });
}

// Function to show a specific tab's content
function showTabContent(tabContentId) {
    const tabContent = document.getElementById(tabContentId);
    if (tabContent) {
        tabContent.style.display = 'flex'; // You can adjust this to 'block' or 'flex' depending on your layout
    }
}

// Function to initialize the tabs functionality
function initializeTabs() {
    Object.entries(tabsMapping).forEach(([tabId, tabContentId]) => {
        const tabButton = document.getElementById(tabId);
        if (tabButton) {
        tabButton.addEventListener('click', () => {
            hideAllTabContents(); // Hide all tab contents
            showTabContent(tabContentId); // Show the clicked tab's content
        });
        }
    });
}


// The createDOMElement function as provided
function createDOMElement(type, className, value, parent) {
    let DOMElement = document.createElement(type);
    DOMElement.setAttribute('class', className);
    if (type == 'img') {
        DOMElement.src = value;
    } else {
        DOMElement.innerHTML = value;
    }
    parent.appendChild(DOMElement);
    return DOMElement
}


// Example: Initialize tabs functionality on page load
document.addEventListener('DOMContentLoaded', initializeTabs);