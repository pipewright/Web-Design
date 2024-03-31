

async function fetchAllProductsAndBuildBlocks() {
    const productsContainer = document.getElementById('products-container'); // Ensure you have this in your HTML

    // Clear existing products display
    while (productsContainer.firstChild) {
        productsContainer.removeChild(productsContainer.firstChild);
    }

    try {
        const productsSnapshot = await db.collection('products').get();
        for (let doc of productsSnapshot.docs) {
            const product = doc.data();
            buildProductBlock(doc.id, product.title, product.image, product.status, product.pricePerUnit, product.description);
        }
    } catch (error) {
        console.error("Error fetching products: ", error);
    }
}

function buildProductBlock(productId, title, image, status, pricePerUnit, description) {
    let productBlock = document.createElement('div');
    productBlock.className = 'row-container';

    // Image
    let imgBlock = createDOMElement('img', 'product-image', image, productBlock);
    imgBlock.src = image; // Assuming 'image' is a path to the image

    // Title
    createDOMElement('div', 'text-div-20 text-light', title, productBlock);

    // Price per unit
    createDOMElement('div', 'text-light', `$${pricePerUnit}`, productBlock);

    // Description
    createDOMElement('div', 'text-light', description, productBlock);

    // Status
    createDOMElement('div', 'text-light', status, productBlock);

    // Append the productBlock to the container
    document.getElementById('products-container').appendChild(productBlock);
}

fetchAllProductsAndBuildBlocks()