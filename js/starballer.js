let devMode = false
const seed = 3
const rng = new Math.seedrandom(seed)
let player = {
  name: 'StarBaller',
  starSystem: generateStarSystem(seed),
  starDistance: 0,
  image: `img/player-spaceship-3.png`,
  station: null,
  isInFlight: false,
  credits: 100,
  jobs: [],
  location: null,
  inventory: [],
  ship: null,
  name: `SpaceBaller`,
  avatarID: 1,
  dockDistance: 0,
  speed: 1,
  id: null,
  area: null
}
let ship = {
  fuelLevel: 5000,
  fuelCompacity: 5000,
  model: 'StarCruizer',
  name: 'StarBaller',
  launched: false,
  rented: false
}
const synthesis = window.speechSynthesis;
synthesis.getVoices()
let station = player.starSystem.stations[0]
setTitle(player.starSystem.name)
setSubtitle(station.name)
player.starSystem.stations.forEach(station => {
  station.jobs.push(generateJob(station))
})
if(ship.launched) {
  if (ship.fuelLevel == 0) {
    fuelLevelAlert()
  }
}
if (station) { // if the player is at a station at the start it's in a room
  player.station = station
  player.starDistance = player.station.starDistance
  const bedroomArea = station.areas.find(area => area.title === 'Bedroom');
  player.image = `img/sci-fi-pilot (${player.avatarID}).png`
  bedroomArea.npc.image = player.image
  bedroomArea.npc.name = player.name
  player.dockDistance = bedroomArea.dockDistance
  player.area = bedroomArea
  bedroom()
  toggleBGSway(false)
  toggleAvatar(true)
  toggleMonitorTransparency(false)
} else {
  setBackgroundImage(player.starSystem.image)
}
// Closes the dialogue box
document.querySelector('#dialogue-close').addEventListener('click', () => {
  document.querySelector('#dialogue-box').close();
})
if (!ship) {
  toggleGuages(false)
  toggleBGSway(false)
}
navigationMenu()
document.querySelector('#credits').textContent = player.credits

function setTitle(text){
  document.querySelector('#hud-title').textContent = text
}
function generateStation() {
  const spaceStationNames1 = pick(["Lunaris", "Stellar", "Nebula", "Galactic", "Astrocore", "Celestial", "Orion", "Cosmos", "Infinity", "Nova", "Serenity", "Quantum", "Interstellar", "Aurora", "Cosmic", "Pulsar", "Eclipse", "Astrostar", "Supernova", "Astroverse"]);
  const spaceStationNames2 = pick(["Station", "Nexus", "Prime", "Horizon", "Citadel", "Outpost", "Haven", "Orbital", "Command", "Vertex", "Hub", "Base", "Sanctuary", "Observatory", "Gateway", "Spire", "Expanse", "Fortress", "Refuge", "Center"]);
  const company = pick(["Systems", "Industrial", "Corporation", "Science", "Enterprises", "Union", "Core", "Tec", "Dynamic", "Industries", "Industry", "Commercial"])
  const stationName = `${spaceStationNames1} ${spaceStationNames2}`
  let companyName = `${stationName} ${company}`
  let areas = [
    generateArea(`Loading Docks`, `loading-docks`, `worker`, loadingDocks),
    generateArea(`Shipyard`, `shipyard`, `worker`, shipyard),
    generateArea(companyName, `office-bg`, `office`, stationOffice),
    generateArea(`Bedroom`, `bedroom`, `pilot`, bedroom),
    generateArea(`Security Office`, `office-bg`, `pilot`, securityOffice)
  ]
  areas.sort((a, b) => a.dockDistance - b.dockDistance);
  return {
    name: stationName,
    image: `img/space-station-${Math.floor(rng() * 7) + 1}.png`,
    starDistance: Math.floor(rng() * 5000),
    mechanicNPC: generateNPC('mechanic', true, `${stationName} Shipyard`, null, `img/sci-fi-shipyard (${Math.floor(rng() * 13) + 1}).png`),
    jobNPC: generateNPC('office', true, companyName, null, `img/sci-fi-office-bg (${Math.floor(rng() * 22) + 1}).png`),
    jobs: [],
    company: companyName,
    payPerMillionMiles: Math.floor(rng() * 8) + 2,
    roomImg: `img/sci-fi-bedroom (${Math.floor(rng() * 13) + 1}).png`,
    areas: areas
  }
}
function generateStarSystem(id) {
  let spaceStations = []
  const maxStarSystemImages = 5
  const rng = new Math.seedrandom(id)
  const word1 = ["Alpha", "Sirius", "Betelgeuse", "Proxima", "Vega", "Polaris", "Antares", "Deneb", "Epsilon", "Tau", "Wolf", "Kepler", "Trappist", "Gliese", "HD", "Eta", "Zeta", "Sagittarius", "Cygnus", "Orion"];
  const word2 = ["Eridani", "Ceti", "359", "186", "1", "581", "209458", "Carinae", "Reticuli", "A*", "X-1", "Nebula"];
  const totalStations = Math.floor(rng() * 10) + 2
  for (let i = 0; i < totalStations; i++) {
    spaceStations.push(generateStation())
  }
  // Sort stations by star distance
  spaceStations.sort((a, b) => a.starDistance - b.starDistance);
  return {
    id: id,
    name: `${word1[Math.floor(rng() * word1.length)]} ${word2[Math.floor(rng() * word2.length)]}`,
    image: `img/star-system-${Math.floor(rng() * maxStarSystemImages) + 1}.png`,
    stations: spaceStations,
    emergencyFuelPilot: generateNPC('pilot', false, 'Emergency Fuel Services')
  }
}
function updateNavigator() {
  const listItems = document.querySelectorAll('.list-group-item');
  listItems.forEach(item => {
    const stationName = item.getAttribute('data-station-name');
    const stationDistance = item.getAttribute('data-station-distance');
    item.querySelector('span').textContent = `${stationName} ${Math.abs(stationDistance - player.starDistance)} Mm`;
  });
}
function setFuelLevel(amount) {
  let fuelTankBar = document.querySelector('#fuel-tank')
  ship.fuelLevel = amount
  if (amount)
    fuelTankBar.style.width = `${Math.floor(amount / ship.fuelTankCapacity * 100)}%`
  else
    fuelTankBar.style.width = `0%`
}
function displayComms(avatar = 'img/loader.gif', name = 'Loading Contact...', dept = 'Loading Info...', message = '', callback = null, delay = 2000, bgImg = null) {
  showNPC()
  setAvatarImage(`img/loader.gif`)
  if (bgImg) {
    setBackgroundImage(`img/bg-transition.gif`)
    toggleBGSway(false)
  }
  setAvatarTitle(name)
  setAvatarSubtitle(dept)
  setMessage(`Attempting to connect to ${dept}.`)
  setTimeout(() => {
    setAvatarImage(avatar)
    setMessage(message)
    if (bgImg) {
      setBackgroundImage(bgImg)
      toggleMonitorTransparency(false)
    }
    if (callback) callback()
  }, delay)
}
function generateNPC(type, procedural, dept = '', message = '', bgImg = null) {
  let name1
  let name2
  let imgMax
  let imgPick
  let npcName
  if (type == 'pilot') {
    name1 = ["Max", "Stella", "Aurora", "Jet", "Nova", "Rex", "Luna", "Cosmo", "Zara", "Orion", "Vega", "Nyx", "Apollo", "Nova", "Stellar", "Raven", "Galaxy", "Axel", "Celeste", "Blaze"];
    name2 = ["Nova", "Orion", "Blaze", "Phoenix", "Starstrider", "Nebula", "Stardust", "Falcon", "Warpwind", "Skyslicer", "Starfire", "Shadowpilot", "Starwing", "Nebulon", "Eclipse", "Starwind", "Stardancer", "Novaheart", "Starfrost", "Starglider"];
    imgMax = 28
    imgPick = (procedural) ? Math.floor(rng() * imgMax) + 1 : Math.floor(Math.random() * imgMax) + 1
    npcName = (procedural) ? `${name1[Math.floor(rng() * name1.length)]} ${name2[Math.floor(rng() * name2.length)]}` : `${name1[Math.floor(Math.random() * name1.length)]} ${name2[Math.floor(Math.random() * name2.length)]}`
  } else if (type == 'mechanic' || 'worker') {
    name1 = ["Cyber", "Tech", "Byte", "Circuit", "Nexus", "Matrix", "Drone", "Pulse", "Nano", "Vortex", "Probe", "Neon", "Synth", "Gadget", "Jolt"]
    name2 = ["Axel", "Sprocket", "Wrench", "Gizmo", "Spark", "Bolt", "Cog", "Ratchet", "Gear", "Spanner", "Socket", "Piston", "Widget", "Crux", "Machina"]
    imgMax = 9
    imgPick = (procedural) ? Math.floor(rng() * imgMax) + 1 : Math.floor(Math.random() * imgMax) + 1
    npcName = (procedural) ? `${name1[Math.floor(rng() * name1.length)]} ${name2[Math.floor(rng() * name2.length)]}` : `${name1[Math.floor(Math.random() * name1.length)]} ${name2[Math.floor(Math.random() * name2.length)]}`
  } else if (type == 'office') {
    name1 = ["Xander", "Luna", "Nyx", "Stella", "Nova", "Astra", "Zephyr", "Cyber", "Nebula", "Galaxy", "Cosmo", "Orion", "Serenity", "Celeste", "Raven", "Axel", "Aurora", "Blaze Nebula", "Phoenix", "Vega"];
    name2 = ["Drake", "Vega", "Orion", "Steele", "Nexus", "Frost", "Silver", "Haze", "Nano", "Swift", "Stone", "Neon", "Starling", "Moon", "Nova", 'Eclipse', 'Mercury', 'Steel', 'Jetstream'];
    imgMax = 25
    imgPick = (procedural) ? Math.floor(rng() * imgMax) + 1 : Math.floor(Math.random() * imgMax) + 1
    npcName = (procedural) ? `${name1[Math.floor(rng() * name1.length)]} ${name2[Math.floor(rng() * name2.length)]}` : `${name1[Math.floor(Math.random() * name1.length)]} ${name2[Math.floor(Math.random() * name2.length)]}`
  }
  return {
    name: npcName,
    image: `img/sci-fi-${type} (${imgPick}).png`,
    dept: dept,
    message: message,
    bgImg: bgImg
  }
}
function emergencyFuelRequest() {
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
  let message = `${pick(sentence[0], false)} ${pick(sentence[1], false)} The cost is 10,000 credits for a full tank of gas.`
  displayComms(
    player.starSystem.emergencyFuelPilot.image,
    player.starSystem.emergencyFuelPilot.name,
    player.starSystem.emergencyFuelPilot.dept,
    message, () => {
      clearActions()
      commsButton('Confirm', () => {
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
        setFuelLevel(ship.fuelTankCapacity)
        setMessage(`${sentence[Math.floor(Math.random() * sentence.length)]}`)
        updateCredits(-10000)
        clearActions()
        powerNavigation(true)
      })
      commsButton('Exit', emergencyServiceMenu)
    })
}
function generateShipName() {
  let words = [
    ["Starfire", "Cosmosphere", "Astroblade", "Stellaris", "Galactron", "Nebula", "Celestial", "Interstellar", "Lunar", "Cosmic", "Orion's", "Nova", "Quantum", "Eclipse", "Astroscout", "Cosmic", "Infinity", "Stardust", "Hypernova", "Solar", "Aurora", "Spectrum", "Astroflux", "Celestia", "Astroverse"],
    ["Voyager", "Wing", "Phoenix", "Sentinel", "Serpent", "Fury", "Explorer", "Dawn", "Raider", "Crusader", "Falcon", "Voyager", "Flare", "Cosmos", "Nighthawk", "Horizon", "Supernova", "Nova", "Stargazer", "Nebulus", "Stellar", "Aether", "Elysium", "Orbiter", "Infinity"]
  ]
  return `${words[0][Math.floor(rng() * words[0].length)]} ${words[1][Math.floor(rng() * words[1].length)]}`
}
function starportFuelRequest() {
  toggleMonitorTransparency(false)
  if (ship) {
    let mileage = ship.fuelTankCapacity - ship.fuelLevel
    let estimate = mileage * 2
    if (mileage > 0) {
      setMessage(`Your odometer reads ${mileage} million miles. The cost of NovaFuel per gallon is 1 credit. And the rental is 1 credit per million miles. Total cost for the rental and gas is ${estimate} credits.`)
      commsButton('Confirm', () => starportRefuel(estimate))
    } else {
      setMessage(`Our system shows you have a full tank.`)
    }
  } else {
    setMessage(`What ship? It might help if you had a ship to fuel. You can rent a ship for 2 credit per million miles. But you need your pilots license to rent one. Don't look at me like that. It's the law. You can register for a pilots license at ${player.station.company} Main Office.`)
  }
}
function fuelLevelAlert() {
  let message = `Danger. Fuel levels are critical. Shutting navigation system down. Recommend Sending a request signal for Emergency Fuel Services.`
  displayComms(player.image, ship.name, ship.model, message)
  clearActions()
  commsButton('Send Emergency Distress Signal', emergencyServiceMenu)
  powerNavigation(false)
}
function clearActions() {
  const shipComms = document.querySelector('#ship-comms')
  while (shipComms.firstChild) {
    shipComms.removeChild(shipComms.firstChild);
  }
}
function commsButton(label, func, icon = null) {
  const button = document.createElement('button')
  button.classList.add('btn')
  button.classList.add('btn-primary')
  button.innerHTML = (icon) ? `<i class="${icon}"></i> ${label}` : label
  button.addEventListener('click', func)
  document.querySelector('#ship-comms').appendChild(button)
  return button
}
function stationMainMenu() {
  clearActions()
  toggleAvatar(false)
  commsButton(`Request Docking`, requestDocking, `bi bi-rocket-fill`)
}
function requestDocking(){
  const npc = player.station.areas[0].npc
  setAvatarImage(npc.image)
  setAvatarTitle(npc.name)
  setAvatarSubtitle(`Loading Docks`)
  toggleAvatar(true)
  setMessage(`Welcome to ${player.station.name}. The docking fee is 50 credits and includes room and board.`)
  clearActions()
  commsButton(`Pay 50 credits`, payDocking, `bi bi-currency-bitcoin`)
}
function payDocking(){
  if(!devMode) updateCredits(-50)
  loadScreen(`Docking at ${player.station.name}`, 
  ``, 
  loadingDocks)
  ship.launched = false
  player.dockDistance = 0
  player.area = player.station.areas[0]
}
function shipyard() {
  const message = `Welcome to the ${player.station.mechanicNPC.dept}. What can I do for you?`
  toggleMonitorTransparency(false)
  setAvatarImage(player.station.mechanicNPC.image)
  setAvatarTitle(player.station.mechanicNPC.name)
  setAvatarSubtitle(player.station.mechanicNPC.dept)
  setMessage(message)
  setBackgroundImage(player.station.mechanicNPC.bgImg)
  toggleBGSway(false)
  shipyardMenu()
  setPlayerLocation(player.station.mechanicNPC.dept)
}
function stationOffice() {
  toggleMonitorTransparency(false)
  let message = `Welcome to ${player.station.company}. How can I help you?`
  player.station.jobs.forEach(job => {
    if (job.status == 'active') {
      message = `If you have an questions about your active job check your ${job.jobStation.company} contract labeled ${job.destination.name} ${job.type} in your documents.`
    }
  })
  setPlayerLocation(player.station.company)
  player.jobs.forEach(job => {
    if (job.destination.company == player.location) addCompleteJobBtn(job)
  })
  setBackgroundImage(player.station.jobNPC.bgImg)
  setAvatarImage(player.station.jobNPC.image)
  setAvatarTitle(player.station.jobNPC.name)
  setAvatarSubtitle(`${player.station.company} Main Office`)
  setMessage(message)
  inventoryMenu()
  toggleBGSway(false)
  companyMenu()
}
function acceptJob(job) {
  if (checkPilotLicense()) {
    loadScreen(`Downloading Contract File`, `Processing ${job.type} Contract.`, () => {
      job.status = 'active'
      addItem(job)
      toggleMonitorTransparency(false)
      setAvatarImage(player.station.jobNPC.image)
      setAvatarTitle(player.station.jobNPC.name)
      setAvatarSubtitle(player.station.company)
      setBackgroundImage(player.station.jobNPC.bgImg)
      setMessage(`I've uploaded your contract data to your documents. If you have an questions about your active job check your ${job.jobStation.company} contract labeled ${job.destination.name} ${job.type} in your documents.`)
      commsButton('Exit', exitToRoom, 'bi bi-door-open-fill')
      player.jobs.push(job)
    })
  } else {
    setMessage(`${player.station.company} requires a pilots license for delivery contracts. You can register for one here at our main office for 1000 credits.`)
  }
}
function setMessage(message, voice = 6) {
  toggleMessage(true)
  document.querySelector('#npc-message').innerHTML = message
  // Check if the browser supports speech synthesis
  if ('speechSynthesis' in window && !devMode) {
    // const synthesis = window.speechSynthesis;
    // Create a new SpeechSynthesisUtterance instance
    const utterance = new SpeechSynthesisUtterance();
    // Set the text to be spoken
    utterance.text = message;
    utterance.voice = synthesis.getVoices()[voice]; // choose 0 - 6
    utterance.rate = 1.0; // Set the speech rate
    synthesis.speak(utterance);
  }
}
function pick(list, procedural = true) {
  if (procedural)
    return list[Math.floor(rng() * list.length)]
  else
    return list[Math.floor(Math.random() * list.length)]
}
function emergencyServiceMenu() {
  clearActions()
  displayComms(
    player.starSystem.emergencyFuelPilot.image,
    player.starSystem.emergencyFuelPilot.name,
    player.starSystem.emergencyFuelPilot.dept,
    `I have recieved your emergency signal. How can I help you?`,
    () => {
      commsButton('Request Tow Service', emergencyTowRequest)
      commsButton('Request Fuel Service', emergencyFuelRequest)
      commsButton('Exit', fuelLevelAlert)
    }
  )
}
function emergencyTowRequest() {
  clearActions()
  setMessage(`To tow you to the nearest station costs 10000 credits.`)
  commsButton('Confirm', emergencyTow)
  commsButton('Exit', fuelLevelAlert)
}
function emergencyTow() {
  clearActions()
  setMessage(`Sit tight and away we go.`)
  let closestStation = spaceStations[0]
  for (let i = 1; i < player.starSystem.stations.length; i++) {
    let stationDistance = Math.abs(spaceStations[i].starDistance - player.starDistance)
    if (stationDistance < Math.abs(closestStation.starDistance - player.starDistance)) {
      closestStation = spaceStations[i]
    }
  }
  movePlayer(closestStation, false)
  updateCredits(-10000)
}
function warpView() {
  setBackgroundImage('img/warp.gif');
}
function powerNavigation(onoff) {
  const navButtons = document.querySelectorAll('.btn-navigate')
  navButtons.forEach(button => {
    button.disabled = !onoff
  })
}
function generateJob(jobStation) {
  const types = [
    'Data Delivery',
    'Cargo Delivery',
    'Passenger Transport',
    'Rescue Operation',
    'Research Assignment',
    'Diplomatic Mission',
    'Asteroid Mining',
    'Security Escort'
  ]
  const type = types[0]//pick(types)
  let message = `Job info`
  let pay = 0
  let missionStation
  if (type == 'Data Delivery') {
    let availableStations = player.starSystem.stations.filter((station) => station != jobStation)
    missionStation = pick(availableStations, false)
    let totalDistance = Math.abs(missionStation.starDistance - jobStation.starDistance)
    pay = totalDistance * jobStation.payPerMillionMiles
    message = `We have a new ${type} contract delivering encrypted data to ${missionStation.name}. Here is the contract if you want to read it.`
  }
  let contract = {
    title: `${missionStation.name} ${type} Contract`,
    desc: `<b>${jobStation.company} ${type} Contract</b><br>Pilot agrees to deliver ${jobStation.company} encrypted data to ${missionStation.company} for ${jobStation.payPerMillionMiles} credits per million miles traveled.<br>Contract Value: ${pay} credits.<br>Contractor Signature: ${jobStation.jobNPC.name}`,
    image: `img/sci-fi-data (${Math.floor(rng() * 10) + 1}).png`,
    type: `Contract`
  }
  let job = {
    type: type,
    details: () => {
      setMessage(message)
      clearActions()
      commsButton(`View Job Contract`, () => viewItem(contract))
      commsButton(`Accept Contract`, () => acceptJob(job))
      commsButton('Cancel', stationOffice)
    },
    pay: pay,
    status: 'available',
    info: message,
    destination: missionStation,
    jobStation: jobStation,
    image: `img/sci-fi-data (${Math.floor(rng() * 10) + 1}).png`,
    contract: contract
  }
  return job
}
function starportRefuel(cost) {
  setFuelLevel(ship.fuelTankCapacity)
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
  setMessage(pick(sentence, false))
  updateCredits(-cost)
  navigationMenu()
}
function navigationMenu() {
  const ul = document.querySelector('#navigation')
  // Clear navigation list
  while (ul.firstChild) {
    ul.removeChild(ul.firstChild);
  }
  if(ship.launched) {
    let closestStation = findClosestStation()
    // Build and rebuild navigation list
    player.starSystem.stations.forEach(station => {
      const li = document.createElement('li')
      const stationInfo = document.createElement('span')
      li.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-center bg-dark text-bg-dark');
      li.setAttribute('data-station-name', station.name);
      li.setAttribute('data-station-distance', station.starDistance);
      const distance = Math.abs(station.starDistance - player.starDistance)
      stationInfo.textContent = `${station.name} ${distance} Mm`;
      const button = document.createElement('button');
      button.setAttribute('class', 'btn btn-primary float-end btn-navigate');
      button.textContent = 'Navigate';
      if (ship.fuelLevel <= 0 || station == player.station || player.location != player.station.name) {
        button.disabled = true
      } else {
        button.disabled = false
      }
      button.addEventListener('click', () => {
        // Remove highlighting from all list items
        const listItems = document.querySelectorAll('.list-group-item');
        listItems.forEach(item => {
          item.classList.remove('active');
        })
        toggleAvatar(false)
        player.isInFlight = true
        movePlayer(station)
      })
      li.appendChild(stationInfo);
      if (ship) li.appendChild(button);
      if (station == closestStation) li.classList.add('active')
      ul.appendChild(li)
    })
  } else { // When player is in the station
    stationNavigation()
  }
}
function stationNavigation(){
  const closestArea = findClosestArea()
  const ul = document.querySelector('#navigation')
  player.station.areas.forEach(area => {
    const li = document.createElement('li')
    const stationInfo = document.createElement('span')
    li.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-center bg-dark text-bg-dark');
    li.setAttribute('data-area-name', area.title);
    li.setAttribute('data-area-distance', area.dockDistance)
    const distance = Math.abs(area.dockDistance - player.dockDistance)
    stationInfo.innerHTML = `${area.title} ${distance} m`;
    const button = document.createElement('button');
    button.setAttribute('class', 'btn btn-primary float-end btn-navigate');
    button.innerHTML = 'Navigate';
    button.addEventListener('click', () => navigateStation(area))
    li.appendChild(stationInfo);
    li.appendChild(button);
    if (area == closestArea) li.classList.add('active')
    ul.appendChild(li)
  })
}
function findClosestArea() {
  let closestArea = null;
  let closestDistance = Infinity;
  player.station.areas.forEach(area => {
    const distance = Math.abs(area.dockDistance - player.dockDistance);
    if (distance < closestDistance) {
      closestArea = area;
      closestDistance = distance;
    }
  });
  return closestArea;
}
function navigateStation(area){
  // Remove highlighting from all list items
  const listItems = document.querySelectorAll('.list-group-item');
  listItems.forEach(item => {
    item.classList.remove('active');
  })
  clearActions()
  setAvatarImage(player.image)
  setBackgroundImage(`img/sci-fi-hallway.gif`)
  setAvatarTitle(`Navigating to`)
  setAvatarSubtitle(area.title)
  showNPC()
  toggleMessage(false)
  toggleMonitorTransparency(false)
  function animate() {
    const velocity = (player.dockDistance < area.dockDistance) ? 1 : -1;
    if(devMode) player.dockDistance = area.dockDistance 
    else player.dockDistance += velocity
    if (Math.abs(area.dockDistance - player.dockDistance) < player.speed) { // When player arrives at area
      player.dockDistance = area.dockDistance
      player.area = area
      setBackgroundImage(area.bgImg)
      setPlayerLocation(area.title)
      setAvatarImage(area.npc.image)
      navigationMenu()
      inventoryMenu()
      showNPC()
      toggleMonitorTransparency(false)
      area.actions()
    } else {
      updateNavigator()
      navigationMenu()
      requestAnimationFrame(animate)
    }
  }
  let navigationInterval = requestAnimationFrame(animate);
}
function movePlayer(station, fuel = true) {
  let fuelTankBar = document.querySelector('#fuel-tank')
  if(devMode) {
    player.starDistance = station.starDistance
    player.dockDistance = 0
    setBackgroundImage(station.image);
    player.station = station;
    setPlayerLocation(station.name)
    stationMainMenu()
    toggleAvatar(false)
    navigationMenu()
    inventoryMenu()
  } else {
    warpView();
    player.isInFlight = true;
    const lightspeed = 5370;
    const hackerspeed = 1;
    const velocity = (player.starDistance < station.starDistance) ? hackerspeed : -hackerspeed;
    if (fuel) fuelTankBar.classList.add('progress-bar-animated');
    powerNavigation(true);
    function animate() {
      player.starDistance += velocity
      if (station.starDistance - player.starDistance === 0) {
        setBackgroundImage(station.image)
        player.isInFlight = false
        player.station = station
        setPlayerLocation(station.name)
        stationMainMenu()
        toggleAvatar(false)
        fuelTankBar.classList.remove('progress-bar-animated')
        navigationMenu()
        inventoryMenu()
      } else {
        updateNavigator()
        navigationMenu()
        if (fuel) setFuelLevel(ship.fuelLevel - 1)
        requestAnimationFrame(animate)
      }
    }
    let navigationInterval = requestAnimationFrame(animate);
  }
}
function addCompleteJobBtn(job) {
  if (job) {
    if (player.station == job.destination && player.location == job.destination.company) {
      commsButton(`Deliver Encrypted Data`, () => {
        loadScreen(`Encrypted Data Delivery`,
          `Delivering encrypted data to ${player.station.company}.`,
          () => completeJob(job))
      }, 'bi bi-database-fill-lock')
    }
  }
}
function inventoryMenu() {
  const activeJobs = document.querySelector('#active-jobs')
  while (activeJobs.firstChild) {
    activeJobs.removeChild(activeJobs.firstChild);
  }
  if (player.jobs.length || player.inventory.length) {
    player.inventory.forEach(item => {
      inventoryBtn(item)
    })
  }
}
function inventoryBtn(item) {
  const button = document.createElement('button');
  button.classList.add('btn');
  button.classList.add('btn-primary');
  if (item.icon) {
    const icon = document.createElement('span');
    icon.classList.add('bi', `bi-${item.icon}`, 'me-1');
    button.appendChild(icon);
  }
  const title = document.createElement('span');
  title.textContent = item.title;
  button.appendChild(title);
  button.addEventListener('click', () => viewItem(item));
  document.querySelector('#active-jobs').appendChild(button);
}
function remove(array, element) {
  const result = array.filter(item => {
    return item != element;
  });
  return result;
}
function showModal(title, message, confirm = null) {
  const dialogueBox = document.querySelector('#dialogue-box');
  dialogueBox.showModal();
  document.querySelector('#dialogue-title').textContent = title;
  document.querySelector('#dialogue-message').textContent = message;
  const confirmBtn = document.querySelector('#dialogue-confirm');
  // Define a function that wraps the confirm function and removes the event listener
  const confirmHandler = () => {
    if (confirm) {
      confirm();
      confirmBtn.removeEventListener('click', confirmHandler);
    }
  }
  if (confirm) {
    confirmBtn.classList.remove('d-none');
    confirmBtn.addEventListener('click', confirmHandler);
  } else {
    confirmBtn.classList.add('d-none');
  }
}
function updateCredits(amount) {
  const credits = document.querySelector('#credits')
  player.credits += amount
  credits.textContent = player.credits
  hideModalInput()
  if (amount > 0) {
    showModal('CryptoCredits', `Your account was credited ${amount} credits.`)
  } else {
    showModal('CryptoCredits', `Your account was debited ${amount} credits.`)
  }
}
function findClosestStation() {
  let closestStation = player.starSystem.stations[0];
  player.starSystem.stations.forEach(station => {
    if (Math.abs(station.starDistance - player.starDistance) < Math.abs(closestStation.starDistance - player.starDistance)) {
      closestStation = station;
    }
  })
  return closestStation;
}
function launchShip() {
  if(!ship.rented) {
    setMessage(`Looks like you don't have a ship yet. You can rent one here at the loading docks.`)
  } else if(ship.fuelLevel <= 0){
    setMessage(`You are gonna need some fuel in your before you can launch. You can buy some here in the shipyard.`)
  } else {
    ship.launched = true 
    toggleAvatar(false)
    clearActions()
    loadScreen(
      player.station.name,
      `Launching ship...`,
      () => {
        setBackgroundImage(player.station.image)
        toggleBGSway(true)
        setPlayerLocation(player.station.name)
        stationMainMenu()
        navigationMenu()
      }
    )
  }
}
function pilotLicense() {
  if(checkPilotLicense()) {
    setMessage(`Our records show you already have an active registered ${player.starSystem.name} pilot license.`)
  } else {
    setMessage(`The ${player.starSystem.name} Pilot License is required for commercial level flight in ${player.starSystem.name}. To register for a license you need to have your ${player.starSystem.name} ID Card and the registration fee of 1000 credits.`)
    clearActions()
    commsButton(`Purchase`, purchasePilotLicense)
    commsButton(`Back`, companyMenu)
  }
}
function purchasePilotLicense(){
  hideModalInput()
  if(checkPilotLicense()) {
    setMessage(`Our records show you already have an active registered ${player.starSystem.name} pilot license.`)
  } else if (player.credits < 1000 && !devMode) {
    setMessage(`I apologize. Your CryptoCredits declined. If you need a job that doesn't require pilot license, you can deliver packages at the loading docks.`)
  } else if(checkID() == undefined && !devMode) {
    setMessage(`The pilot license requires a valid ID. You can get one at the security office.`)
  } else {
    showModal(
      `${player.starSystem.name} Pilot License Agreement`, 
      `The ${player.starSystem.name} Pilot License is required for commercial level flight in ${player.starSystem.name}. By registering you the a registration fee of 1000 credits.`,   registerPilotLicense
    )
  }
}
function registerPilotLicense() {
  let pilotLicense = {
    title: `${player.starSystem.name} Pilot License`,
    licensee: player.name,
    starSystem: player.starSystem.name,
    issuerSignature: player.area.npc.name,
    issuer: player.station.company,
    code: generateID(),
    image: `img/official-doc (${Math.floor(rng() * 4) + 1}).png`,
    icon: `person-vcard-fill`
  }
  pilotLicense.desc = `<b>${player.starSystem.name} Commercial Pilot's License</b><br>License Holder's Name: ${player.name}<br>License Number: ${pilotLicense.code}<br>Issuer: ${pilotLicense.issuer}<br>Issuer Signature: ${pilotLicense.issuerSignature}`
  addItem(pilotLicense)
  closeModal()
  if(!devMode) updateCredits(-1000)
  setMessage(`Congrats, ${player.name}! I've registered your pilot license into the ${player.starSystem.name} archives and your application has already been approved. You should receive your pilots license in your documents soon.`)
  companyMenu()
}
function generateID() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 10;
  let id = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    id += characters.charAt(randomIndex);
  }
  return id;
}
function closeModal() {
  document.querySelector('#dialogue-box').close();
}
function hideModalInput() {
  document.querySelector('#dialogue-text-input').classList.add('d-none')
}
function showModalInput() {
  document.querySelector('#dialogue-text-input').classList.remove('d-none')
}
function addItem(item) {
  player.inventory.push(item)
  inventoryMenu()
}
function viewItem(item) {
  showNPC()
  toggleMonitorTransparency(true)
  setAvatarImage(item.image)
  setAvatarTitle(item.title)
  setAvatarSubtitle(`${item.type}`)
  setMessage(item.desc)
  console.log(item.area)
  if(item.area) {
    if(item.area == player.area) {
      if(!item.ready) {
        item.ready = true
        commsButton(`Deliver Package`, ()=>deliverPackage(item), `bi bi-box-seam-fill`)
      }
    }
  }
}
function setAvatarImage(path) {
  document.querySelector('#npc-avatar').style.backgroundImage = `url('${path}')`
  document.querySelector('#npc-chat-avatar').src = path
}
function showNPC() {
  document.querySelector('#npc').style.display = 'block'
  toggleMessage(true)
}
function rentShip() {
  if(findItem(`${player.starSystem.name} Pilot License`)) {
    setMessage(`You can rent a ship for 1 credit per million miles. You won't have to pay until you fill up with gas at a station. All pilots are required to have a commercial pilots license before they can rent a ship.`)
    clearActions()
    commsButton(`Agree`, addShip)
    commsButton(`Cancel`, shipyard)
  } else {
    setMessage(`You need to go to ${player.station.company} Main Office to get your pilot's license. You can buy one for 1000 credits.`)
  }
}
function setBackgroundImage(image) {
  document.querySelector('#pilot-window').style.backgroundImage = `url('${image}')`
}
function toggleBGSway(bool = true) {
  if (bool)
    document.querySelector('#pilot-window').classList.add('sway-animation')
  else
    document.querySelector('#pilot-window').classList.remove('sway-animation')
}
function setAvatarTitle(title) {
  document.querySelector('#npc-name').textContent = title
}
function setAvatarSubtitle(subtitle) {
  document.querySelector('#npc-dept').textContent = subtitle
}
function loadScreen(title, message, callback, timeout = 2000) {
  toggleAvatar(true)
  clearActions()
  setAvatarImage(`img/loader.gif`)
  setBackgroundImage(`img/bg-transition.gif`)
  setAvatarTitle(`Connecting to`)
  setAvatarSubtitle(title)
  setMessage(message)
  if(devMode) timeout = 0
  setTimeout(() => {
    callback()
    navigationMenu()
  }, timeout)
}
function toggleMessage(on = true) {
  const log = document.querySelector('#log')
  if (on) log.style.display = 'block'
  else log.style.display = 'none'
}
function toggleAvatar(on) {
  if (on) {
    document.querySelector('#npc').style.display = 'block'
    toggleMessage(true)
  } else {
    document.querySelector('#npc').style.display = 'none'
    toggleMessage(false)
  }
}
function addShip() {
  setMessage(`Let's see your pilots license. Everything looks in order here. `)
  navigationMenu()
  toggleGuages(true)
  shipyardMenu()
  ship.rented = true
}
function toggleGuages(on) {
  const fuel = document.querySelector('#fuel-guage')
  if (on) fuel.style.visibility = 'visible'
  else fuel.style.visibility = 'hidden'
}
function toggleMonitorTransparency(on = true) {
  let monitor = document.querySelector('#monitor')
  if (on) monitor.classList.add('opacity-75')
  else monitor.classList.remove('opacity-75')
}
function completeJob(job) {
  player.inventory = removeItem(job)
  player.jobs = remove(player.jobs, job)
  updateCredits(job.pay)
  inventoryMenu()
  job.jobStation.jobs.forEach(contract => {
    if (contract == job) {
      job.jobStation.jobs = remove(job.jobStation.jobs, job)
      job.jobStation.jobs.push(generateJob(job.jobStation))
    }
  })
  setAvatarImage(job.destination.jobNPC.image)
  setAvatarTitle(job.destination.jobNPC.name)
  setAvatarSubtitle(job.destination.jobNPC.company)
  setMessage(`You brought the data! I can finally login now. Thanks for delivering it here all the way from ${job.jobStation.name}.`)
  setBackgroundImage(job.destination.jobNPC.bgImg)
  commsButton(`Confirm`, stationOffice)
}
function moveToStationArea(title, menu) {
  toggleAvatar(true)
  clearActions()
  setAvatarImage(`img/loader.gif`)
  setBackgroundImage(`img/sci-fi-hallway.gif`)
  setAvatarTitle(`Walking to`)
  setAvatarSubtitle(title)
  toggleMessage(false)
  let timeout = 2000
  if(devMode) timeout = 0
  setTimeout(() => {
    menu()
    navigationMenu()
  }, timeout)
}
function removeItem(item) {
  player.inventory = player.inventory.filter(inventory => inventory !== item)
  inventoryMenu()
}
function setPlayerLocation(location){
  player.location = location
}
function bedroom(){
  setPlayerLocation(`Bedroom`)
  setBackgroundImage(player.station.roomImg)
  mirrorView()
  setMessage(`How should I look today?`)
  bedroomMenu()
  
}
function bedroomMenu(){
  clearActions()
  commsButton(`Next`, nextAvatar)
  commsButton(`Previous`, prevAvatar)
}
function exitToRoom(){
  moveToStationArea(`${player.station.name} Bedroom`, bedroomMenu)
}
function shipyardMenu(){
  clearActions()
  commsButton('Refuel Ship', starportFuelRequest)
  commsButton(`Rent Ship`, rentShip)
  commsButton('Launch Ship', launchShip, 'bi bi-rocket-takeoff-fill')
}
function companyMenu(){
  clearActions()
  commsButton(`Jobs`, jobMenu, 'bi bi-briefcase-fill')
  commsButton(`Pilot License`, pilotLicense, 'bi bi-airplane-fill')
}
function jobMenu(){
  clearActions()
  player.station.jobs.forEach(job => {
    if (job.status == 'available')
      commsButton(`${job.destination.name} ${job.type}`, job.details, 'bi bi-database-fill-lock')
  })
}
function deliverPackage(package) {
  toggleMonitorTransparency(false)
  setAvatarImage(player.area.npc.image)
  if(package.area.title === `Bedroom`) {
    setAvatarImage(player.image)
    setMessage(`My Spaceweed package arrived early. Nice!`)
    bedroomMenu()
  } else if(package.area.title === `Security Office`) {
    setMessage(`Thanks, ${player.name}. Seems like we can never get enough guns in here.`)
    securityOfficeMenu()
  } else if(package.area.title === `Shipyard`) {
    setMessage(`It seems we have some new components for the shipyard. These will definitely come in handy for our ongoing projects.`)
    shipyardMenu()
  } else if(package.area.title === player.station.company) {
    setMessage(`It appears we have some important encrypted data here. These must be reviewed and filed accordingly.`)
    companyMenu()
  }
  updateCredits(package.pay)
  removeItem(package)
}
function loadingDocks(){
  toggleAvatar(true)
  toggleMonitorTransparency(false)
  setMessage(`Welcome to the ${player.station.name} Loading Docks. We have cargo we receive here at the loading docks that need to be delivered to various departments around ${player.station.name}. We pay credits to have them delivered. You can scan your ID card to be assigned to a package delivery.`)
  setAvatarTitle(player.area.npc.name)
  setAvatarSubtitle(player.area.npc.subtitle)
  setAvatarImage(player.area.npc.image)
  setBackgroundImage(player.area.bgImg)
  loadingDocksMenu()
  toggleBGSway(false)
  setSubtitle(player.location)
}
function updateLocation(location){
  player.location = location
  navigationMenu()
}
function loadingDocksMenu(){
  clearActions()
  commsButton('Scan ID Card', loadingDockIDScan, 'bi bi-upc-scan')
}
function loadingDockIDScan(){
  if(checkID()) {
    setMessage(`We have a package available for delivery.`)
    deliveryOrder()
  } else {
    setMessage(`You don't have a valid Identification Card. You can get one at the Security Office.`)
  }
}
function deliveryOrder(){
  const localPackage = generateLocalPackage()
  const stationPackage = generateStationPackage()
  clearActions()
  const localPackageBtn = commsButton(localPackage.title, ()=>{
    pickUpPackage(localPackage)
    localPackageBtn.remove()
  }, 'bi bi-box-seam-fill')
  const stationPackageBtn = commsButton(stationPackage.title, ()=>{
    if(checkPilotLicense()) {
      pickUpPackage(stationPackage)
      stationPackageBtn.remove()
    } else {
      setAvatarImage(player.area.npc.image)
      setAvatarTitle(player.area.npc.name)
      setAvatarSubtitle(`Loading Docks Manager`)
      setMessage(`This job requires a Pilot's License. You can get one at the main office.`)
      toggleMonitorTransparency(false)
    }
    
  }, 'bi bi-box-seam-fill')
}
function generateLocalPackage(){
  const filteredAreas = player.station.areas.filter(area => area.title !== "Loading Docks");
  const randomIndex = Math.floor(Math.random() * filteredAreas.length);
  const area = filteredAreas[randomIndex]
  let package = {
    image: `img/sci-fi-package (${Math.floor(Math.random() * 14)+1}).png`,
    type: `Local Delivery Package`,
    area: area,
    id: generateID(),
    icon: `box-seam-fill`,
    pay: area.dockDistance,
    pilotLicense: false
  }
  package.title = `${player.station.name} Package ${package.id}`,
  package.desc = `Deliver to: ${player.station.name} ${area.title}<br>Package ID: ${package.id}<br>Credits: ${package.pay}`
  return package
}
function generateStationPackage(){
  const station = pickRandomStation(player.station)
  const filteredAreas = station.areas.filter(area => area.title !== "Loading Docks");
  const randomIndex = Math.floor(Math.random() * filteredAreas.length);
  const area = filteredAreas[randomIndex]
  let package = {
    image: `img/sci-fi-package (${Math.floor(Math.random() * 14)+1}).png`,
    type: `Station Delivery Package`,
    area: area,
    id: generateID(),
    icon: `box-seam-fill`,
    pay: area.dockDistance + Math.abs(station.starDistance - player.station.starDistance),
    pilotLicense: true
  }
  package.title = `${station.name} Package ${package.id}`,
  package.desc = `Deliver to: ${station.name} ${area.title}<br>Package ID: ${package.id}`
  return package
}
function pickRandomStation(station) {
  const stations = player.starSystem.stations.filter(item => item !== station);
  const randomIndex = Math.floor(Math.random() * stations.length);
  return stations[randomIndex];
}
function pickUpPackage(package, btn){
  // clearActions()
  viewItem(package)
  addItem(package)
}
function mirrorView(){
  toggleMonitorTransparency(false)
  toggleAvatar(true)
  clearActions()
  setAvatarImage(player.image)
  setAvatarTitle(player.name)
  setAvatarSubtitle(`Your Room`)
}
function nextAvatar(){
  player.avatarID++
  if(player.avatarID > 79) player.avatarID = 1
  const playerAvatar = `img/sci-fi-pilot (${player.avatarID}).png`
  setAvatarImage(playerAvatar)
  player.area.npc.avatar = playerAvatar
  player.image = playerAvatar
  toggleMonitorTransparency(false)
}
function prevAvatar(){
  player.avatarID--
  if(player.avatarID < 1) player.avatarID = 79
  const playerAvatar = `img/sci-fi-pilot (${player.avatarID}).png`
  setAvatarImage(playerAvatar)
  player.area.npc.avatar = playerAvatar
  player.image = playerAvatar
  toggleMonitorTransparency(false)
}
function generateArea(facility, bgType, npcType, actions){
  let bgImgMax = 0
  let dept = `Manager`
  switch(bgType) {
    case 'loading-docks':
      bgImgMax = 24
      dept = `Loading Docks Manager`
      break
    case 'shipyard':
      bgImgMax = 13
      dept = `Shipyard Supervisor`
      break
    case 'office-bg':
      bgImgMax = 22
      dept = `Front Desk`
      break
  }
  let npcImgMax = 0
  switch(npcType) {
    case 'worker':
      npcImgMax = 25
      break
    case 'pilot':
      npcImgMax = 79
      break
    case 'office':
      npcImgMax = 25
      break
  }
  let area = {
    title: facility, 
    dockDistance: (bgType == `loading-docks`) ? 0 : Math.floor(rng() * 1000), 
    bgImg: `img/sci-fi-${bgType} (${Math.floor(rng() * bgImgMax) + 1}).png`,
    actions: actions,
    npc: generateNPC(npcType, true, dept, '', `img/sci-fi-${bgType} (${Math.floor(rng() * bgImgMax) + 1}).png`, )
  }
  return area
}
function generateName(npcType) {
  let first = null
  let last = null
  switch(npcType) {
    case 'worker':
      first = pick(["Cyber", "Tech", "Byte", "Circuit", "Nexus", "Matrix", "Drone", "Pulse", "Nano", "Vortex", "Probe", "Neon", "Synth", "Gadget", "Jolt"])
      last = pick(["Axel", "Sprocket", "Wrench", "Gizmo", "Spark", "Bolt", "Cog", "Ratchet", "Gear", "Spanner", "Socket", "Piston", "Widget", "Crux", "Machina"])
      break
    case 'pilot':
      first = pick(["Max", "Stella", "Aurora", "Jet", "Nova", "Rex", "Luna", "Cosmo", "Zara", "Orion", "Vega", "Nyx", "Apollo", "Nova", "Stellar", "Raven", "Galaxy", "Axel", "Celeste", "Blaze"]);
      last = pick(["Nova", "Orion", "Blaze", "Phoenix", "Starstrider", "Nebula", "Stardust", "Falcon", "Warpwind", "Skyslicer", "Starfire", "Shadowpilot", "Starwing", "Nebulon", "Eclipse", "Starwind", "Stardancer", "Novaheart", "Starfrost", "Starglider"]);
      break
    case 'office': 
      first = pick(["Xander", "Luna", "Nyx", "Stella", "Nova", "Astra", "Zephyr", "Cyber", "Nebula", "Galaxy", "Cosmo", "Orion", "Serenity", "Celeste", "Raven", "Axel", "Aurora", "Blaze Nebula", "Phoenix", "Vega"]);
      last = pick(["Drake", "Vega", "Orion", "Steele", "Nexus", "Frost", "Silver", "Haze", "Nano", "Swift", "Stone", "Neon", "Starling", "Moon", "Nova", 'Eclipse', 'Mercury', 'Steel', 'Jetstream']);
      break
  }
  return `${first} ${last}`
}
function securityOffice() {
  if(findItem(`Identification Card`)) {
    setMessage(`Welcome back, ${player.name}. How's that security card working out for you? You should be able to work at the loading docks now. Check by there for work.`)
  } else {
    setMessage(`This is the ${player.station.name} Security office. You can register for an ID card here. The registration fee is 30 credits.`)
  }
  
  securityOfficeMenu()
}
function securityOfficeMenu(){
  clearActions()
  commsButton(`Register ID Card`, registerID, 'bi bi-person-vcard')
}
function registerID(){
  if(findItem(`Identification Card`)) {
    setMessage(`Our records show you already have an active registered ${player.starSystem.name} Identification Card.`)
  } else {
    showModal(
      `${player.starSystem.name} ID Card`, 
      `The ${player.starSystem.name} Identification card is required for working in ${player.station.name}. The registration cost is 30 credits. Enter your name and confirm.`, 
      registerIDCard
    )
    document.querySelector('#dialogue-text-input').classList.remove('d-none')
    document.querySelector('#dialogue-text-input').value = player.name
  }
}
function registerIDCard(){
  const card = {
    title: `Identification Card`,
    type: `Government Document`,
    id: generateID(),
    image: `img/official-doc (${Math.floor(rng()*4) + 1}).png`,
    icon: `person-vcard-fill`
  }
  card.desc = `<b>${player.starSystem.name} Official ID Card</b><br>Name: ${player.name}<br>ID#: ${card.id}`,
  addItem(card)
  closeModal()
  if(!devMode) updateCredits(-30)
  setMessage(`Congrats on getting your identification card. You can now qualify for delivery jobs in the station.`)
  player.name = document.querySelector('#dialogue-text-input').value
}
function checkID(){
  return findItem(`Identification Card`)
}
function findItem(title) {
  return player.inventory.find(item => item.title === title)
}
function checkPilotLicense(){
  if(findItem(`${player.starSystem.name} Pilot License`))
    return true
  else
    return false
}
function setSubtitle(text) {
  document.querySelector('#hud-location').textContent = text
}