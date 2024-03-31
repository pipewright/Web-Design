

const addProductButton = document.getElementById('add-product-button')
const createProductModal = document.getElementById('create-product-modal')
const closeProductModal = document.getElementById('close-product-modal')

addProductButton.addEventListener('click', () => {
    createProductModal.style.display = 'flex'
})

closeProductModal.addEventListener('click', () => {
    createProductModal.style.display = 'none'
})


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



const productPhotoContainer = document.getElementById('product-photo-container')

document.getElementById('product-photo-button').addEventListener('click', function() {
    document.getElementById('hidden-file-input').click();
});

// Handle file selection
document.getElementById('hidden-file-input').addEventListener('change', function(event) {
    if (event.target.files.length > 0) {
        const fileReader = new FileReader();
        fileReader.onload = function(fileLoadEvent) {
            // Check if an image already exists in the container
            while(productPhotoContainer.firstChild) {
                productPhotoContainer.removeChild(productPhotoContainer.firstChild)
            }
            createDOMElement('img', 'create-product-image', fileLoadEvent.target.result, productPhotoContainer)
        };
        fileReader.readAsDataURL(event.target.files[0]); // Convert the file to a data URL
    }
});


document.getElementById('create-product-button').addEventListener('click', async function() {
    const fileInput = document.getElementById('product-photo-button');
    const titleInput = document.getElementById('product-title');
    const descriptionInput = document.getElementById('product-description');
    const priceInput = document.getElementById('product-price');

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const storageRef = firebase.storage().ref('products/' + file.name);
        const uploadTask = storageRef.put(file);

        try {
            // Wait for the file to upload
            await uploadTask;
            // Get URL of the uploaded file
            const photoURL = await storageRef.getDownloadURL();
            
            // Now save the product data to Firestore
            await db.collection('products').add({
                title: titleInput.value,
                description: descriptionInput.value,
                price: parseFloat(priceInput.value),
                image: photoURL
            });

            alert('Product saved successfully!');
        } catch (error) {
            console.error('Error saving product: ', error);
            alert('Error saving product.');
        }
    }
});