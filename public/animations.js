// Shared animation script using IntersectionObserver for scroll-triggered animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('appear');
        }
    });
}, observerOptions);

function observeScrollAnimations() {
    const animateElements = document.querySelectorAll('.animate-on-scroll:not(.appear)');
    animateElements.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', observeScrollAnimations);

// Expose globally for dynamic content
window.observeScrollAnimations = observeScrollAnimations;
