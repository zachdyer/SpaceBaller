let maxSpaceStationImages = 7
let maxStarSystemImages = 5
let hudTitle = document.querySelector('#hud-title')
let hudLocation = document.querySelector('#hud-location')
let pilotWindow = document.querySelector('#pilot-window')
let navigation = document.querySelector('#navigation')
let spaceStations = []
let navigationInterval
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
const emergencyFuelBtn = document.createElement('button')
const shipComms = document.querySelector('#ship-comms')
const starportFuelBtn = document.createElement('button')
const credits = document.querySelector('#credits')
let player = {
  starDistance: 0,
  starID: 1,
  image: `img/player-spaceship-2.png`,
  shipName: null,
  station: null,
  isInFlight: false,
  credits: 0,
  setCredits: (amount)=>{
    player.credits = amount
    credits.textContent = player.credits
  }
}
let rng = new Math.seedrandom(player.starID)
let maxStations = Math.floor(rng() * maxSpaceStationImages) + 1
let starSystem = generateStarSystem()
let jobBoardBtn = document.createElement('button')

function generateStation() {
  const spaceStationNames1 = ["Lunaris", "Stellar", "Nebula", "Galactic", "Astrocore", "Celestial", "Orion", "Cosmos", "Infinity", "Nova", "Serenity", "Quantum", "Interstellar", "Aurora", "Cosmic"]
  const spaceStationNames2 = ["Station", "Nexus", "Prime", "Horizon", "Citadel", "Outpost", "Haven", "Orbital", "Command", "Vertex", "Hub", "Base", "Sanctuary"]
  let stationName = `${spaceStationNames1[Math.floor(rng() * spaceStationNames1.length)]} ${spaceStationNames2[Math.floor(rng() * spaceStationNames2.length)]}`
  return {
    name: stationName,
    image: `url(../img/space-station-${Math.floor(rng() * maxSpaceStationImages) + 1}.png)`,
    starDistancePerMillionMiles: Math.floor(rng() * 5000),
    mechanicNPC: generateNPC('mechanic', true, `${stationName} Ship Services`),
    jobNPC: generateNPC('office', true, `${stationName} Human Resources`)
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
    item.querySelector('span').textContent = `${stationName} ${Math.abs(stationDistance - player.starDistance)} Mm`;
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
  } else if(type == 'office') {
    name1 = ["Xander", "Luna", "Nyx", "Stella", "Nova", "Astra", "Zephyr", "Cyber", "Nebula", "Galaxy", "Cosmo", "Orion", "Serenity", "Celeste", "Raven", "Axel", "Aurora", "Blaze Nebula", "Phoenix", "Vega"];
    name2 = ["Drake", "Vega", "Orion", "Steele", "Nexus", "Frost", "Silver", "Haze", "Nano", "Swift", "Stone", "Neon", "Starling", "Moon", "Nova", 'Eclipse', 'Mercury', 'Steel', 'Jetstream'];
    imgMax = 25
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
  console.log(emergencyFuelBtn.textContent, emergencyFuelBtn.textContent == 'Emergency Fuel Services')
  if(emergencyFuelBtn.textContent == 'Emergency Fuel Services') {
    let sentence = [
      [
        `We received your emergency signal for fuel services.`,
        `Your a long way from home.`,
        "Emergency fuel request received.",
        "Fuel reserves critically low.",
        "Emergency fuel transfer initiated.",
        "Emergency fueling underway.",
        "Fuel levels critical.",
        "Emergency refuel request confirmed. ",
        "Fuel reserves depleted.",
        "Emergency fueling initiated.",
        "Low fuel detected.",
        "Running on fumes."
      ],
      [
        'Stand by. We are in route to your position.',
        "Stand by for refueling.",
        'Initiating emergency refueling protocol.',
        'Please remain stationary.',
        'Stay put while we replenish your fuel.',
        'Emergency refueling in progress.',
        'Estimated completion time: T-minus 5 minutes.',
        'Activating emergency fueling sequence.',
        'Please secure all systems.',
        'Emergency refuel procedure initiated.',
        'Emergency fueling commencing now.'
      ]
    ]
    npcAvatar.style.backgroundImage = `url('${emergencyFuelPilot.image}')`
    npcChatAvatar.src = emergencyFuelPilot.image
    npcMessage.textContent = `${sentence[0][Math.floor(Math.random()*sentence[0].length)]} ${sentence[1][Math.floor(Math.random()*sentence[1].length)]} The cost is 10,000 credits for a full tank of gas.`
    npcName.textContent = emergencyFuelPilot.name
    npcDept.textContent = emergencyFuelPilot.dept
    displayComms()
    emergencyFuelBtn.textContent = 'Confirm'
  } else {
    let sentence = [
      "Fuel replenishment complete. You're good to go. Safe travels!",
      "Refueling successful. Your fuel tanks are fully replenished.",
      "Refuel operation successful. All systems back online.",
      "Fuel transfer complete. You now have a full tank. Fly safe!",
      "Refueling process finished. Fuel levels restored to maximum capacity.",
      "Refuel complete. Your ship is ready to soar through the stars.",
      "Fuel replenished successfully. Launch permission granted. Fly responsibly.",
      "Refuel operation successful. Prepare for takeoff.",
      "Refueling complete. Your ship is fueled up and ready for action.",
      "Fueling process completed. Ready for departure. Have a stellar journey!"
    ]
    setFuelLevel(fuelTankCapacity)
    npcMessage.textContent = `${sentence[Math.floor(Math.random()*sentence.length)]}`
    emergencyFuelBtn.style.display = 'none'
    emergencyFuelBtn.textContent = 'Emergency Fuel Services'
    player.credits - 10000
    player.setCredits(player.credits - 10000)
  }
}
function generateShipName() {
    let words = [
      ["Starfire", "Cosmosphere", "Astroblade", "Stellaris", "Galactron", "Nebula", "Celestial", "Interstellar", "Lunar", "Cosmic", "Orion's", "Nova", "Quantum", "Eclipse", "Astroscout", "Cosmic", "Infinity", "Stardust", "Hypernova", "Solar"],
      ["Voyager", "Wing", "Phoenix", "Sentinel", "Serpent", "Fury", "Explorer", "Dawn", "Raider", "Crusader", "Falcon", "Voyager", "Flare"]
    ]
    return `${words[0][Math.floor(rng()*words[0].length)]} ${words[1][Math.floor(rng()*words[1].length)]}`
}
function starportFuelRequest(){
  if(starportFuelBtn.textContent == player.station.mechanicNPC.dept) {
    npcAvatar.style.backgroundImage = `url('${player.station.mechanicNPC.image}')`
    npcChatAvatar.src = player.station.mechanicNPC.image
    npcMessage.textContent = `Welcome to ${player.station.mechanicNPC.dept}. Stand by as we refuel.`
    npcName.textContent = player.station.mechanicNPC.name
    npcDept.textContent = player.station.mechanicNPC.dept
    displayComms()
    starportFuelBtn.textContent = 'Confirm'
  } else {
    setFuelLevel(fuelTankCapacity)
    npcMessage.textContent = `We have replenished your gas tank. You are good to go. Happy hunting.`
    starportFuelBtn.style.display = 'none'
    starportFuelBtn.textContent = player.station.mechanicNPC.dept
  }
}
function fuelLevelAlert(){
  npcAvatar.style.backgroundImage = `url('${player.image}')`
  npcChatAvatar.src = player.image
  npcMessage.textContent = `Danger. Fuel levels are critical. Send a request for Emergency Fuel Services.`
  npcName.textContent = player.shipName
  npcDept.textContent = 'Planetary Cruiser'
  displayComms()
}

emergencyFuelBtn.addEventListener('click', emergencyFuelRequest)
starportFuelBtn.addEventListener('click', starportFuelRequest)
jobBoardBtn.addEventListener('click', ()=>{
  if(jobBoardBtn.textContent == player.station.jobNPC.dept) {
    npcAvatar.style.backgroundImage = `url('${player.station.jobNPC.image}')`
    npcChatAvatar.src = player.station.jobNPC.image
    npcMessage.textContent = `Welcome to ${player.station.jobNPC.dept}. Would you like a job?`
    npcName.textContent = player.station.jobNPC.name
    npcDept.textContent = player.station.jobNPC.dept
    displayComms()
    jobBoardBtn.textContent = 'Confirm'
    starportFuelBtn.style.display = 'none'
  } else {
    npcMessage.textContent = `We will have a job available soon. Check back later.`
    jobBoardBtn.textContent = player.station.jobNPC.dept
    starportFuelBtn.style.display = 'block'
  }
})

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
  stationInfo.textContent = `${station.name} ${station.starDistancePerMillionMiles - player.starDistance} Mm`;
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
        if (player.starDistance < station.starDistancePerMillionMiles) 
          player.starDistance += 1;
        else
          player.starDistance -= 1
        hudLocation.textContent = station.name;
        // Player has arrived at station
        if (station.starDistancePerMillionMiles - player.starDistance == 0) {
          clearInterval(navigationInterval)
          pilotWindow.style.backgroundImage = station.image;
          button.disabled = true;
          fuelTankBar.classList.remove('progress-bar-animated')
          player.isInFlight = false
          player.station = station
          starportFuelBtn.textContent = player.station.mechanicNPC.dept
          starportFuelBtn.style.display = 'block'
          jobBoardBtn.style.display = 'block'
          jobBoardBtn.textContent = player.station.jobNPC.dept
        }
        updateListContent()
        setFuelLevel(fuelLevel - 1)
      } else {
        // When player runs out of fuel during travel
        clearInterval(navigationInterval)
        fuelTankBar.classList.remove('progress-bar-animated')
        pilotWindow.style.backgroundImage = starSystem.image
        player.isInFlight = false
        emergencyFuelBtn.textContent = 'Emergency Fuel Services'
        emergencyFuelBtn.style.display = 'block'
        fuelLevelAlert()
      }
      
    }, hackerspeed);
    // Highlight the clicked list item
    li.classList.add('active');
    pilotWindow.style.backgroundImage = 'url(../img/warp.gif)';
    fuelTankBar.classList.add('progress-bar-animated')
    hideComms()
    player.isInFlight = true
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
emergencyFuelBtn.classList.add('mb-2')
emergencyFuelBtn.textContent = `Emergency Fuel Services`
shipComms.appendChild(emergencyFuelBtn)
starportFuelBtn.classList.add('btn')
starportFuelBtn.classList.add('btn-primary')
starportFuelBtn.classList.add('mb-2')
starportFuelBtn.textContent = `Starport Fuel Services`
starportFuelBtn.style.display = 'none'
shipComms.appendChild(starportFuelBtn)
fuelLevelAlert()
credits.textContent = player.credits
player.shipName = generateShipName()
jobBoardBtn.classList.add('btn')
jobBoardBtn.classList.add('btn-primary')
jobBoardBtn.textContent = `Starport Mission Board`
jobBoardBtn.style.display = 'none'
shipComms.appendChild(jobBoardBtn)