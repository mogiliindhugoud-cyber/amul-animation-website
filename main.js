// Wait for DOM to be ready
document.addEventListener("DOMContentLoaded", () => {
    // Register GSAP ScrollTrigger plugin
    gsap.registerPlugin(ScrollTrigger);

    const canvas = document.getElementById("animation-canvas");
    const context = canvas.getContext("2d");

    let totalFrames = 268;
    const images = [];
    let loadedCount = 0;

    const loaderBar = document.getElementById("loader-bar");
    const loaderText = document.getElementById("loader-text");
    const preloader = document.getElementById("preloader");

    const animationState = {
        frame: 0
    };

    function getFrameUrl(index) {
        const frameNum = String(index).padStart(3, '0');
       return 'image/ezgif-frame-' + frameNum + '.jpg';
    }

    // Preload all frames
    function preloadImages() {
        return new Promise((resolve) => {
            for (let i = 1; i <= totalFrames; i++) {
                const img = new Image();
                img.src = getFrameUrl(i);
                img.onload = () => {
                    loadedCount++;
                    const progress = Math.floor((loadedCount / totalFrames) * 100);
                    
                    // Update preloader UI
                    loaderBar.style.width = `${progress}%`;
                    loaderText.textContent = `Loading Experience ${progress}%`;
                    
                    if (loadedCount === totalFrames) {
                        resolve();
                    }
                };
                img.onerror = () => {
                    // Fallback to continue loading if single frame fails
                    loadedCount++;
                    const progress = Math.floor((loadedCount / totalFrames) * 100);
                    
                    // Update preloader UI
                    loaderBar.style.width = `${progress}%`;
                    loaderText.textContent = `Loading Experience ${progress}%`;
                    
                    if (loadedCount === totalFrames) {
                        resolve();
                    }
                };
                images.push(img);
            }
        });
    }

    // Aspect ratio-aware image drawing
    function renderImage() {
        const frameIndex = Math.round(animationState.frame);
        const img = images[frameIndex];
        if (!img) return;

        context.clearRect(0, 0, canvas.width, canvas.height);

        // Enable high-quality image smoothing
        context.imageSmoothingEnabled = true;
        context.imageSmoothingQuality = "high";

        const imgWidth = img.naturalWidth || img.width;
        const imgHeight = img.naturalHeight || img.height;
        const canvasWidth = canvas.width;
        const canvasHeight = canvas.height;

        const imgRatio = imgWidth / imgHeight;
        const canvasRatio = canvasWidth / canvasHeight;

        let drawWidth, drawHeight, drawX, drawY;

        if (canvasRatio > imgRatio) {
            // Canvas is wider than image aspect ratio
            drawWidth = canvasWidth;
            drawHeight = canvasWidth / imgRatio;
            drawX = 0;
            drawY = (canvasHeight - drawHeight) / 2;
        } else {
            // Canvas is taller than image aspect ratio
            drawWidth = canvasHeight * imgRatio;
            drawHeight = canvasHeight;
            drawX = (canvasWidth - drawWidth) / 2;
            drawY = 0;
        }

        context.drawImage(img, drawX, drawY, drawWidth, drawHeight);
    }

    // Handle canvas sizing dynamically (Retina/High-DPI aware)
    function resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = window.innerWidth * dpr;
        canvas.height = window.innerHeight * dpr;
        canvas.style.width = `${window.innerWidth}px`;
        canvas.style.height = `${window.innerHeight}px`;
        renderImage();
    }

    // Initialize ScrollTrigger and GSAP timeline
    function initScrollAnimation() {
        // Setup initial canvas size
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        // Build Master Scroll Timeline
        const masterTimeline = gsap.timeline({
            scrollTrigger: {
                trigger: ".animation-section",
                start: "top top",
                end: "bottom bottom",
                scrub: 0.8
            }
        });

        // 1. Scrub through frames
        masterTimeline.to(animationState, {
            frame: totalFrames - 1,
            snap: "frame",
            ease: "none",
            onUpdate: renderImage,
            duration: 10
        }, 0);

        // 2. Fade out text overlay by 30% of the scroll animation section
        masterTimeline.to("#scroll-hero-text", {
            opacity: 0,
            y: -50,
            ease: "power1.out",
            duration: 3
        }, 0);


    }

    preloadImages().then(() => {
        // Fade out preloader
        preloader.classList.add("fade-out");
        
        // Let user scroll once loaded
        document.body.style.overflow = "auto";
        
        // Initial setup and animation start
        initScrollAnimation();
    });

    // Scroll event listener for transparent navigation bar
    window.addEventListener("scroll", () => {
        const nav = document.getElementById("top-nav");
        if (window.scrollY > 50) {
            nav.classList.add("bg-white/95", "shadow-md", "py-2", "border-b-outline-variant/30");
            nav.classList.remove("bg-transparent", "py-4", "border-white/10");
        } else {
            nav.classList.add("bg-transparent", "py-4", "border-white/10");
            nav.classList.remove("bg-white/95", "shadow-md", "py-2", "border-b-outline-variant/30");
        }
    });
});
