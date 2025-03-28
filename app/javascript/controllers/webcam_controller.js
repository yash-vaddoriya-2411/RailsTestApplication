import { Controller } from "@hotwired/stimulus"
export default class extends Controller {
    static targets = ["camera", "preview", "imageData", "start", "snapshot", "retake"]

    connect() {
        console.log("Webcam Stimulus controller connected.");
        this.webcamStarted = false;
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

    capture() {
        if (!this.webcamStarted) return;

        Webcam.snap((data_uri) => {
            console.log("Captured Image URI:", data_uri);  // Debugging output

            // Hide the camera, show the captured image
            this.cameraTarget.style.display = "none";
            this.previewTarget.src = data_uri;
            this.previewTarget.style.display = "block";

            // Store image data in the hidden input field
            this.imageDataTarget.value = data_uri;

            // Stop webcam after capturing
            Webcam.reset();
            this.webcamStarted = false;

            // Hide "Take Snapshot" button, show "Retake" button
            this.snapshotTarget.style.display = "none";
            this.retakeTarget.style.display = "block";
        });
    }

}

