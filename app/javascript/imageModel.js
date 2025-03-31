// Function to open the modal and display the clicked image
function openModal(imageSrc) {
    document.getElementById('fullImage').src = imageSrc;
    document.getElementById('imageModal').style.display = 'flex';
}

// Function to close the modal
function closeModal() {
    document.getElementById('imageModal').style.display = 'none';
}
