



const addProductButton = document.getElementById('add-product-button')
const createProductModal = document.getElementById('create-product-modal')
const closeProductModal = document.getElementById('close-product-modal')
const closeDeleteModal = document.getElementById('close-delete-modal')
const productsContainer = document.getElementById('products-container'); 
const productPhotoContainer = document.getElementById('product-photo-container')


addProductButton.addEventListener('click', () => {
    $("#create-product-button").text("Create Product");

    $("#create-product-modal").css('display', 'flex').css('opacity', '0');
    $("#create-product-modal").fadeTo(400, 1); 
});

closeProductModal.addEventListener('click', () => {
    $("#create-product-modal").fadeTo(400, 0, function() {
        $(this).css('display', 'none');
    });
});

closeDeleteModal.addEventListener('click', () => {
    $("#delete-product-modal").fadeTo(400, 0, function() {
        $(this).css('display', 'none');
    });
});


async function fetchAllProductsAndBuildBlocks() {
    while (productsContainer.firstChild) {
        productsContainer.removeChild(productsContainer.firstChild);
    }

    try {
        const productsSnapshot = await db.collection('products').get();
        productsSummaryText.innerHTML = `${productsSnapshot.docs.length}`;

        for (let doc of productsSnapshot.docs) {
            const product = doc.data();
            buildProductBlock(doc.id, product.title, product.image, product.status, product.price, product.description);
        }
    } catch (error) {
        console.error("Error fetching products: ", error);
    }
}

function buildProductBlock(productId, title, image, status, pricePerUnit, description) {
    let productRowContainer = createDOMElement('div', 'product-row-container', '', productsContainer)

    // Image + Title
    let productTitleBlock = createDOMElement('div', 'text-div-20', '', productRowContainer);
    createDOMElement('img', 'product-image', image, productTitleBlock);
    createDOMElement('div', 'text-light', title, productTitleBlock);

    // Status
    let statusBlock = createDOMElement('div', 'text-div-20', '', productRowContainer);
    createDOMElement('div', 'text-light', status, statusBlock);

    // Price per unit
    let priceBlock = createDOMElement('div', 'text-div-20', '', productRowContainer);
    createDOMElement('div', 'text-light', `$${pricePerUnit}`, priceBlock);

    // Description
    let descriptionBlock = createDOMElement('div', 'product-description-block', '', productRowContainer);
    createDOMElement('div', 'description-text', description, descriptionBlock);

    //Actions
    let actionsBlock = createDOMElement('div', 'actions-div', '', productRowContainer);
    let deleteButton = createDOMElement('div', 'action-delete', '', actionsBlock);
    let editButton = createDOMElement('div', 'action-edit', '', actionsBlock);

    deleteButton.setAttribute('data-product-id', productId); 
    editButton.setAttribute('data-product-id', productId); 

    // Delete button event listener
    deleteButton.addEventListener('click', function() {
        const prodId = this.getAttribute('data-product-id');
        openDeleteModal(prodId);
    });

    // Edit button event listener
    editButton.addEventListener('click', function() {
        const prodId = this.getAttribute('data-product-id');
        openEditModal(prodId);
    });

    // Append the productBlock to the container
    document.getElementById('products-container').appendChild(productRowContainer);
}

fetchAllProductsAndBuildBlocks()

//Modals
let editingProductId = null; // Null when creating a new product, holds ID when editing


// Function to open the delete modal and set up the confirmation action
async function openDeleteModal(productId) {

    try {
        const doc = await db.collection('products').doc(productId).get();
        if (doc.exists) {
            const product = doc.data();
            $('#delete-product-title').text(product.title);
            $('#delete-product-description').text(product.description);
            $("#delete-product-modal").css('display', 'flex').css('opacity', '0');
            let deleteProductDiv = document.getElementById('delete-product-div')
            while(deleteProductDiv.firstChild) { 
                deleteProductDiv.removeChild(deleteProductDiv.firstChild)
            }
            createDOMElement('img', 'create-product-image', product.image, deleteProductDiv)


            $("#delete-product-modal").fadeTo(400, 1); // Fade in to opacity 1 over 400ms

            // Ensure this doesn't add multiple listeners to the same button over time
            $("#delete-product-button").off('click').on('click', function() {
                deleteProduct(productId);
            });
        }
    } catch (error) {
        console.error('Error loading product for editing: ', error);
        alert('Error loading product details.');
    }
}

async function deleteProduct(productId) {
    try {
        await db.collection('products').doc(productId).delete();
        $("#delete-product-modal").fadeTo(400, 0, function() {
            $(this).css('display', 'none');
        });
        alert('Product deleted successfully');
        fetchAllProductsAndBuildBlocks()
    } catch (error) {
        console.error('Error deleting product: ', error);
        alert('Error deleting product.');
    }
}


async function openEditModal(productId) {
    try {
        const doc = await db.collection('products').doc(productId).get();
        if (doc.exists) {
            editingProductId = productId; 
            const product = doc.data();
            $('#product-title').val(product.title);
            $('#product-description').val(product.description);
            $('#product-price').val(product.price);
            document.getElementById('product-photo-button').style.display = 'none'

            while (productPhotoContainer.firstChild) {
                productPhotoContainer.removeChild(productPhotoContainer.firstChild)
            }
            createDOMElement('img', 'create-product-photo', product.image, productPhotoContainer)
            $("#create-product-button").text("Save Product"); // Change button text for editing
            $("#create-product-modal").css('display', 'flex').css('opacity', '0');
            $("#create-product-modal").fadeTo(400, 1);
        }
    } catch (error) {
        console.error('Error loading product for editing: ', error);
        alert('Error loading product details.');
    }
}



document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('product-photo-button').addEventListener('click', function() {
        document.getElementById('hidden-file-input').click();
    });
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
            document.getElementById('product-photo-button').style.display = 'none'

        };
        fileReader.readAsDataURL(event.target.files[0]); // Convert the file to a data URL
    }
});


document.getElementById('create-product-button').addEventListener('click', async function() {
    const fileInput = document.getElementById('hidden-file-input');
    const titleInput = document.getElementById('product-title');
    const descriptionInput = document.getElementById('product-description');
    const priceInput = document.getElementById('product-price');

    // Check if a new image was uploaded; if not, keep the existing one
    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const storageRef = firebase.storage().ref('products/' + file.name);
        try {
            const uploadTask = await storageRef.put(file);
            const photoURL = await uploadTask.ref.getDownloadURL();

            saveOrUpdateProduct({
                title: titleInput.value,
                description: descriptionInput.value,
                price: parseFloat(priceInput.value),
                image: photoURL,
                status: 'available'
            });
        } catch (error) {
            console.error('Error saving product: ', error);
            alert('Error saving product.');
        }
    } else if (editingProductId) { // No new image, updating existing product
        saveOrUpdateProduct({
            title: titleInput.value,
            description: descriptionInput.value,
            price: parseFloat(priceInput.value),
            // Image not updated, assuming existing URL is kept
            status: 'available'
        }, editingProductId);
    } else {
        alert("Please select an image for the product.");
    }
});


async function saveOrUpdateProduct(productData, productId = null) {
    if (productId) {
        // Update existing product
        await db.collection('products').doc(productId).update(productData);
        alert('Product updated successfully!');
    } else {
        // Add new product
        await db.collection('products').add(productData);
        alert('Product added successfully!');
    }
    fetchAllProductsAndBuildBlocks();
    $("#create-product-modal").fadeTo(400, 0, function() {
        $(this).css('display', 'none');
    });
    // Reset global variable and form after operation
    editingProductId = null;
    resetForm();
}



function resetForm() {
    // Reset form fields and the file input if necessary
    $('#product-title').val('');
    $('#product-description').val('');
    $('#product-price').val('');
    $('#hidden-file-input').val('');
    document.getElementById('product-photo-button').style.display = 'flex'
    // Remove the displayed image
    while (productPhotoContainer.firstChild) {
        productPhotoContainer.removeChild(productPhotoContainer.firstChild);
    }
}
