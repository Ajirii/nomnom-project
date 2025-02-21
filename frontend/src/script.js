// Select the face image
const potFace = document.getElementById("potFace");

// Define the ordered sequence of images
const imageSequence = [
    "images/pot_sad.png",  // Sad face
    "images/pot_1.png",    // Transition to neutral
    "images/pot_2.png",    // Another neutral frame
    "images/pot_right1.png", // Flirting (eye wink left)
    "images/pot_right2.png", // Flirting (eye wink right)
    "images/pot_smile1.png", // Smiling 1
    "images/pot_smile2.png"  // Smiling 2
];

let index = 0; // Track the current image index

// Function to smoothly change images
function changeImage() {
    index = (index + 1) % imageSequence.length; // Loop through images
    gsap.to(potFace, {
        duration: 0.8,  // Smooth transition time
        opacity: 0.99,  // Keep visible
        onUpdate: () => {
            potFace.src = imageSequence[index]; // Change image smoothly
        }
    });
}

// Create a GSAP timeline for the animation cycle
const tl = gsap.timeline({ repeat: -1 });

// Add images with longer duration before transitioning
imageSequence.forEach((_, i) => {
    tl.call(changeImage) // Change to next image
      .to({}, { duration: 1.5 }); // Hold image for 1.5 seconds
});