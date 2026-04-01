// Inicjalizacja AOS
AOS.init({
    duration: 800,
    once: true,
    offset: 100
});

// Funkcja ładowania meczów
async function fetchMatches() {
    const list = document.getElementById('match-list');
    try {
        const response = await fetch('https://www.scorebat.com/video-api/v3/');
        const data = await response.json();
        
        list.innerHTML = '';
        // Wybieramy 4 najnowsze transmisje
        const recent = data.response.slice(0, 4);

        recent.forEach((m, i) => {
            const card = document.createElement('div');
            card.className = 'match-card';
            card.setAttribute('data-aos', 'fade-up');
            card.setAttribute('data-aos-delay', (i * 100).toString());

            card.innerHTML = `
                <small class="yellow" style="text-transform: uppercase; letter-spacing: 1px;">${m.competition}</small>
                <h3 style="margin:12px 0; font-size: 1.4rem;">${m.title}</h3>
                <a href="${m.matchviewUrl}" target="_blank" style="color:white; font-size:0.85rem; text-decoration:none; font-weight: bold;">INFO O TRANSMISJI →</a>
            `;
            list.appendChild(card);
        });
    } catch (e) {
        list.innerHTML = '<p class="center">Zadzwoń do nas, by sprawdzić dzisiejsze mecze!</p>';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    fetchMatches();
    // Odświeżenie animacji po załadowaniu treści
    setTimeout(() => { AOS.refresh(); }, 1500);
});