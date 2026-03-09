// Register the GSAP scroll tool
gsap.registerPlugin(ScrollTrigger);

// --- 1. THE CLIFF FADE OUT ---
gsap.to(".floating-cliff", {
  opacity: 0,
  y: -100, 
  scrollTrigger: {
    trigger: "#variables", 
    start: "top 90%", 
    end: "top 40%",   
    scrub: true
  }
});

// --- 2. THE WALLS BOTTOM-UP FADE IN ---
gsap.fromTo(".background-walls", 
  { 
    opacity: 0,
    clipPath: "inset(100% 0% 0% 0%)" 
  },
  {
    opacity: 1, 
    clipPath: "inset(0% 0% 0% 0%)",  
    scrollTrigger: {
      trigger: "#variables", 
      start: "top 60%", 
      end: "top 10%",
      scrub: true            
    }
  }
);

// --- 3. CLIMBER IMAGE LOOP ---
const chillClimber = document.querySelector('.climber--chill');
const dangleClimber = document.querySelector('.climber--dangling');

function crossFadeClimber() {
  const tl = gsap.timeline();
  // Smoothly cross-fade instead of violently flashing
  tl.to(chillClimber, { opacity: 0, duration: 0.3 })
    .to(dangleClimber, { opacity: 1, duration: 0.3 }, "<") 
    .to(dangleClimber, { opacity: 0, duration: 0.3, delay: 1.2 })
    .to(chillClimber, { opacity: 1, duration: 0.3 }, "<"); 
}

// --- 4. PAPER STRIPS DRIFT & PARALLAX ---

// Right Paper Note
gsap.fromTo(".paper-note--right",
  { x: 100, opacity: 0, y: 150 }, // Starts 150px lower and shifted right
  { x: 0, opacity: 1, y: 0,       // Settles perfectly into its natural spot
    scrollTrigger: {
      trigger: ".paper-note--right",
      start: "top 95%",   // Starts appearing right as it enters the bottom of the screen
      end: "top 50%",     // Finishes animating exactly at the middle of the screen!
      scrub: true
    }
  }
);

// Left Paper Note
gsap.fromTo(".paper-note--left",
  { x: -100, opacity: 0, y: 150 }, // Starts 150px lower and shifted left
  { x: 0, opacity: 1, y: 0,        // Settles perfectly into its natural spot
    scrollTrigger: {
      trigger: ".paper-note--left",
      start: "top 95%",
      end: "top 50%",     // Finishes animating at the middle of the screen
      scrub: true
    }
  }
);

// --- 6. FLOATING CLIMBING HOLDS (PARALLAX) ---

// Slow moving holds
gsap.utils.toArray('.parallax-slow').forEach(hold => {
  gsap.to(hold, {
    y: -80, // Drifts up slightly
    scrollTrigger: { trigger: "#events", start: "top bottom", end: "bottom top", scrub: 1 }
  });
});

// Medium moving holds
gsap.utils.toArray('.parallax-medium').forEach(hold => {
  gsap.to(hold, {
    y: -150, // Drifts up a bit more
    scrollTrigger: { trigger: "#events", start: "top bottom", end: "bottom top", scrub: 1 }
  });
});

// Fast moving holds
gsap.utils.toArray('.parallax-fast').forEach(hold => {
  gsap.to(hold, {
    y: -250, // Drifts up significantly more, creating 3D depth!
    scrollTrigger: { trigger: "#events", start: "top bottom", end: "bottom top", scrub: 1 }
  });
});

// Start the loop!
setInterval(crossFadeClimber, 2100);

// --- 5. GLOBAL HEADER ANIMATIONS ---

// Grab every single <h2> tag on the page
const sectionHeaders = document.querySelectorAll('h2');

// Loop through each one and give it the exact same scroll trigger
sectionHeaders.forEach((header) => {
  gsap.fromTo(header, 
    { 
      opacity: 0, 
      x: -100 // Starts completely invisible and pushed 100px to the left
    },
    {
      opacity: 1,
      x: 0,   // Slides seamlessly into its natural layout position
      duration: 1, // Takes exactly 1 second to slide in smoothly
      ease: "power2.out", // Makes the slide decelerate smoothly at the end
      scrollTrigger: {
        trigger: header,
        start: "top 85%", // Fires when the header enters the bottom 15% of the screen
        toggleActions: "play none none reverse" // Plays on the way down, reverses on the way up!
      }
    }
  );
});

// --- 7. CONDITIONALS PUZZLE SCROLL TIMELINE ---

// Let GSAP strictly set the 3D rules so CSS doesn't fight it
gsap.set(".puzzle-flip-inner", { transformStyle: "preserve-3d" });

// HIDE THE WHITE BOX: autoAlpha sets it to visibility:hidden so it CANNOT be seen early
gsap.set(".puzzle-back", { rotationY: 180, autoAlpha: 0 }); 

const puzzleTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#conditionals",
    start: "top top", // Locks exactly when the section hits the top of the monitor
    end: "+=2500",    // Gives a massive 2500px of scroll space to enjoy the animation
    pin: true,        // THE MAGIC TRICK: Freezes the screen!
    scrub: 1,      
  }
});

// Step A: Fly the pieces in
puzzleTl.from(".puzzle-piece", {
  x: () => gsap.utils.random(-1500, 1500), // Flung even further off-screen       
  y: () => gsap.utils.random(-1500, 1500),       
  rotation: () => gsap.utils.random(-360, 360), 
  opacity: 0,
  duration: 2,
  stagger: 0.02 
})

// Step B: Pause briefly on the assembled photo
.to({}, {duration: 0.5})

// Step C: Turn the white box "on" secretly right before the flip
.set(".puzzle-back", { autoAlpha: 1 })

// Step D: Spin the container
.to(".puzzle-flip-inner", {
  rotationY: 180,
  duration: 1.5,
  ease: "power2.inOut"
}, "flipPoint") // "flipPoint" ensures Step D and E happen at the exact same time

// Step E: Flatten shadows as it flips
.to(".puzzle-piece", {
  filter: "drop-shadow(0px 0px 0px rgba(0,0,0,0))",
  duration: 0.5
}, "flipPoint");



const toggleBtn = document.querySelector('#wall-switcher');

if (toggleBtn) {
  toggleBtn.addEventListener('click', () => {
    // Toggles the class on the body tag
    document.body.classList.toggle('on-the-wall');

    // Updates button text based on the current state
    if (document.body.classList.contains('on-the-wall')) {
      toggleBtn.textContent = "Drop back down";
    } else {
      toggleBtn.textContent = "Get on the wall";
    }
  });
}