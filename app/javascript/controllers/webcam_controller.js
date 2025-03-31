import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    static targets = ["video", "canvas", "captureBtn", "retakeBtn", "preview", "imageData"]

    connect() {
        console.log("Webcam Stimulus controller connected.");
        this.setupCamera();
    }

    async setupCamera() {
        try {
            let height = this.isMobile() ? window.innerHeight * 0.8 : 720; // Increase height for a more rectangular shape
            let width = this.isMobile() ? window.innerWidth * 0.6 : 480;  // Decrease width for a portrait-like aspect ratio

            const constraints = {
                video: {
                    facingMode: this.isMobile() ? "environment" : "user", // Back camera for mobile, front for laptop
                    width: { ideal: width },
                    height: { ideal: height }
                }
            };

            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.videoTarget.srcObject = this.stream;

            // Adjust video element size dynamically
            this.videoTarget.style.width = `${width}px`;
            this.videoTarget.style.height = `${height}px`;

            // Show camera, hide preview and retake button
            this.videoTarget.style.display = "block";
            this.previewTarget.style.display = "none";
            this.retakeBtnTarget.style.display = "none";

        } catch (error) {
            console.error("Error accessing camera:", error);
        }
    }


    isMobile() {
        return /Mobi|Android/i.test(navigator.userAgent);
    }

    captureImage() {
        const context = this.canvasTarget.getContext("2d");
        this.canvasTarget.width = this.videoTarget.videoWidth;
        this.canvasTarget.height = this.videoTarget.videoHeight;

        // Draw image from video stream
        context.drawImage(this.videoTarget, 0, 0, this.canvasTarget.width, this.canvasTarget.height);
        const imageData = this.canvasTarget.toDataURL("image/jpeg");

        // Display captured image
        this.previewTarget.src = imageData;
        this.previewTarget.style.display = "block";
        this.imageDataTarget.value = imageData; // Store image in hidden input for form submission

        // Hide video and capture button, show retake button
        this.videoTarget.style.display = "none";
        this.captureBtnTarget.style.display = "none";
        this.retakeBtnTarget.style.display = "inline-block";
    }

    retakeImage() {
        // Show video and capture button, hide captured image and retake button
        this.videoTarget.style.display = "block";
        this.captureBtnTarget.style.display = "inline-block";
        this.previewTarget.style.display = "none";
        this.retakeBtnTarget.style.display = "none";

        // Restart camera stream
        this.setupCamera();
    }
}
