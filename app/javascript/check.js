function openModal(imageUrl) {
    let modal = document.getElementById("imageModal");
    let fullImage = document.getElementById("fullImage");

    fullImage.src = imageUrl;
    modal.style.display = "flex";
}

function closeModal() {
    document.getElementById("imageModal").style.display = "none";
}

// Close modal when clicking outside the image
window.onclick = function(event) {
    let modal = document.getElementById("imageModal");
    if (event.target === modal) {
        closeModal();
    }
};
