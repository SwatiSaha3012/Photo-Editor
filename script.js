// Get DOM elements
const imageUpload = document.getElementById("imageUpload");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const grayscaleBtn = document.getElementById("grayscaleBtn");
const sepiaBtn = document.getElementById("sepiaBtn");
const invertBtn = document.getElementById("invertBtn");
const brightnessBtn = document.getElementById("brightnessBtn");
const saturateBtn = document.getElementById("saturateBtn");
const resetBtn = document.getElementById("resetBtn");
const downloadBtn = document.getElementById("downloadBtn");

let img = new Image();
let originalImageData;

// Handle image upload
imageUpload.addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (event) {
      img.onload = function () {
        // Set canvas dimensions
        canvas.width = img.width;
        canvas.height = img.height;

        // Draw the image on the canvas
        ctx.drawImage(img, 0, 0);
        originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height); // Save original image data
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  }
});

// Apply grayscale filter
grayscaleBtn.addEventListener("click", function () {
  applyFilter('grayscale');
});

// Apply sepia filter
sepiaBtn.addEventListener("click", function () {
  applyFilter('sepia');
});

// Invert colors
invertBtn.addEventListener("click", function () {
  applyFilter('invert');
});

// Adjust brightness/contrast
brightnessBtn.addEventListener("click", function () {
  adjustBrightnessContrast();
});

// Adjust saturation
saturateBtn.addEventListener("click", function () {
  adjustSaturation();
});

// Reset the image
resetBtn.addEventListener("click", function () {
  ctx.putImageData(originalImageData, 0, 0); // Reset to original image
});

// Download the edited image
downloadBtn.addEventListener("click", function () {
  const link = document.createElement("a");
  link.href = canvas.toDataURL(); // Get the image data as a URL
  link.download = "edited-image.png"; // Download the image
  link.click();
});

// Function to apply filters
function applyFilter(filter) {
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i]; // Red
    let g = data[i + 1]; // Green
    let b = data[i + 2]; // Blue

    if (filter === "grayscale") {
      // Convert to grayscale
      let gray = r * 0.3 + g * 0.59 + b * 0.11;
      data[i] = data[i + 1] = data[i + 2] = gray;
    } else if (filter === "sepia") {
      // Apply sepia tone
      data[i] = r * 0.393 + g * 0.769 + b * 0.189;
      data[i + 1] = r * 0.349 + g * 0.686 + b * 0.168;
      data[i + 2] = r * 0.272 + g * 0.534 + b * 0.131;
    } else if (filter === "invert") {
      // Invert colors
      data[i] = 255 - r;
      data[i + 1] = 255 - g;
      data[i + 2] = 255 - b;
    }
  }

  // Put the modified image data back onto the canvas
  ctx.putImageData(imageData, 0, 0);
}

// Adjust brightness and contrast
function adjustBrightnessContrast() {
  const brightness = 1.2;  // Increase brightness by 20%
  const contrast = 1.5;    // Increase contrast

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    data[i] = (data[i] - 128) * contrast + 128 + brightness;
    data[i + 1] = (data[i + 1] - 128) * contrast + 128 + brightness;
    data[i + 2] = (data[i + 2] - 128) * contrast + 128 + brightness;
  }

  ctx.putImageData(imageData, 0, 0);
}

// Adjust saturation
function adjustSaturation() {
  const saturationFactor = 1.5; // Increase saturation by 50%

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    let r = data[i];
    let g = data[i + 1];
    let b = data[i + 2];

    const avg = (r + g + b) / 3;
    data[i] = avg + (r - avg) * saturationFactor;
    data[i + 1] = avg + (g - avg) * saturationFactor;
    data[i + 2] = avg + (b - avg) * saturationFactor;
  }

  ctx.putImageData(imageData, 0, 0);
}
