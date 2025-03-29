import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    static targets = ["cameraInput", "preview", "imageData", "start"]

    openCamera() {
        console.log("Opening mobile camera...");
        this.cameraInputTarget.click(); // Opens mobile camera app
    }

    connect() {
        console.log("Webcam Stimulus controller connected.");
        this.cameraInputTarget.addEventListener("change", (event) => this.handleImage(event));
    }

    handleImage(event) {
        const file = event.target.files[0];
        if (file) {
            console.log("Image captured:", file);
            const reader = new FileReader();
            reader.onload = (e) => {
                this.previewTarget.src = e.target.result;
                this.previewTarget.style.display = "block";
                this.imageDataTarget.value = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    }
}
