document.addEventListener('DOMContentLoaded', function () {
    crtP();
    stCd();
    addSA();
    addPE();
});

function crtP() {
    const cont = document.getElementById('particles');
    const num = 25;

    for (let i = 0; i < num; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        p.style.left = Math.random() * 100 + '%';
        p.style.animationDelay = Math.random() * 8 + 's';
        p.style.animationDuration = (6 + Math.random() * 4) + 's';
        p.style.width = (2 + Math.random() * 4) + 'px';
        p.style.height = p.style.width;
        cont.appendChild(p);
    }
}

function stCd() {
    const bDay = new Date(new Date().getFullYear(), 8, 23);
    const now = new Date();

    if (now > bDay) {
        bDay.setFullYear(bDay.getFullYear() + 1);
    }

    function upd() {
        const curr = new Date();
        const diff = bDay - curr;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hrs = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(3, '0');
        document.getElementById('hours').textContent = String(hrs).padStart(2, '0');
        document.getElementById('minutes').textContent = String(mins).padStart(2, '0');
        document.getElementById('seconds').textContent = String(secs).padStart(2, '0');
    }

    upd();
    setInterval(upd, 1000);
}

function addSA() {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });

    const secs = document.querySelectorAll('section, .hero-section');
    secs.forEach((sec, i) => {
        sec.classList.add('blur-reveal');
        sec.style.transitionDelay = `${i * 0.15}s`;
        obs.observe(sec);
    });

    const style = document.createElement('style');
    style.textContent = `
        section.visible, .hero-section.visible {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        .blur-reveal.revealed {
            opacity: 1 !important;
            filter: blur(0) !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    const scrInd = document.querySelector('.scroll-indicator');
    if (scrInd) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                scrInd.style.opacity = '0';
                scrInd.style.pointerEvents = 'none';
            } else {
                scrInd.style.opacity = '1';
                scrInd.style.pointerEvents = 'auto';
            }
        });
    }
}

function addPE() {
    document.addEventListener('mousemove', (e) => {
        const cards = document.querySelectorAll('.info-card, .social-card, .group-card');
        cards.forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
                const xPct = (x / rect.width - 0.5) * 10;
                const yPct = (y / rect.height - 0.5) * 10;
                card.style.transform = `perspective(1000px) rotateX(${-yPct}deg) rotateY(${xPct}deg) translateY(-8px)`;
            }
        });
    });

    document.querySelectorAll('.info-card, .social-card, .group-card').forEach(card => {
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

document.querySelectorAll('.social-card, .group-card').forEach(link => {
    link.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            background: rgba(212, 175, 55, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;

        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero-section');
    if (hero) {
        hero.style.transform = `translateY(${scrolled * 0.3}px)`;
        hero.style.opacity = 1 - (scrolled * 0.002);
    }
});