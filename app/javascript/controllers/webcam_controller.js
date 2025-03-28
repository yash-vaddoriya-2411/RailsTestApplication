import { Controller } from "@hotwired/stimulus"
export default class extends Controller {
    static targets = ["cameraInput", "camera", "preview", "imageData", "start", "snapshot", "retake"]

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

    start() {
        if (!this.webcamStarted) {
            Webcam.set({
                width: 320,
                height: 240,
                image_format: 'jpeg',
                jpeg_quality: 90
            });

            Webcam.attach(this.cameraTarget);
            this.webcamStarted = true;

            // Wait for the webcam to fully initialize
            setTimeout(() => {
                console.log("Webcam is ready for capture.");
            }, 1000); // 1-second delay

            // Show the "Take Snapshot" button
            this.startTarget.style.display = "none";
            this.snapshotTarget.style.display = "block";
            this.retakeTarget.style.display = "none";
            this.previewTarget.style.display = "none";

            this.cameraTarget.style.display = "block";
        }
    }


    capture() {
        if (!this.webcamStarted) return;

        Webcam.snap((data_uri) => {
            this.cameraTarget.style.display = "none";
            this.previewTarget.src = data_uri;
            this.previewTarget.style.display = "block";
            this.imageDataTarget.value = data_uri;

            Webcam.reset();
            this.webcamStarted = false;

            // Hide "Take Snapshot" button, show "Retake" button
            this.snapshotTarget.style.display = "none";
            this.retakeTarget.style.display = "block";
        });
    }

    retake() {
        this.previewTarget.style.display = "none";
        this.start();
    }
}

