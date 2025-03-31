import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    static targets = ["video", "canvas", "captureBtn", "preview", "imageData", "fileInput"]

    connect() {
        console.log("Webcam Stimulus controller connected.");
        this.cameraOpen = false;

        if (this.isMobile()) {
            this.fileInputTarget.style.display = "block"; // Show file input on mobile
            this.captureBtnTarget.style.display = "none"; // Hide webcam button
        } else {
            this.fileInputTarget.style.display = "none"; // Hide file input on desktop
            this.captureBtnTarget.style.display = "block"; // Show webcam button
        }
    }

    async toggleCamera() {
        if (!this.isMobile()) {
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
                    facingMode: "user",
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
        this.imageDataTarget.value = imageData;

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
                this.imageDataTarget.value = e.target.result;
                this.previewTarget.style.display = "block";
            };
            reader.readAsDataURL(file);
        }
    }

    isMobile() {
        return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    }
}
