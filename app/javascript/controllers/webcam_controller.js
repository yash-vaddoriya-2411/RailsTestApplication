import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    static targets = ["video", "canvas", "captureBtn", "preview", "imageData"]

    connect() {
        console.log("Webcam Stimulus controller connected.");
        this.cameraOpen = false;
    }

    async toggleCamera() {
        if (!this.cameraOpen) {
            await this.startCamera();
        } else {
            this.captureImage();
        }
    }

    async startCamera() {
        try {
            let isMobile = this.isMobile();
            let height = isMobile ? window.innerHeight * 0.7 : 720; // Adjust height for mobile
            let width = isMobile ? window.innerWidth * 0.9 : 540;  // Adjust width for mobile

            const constraints = {
                video: {
                    facingMode: isMobile ? { exact: "environment" } : "user", // Back camera for mobile, front for laptop
                    width: { ideal: width },
                    height: { ideal: height }
                }
            };

            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.videoTarget.srcObject = this.stream;

            // Adjust video size
            this.videoTarget.style.width = `${width}px`;
            this.videoTarget.style.height = `${height}px`;
            this.videoTarget.style.display = "block";

            // Hide captured image
            this.previewTarget.style.display = "none";
            this.captureBtnTarget.textContent = "Capture Image";

            this.cameraOpen = true;

        } catch (error) {
            console.error("Error accessing camera:", error);
            alert("Could not access the camera. Try allowing camera access in your settings.");
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

        // Show captured image, hide video
        this.previewTarget.style.display = "block";
        this.videoTarget.style.display = "none";

        // Stop camera stream
        this.stream.getTracks().forEach(track => track.stop());

        // Change button text to allow retake
        this.captureBtnTarget.textContent = "Retake Image";
        this.cameraOpen = false;
    }

    isMobile() {
        return window.matchMedia("(max-width: 768px)").matches;
    }
}
