document.addEventListener('DOMContentLoaded', () => {
    const mobileMenuBtn = document.querySelector('.mobile-menu-toggle');
    const navList = document.querySelector('.nav-list');

    if (mobileMenuBtn && navList) {
        mobileMenuBtn.addEventListener('click', () => {
            const isExpanded = mobileMenuBtn.getAttribute('aria-expanded') === 'true';
            mobileMenuBtn.setAttribute('aria-expanded', !isExpanded);
            navList.classList.toggle('active');

            // Optional: Animate hamburger to X
            mobileMenuBtn.classList.toggle('open');
        });
    }

    // FAQ Accordion Logic (will be used on FAQ page)
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all others (optional - for accordion behavior)
            faqItems.forEach(otherItem => {
                if (otherItem !== item) otherItem.classList.remove('active');
            });

            // Toggle current
            item.classList.toggle('active', !isActive);
        });
    });

    // Scroll Animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.section, .class-card, .team-member, .review-card, .donation-card').forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });

    // Session Card Expansion Logic (Character Truncation)
    document.querySelectorAll('.class-card').forEach(card => {
        const descContainer = card.querySelector('.class-description');
        const btn = card.querySelector('.toggle-desc-btn');

        if (descContainer && btn) {
            // Store the full HTML (Source of Truth)
            const fullContent = descContainer.innerHTML;

            // Generate Truncated Version
            const textContent = descContainer.innerText; // Get raw text
            const charLimit = 160;

            let truncatedContent = textContent;
            if (textContent.length > charLimit) {
                // Cut at limit
                let subString = textContent.substr(0, charLimit);
                // Cut at last space to avoid splitting words
                subString = subString.substr(0, subString.lastIndexOf(" "));
                truncatedContent = subString + "...";
            }

            // Set Initial State (Truncated)
            descContainer.innerText = truncatedContent;

            // Toggle Logic
            btn.addEventListener('click', () => {
                const isExpanded = btn.getAttribute('data-expanded') === 'true';

                if (isExpanded) {
                    // Switch to Truncated
                    descContainer.innerText = truncatedContent;
                    btn.textContent = 'Read More';
                    btn.setAttribute('data-expanded', 'false');
                } else {
                    // Switch to Full HTML
                    descContainer.innerHTML = fullContent;
                    btn.textContent = 'Show Less';
                    btn.setAttribute('data-expanded', 'true');
                }
            });
        }
    });

    // Raffle prize photo carousel (raffle.html)
    const raffleCarousel = document.querySelector('[data-raffle-carousel]');
    if (raffleCarousel) {
        const track = raffleCarousel.querySelector('.raffle-carousel__track');
        const slides = raffleCarousel.querySelectorAll('.raffle-carousel__slide');
        const prevBtn = raffleCarousel.querySelector('[data-carousel-prev]');
        const nextBtn = raffleCarousel.querySelector('[data-carousel-next]');
        const dotButtons = raffleCarousel.querySelectorAll('[data-carousel-dot]');
        const total = slides.length;
        let index = 0;

        function setSlideAttributes() {
            slides.forEach((slide, i) => {
                slide.setAttribute('aria-hidden', i !== index ? 'true' : 'false');
            });
            dotButtons.forEach((dot, i) => {
                const selected = i === index;
                dot.setAttribute('aria-selected', selected);
                dot.tabIndex = selected ? 0 : -1;
            });
        }

        function goTo(i) {
            index = ((i % total) + total) % total;
            if (track) {
                const step = 100 / total;
                track.style.transform = `translateX(-${index * step}%)`;
            }
            setSlideAttributes();
        }

        prevBtn?.addEventListener('click', () => goTo(index - 1));
        nextBtn?.addEventListener('click', () => goTo(index + 1));
        dotButtons.forEach((dot) => {
            const i = parseInt(dot.getAttribute('data-carousel-dot'), 10);
            if (!Number.isNaN(i)) {
                dot.addEventListener('click', () => goTo(i));
            }
        });

        goTo(0);
    }
});
