let maxSpaceStationImages = 7
let maxStarSystemImages = 5
let starSystem = generateStarSystem()
let hudTitle = document.querySelector('#hud-title')
let hudLocation = document.querySelector('#hud-location')
hudTitle.textContent = starSystem.name
let pilotWindow = document.querySelector('#pilot-window')
pilotWindow.style.backgroundImage = starSystem.image
let navigation = document.querySelector('#navigation')
let spaceStations = []
let maxStations = Math.floor(Math.random() * 10) + 1
let playerSunDistance = 0
let navigationInterval
function generateStation() {
  const spaceStationNames1 = [
    "Lunaris",
    "Stellar",
    "Nebula",
    "Galactic",
    "Astrocore",
    "Celestial",
    "Orion",
    "Cosmos",
    "Infinity",
    "Nova",
    "Serenity",
    "Quantum",
    "Interstellar",
    "Aurora",
    "Cosmic"
  ]
  const spaceStationNames2 = [
    "Station",
    "Nexus",
    "Prime",
    "Horizon",
    "Citadel",
    "Outpost",
    "Haven",
    "Orbital",
    "Command",
    "Vertex",
    "Hub",
    "Base",
    "Sanctuary"
  ]

  return {
    name: `${spaceStationNames1[Math.floor(Math.random() * spaceStationNames1.length)]} ${spaceStationNames2[Math.floor(Math.random() * spaceStationNames2.length)]}`,
    image: `url(../img/space-station-${Math.floor(Math.random() * maxSpaceStationImages) + 1}.png)`,
    starDistancePerMillionMiles: Math.floor(Math.random() * 5000)
  }
}
function updateListContent() {
  const listItems = document.querySelectorAll('.list-group-item');
  listItems.forEach(item => {
    const stationName = item.getAttribute('data-station-name');
    const stationDistance = item.getAttribute('data-station-distance');
    item.querySelector('span').textContent = `${stationName} ${Math.abs(stationDistance - playerSunDistance)} Mm`;
  });
}
function generateStarSystem() {
  const word1 = [
    "Alpha",
    "Sirius",
    "Betelgeuse",
    "Proxima",
    "Vega",
    "Polaris",
    "Antares",
    "Deneb",
    "Epsilon",
    "Tau",
    "Wolf",
    "Kepler",
    "Trappist",
    "Gliese",
    "HD",
    "Eta",
    "Zeta",
    "Sagittarius",
    "Cygnus",
    "Orion"
  ]
  const word2 = [
    "Eridani",
    "Ceti",
    "359",
    "186",
    "1",
    "581",
    "209458",
    "Carinae",
    "Reticuli",
    "A*",
    "X-1",
    "Nebula"
  ]
  return {
    name: `${word1[Math.floor(Math.random() * word1.length)]} ${word2[Math.floor(Math.random() * word2.length)]}`,
    image: `url(../img/star-system-${Math.floor(Math.random() * maxStarSystemImages) + 1}.png)`
  }
}
for (let i = 0; i < maxStations; i++) {
  spaceStations.push(generateStation())
}
// order stations
spaceStations.sort((a, b) => a.starDistancePerMillionMiles - b.starDistancePerMillionMiles);
spaceStations.forEach(station => {
  const li = document.createElement('li');
  const stationInfo = document.createElement('span')
  li.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-center');
  li.setAttribute('data-station-name', station.name);
  li.setAttribute('data-station-distance', station.starDistancePerMillionMiles);
  stationInfo.textContent = `${station.name} ${station.starDistancePerMillionMiles - playerSunDistance} Mm`;
  const button = document.createElement('button');
  button.setAttribute('class', 'btn btn-primary float-end btn-navigate');
  button.textContent = 'Navigate';
  button.addEventListener('click', () => {
    // Remove highlighting from all list items
    const listItems = document.querySelectorAll('.list-group-item');
    listItems.forEach(item => {
      item.classList.remove('active');
    });
    const navButtons = document.querySelectorAll('.btn-navigate')
    navButtons.forEach(btn => {
      btn.disabled = false
    })
    clearInterval(navigationInterval)
    // Update player distance every millisecond
    navigationInterval = setInterval(() => {
      // Increment player distance by 1 Mm per millisecond
      if (playerSunDistance < station.starDistancePerMillionMiles) playerSunDistance += 1;
      else
        playerSunDistance -= 1
      hudLocation.textContent = station.name;
      if (station.starDistancePerMillionMiles - playerSunDistance == 0) {
        clearInterval(navigationInterval)
        pilotWindow.style.backgroundImage = station.image;
        button.disabled = true;
      }
      updateListContent();
    }, 1);
    // Highlight the clicked list item
    li.classList.add('active');
    pilotWindow.style.backgroundImage = 'url(../img/warp.gif)';
  });

  li.appendChild(stationInfo);
  li.appendChild(button);
  navigation.appendChild(li);
});



