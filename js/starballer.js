let spaceStationImage = Math.floor(Math.random()*7)+1
let hudTitle = document.querySelector('#hud-title')
hudTitle.textContent = `Space Station ${spaceStationImage}`
let pilotWindow = document.querySelector('#pilot-window')
pilotWindow.style.backgroundImage = `url(../img/space-station-${spaceStationImage}.png)`
let navigation = document.querySelector('#navigation')
for(let i = 1; i <= 7; i++) {
    const button = document.createElement("button");
    button.setAttribute('class', 'btn btn-secondary')
    button.textContent = `Space Station ${i}`;
    button.addEventListener('click', ()=>{
        pilotWindow.style.backgroundImage = `url(../img/space-station-${i}.png)`
        hudTitle.textContent = `Space Station ${i}`
    })
    navigation.appendChild(button);
}