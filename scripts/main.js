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

// --- 2B. SUBTLE WALL DRIFT (SLOW PARALLAX) ---
gsap.to(".wall--left", {
  y: -60,
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: 2
  }
});

gsap.to(".wall--right", {
  y: -60,
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: 2
  }
});

// --- 2C. TOKENS WALL GLITCH + WHOLE WALL REVEAL ---
gsap.set(".wall--whole", { autoAlpha: 0 });

const wallGlitchTl = gsap.timeline({
  scrollTrigger: {
    trigger: "#tokens",
    start: "top 75%",
    end: "top 20%",
    scrub: 2
  }
});

wallGlitchTl
  .to(".wall-glitch-overlay", {
    autoAlpha: 0.6,
    duration: 0.2,
    ease: "power2.out"
  }, "<")
  .to(".wall--left, .wall--right", {
    opacity: 0.15,
    x: () => gsap.utils.random(-24, 24),
    y: () => gsap.utils.random(-16, 16),
    filter: "hue-rotate(70deg) contrast(1.35) saturate(1.3)",
    duration: 0.16,
    repeat: 7,
    yoyo: true,
    ease: "steps(2)"
  })
  .to(".wall-glitch-overlay", {
    autoAlpha: 0,
    duration: 0.25,
    ease: "power2.inOut"
  }, ">-0.1")
  .to(".wall--left, .wall--right", {
    opacity: 0,
    duration: 0.55,
    ease: "power2.inOut"
  }, ">-0.05")
  .to(".wall--whole", {
    autoAlpha: 1,
    filter: "none",
    duration: 0.75,
    ease: "power2.out"
  }, ">-0.2");

// --- 2D. TOKENS LIGHT-UP HOLDS ---
gsap.set(".light-up-hold", {
  autoAlpha: 0,
  scale: 0.72,
  filter: "drop-shadow(0 0 0 rgba(226, 200, 255, 0)) brightness(1) saturate(1)"
});

const holdLightTl = gsap.timeline({ paused: true });

gsap.utils.toArray(".light-up-hold").forEach((hold, index) => {
  holdLightTl.to(hold, {
    autoAlpha: 1,
    scale: 1,
    duration: 0.55,
    ease: "power2.out",
    filter: "drop-shadow(0 0 30px rgba(226, 200, 255, 0.98)) brightness(1.45) saturate(1.3)"
  }, index === 0 ? 0 : ">+=0.22");
});

let holdLightDelay;

ScrollTrigger.create({
  trigger: "#tokens",
  start: "top 70%",
  onEnter: () => {
    if (holdLightDelay) {
      holdLightDelay.kill();
    }
    holdLightDelay = gsap.delayedCall(2.5, () => holdLightTl.restart(true));
  },
  onEnterBack: () => {
    if (holdLightDelay) {
      holdLightDelay.kill();
    }
    holdLightDelay = gsap.delayedCall(2.5, () => holdLightTl.restart(true));
  },
  onLeaveBack: () => {
    if (holdLightDelay) {
      holdLightDelay.kill();
    }
    holdLightTl.pause(0);
    gsap.set(".light-up-hold", {
      autoAlpha: 0,
      scale: 0.72,
      filter: "drop-shadow(0 0 0 rgba(226, 200, 255, 0)) brightness(1) saturate(1)"
    });
  }
});

// --- 2E. WALL FADE-OUT BEFORE MEMORY ---
gsap.fromTo(".background-walls",
  {
    opacity: 1,
    clipPath: "inset(0% 0% 0% 0%)"
  },
  {
    opacity: 0,
    clipPath: "inset(0% 0% 100% 0%)",
    scrollTrigger: {
      trigger: "#memory",
      start: "top 120%",
      end: "top 60%",
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

// Right Paper Notes
gsap.utils.toArray(".paper-note--right").forEach((note) => {
  gsap.fromTo(note,
    { x: 100, opacity: 0, y: 150 }, // Starts 150px lower and shifted right
    { x: 0, opacity: 1, y: 0,       // Settles perfectly into its natural spot
      scrollTrigger: {
        trigger: note,
        start: "top 95%",   // Starts appearing right as it enters the bottom of the screen
        end: "top 50%",     // Finishes animating exactly at the middle of the screen!
        scrub: true
      }
    }
  );
});

// Left Paper Notes
gsap.utils.toArray(".paper-note--left").forEach((note) => {
  gsap.fromTo(note,
    { x: -100, opacity: 0, y: 150 }, // Starts 150px lower and shifted left
    { x: 0, opacity: 1, y: 0,        // Settles perfectly into its natural spot
      scrollTrigger: {
        trigger: note,
        start: "top 95%",
        end: "top 50%",     // Finishes animating at the middle of the screen
        scrub: true
      }
    }
  );
});

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

const puzzlePieceLayout = {
  puzzle1: { x: -1.29, y: 0, width: 83.33, height: 107.25 },
  puzzle2: { x: 55.76, y: 0, width: 133.33, height: 82.5 },
  puzzle3: { x: 165.38, y: 0, width: 83.33, height: 107.25 },
  puzzle4: { x: 225, y: 0, width: 133.33, height: 82.5 },
  puzzle5: { x: 333.33, y: 0, width: 83.34, height: 107.25 },
  puzzle6: { x: 391.67, y: 0, width: 108.33, height: 82.5 },
  puzzle7: { x: 0, y: 82.5, width: 108.33, height: 82.5 },
  puzzle8: { x: 83.33, y: 57.75, width: 83.33, height: 132 },
  puzzle9: { x: 141.67, y: 82.5, width: 133.33, height: 82.5 },
  puzzle10: { x: 248.71, y: 57.75, width: 83.33, height: 132 },
  puzzle11: { x: 305.76, y: 82.5, width: 133.33, height: 82.5 },
  puzzle12: { x: 415.38, y: 57.75, width: 83.33, height: 132 },
  puzzle13: { x: -1.29, y: 140.25, width: 83.33, height: 132 },
  puzzle14: { x: 55.76, y: 165, width: 133.33, height: 82.5 },
  puzzle15: { x: 165.38, y: 140.25, width: 83.33, height: 132 },
  puzzle16: { x: 225, y: 165, width: 133.33, height: 82.5 },
  puzzle17: { x: 333.33, y: 140.25, width: 83.34, height: 132 },
  puzzle18: { x: 391.67, y: 165, width: 108.33, height: 82.5 },
  puzzle19: { x: 0, y: 247.5, width: 108.33, height: 82.5 },
  puzzle20: { x: 83.33, y: 222.75, width: 83.33, height: 107.25 },
  puzzle21: { x: 141.67, y: 247.5, width: 133.33, height: 82.5 },
  puzzle22: { x: 248.71, y: 222.75, width: 83.33, height: 107.25 },
  puzzle23: { x: 305.76, y: 247.5, width: 133.33, height: 82.5 },
  puzzle24: { x: 415.38, y: 222.75, width: 83.33, height: 107.25 }
};

const puzzlePieces = gsap.utils.toArray('.puzzle-piece');

puzzlePieces.forEach((piece) => {
  const pieceName = piece.getAttribute('src').split('/').pop().replace('.svg', '');
  const layout = puzzlePieceLayout[pieceName];

  if (!layout) {
    return;
  }

  piece.style.setProperty('--piece-x', layout.x);
  piece.style.setProperty('--piece-y', layout.y);
  piece.style.setProperty('--piece-width', layout.width);
  piece.style.setProperty('--piece-height', layout.height);
});

gsap.set('.puzzle-flip-inner', { transformStyle: 'preserve-3d' });
gsap.set('.puzzle-back', { rotationY: 180, autoAlpha: 0 });
gsap.set('.puzzle-full-image', { autoAlpha: 0 });
gsap.set('.puzzle-piece', { filter: 'drop-shadow(0px 14px 22px rgba(0,0,0,0.18))' });

const puzzleTl = gsap.timeline({
  scrollTrigger: {
    trigger: '#conditionals',
    start: 'top top',
    end: '+=3200',
    pin: true,
    scrub: 2,
    refreshPriority: 10,
  }
});

puzzleTl.from('.puzzle-piece', {
  x: () => gsap.utils.random(-1100, 1100),
  y: () => gsap.utils.random(-900, 900),
  rotation: () => gsap.utils.random(-300, 300),
  scale: () => gsap.utils.random(0.55, 1.35),
  opacity: 0,
  duration: 2,
  stagger: {
    each: 0.03,
    from: 'random'
  },
  ease: 'power3.out'
})
.to({}, { duration: 0.35 })
.to('.puzzle-piece', {
  opacity: 0,
  duration: 0.45,
  stagger: {
    each: 0.01,
    from: 'random'
  },
  ease: 'power2.inOut'
}, 'revealImage')
.to('.puzzle-full-image', {
  autoAlpha: 1,
  duration: 0.45,
  ease: 'power2.inOut'
}, 'revealImage')
.set('.puzzle-back', { autoAlpha: 1 })
.to('.puzzle-flip-inner', {
  rotationY: 180,
  duration: 1.5,
  ease: 'power2.inOut'
}, 'flipPoint')
.to('.puzzle-angry-gif', {
  opacity: 1,
  y: 0,
  duration: 0.6,
  ease: 'power2.out'
}, 'flipPoint+=1.6')
.to('.puzzle-piece', {
  filter: 'drop-shadow(0px 0px 0px rgba(0,0,0,0))',
  duration: 0.5
}, 'flipPoint');

ScrollTrigger.sort();
ScrollTrigger.refresh();

// --- 8. LOCAL STORAGE MEMORY TIMELINE ---
const memoryStage = document.querySelector(".memory-stage");
const thinker = document.querySelector(".memory-thinker");
const brainRotation = document.querySelector(".brain-rotation");
const brainZoom = document.querySelector(".brain-zoom");
const noteLeft = document.querySelector(".brain-note--left");
const noteRight = document.querySelector(".brain-note--right");

const brainFrames = {
  front: document.querySelector(".brain-frame--front"),
  quarters: document.querySelector(".brain-frame--quarters"),
  left: document.querySelector(".brain-frame--left"),
  back: document.querySelector(".brain-frame--back"),
  quartersFlip: document.querySelector(".brain-frame--quarters-flip"),
  right: document.querySelector(".brain-frame--right")
};

if (memoryStage && thinker && brainRotation && brainZoom && noteLeft && noteRight) {
  gsap.set([thinker, brainZoom, noteLeft, noteRight], { autoAlpha: 0 });
  gsap.set(brainRotation, { autoAlpha: 1 });
  gsap.set(thinker, { y: 320, scale: 0.8, xPercent: -50 });
  gsap.set(Object.values(brainFrames), { autoAlpha: 0 });
  gsap.set(brainZoom, { scale: 1, xPercent: -50, yPercent: -50 });

  const memoryTl = gsap.timeline({
    scrollTrigger: {
      trigger: "#memory",
      start: "top top",
      end: "+=4200",
      pin: true,
      scrub: true
    }
  });

  memoryTl
    .to(thinker, {
      autoAlpha: 1,
      y: -40,
      scale: 1,
      duration: 2.4,
      ease: "power3.out"
    })
    .to(thinker, {
      y: 110,
      duration: 1.2,
      ease: "elastic.out(1, 0.5)"
    })
    .to({}, { duration: 1.2 })
    .to(thinker, {
      scale: 3.6,
      x: -80,
      y: 40,
      duration: 3.8,
      ease: "power2.inOut",
      transformOrigin: "60% 18%"
    }, "+=1.0")
    .to(thinker, {
      autoAlpha: 0,
      duration: 1.0,
      ease: "power1.out"
    }, ">-0.2")
    .to(brainFrames.front, {
      autoAlpha: 1,
      duration: 0.9,
      ease: "power1.out"
    }, "<");

  [
    brainFrames.quarters,
    brainFrames.left,
    brainFrames.back,
    brainFrames.quartersFlip,
    brainFrames.right,
    brainFrames.front
  ].forEach((frame) => {
    memoryTl
      .to(Object.values(brainFrames), {
        autoAlpha: 0,
        duration: 0.4,
        ease: "power1.inOut"
      })
      .to(frame, {
        autoAlpha: 1,
        duration: 0.4,
        ease: "power1.inOut"
      }, "<");
  });

  memoryTl
    .to(Object.values(brainFrames), {
      autoAlpha: 0,
      duration: 0.4,
      ease: "power1.inOut"
    })
    .to(brainZoom, {
      autoAlpha: 1,
      duration: 0.5,
      ease: "power1.out"
    }, "<")
    .to(brainZoom, {
      scale: 3.0,
      x: -340,
      y: -260,
      transformOrigin: "top left",
      duration: 2.0,
      ease: "power2.inOut"
    })
    .to("#memory h2", {
      autoAlpha: 0,
      duration: 0.6,
      ease: "power1.out"
    }, "<+0.6")
    .to(noteLeft, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 0.7,
      ease: "elastic.out(1, 0.5)"
    }, "+=0.2")
    .to({}, { duration: 1.4 })
    .to(brainZoom, {
      x: -780,
      y: -260,
      duration: 1.6,
      ease: "power2.inOut"
    }, "+=0.4")
    .to(noteRight, {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 0.7,
      ease: "elastic.out(1, 0.5)"
    }, "+=0.4");
}

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

