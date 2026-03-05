// ============================================================
// DIGITAL CLOCK — JavaScript
// Handles: real-time clock, date display, digit animations,
//          and animated floating background particles.
// ============================================================


// ————————————————————————————————————————————
// 1. GRAB HTML ELEMENTS
// ————————————————————————————————————————————

// Time digit elements
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');
const ampmEl = document.getElementById('ampm');

// Date text element
const dateTextEl = document.getElementById('dateText');

// Particle canvas
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');  // 2D drawing context


// ————————————————————————————————————————————
// 2. CLOCK UPDATE FUNCTION
// ————————————————————————————————————————————

/**
 * updateClock()
 * Reads the current time using JavaScript's Date object,
 * converts it to 12-hour format, and updates the display.
 * Also triggers a small "pop" animation when a digit changes.
 */

// Store the previous values so we know when a digit changes
let prevHours = '', prevMinutes = '', prevSeconds = '';

function updateClock() {
    const now = new Date();

    // --- TIME ---
    let hours = now.getHours();    // 0–23
    let minutes = now.getMinutes();  // 0–59
    let seconds = now.getSeconds();  // 0–59

    // Determine AM or PM
    const period = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format (e.g. 13 → 1, 0 → 12)
    hours = hours % 12 || 12;

    // Pad with leading zeros: 9 → "09"
    const h = String(hours).padStart(2, '0');
    const m = String(minutes).padStart(2, '0');
    const s = String(seconds).padStart(2, '0');

    // Update the display and add a "pop" animation if the value changed
    if (h !== prevHours) {
        hoursEl.textContent = h;
        triggerPop(hoursEl);
        prevHours = h;
    }
    if (m !== prevMinutes) {
        minutesEl.textContent = m;
        triggerPop(minutesEl);
        prevMinutes = m;
    }
    if (s !== prevSeconds) {
        secondsEl.textContent = s;
        triggerPop(secondsEl);
        prevSeconds = s;
    }

    ampmEl.textContent = period;


    // --- DATE ---
    // Arrays of day names and month names
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];

    const dayName = days[now.getDay()];          // e.g. "Thursday"
    const monthName = months[now.getMonth()];      // e.g. "March"
    const date = now.getDate();               // e.g. 5
    const year = now.getFullYear();           // e.g. 2026

    // Format: "Thursday, 05 March 2026"
    dateTextEl.textContent = `${dayName}, ${String(date).padStart(2, '0')} ${monthName} ${year}`;
}


/**
 * triggerPop(element)
 * Briefly adds the CSS class "pop" to an element, creating
 * a subtle scale-up animation, then removes it after 250ms.
 */
function triggerPop(element) {
    element.classList.add('pop');
    setTimeout(() => element.classList.remove('pop'), 250);
}


// ————————————————————————————————————————————
// 3. START THE CLOCK
// ————————————————————————————————————————————

// Run immediately so there's no 1-second blank on page load
updateClock();

// Then repeat every 1000 ms (1 second)
setInterval(updateClock, 1000);


// ————————————————————————————————————————————
// 4. FLOATING PARTICLES (Background Animation)
// ————————————————————————————————————————————

/**
 * Particle class
 * Each particle is a small circle that drifts slowly across the screen.
 * When it goes off-screen, it wraps back to the other side.
 */
class Particle {
    constructor() {
        this.reset();
    }

    // Set (or re-set) the particle's position, size, speed, and opacity
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.radius = Math.random() * 2 + 0.5;           // 0.5 – 2.5 px
        this.speedX = (Math.random() - 0.5) * 0.4;       // slow horizontal drift
        this.speedY = (Math.random() - 0.5) * 0.4;       // slow vertical drift
        this.opacity = Math.random() * 0.4 + 0.1;         // 0.1 – 0.5
    }

    // Move the particle each frame
    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Wrap around edges so particles never disappear
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }

    // Draw the particle as a small glowing circle
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 255, 255, ${this.opacity})`;
        ctx.fill();
    }
}

// --- Canvas setup and particle array ---

// Number of floating particles
const PARTICLE_COUNT = 80;
const particles = [];

/**
 * resizeCanvas()
 * Makes the canvas fill the entire window.
 * Called on load and whenever the window is resized.
 */
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

/**
 * initParticles()
 * Creates all the Particle objects and stores them in the array.
 */
function initParticles() {
    particles.length = 0;  // Clear any existing particles
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }
}

/**
 * animateParticles()
 * The main animation loop — clears the canvas, updates and redraws
 * every particle, then requests the next frame.
 */
function animateParticles() {
    // Clear the entire canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw each particle
    for (const p of particles) {
        p.update();
        p.draw();
    }

    // Request the browser to call this function again on the next frame (~60 fps)
    requestAnimationFrame(animateParticles);
}

// --- Initialize everything ---

// Set canvas size to fill the window
resizeCanvas();

// Re-size canvas when the window is resized
window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();  // Re-create particles so they fit the new size
});

// Create particles and start the animation loop
initParticles();
animateParticles();
