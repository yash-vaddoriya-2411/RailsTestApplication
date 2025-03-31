import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
    static targets = ["video", "canvas", "captureBtn", "retakeBtn", "preview", "imageData"]

    connect() {
        console.log("Webcam Stimulus controller connected.");
        this.setupCamera();
    }

    async setupCamera() {
        try {
            let height = this.isMobile() ? window.innerHeight * 0.9 : 720; // Adjust height for full screen
            let width = this.isMobile() ? window.innerWidth * 0.9 : 480;  // Adjust width to match screen

            const constraints = {
                video: {
                    facingMode: this.isMobile() ? "environment" : "user",
                    width: { ideal: width },
                    height: { ideal: height }
                }
            };

            this.stream = await navigator.mediaDevices.getUserMedia(constraints);
            this.videoTarget.srcObject = this.stream;

            // Set dynamic video size
            this.videoTarget.style.width = "100%";
            this.videoTarget.style.height = "auto"; // Maintain aspect ratio

            // Make sure the modal fills the screen
            this.videoTarget.parentElement.style.width = "100%";
            this.videoTarget.parentElement.style.height = "100vh";

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
