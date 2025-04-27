const audio = new Audio();

// Visualizer variables
let audioContext;
let analyser;
let dataArray;
let canvasCtx;
const visualizer = document.getElementById('visualizerCanvas');

let isPlaying = false;
let currentTrackIndex = 0;
let currentView = 'home';
let musicData = [];
let radioStations = [];
let funFacts = [
    "The Beatles' song 'A Day in the Life' features a 40-piece orchestra crescendo recorded in reverse",
    "The world's longest concert lasted 639 years and is still ongoing in Germany",
    "Music activates more parts of the brain than any other human activity",
    "Mozart wrote his first symphony at age 8",
    "The most expensive musical instrument ever sold was a Stradivarius violin for $15.9 million",
    "Studies show cows produce more milk when listening to relaxing music",
    "The national anthem of Spain has no official lyrics",
    "The shortest song ever recorded is 'You Suffer' by Napalm Death (1.316 seconds)",
    "Bob Marley's last words were 'Money can't buy life'",
    "The first song played in space was 'Happy Birthday' by the Apollo 9 crew",
    "The world's largest guitar was over 13 meters long",
    "Listening to music while exercising can improve performance by 15%",
    "The most expensive music video ever made was 'Scream' by Michael Jackson at $7 million",
    "The longest musical performance in history lasted 639 years",
    "Musical training can improve verbal memory by 90%",
    "The word 'music' comes from the Greek word 'mousike' meaning 'art of the Muses'",
    "The oldest known musical instrument is a 60,000-year-old Neanderthal flute",
    "The average person spends about 4 years of their life listening to music",
    "Music streams on Spotify travel about 12,000 miles before reaching your ears",
    "The most viewed music video on YouTube is 'Baby Shark Dance' with over 14 billion views"
];

// DOM Elements
const dom = {
    views: {
        home: document.getElementById('homeView'),
        music: document.getElementById('musicView'),
        radio: document.getElementById('radioView')
    },
    navItems: document.querySelectorAll('.nav-item'),
    featuredMusic: document.getElementById('featuredMusic'),
    featuredRadio: document.getElementById('featuredRadio'),
    musicGrid: document.getElementById('musicGrid'),
    radioGrid: document.getElementById('radioGrid'),
    funFact: document.getElementById('funFact'),
    searchInput: document.getElementById('searchInput'),
    playerElements: {
        albumArt: document.getElementById('currentAlbumArt'),
        track: document.getElementById('currentTrack'),
        artist: document.getElementById('currentArtist')
    }
};

// Initialize Application
document.addEventListener('DOMContentLoaded', async () => {
    await initializeMusicData();
    await initializeRadioData();
    setupNavigation();
    setupPlayerControls();
    setupScrollListener();
    setupSearch();
    switchView('home');
});

// Music Data Initialization
async function initializeMusicData() {
    try {
        musicData = await generateSoundHelixTracks(200);
    } catch (error) {
        console.error('Music initialization error:', error);
    }
}

async function generateSoundHelixTracks(count) {
    return Array.from({ length: count }, (_, i) => ({
        title: `Track ${i + 1}`,
        artist: "SoundHelix",
        url: `https://www.soundhelix.com/examples/mp3/SoundHelix-Song-${i + 1}.mp3`,
        art: `https://picsum.photos/200?random=${i + 1}`
    }));
}

// Radio Data Initialization
async function initializeRadioData() {
    try {
        const response = await fetch('https://de2.api.radio-browser.info/json/stations/topclick/50');
        radioStations = await response.json();
        radioStations = radioStations.filter(station => station.url).slice(0, 30);
    } catch (error) {
        console.error('Radio initialization error:', error);
    }
}

// View Management
function switchView(view) {
    currentView = view;
    Object.values(dom.views).forEach(v => {
        v.style.display = 'none';
        v.classList.remove('active');
    });
    dom.navItems.forEach(n => n.classList.remove('active'));

    const activeView = document.getElementById(`${view}View`);
    activeView.style.display = 'block';
    activeView.classList.add('active');
    document.querySelector(`[data-view="${view}"]`).classList.add('active');

    // Reset search when switching views
    dom.searchInput.value = '';

    if (view === 'home') renderHomeView();
    if (view === 'music') renderMusicGrid();
    if (view === 'radio') renderRadioGrid();
}

function setupNavigation() {
    dom.navItems.forEach(item => {
        item.addEventListener('click', () => {
            const view = item.dataset.view;
            if (view !== currentView) switchView(view);
        });
    });
}

// Search Functionality
function setupSearch() {
    dom.searchInput.addEventListener('input', debounce(handleSearch, 300));
}

function debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => func.apply(this, args), timeout);
    };
}

function handleSearch(e) {
    const query = e.target.value.toLowerCase();

    switch (currentView) {
        case 'home':
            filterHomeContent(query);
            break;
        case 'music':
            filterMusicGrid(query);
            break;
        case 'radio':
            filterRadioGrid(query);
            break;
    }
}

function filterHomeContent(query) {
    const filteredMusic = musicData.filter(track =>
        track.title.toLowerCase().includes(query) ||
        track.artist.toLowerCase().includes(query)
    ).slice(0, 8);

    const filteredRadio = radioStations.filter(station =>
        station.name.toLowerCase().includes(query) ||
        station.country.toLowerCase().includes(query)
    ).slice(0, 8);

    dom.featuredMusic.innerHTML = filteredMusic.map(createMusicCard).join('');
    dom.featuredRadio.innerHTML = filteredRadio.map(createRadioCard).join('');
    addMusicCardListeners(dom.featuredMusic);
    addRadioCardListeners(dom.featuredRadio);
}

function filterMusicGrid(query) {
    const filtered = musicData.filter(track =>
        track.title.toLowerCase().includes(query) ||
        track.artist.toLowerCase().includes(query)
    );
    dom.musicGrid.innerHTML = filtered.map(createMusicCard).join('');
    addMusicCardListeners(dom.musicGrid);
}

function filterRadioGrid(query) {
    const filtered = radioStations.filter(station =>
        station.name.toLowerCase().includes(query) ||
        station.country.toLowerCase().includes(query)
    );
    dom.radioGrid.innerHTML = filtered.map(createRadioCard).join('');
    addRadioCardListeners(dom.radioGrid);
}

// Rendering Functions
function renderHomeView() {
    dom.featuredMusic.innerHTML = musicData.slice(0, 8).map(createMusicCard).join('');
    addMusicCardListeners(dom.featuredMusic);
    dom.featuredRadio.innerHTML = radioStations.slice(0, 8).map(createRadioCard).join('');
    addRadioCardListeners(dom.featuredRadio);
    updateFunFact();
}

function renderMusicGrid() {
    dom.musicGrid.innerHTML = musicData.map(createMusicCard).join('');
    addMusicCardListeners(dom.musicGrid);
}

function renderRadioGrid() {
    dom.radioGrid.innerHTML = radioStations.map(createRadioCard).join('');
    addRadioCardListeners(dom.radioGrid);
}

// Card Creation
function createMusicCard(track, index) {
    return `
        <div class="card" data-index="${index}">
            <div class="cover-art">
                <img src="${track.art}" alt="${track.title}" loading="lazy">
            </div>
            <div class="card-title">${track.title}</div>
            <div class="card-subtitle">${track.artist}</div>
        </div>
    `;
}

function createRadioCard(station) {
    const initials = station.name.match(/\b(\w)/g)?.join('').slice(0, 2) || '??';
    const color = stringToColor(station.name);
    return `
        <div class="card" data-url="${station.url}">
            <div class="cover-art radio-art" style="background: ${color}">
                ${initials}
            </div>
            <div class="card-title">${station.name}</div>
            <div class="card-subtitle">${station.country}</div>
        </div>
    `;
}

// Event Listeners
function addMusicCardListeners(container) {
    container.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => playTrack(card.dataset.index));
    });
}

function addRadioCardListeners(container) {
    container.querySelectorAll('.card').forEach(card => {
        card.addEventListener('click', () => {
            playRadio(card.dataset.url);
            updateRadioMetadata(card);
        });
    });
}

// Player Controls
function setupPlayerControls() {
    document.getElementById('playPause').addEventListener('click', togglePlayback);
    document.getElementById('prev').addEventListener('click', playPrevious);
    document.getElementById('next').addEventListener('click', playNext);
    document.querySelector('.progress-bar').addEventListener('click', seekTrack);
    document.getElementById('volume').addEventListener('input', updateVolume);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', playNext);
    audio.addEventListener('error', handleAudioError);
}

function togglePlayback() {
    if (isPlaying) {
        audio.pause();
    } else {
        audio.play();
        if (audioContext) draw();
    }
    isPlaying = !isPlaying;
    updatePlayButton();
}

function playPrevious() {
    currentTrackIndex = (currentTrackIndex - 1 + musicData.length) % musicData.length;
    playTrack(currentTrackIndex);
}

function playNext() {
    currentTrackIndex = (currentTrackIndex + 1) % musicData.length;
    playTrack(currentTrackIndex);
}

function playTrack(index) {
    currentTrackIndex = index;
    const track = musicData[index];
    audio.src = track.url;
    audio.play().catch(handleAudioError);
    isPlaying = true;
    updatePlayButton();
    updatePlayerMetadata(track);
    
    // Initialize visualizer on first play
    if (!audioContext) {
        initVisualizer();
        // Start after user interaction
        audioContext.resume().then(() => {
            draw();
        });
    } else {
        draw();
    }
}

async function playRadio(url) {
    try {
        audio.src = url;
        await audio.play();
        isPlaying = true;
        updatePlayButton();
    } catch (error) {
        handleAudioError(error);
    }
}

function updatePlayerMetadata(track) {
    dom.playerElements.albumArt.innerHTML = `<img src="${track.art}" alt="${track.title}">`;
    dom.playerElements.track.textContent = track.title;
    dom.playerElements.artist.textContent = track.artist;
}

function updateRadioMetadata(card) {
    dom.playerElements.albumArt.innerHTML = card.querySelector('.radio-art').outerHTML;
    dom.playerElements.track.textContent = card.querySelector('.card-title').textContent;
    dom.playerElements.artist.textContent = card.querySelector('.card-subtitle').textContent;
}

function updatePlayButton() {
    document.getElementById('playPause').innerHTML = `
        <i class="fas ${isPlaying ? 'fa-pause' : 'fa-play'}"></i>
    `;
}

function updateProgress() {
    const progress = (audio.currentTime / audio.duration) * 100 || 0;
    document.querySelector('.progress').style.width = `${progress}%`;
}

function updateVolume(e) {
    audio.volume = e.target.value;
}

function seekTrack(e) {
    const rect = e.target.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pos * audio.duration;
}

// Helper Functions
function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${Math.abs(hash % 360)}, 60%, 40%)`;
}

let lastScrollUpdate = 0;
function setupScrollListener() {
    window.addEventListener('scroll', () => {
        if (Date.now() - lastScrollUpdate > 2000) {
            updateFunFact();
            lastScrollUpdate = Date.now();
        }
    });
}

function updateFunFact() {
    dom.funFact.textContent = funFacts[Math.floor(Math.random() * funFacts.length)];
}

function handleAudioError(error) {
    console.error('Audio error:', error);
    isPlaying = false;
    updatePlayButton();
    alert('Error playing audio. Please try another source.');
}

function initVisualizer() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaElementSource(audio);

    source.connect(analyser);
    analyser.connect(audioContext.destination);

    analyser.fftSize = 256;
    const bufferLength = analyser.frequencyBinCount;
    dataArray = new Uint8Array(bufferLength);

    canvasCtx = visualizer.getContext('2d');
    visualizer.width = visualizer.offsetWidth;
    visualizer.height = visualizer.offsetHeight;
}

// Draw visualization
function draw() {
    if (!isPlaying) return;

    requestAnimationFrame(draw);
    analyser.getByteFrequencyData(dataArray);

    canvasCtx.fillStyle = '#0f0f0f';
    canvasCtx.fillRect(0, 0, visualizer.width, visualizer.height);

    const barWidth = (visualizer.width / dataArray.length) * 2.5;
    let x = 0;

    for (let i = 0; i < dataArray.length; i++) {
        const barHeight = (dataArray[i] / 255) * visualizer.height;
        const gradient = canvasCtx.createLinearGradient(0, visualizer.height, 0, 0);
        gradient.addColorStop(0, '#1db954');
        gradient.addColorStop(1, '#1db95433');

        canvasCtx.fillStyle = gradient;
        canvasCtx.fillRect(x, visualizer.height - barHeight, barWidth, barHeight);
        x += barWidth + 2;
    }
}