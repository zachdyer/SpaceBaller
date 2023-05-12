let spaceStationImage = Math.floor(Math.random()*7)+1
let hudTitle = document.querySelector('#hud-title')
hudTitle.textContent = `Space Station ${spaceStationImage}`
let pilotWindow = document.querySelector('#pilot-window')
pilotWindow.style.backgroundImage = `url(../img/space-station-${spaceStationImage}.png)`