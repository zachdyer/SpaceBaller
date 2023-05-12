let maxSpaceStationImages = 7
let spaceStationImage = Math.floor(Math.random() * maxSpaceStationImages) + 1
let hudTitle = document.querySelector('#hud-title')
hudTitle.textContent = `Space Station ${spaceStationImage}`
let pilotWindow = document.querySelector('#pilot-window')
pilotWindow.style.backgroundImage = `url(../img/space-station-${spaceStationImage}.png)`
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
  button.setAttribute('class', 'btn btn-secondary float-end');
  button.textContent = 'Navigate';
  button.addEventListener('click', () => {
    // Remove highlighting from all list items
    const listItems = document.querySelectorAll('.list-group-item');
    listItems.forEach(item => {
      item.classList.remove('active');
    });
    clearInterval(navigationInterval)
    // Update player distance every millisecond
    navigationInterval = setInterval(() => {
      // Increment player distance by 1 Mm per millisecond
      if (playerSunDistance < station.starDistancePerMillionMiles) playerSunDistance += 1;
      else
        playerSunDistance -= 1
      if (station.starDistancePerMillionMiles - playerSunDistance == 0) {
        clearInterval(navigationInterval)
        pilotWindow.style.backgroundImage = station.image;
        hudTitle.textContent = station.name;
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



