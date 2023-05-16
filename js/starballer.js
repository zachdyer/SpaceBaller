let maxSpaceStationImages = 7
let maxStarSystemImages = 5
let hudTitle = document.querySelector('#hud-title')
let hudLocation = document.querySelector('#hud-location')
let pilotWindow = document.querySelector('#pilot-window')
let navigation = document.querySelector('#navigation')
let spaceStations = []
let playerSunDistance = 0
let navigationInterval
let playerStarSystem = 1
let rng = new Math.seedrandom(playerStarSystem);
let starSystem = generateStarSystem()
let maxStations = Math.floor(rng() * maxSpaceStationImages) + 1
let fuelTankCapacity = 5000
let fuelLevel = 0
let fuelTankBar = document.querySelector('#fuel-tank')
const refuel = document.querySelector('#refuel')
const npc = document.querySelector('#npc')
const log = document.querySelector('#log')
const npcAvatar = document.querySelector('#npc-avatar')
const npcChatAvatar = document.querySelector('#npc-chat-avatar')
const npcMessage = document.querySelector('#npc-message')
const npcName = document.querySelector('#npc-name')
const npcDept = document.querySelector('#npc-dept')
let emergencyFuelPilot = generateNPC('pilot', false, 'Emergency Fuel Services')
let isInFlight = false
let playerStation
const playerImage = `img/player-spaceship.png`
const playerShipName = generateShipName()
const emergencyFuelBtn = document.createElement('button')
const shipComms = document.querySelector('#ship-comms')
const starportFuelBtn = document.createElement('button')

function generateStation() {
  const spaceStationNames1 = ["Lunaris", "Stellar", "Nebula", "Galactic", "Astrocore", "Celestial", "Orion", "Cosmos", "Infinity", "Nova", "Serenity", "Quantum", "Interstellar", "Aurora", "Cosmic"]
  const spaceStationNames2 = ["Station", "Nexus", "Prime", "Horizon", "Citadel", "Outpost", "Haven", "Orbital", "Command", "Vertex", "Hub", "Base", "Sanctuary"]
  let stationName = `${spaceStationNames1[Math.floor(rng() * spaceStationNames1.length)]} ${spaceStationNames2[Math.floor(rng() * spaceStationNames2.length)]}`
  return {
    name: stationName,
    image: `url(../img/space-station-${Math.floor(rng() * maxSpaceStationImages) + 1}.png)`,
    starDistancePerMillionMiles: Math.floor(rng() * 5000),
    mechanicNPC: generateNPC('mechanic', true, `${stationName} Ship Services`)
  }
}
function generateStarSystem() {
  const word1 = ["Alpha", "Sirius", "Betelgeuse", "Proxima", "Vega", "Polaris", "Antares", "Deneb", "Epsilon", "Tau", "Wolf", "Kepler", "Trappist", "Gliese", "HD", "Eta", "Zeta", "Sagittarius", "Cygnus", "Orion"];
  const word2 = ["Eridani", "Ceti", "359", "186", "1", "581", "209458", "Carinae", "Reticuli", "A*", "X-1", "Nebula"];
  return {
    name: `${word1[Math.floor(rng() * word1.length)]} ${word2[Math.floor(rng() * word2.length)]}`,
    image: `url(../img/star-system-${Math.floor(rng() * maxStarSystemImages) + 1}.png)`
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
function setFuelLevel(amount){
  fuelLevel = amount
  if(amount)
    fuelTankBar.style.width = `${Math.floor(fuelLevel / fuelTankCapacity * 100)}%`
  else
    fuelTankBar.style.width = `0%`
}
function displayComms(){
  npc.style.display = 'block'
  log.style.display = 'block'
}
function hideComms() {
  npc.style.display = 'none'
  log.style.display = 'none'
}
function generateNPC(type, procedural, dept = ''){
  let name1
  let name2
  let imgMax
  let imgPick
  let npcName
  if(type == 'pilot') {
    name1 = ["Max", "Stella", "Aurora", "Jet", "Nova", "Rex", "Luna", "Cosmo", "Zara", "Orion", "Vega", "Nyx", "Apollo", "Nova", "Stellar", "Raven", "Galaxy", "Axel", "Celeste", "Blaze"];
    name2 = ["Nova", "Orion", "Blaze", "Phoenix", "Starstrider", "Nebula", "Stardust", "Falcon", "Warpwind", "Skyslicer", "Starfire", "Shadowpilot", "Starwing", "Nebulon", "Eclipse", "Starwind", "Stardancer", "Novaheart", "Starfrost", "Starglider"];
    imgMax = 28
    imgPick = (procedural) ? Math.floor(rng() * imgMax) + 1 : Math.floor(Math.random() * imgMax) + 1
    npcName = (procedural) ? `${name1[Math.floor(rng() * name1.length)]} ${name2[Math.floor(rng() * name2.length)]}` : `${name1[Math.floor(Math.random() * name1.length)]} ${name2[Math.floor(Math.random() * name2.length)]}`
  } else if (type == 'mechanic') {
    name1 = ["Axel", "Sprocket", "Wrench", "Gizmo", "Spark", "Bolt", "Cog", "Ratchet", "Gear", "Spanner", "Socket", "Piston", "Widget", "Crux", "Machina"];
    name2 = ["Cyber", "Tech", "Byte", "Circuit", "Nexus", "Matrix", "Drone", "Pulse", "Nano", "Vortex", "Probe", "Neon", "Synth", "Gadget", "Jolt"];
    imgMax = 9
    imgPick = (procedural) ? Math.floor(rng() * imgMax) + 1 : Math.floor(Math.random() * imgMax) + 1
    npcName = (procedural) ? `${name1[Math.floor(rng() * name1.length)]} ${name2[Math.floor(rng() * name2.length)]}` : `${name1[Math.floor(Math.random() * name1.length)]} ${name2[Math.floor(Math.random() * name2.length)]}`
  }
  return {
    name: npcName,
    image: `img/sci-fi-${type} (${imgPick}).png`,
    dept: dept
  }
}
function emergencyFuelRequest(){
  npcAvatar.style.backgroundImage = `url('${emergencyFuelPilot.image}')`
  npcChatAvatar.src = emergencyFuelPilot.image
  npcMessage.textContent = `We received your emergency fuel request. Stand by as we refuel.`
  npcName.textContent = emergencyFuelPilot.name
  npcDept.textContent = emergencyFuelPilot.dept
  displayComms()
  emergencyFuelBtn.textContent = 'Confirm'
  emergencyFuelBtn.removeEventListener('click', emergencyFuelRequest)
  emergencyFuelBtn.addEventListener('click', emergencyFuelConfirmation)
}
function generateShipName() {
    let words = [
      ["Starfire", "Cosmosphere", "Astroblade", "Stellaris", "Galactron", "Nebula", "Celestial", "Interstellar", "Lunar", "Cosmic", "Orion's", "Nova", "Quantum", "Eclipse", "Astroscout", "Cosmic", "Infinity", "Stardust", "Hypernova", "Solar"],
      ["Voyager", "Wing", "Phoenix", "Sentinel", "Serpent", "Fury", "Explorer", "Dawn", "Raider", "Crusader", "Falcon", "Voyager", "Flare"]
    ]
    return `${words[0][Math.floor(rng()*words[0].length)]} ${words[1][Math.floor(rng()*words[1].length)]}`
}
function starportFuelConfirmation() {
  setFuelLevel(fuelTankCapacity)
  npcMessage.textContent = `We have replenished your gas tank. You are good to go. Happy hunting.`
  starportFuelBtn.style.display = 'none'
  starportFuelBtn.removeEventListener(starportFuelConfirmation)
  starportFuelBtn.addEventListener('click', starportFuelRequest)
  starportFuelBtn.textContent = playerStation.mechanicNPC.dept
}
function starportFuelRequest(){
  npcAvatar.style.backgroundImage = `url('${playerStation.mechanicNPC.image}')`
  npcChatAvatar.src = playerStation.mechanicNPC.image
  npcMessage.textContent = `We received your emergency fuel request. Stand by as we refuel.`
  npcName.textContent = playerStation.mechanicNPC.name
  npcDept.textContent = playerStation.mechanicNPC.dept
  displayComms()
  starportFuelBtn.textContent = 'Confirm'
  starportFuelBtn.removeEventListener('click', starportFuelRequest)
  starportFuelBtn.addEventListener('click', emergencyFuelConfirmation)
}
function emergencyFuelConfirmation(){
  setFuelLevel(fuelTankCapacity)
  npcMessage.textContent = `We have replenished your gas tank. You are good to go. Happy hunting.`
  emergencyFuelBtn.style.display = 'none'
  emergencyFuelBtn.removeEventListener('click', emergencyFuelConfirmation)
  emergencyFuelBtn.addEventListener('click', emergencyFuelRequest)
  emergencyFuelBtn.textContent = 'Emergency Fuel Request'
}

emergencyFuelBtn.addEventListener('click', emergencyFuelRequest)
starportFuelBtn.addEventListener('click', starportFuelRequest)

hudTitle.textContent = starSystem.name
pilotWindow.style.backgroundImage = starSystem.image
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
    const lightspeed = 5370
    const hackerspeed = 1
    navigationInterval = setInterval(() => {
      // Increment player distance by 1 Mm per millisecond
      if(fuelLevel > 0) {
        if (playerSunDistance < station.starDistancePerMillionMiles) 
          playerSunDistance += 1;
        else
          playerSunDistance -= 1
        hudLocation.textContent = station.name;
        // Player has arrived at station
        if (station.starDistancePerMillionMiles - playerSunDistance == 0) {
          clearInterval(navigationInterval)
          pilotWindow.style.backgroundImage = station.image;
          button.disabled = true;
          fuelTankBar.classList.remove('progress-bar-animated')
          isInFlight = false
          playerStation = station
          starportFuelBtn.textContent = playerStation.mechanicNPC.dept
          starportFuelBtn.style.display = 'block'
          starportFuelBtn.addEventListener('click', ()=>{
            npcAvatar.style.backgroundImage = `url('${playerStation.mechanicNPC.image}')`
            npcChatAvatar.src = playerStation.mechanicNPC.image
            npcMessage.textContent = `Welcome to ${playerStation.mechanicNPC.dept}. What can we do for you?`
            npcName.textContent = playerStation.mechanicNPC.name
            npcDept.textContent = playerStation.mechanicNPC.dept
            displayComms()
            starportFuelBtn.textContent = 'Refuel'
            starportFuelBtn.style.display = 'block'
            starportFuelBtn.addEventListener('click', ()=>{
              setFuelLevel(fuelTankCapacity)
              npcMessage.textContent = `You got a full tank. Thanks for using ${playerStation.mechanicNPC.dept}. Have a great day.`
              starportFuelBtn.style.display = 'none'
            })
          })
        }
        updateListContent()
        setFuelLevel(fuelLevel - 1)
      } else {
        // When player runs out of fuel during travel
        clearInterval(navigationInterval)
        fuelTankBar.classList.remove('progress-bar-animated')
        pilotWindow.style.backgroundImage = starSystem.image
        isInFlight = false
        emergencyFuelBtn.textContent = 'Emergency Fuel Request'
        emergencyFuelBtn.style.display = 'block'
        npcAvatar.style.backgroundImage = `url('${playerImage}')`
        npcChatAvatar.src = playerImage
        npcMessage.textContent = `Danger. Fuel levels are critical. Send a request for Emergency Fuel Services.`
        npcName.textContent = playerShipName
        npcDept.textContent = 'Planetary Cruiser'
        displayComms()
        emergencyFuelBtn.removeEventListener(emergencyFuelConfirmation)
        emergencyFuelBtn.addEventListener('click', emergencyFuelRequest)
      }
      
    }, hackerspeed);
    // Highlight the clicked list item
    li.classList.add('active');
    pilotWindow.style.backgroundImage = 'url(../img/warp.gif)';
    fuelTankBar.classList.add('progress-bar-animated')
    hideComms()
    isInFlight = true
    starportFuelBtn.style.display = 'none'
  });

  li.appendChild(stationInfo);
  li.appendChild(button);
  navigation.appendChild(li);
});
// The fuel level is initialized to update the fuel bar
setFuelLevel(fuelLevel)
emergencyFuelBtn.classList.add('btn')
emergencyFuelBtn.classList.add('btn-primary')
emergencyFuelBtn.textContent = `Request Emergency Fuel Services`
shipComms.appendChild(emergencyFuelBtn)
starportFuelBtn.classList.add('btn')
starportFuelBtn.classList.add('btn-primary')
starportFuelBtn.textContent = `Starport Fuel Services`
starportFuelBtn.style.display = 'none'
shipComms.appendChild(starportFuelBtn)
