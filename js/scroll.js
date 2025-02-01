/**
 * Initialize scroll behavior for the week container
 * @param {HTMLElement} weekContainer - Week container element
 */
export function initializeScroll(weekContainer) {
    let lastScrollLeft = weekContainer.scrollLeft;
    let touchStartX = 0;
    let touchStartScroll = 0;

    // Scroll to top when changing weeks
    // weekContainer.addEventListener('scroll', () => {
    //     const currentScrollLeft = weekContainer.scrollLeft;
    //     const weekWidth = window.innerWidth;
        
    //     // Check if we've scrolled to a new week
    //     if (Math.abs(currentScrollLeft - lastScrollLeft) >= weekWidth / 2) {
    //         window.scrollTo({ top: 0, behavior: 'smooth' });
    //         lastScrollLeft = Math.round(currentScrollLeft / weekWidth) * weekWidth;
    //     }
    // });

    // Touch event handlers for smooth scrolling
    weekContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
        touchStartScroll = weekContainer.scrollLeft;
        lastScrollLeft = weekContainer.scrollLeft;
    });

    weekContainer.addEventListener('touchend', () => {
        const weekWidth = window.innerWidth;
        const currentWeek = Math.round(weekContainer.scrollLeft / weekWidth);
        weekContainer.scrollTo({
            left: currentWeek * weekWidth,
            behavior: 'smooth'
        });
    });
}
