
const usersSummaryText = document.getElementById('users-summary-text')
const productsSummaryText = document.getElementById('products-summary-text')
const ordersSummaryText = document.getElementById('orders-summary-text')

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
                // Reset all tabs to unselected state
                Object.keys(tabsMapping).forEach(otherTabId => {
                    const otherTabButton = document.getElementById(otherTabId);
                    if (otherTabButton) {
                        otherTabButton.className = 'tab-option';
                    }
                });

                // Hide all tab contents
                hideAllTabContents();

                // Show the clicked tab's content
                showTabContent(tabContentId);

                // Set the clicked tab to selected state
                tabButton.className = 'tab-option-selected';
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
