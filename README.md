# Music-radio-streaming
an online music and radio streaming website. 

A responsive web application for streaming music and radio stations, built with modern web technologies.

🛠️ Development Highlights
🌐 API Integration
Radio Browser API Implementation
Integrated the Radio Browser API to fetch real-time radio station data:

***javascript <br>
async function initializeRadioData() { <br>
  const response = await fetch('https://de2.api.radio-browser.info/json/stations/topclick/50'); <br>
  radioStations = await response.json(); <br>
}** <br>

Dynamic audio source handling for both local and external streams

CORS proxy implementation for radio station streaming

Asynchronous data fetching with error handling

<h2>🎨 CSS Architecture </h2>
Responsive Design System:

Mobile-first approach with breakpoints at 768px and 480px

Flexible grid layout using CSS Grid and Flexbox

Smooth animations and transitions for UI interactions

css
@media (max-width: 768px) { <br>
  .sidebar { width: 70px } <br>
  .grid { grid-template-columns: repeat(2, 1fr) } <br>
} <br>
**Advanced Features:**

Custom scrollbar styling

Complex gradient backgrounds

Dynamic color generation for radio station cards

***javascript <br>
function stringToColor(str) { <br>
  // Generates HSL color from string hash <br>
}*** <br>
Performance optimizations:

Lazy loading for images

CSS hardware acceleration for animations

Efficient selector hierarchy

**⚡ JavaScript Functionality**
Core Features:

Audio visualization using Web Audio API and Canvas

**javascript <br>
function initVisualizer() { <br>
  audioContext = new AudioContext(); <br> 
  analyser = audioContext.createAnalyser(); <br>
  draw(); // Animation frame-based rendering <br>
} <br>**
<h5> State management for: <br>

Active view tracking

Playback status

Current track index </h5>

Search implementation with debounce:

***javascript <br>
function debounce(func, timeout = 300) { <br>
  let timer;<br>
  return (...args) => { <br>
    clearTimeout(timer); <br>
    timer = setTimeout(() => func(...args), timeout); <br>
  }; <br>
}*** <br>
Performance Optimizations:

Efficient DOM manipulation using document fragments

Event delegation for dynamic elements

Memory management for audio resources

Throttled scroll listeners

<h3>🚀 Installation & Usage</h3>
Clone repository

Open index.html in modern browser

No build step required - pure ES6 implementation

<h3>🔧 Technical Challenges</h3>
Audio Context Limitations: Implemented user gesture requirements for audio playback

Cross-Origin Restrictions: Developed proxy pattern for radio streams

State Synchronization: Maintained consistent UI across multiple views

Performance: Optimized canvas rendering for smooth visualization

<h3>📱 Responsive Features</h3>
Adaptive sidebar navigation (full ➔ compact)

Dynamic grid layouts (4 → 2 columns on mobile)

Touch-friendly controls

Viewport-aware element sizing

Mobile-optimized player controls

<h3>🌟 Key Features</h3>
Real-time audio visualization

Cross-fade transitions between tracks

Background audio persistence

Search-as-you-type functionality

Progressive Web App fundamentals

<h3>📚 Technology Stack</h3>
Core: Vanilla JavaScript (ES6+)

Styling: Pure CSS with custom properties

APIs: Radio Browser API, Web Audio API

Packages: Font Awesome icons

***📜 License***
MIT License - Free for educational and personal use
