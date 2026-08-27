const entryScreen = document.querySelector('#entryScreen');
const mainContent = document.querySelector('#mainContent');
const enterButton = document.querySelector('#enterButton');
const videoModal = document.querySelector('#videoModal');
const passwordScreen = document.querySelector('#passwordScreen');
const flowerBurst = document.querySelector('#flowerBurst');

const petalField = document.querySelector('.petal-field');
for (let index = 0; index < 36; index += 1) {
    const leaf = document.createElement('span');
    leaf.className = 'leaf-particle';
    leaf.style.setProperty('--left', `${Math.random() * 100}%`);
    leaf.style.setProperty('--size', `${4 + Math.random() * 5}px`);
    leaf.style.setProperty('--delay', `${Math.random() * -14}s`);
    leaf.style.setProperty('--duration', `${9 + Math.random() * 10}s`);
    leaf.style.setProperty('--drift', `${-18 + Math.random() * 36}vw`);
    petalField.appendChild(leaf);
}





let password = '';
const clickSfx = document.querySelector('#clickSfx');
const shapeSong = document.querySelector('#shapeSong');

document.querySelectorAll('#keypad button[data-key]').forEach((key) => {
    key.addEventListener('click', () => {
        clickSfx.currentTime = 0;
        clickSfx.play().catch(() => {});
        
        if (key.dataset.key === 'delete') password = password.slice(0, -1);
        else if (password.length < 4) password += key.dataset.key;
        document.querySelectorAll('#passwordDots i').forEach((dot, index) => dot.classList.toggle('filled', index < password.length));
        if (password.length === 4) {
            if (password === '0411') {
                shapeSong.currentTime = 141.5; // 2 minutes 21 seconds
                shapeSong.volume = 0;
                shapeSong.play().catch(() => {});
                // Smooth fade from 0% to 35%
                const fadeTo35 = setInterval(() => {
                    if (shapeSong.volume < 0.25) {
                        shapeSong.volume = Math.min(0.35, shapeSong.volume + 0.01);
                    } else {
                        clearInterval(fadeTo35);
                    }
                }, 30);
                passwordScreen.classList.add('exit');
                entryScreen.classList.remove('is-hidden');
                entryScreen.classList.add('arriving');
                window.setTimeout(() => entryScreen.classList.remove('arriving'), 900);
                window.setTimeout(() => passwordScreen.classList.add('is-hidden'), 700);
            } else {
                document.querySelector('#passwordHint').textContent = 'that is not it, try again';
                document.querySelector('#passwordDots').classList.add('shake');
                window.setTimeout(() => { password = ''; document.querySelectorAll('#passwordDots i').forEach((dot) => dot.classList.remove('filled')); document.querySelector('#passwordDots').classList.remove('shake'); }, 550);
            }
        }
    });
});

enterButton.addEventListener('click', () => {
    if (entryScreen.classList.contains('opening')) return;
    entryScreen.classList.add('opening');
    window.setTimeout(() => createFlowerBurst(45, true), 260);
    window.setTimeout(() => {
        entryScreen.classList.add('exit');
        mainContent.classList.remove('is-hidden');
        createFlowerBurst();
        // Smooth fade from 35% to 75%
        const fadeTo75 = setInterval(() => {
            if (shapeSong.volume < 0.75) {
                shapeSong.volume = Math.min(0.75, shapeSong.volume + 0.01);
            } else {
                clearInterval(fadeTo75);
            }
        }, 30);
        window.setTimeout(() => document.querySelector('.hero-copy').classList.add('visible'), 250);
    }, 1250);
});

function createFlowerBurst(openingBurst = false) {
    const flowers = ['✿', '✽', '❀', '✾', '✧', '♥'];
    flowerBurst.innerHTML = '';
    const flowerCount = openingBurst ? 45 : 210;
    flowerBurst.classList.toggle('opening-burst', openingBurst);
    if (openingBurst) {
        const giftBounds = document.querySelector('.gift-icon').getBoundingClientRect();
        flowerBurst.style.setProperty('--origin-x', `${giftBounds.left + giftBounds.width / 2}px`);
        flowerBurst.style.setProperty('--origin-y', `${giftBounds.top + giftBounds.height / 2}px`);
    }
    for (let index = 0; index < flowerCount; index += 1) {
        const flower = document.createElement('span');
        flower.className = 'burst-flower';
        flower.textContent = flowers[index % flowers.length];
        flower.style.setProperty('--x', `${Math.random() * 100}vw`);
        flower.style.setProperty('--y', `${Math.random() * 100}vh`);
        flower.style.setProperty('--size', openingBurst ? `${16 + Math.random() * 24}px` : `${30 + Math.random() * 66}px`);
        flower.style.setProperty('--delay', openingBurst ? `${(index / flowerCount) * .7 + Math.random() * .12}s` : `${(index % 7) * .16 + Math.random() * .35}s`);
        flower.style.setProperty('--duration', openingBurst ? `${1.8 + Math.random() * 1.4}s` : `${3.2 + Math.random() * 3.2}s`);
        flowerBurst.appendChild(flower);
    }
    flowerBurst.classList.add('blooming');
    window.setTimeout(() => flowerBurst.classList.remove('blooming'), 8500);
}

const birthDate = new Date('2007-08-26T00:00:00');
const counterUnits = [
    ['years', 'Years'], ['months', 'Months'], ['days', 'Days'],
    ['hours', 'Hours'], ['minutes', 'Minutes'], ['seconds', 'Seconds']
];
const counterGrid = document.querySelector('#counterGrid');

counterGrid.innerHTML = counterUnits.map(([key, label]) => `
	<div class="counter-item"><div class="counter-box"><span class="counter-number" data-counter="${key}">00</span></div><span class="counter-label">${label}</span></div>
`).join('');

function updateCounter() {
    const now = new Date();
    let years = now.getFullYear() - birthDate.getFullYear();
    let months = now.getMonth() - birthDate.getMonth();
    let days = now.getDate() - birthDate.getDate();
    if (days < 0) {
        months -= 1;
        const previousMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += previousMonth.getDate();
    }
    if (months < 0) { years -= 1; months += 12; }
    const anniversary = new Date(birthDate);
    anniversary.setFullYear(birthDate.getFullYear() + years);
    anniversary.setMonth(birthDate.getMonth() + months);
    anniversary.setDate(birthDate.getDate() + days);
    const elapsed = Math.max(0, now - anniversary);
    const hours = Math.floor(elapsed / 3600000) % 24;
    const minutes = Math.floor(elapsed / 60000) % 60;
    const seconds = Math.floor(elapsed / 1000) % 60;
    const values = { years, months, days, hours, minutes, seconds };
    counterUnits.forEach(([key]) => {
        const element = document.querySelector(`[data-counter="${key}"]`);
        element.textContent = String(values[key]).padStart(2, '0');
    });
}
updateCounter();
window.setInterval(updateCounter, 1000);

document.querySelectorAll('.love-card').forEach((card) => {
    card.setAttribute('aria-pressed', 'false');
    card.addEventListener('click', () => {
        if (card.classList.contains('is-flipped')) {
            card.classList.remove('is-flipped');
            card.setAttribute('aria-pressed', 'false');
            return;
        }
        card.classList.add('is-flipped');
        card.setAttribute('aria-pressed', 'true');
    });
});

petalField.classList.add('season-spring');
/*
    spring: [
        ['https://images.unsplash.com/photo-1490750967868-88aa4486c946?auto=format&fit=crop&w=900&q=85', 'Flowers in soft sunlight'],
        ['https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=900&q=85', 'A slice of birthday cake'],
        ['https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=900&q=85', 'Friends laughing together'],
        ['https://images.unsplash.com/photo-1506869640319-fe1a24fd76dc?auto=format&fit=crop&w=900&q=85', 'Friends enjoying a sunny day'],
        ['https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=900&q=85', 'Birthday celebration details']
    ],
    summer: [
        ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=85', 'A bright day by the sea'],
        ['https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?auto=format&fit=crop&w=900&q=85', 'Sunlight through the trees'],
        ['https://images.unsplash.com/photo-1539635278303-d4002c07eae3?auto=format&fit=crop&w=900&q=85', 'A summer adventure'],
        ['https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=900&q=85', 'A warm afternoon'],
        ['https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=85', 'A little summer escape']
    ],
    autumn: [
        ['https://images.unsplash.com/photo-1507371341162-763b5e419408?auto=format&fit=crop&w=900&q=85', 'Golden leaves and quiet walks'],
        ['https://images.unsplash.com/photo-1476837579993-f1d394a1ae67?auto=format&fit=crop&w=900&q=85', 'A crisp autumn morning'],
        ['https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=85', 'A road worth taking'],
        ['https://images.unsplash.com/photo-1504641963096-7f7e7b4aa0e3?auto=format&fit=crop&w=900&q=85', 'Cozy days together'],
        ['https://images.unsplash.com/photo-1508182311256-e3f7d7c8c5e9?auto=format&fit=crop&w=900&q=85', 'Autumn colors']
    ],
    winter: [
        ['https://images.unsplash.com/photo-1483664852095-d6cc6870702d?auto=format&fit=crop&w=900&q=85', 'A winter forest'],
        ['https://images.unsplash.com/photo-1517299321609-52687d1bc55a?auto=format&fit=crop&w=900&q=85', 'Warm lights in the cold'],
        ['https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=900&q=85', 'Evergreen memories'],
        ['https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=900&q=85', 'A quiet winter view'],
        ['https://images.unsplash.com/photo-1484101403633-562f891dc89a?auto=format&fit=crop&w=900&q=85', 'Home for the holidays']
    ]
}; */
document.querySelectorAll('.season').forEach((season) => {
    season.addEventListener('click', () => {
        document.querySelector('.season.active').classList.remove('active');
        season.classList.add('active');
        document.querySelectorAll('.season').forEach((tab) => tab.setAttribute('aria-selected', tab === season ? 'true' : 'false'));
        petalField.className = 'petal-field season-' + season.dataset.season;
    });
});

document.querySelector('#celebrateButton').addEventListener('click', () => {
    videoModal.classList.add('open');
    videoModal.setAttribute('aria-hidden', 'false');
    document.querySelector('#closeModal').focus();
});

function closeVideo() {
    videoModal.classList.remove('open');
    videoModal.setAttribute('aria-hidden', 'true');
}
document.querySelector('#closeModal').addEventListener('click', closeVideo);
videoModal.addEventListener('click', (event) => { if (event.target === videoModal) closeVideo(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeVideo(); });

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('visible'); });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));
