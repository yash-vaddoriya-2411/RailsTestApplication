import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
    static targets = ["video", "canvas", "captureBtn", "preview", "imageData"];

    connect() {
        console.log("Webcam Stimulus controller connected.");
        this.cameraOpen = false;
    }

    async toggleCamera() {
        if (this.isMobile()) {
            // Open mobile camera app directly using an intent
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.capture = "environment"; // Open rear camera (change to "user" for front camera)

            input.addEventListener("change", (event) => this.handleFileInput(event));
            input.click();
        } else {
            // Open desktop webcam
            if (!this.cameraOpen) {
                await this.startCamera();
            } else {
                this.captureImage();
            }
        }
    }

    async startCamera() {
        try {
            const constraints = {
                video: {
                    facingMode: "user", // Front camera for desktop
                    width: { ideal: 540 },
                    height: { ideal: 720 }
                }
            };

            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.videoTarget.srcObject = this.stream;
            this.videoTarget.style.display = "block";
            this.previewTarget.style.display = "none";
            this.captureBtnTarget.textContent = "Capture Image";

            this.cameraOpen = true;
        } catch (error) {
            console.error("Error accessing camera:", error);
            alert("Could not access the camera. Allow camera access in your browser settings.");
        }
    }

    captureImage() {
        const context = this.canvasTarget.getContext("2d");
        this.canvasTarget.width = this.videoTarget.videoWidth;
        this.canvasTarget.height = this.videoTarget.videoHeight;
        context.drawImage(this.videoTarget, 0, 0, this.canvasTarget.width, this.canvasTarget.height);

        const imageData = this.canvasTarget.toDataURL("image/jpeg");
        this.previewTarget.src = imageData;
        this.imageDataTarget.value = imageData; // Store in hidden field

        this.previewTarget.style.display = "block";
        this.videoTarget.style.display = "none";

        this.stream.getTracks().forEach(track => track.stop());

        this.captureBtnTarget.textContent = "Retake Image";
        this.cameraOpen = false;
    }

    handleFileInput(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.previewTarget.src = e.target.result;
                this.imageDataTarget.value = e.target.result; // Store in hidden field
                this.previewTarget.style.display = "block";
            };
            reader.readAsDataURL(file);
        }
    }

    isMobile() {
        return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }
}
