// Event listeners untuk navigasi
document.getElementById('juz-btn').addEventListener('click', () => showSection('juz-list', loadJuz));
document.getElementById('surah-btn').addEventListener('click', () => showSection('surah-list', loadSurah));
document.getElementById('tajwid-btn').addEventListener('click', () => showSection('tajwid-section'));
document.getElementById('tafsir-btn').addEventListener('click', () => showSection('tafsir-section', loadTafsirOptions));

// Fungsi umum
function showSection(id, callback) {
    document.querySelectorAll('.section').forEach(sec => sec.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    if (callback) callback();
}

// Load Juz (30 Juz)
function loadJuz() {
    const content = document.getElementById('juz-content');
    content.innerHTML = '';
    for (let i = 1; i <= 30; i++) {
        content.innerHTML += `<div class="juz-item" onclick="loadJuzDetail(${i})">Juz ${i}</div>`;
    }
}

function loadJuzDetail(juz) {
    // Fetch ayat dari Juz (gunakan API)
    fetch(`https://api.alquran.cloud/v1/juz/${juz}`)
        .then(res => res.json())
        .then(data => {
            const content = document.getElementById('juz-content');
            content.innerHTML = `<h3>Juz ${juz}</h3>` + data.data.ayahs.map(ayah => `
                <div class="surah-item">
                    <p class="arab-text">${ayah.text}</p>
                    <p class="translation">${ayah.translation || 'Terjemahan tidak tersedia'}</p>
                </div>
            `).join('');
        });
}

// Load Surah (114 Surah)
function loadSurah() {
    const content = document.getElementById('surah-content');
    content.innerHTML = '';
    fetch('https://api.alquran.cloud/v1/surah')
        .then(res => res.json())
        .then(data => {
            data.data.forEach(surah => {
                content.innerHTML += `<div class="surah-item" onclick="loadSurahDetail(${surah.number})">${surah.number}. ${surah.englishName} (${surah.name})</div>`;
            });
        });
}

function loadSurahDetail(number) {
    fetch(`https://api.alquran.cloud/v1/surah/${number}`)
        .then(res => res.json())
        .then(data => {
            const content = document.getElementById('surah-content');
            content.innerHTML = `<h3>${data.data.englishName} (${data.data.name})</h3>` + data.data.ayahs.map(ayah => `
                <div class="surah-item">
                    <p class="arab-text">${ayah.text}</p>
                    <p class="translation">${ayah.translation || 'Terjemahan tidak tersedia'}</p>
                </div>
            `).join('');
        });
}

// Load Tafsir Options
function loadTafsirOptions() {
    const select = document.getElementById('surah-select');
    select.innerHTML = '<option value="">Pilih Surah</option>';
    fetch('https://api.alquran.cloud/v1/surah')
        .then(res => res.json())
        .then(data => {
            data.data.forEach(surah => {
                select.innerHTML += `<option value="${surah.number}">${surah.number}. ${surah.englishName}</option>`;
            });
        });
    select.addEventListener('change', (e) => loadTafsir(e.target.value));
}

function loadTafsir(surahNumber) {
    if (!surahNumber) return;
    fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`)
        .then(res => res.json())
        .then(data => {
            const content = document.getElementById('tafsir-content');
            content.innerHTML = data.data.ayahs.map(ayah => `
                <div class="surah-item">
                    <p class="arab-text">${ayah.text}</p>
                    <p class="translation">${ayah.translation || 'Terjemahan tidak tersedia'}</p>
                    <p class="tafsir-text"><strong>Tafsir:</strong> ${ayah.tafsir || 'Tafsir tidak tersedia (gunakan API tambahan seperti Tafsir Ibn Kathir)'}</p>
                </div>
            `).join('');
        });
}