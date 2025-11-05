document.addEventListener('DOMContentLoaded', () => {
    const status = document.getElementById('status');
    const gallery = document.getElementById('gallery');
    const search = document.getElementById('search');
    let countries = [];

    function createCard(country) {
        const flag = country.flags && country.flags.svg ? country.flags.svg : '';
        const name = country.name && country.name.common ? country.name.common : 'Nincs adat';
        const capital = country.capital && country.capital.length ? country.capital[0] : 'Nincs adat';
        const region = country.region ? country.region : 'Nincs adat';
        return `<div class="card">
            <img src="${flag}" alt="${name} zászlója">
            <h2>${name}</h2>
            <p><strong>Főváros:</strong> ${capital}</p>
            <p><strong>Régió:</strong> ${region}</p>
        </div>`;
    }

    function renderGallery(list) {
        gallery.innerHTML = list.map(createCard).join('');
    }

    function filterCountries() {
        const query = search.value.toLowerCase();
        const filtered = countries.filter(c => c.name.common.toLowerCase().includes(query));
        renderGallery(filtered);
    }

    search.addEventListener('input', filterCountries);

    async function fetchCountries() {
        status.textContent = 'Betöltés folyamatban...';
        gallery.innerHTML = '';
        try {
            const res = await fetch('https://restcountries.com/v3.1/all?fields=name,flags,capital,region');
            if (!res.ok) throw new Error(res.statusText);
            countries = await res.json();
            if (!Array.isArray(countries) || countries.length === 0) {
                throw new Error('Nem érkezett ország adat.');
            }
            status.textContent = '';
            renderGallery(countries);
        } catch (err) {
            status.textContent = 'HIBA: ' + err.message + '\nPélda országok:';
            
            countries = [
                {
                    name: { common: 'Magyarország' },
                    flags: { svg: 'https://flagcdn.com/hu.svg' },
                    capital: ['Budapest'],
                    region: 'Europe'
                },
                {
                    name: { common: 'Németország' },
                    flags: { svg: 'https://flagcdn.com/de.svg' },
                    capital: ['Berlin'],
                    region: 'Europe'
                },
                {
                    name: { common: 'Japán' },
                    flags: { svg: 'https://flagcdn.com/jp.svg' },
                    capital: ['Tokio'],
                    region: 'Asia'
                },
                {
                    name: { common: 'Franciaország' },
                    flags: { svg: 'https://flagcdn.com/fr.svg' },
                    capital: ['Párizs'],
                    region: 'Europe'
                },
                {
                    name: { common: 'Brazília' },
                    flags: { svg: 'https://flagcdn.com/br.svg' },
                    capital: ['Brasília'],
                    region: 'Americas'
                },
                {
                    name: { common: 'Ausztrália' },
                    flags: { svg: 'https://flagcdn.com/au.svg' },
                    capital: ['Canberra'],
                    region: 'Oceania'
                },
                {
                    name: { common: 'Egyesült Királyság' },
                    flags: { svg: 'https://flagcdn.com/gb.svg' },
                    capital: ['London'],
                    region: 'Europe'
                },
                {
                    name: { common: 'Oroszország' },
                    flags: { svg: 'https://flagcdn.com/ru.svg' },
                    capital: ['Moszkva'],
                    region: 'Europe'
                },
                {
                    name: { common: 'Kína' },
                    flags: { svg: 'https://flagcdn.com/cn.svg' },
                    capital: ['Peking'],
                    region: 'Asia'
                },
                {
                    name: { common: 'USA' },
                    flags: { svg: 'https://flagcdn.com/us.svg' },
                    capital: ['Washington D.C.'],
                    region: 'Americas'
                }
            ];
            renderGallery(countries);
            
            fetch('orszagok.json')
                .then(r => r.json())
                .then(data => {
                    countries = data;
                    renderGallery(countries);
                })
                .catch(() => {
                    status.textContent += '\nNem sikerült a helyi országlista betöltése.';
                });
            return;
        }
    }

    fetchCountries();
});