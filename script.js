// Inicjalizacja animacji przy skrolowaniu
AOS.init({
    duration: 1000,
    once: true,
    offset: 100
});

// Słownik tłumaczeń dla lig piłkarskich
const leaguesPl = {
    "England: Premier League": "Premier League (Anglia)",
    "Spain: La Liga": "La Liga (Hiszpania)",
    "Italy: Serie A": "Serie A (Włochy)",
    "Germany: Bundesliga": "Bundesliga (Niemcy)",
    "UEFA Champions League": "Liga Mistrzów",
    "UEFA Europa League": "Liga Europy",
    "Poland: Ekstraklasa": "Ekstraklasa"
};

async function fetchFootballMatches() {
    const matchContainer = document.getElementById('match-list');
    
    try {
        // Używamy darmowego ScoreBat Video API
        const response = await fetch('https://www.scorebat.com/video-api/v3/');
        const data = await response.json();
        
        matchContainer.innerHTML = ''; // Czyścimy loader

        // Wybieramy 6 najświeższych wpisów piłkarskich
        const matches = data.response.slice(0, 6);

        matches.forEach((match, index) => {
            let leagueName = match.competition;
            // Tłumaczenie jeśli nazwa jest w słowniku
            for (const [en, pl] of Object.entries(leaguesPl)) {
                if (leagueName.includes(en)) leagueName = pl;
            }

            const card = document.createElement('div');
            card.className = 'match-card';
            card.setAttribute('data-aos', 'fade-up');
            card.setAttribute('data-aos-delay', (index * 100).toString());

            card.innerHTML = `
                <div class="league-tag">${leagueName}</div>
                <h3 style="margin: 15px 0; font-size: 1.5rem;">${match.title}</h3>
                <a href="${match.matchviewUrl}" target="_blank" style="color: #ffcc00; text-decoration: none; font-size: 0.9rem; font-weight: bold;">SPRAWDŹ SZCZEGÓŁY →</a>
            `;
            matchContainer.appendChild(card);
        });

    } catch (error) {
        console.error("Błąd ładowania meczów:", error);
        matchContainer.innerHTML = '<p class="center">Zadzwoń do nas, aby sprawdzić dzisiejszy rozkład jazdy!</p>';
    }
}

// Obsługa paska nawigacji przy skrolowaniu
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.style.padding = '8px 0';
        nav.style.background = 'rgba(0,0,0,0.98)';
    } else {
        nav.style.padding = '15px 0';
        nav.style.background = 'rgba(0,0,0,0.95)';
    }
});

// Start
document.addEventListener('DOMContentLoaded', fetchFootballMatches);