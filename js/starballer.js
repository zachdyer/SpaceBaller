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
const log = document.querySelector('#log')
let emergencyFuelPilot = generateNPC('pilot', false, 'Emergency Fuel Services')
const shipComms = document.querySelector('#ship-comms')
const credits = document.querySelector('#credits')
let player = {
  starDistance: 0,
  starID: 1,
  image: `img/player-spaceship-3.png`,
  shipName: null,
  shipModel: 'Planetary Cruiser',
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
const npcElements = {
  avatar: document.querySelector('#npc-avatar'),
  thumb: document.querySelector('#npc-chat-avatar'),
  profile: document.querySelector('#npc'),
  message: document.querySelector('#npc-message'),
  name: document.querySelector('#npc-name'),
  dept: document.querySelector('#npc-dept')
}

function generateStation() {
  const spaceStationNames1 = ["Lunaris", "Stellar", "Nebula", "Galactic", "Astrocore", "Celestial", "Orion", "Cosmos", "Infinity", "Nova", "Serenity", "Quantum", "Interstellar", "Aurora", "Cosmic"]
  const spaceStationNames2 = ["Station", "Nexus", "Prime", "Horizon", "Citadel", "Outpost", "Haven", "Orbital", "Command", "Vertex", "Hub", "Base", "Sanctuary"]
  let stationName = `${spaceStationNames1[Math.floor(rng() * spaceStationNames1.length)]} ${spaceStationNames2[Math.floor(rng() * spaceStationNames2.length)]}`
  return {
    name: stationName,
    image: `url(../img/space-station-${Math.floor(rng() * maxSpaceStationImages) + 1}.png)`,
    starDistancePerMillionMiles: Math.floor(rng() * 5000),
    mechanicNPC: generateNPC('mechanic', true, `${stationName} Ship Services`),
    jobNPC: generateNPC('office', true, `${stationName} Human Resources`),
    generalNPC: generateNPC('office', true, `${stationName} Main Office`),
    jobs: generateJobs()
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
function displayComms(avatar = 'img/loader.gif', name = 'Loading Contact...', dept = 'Loading Info...', message = '', callback = null){
  npcElements.profile.style.display = 'block'
  log.style.display = 'block'
  npcElements.avatar.style.backgroundImage = `url(img/loader.gif)`
  npcElements.name.textContent = name
  npcElements.dept.textContent = dept
  npcElements.thumb.src = player.image
  npcElements.message.textContent = `Attempting to connect to ${dept}.`
  setTimeout(()=> {
    npcElements.avatar.style.backgroundImage = `url('${avatar}')`
    npcElements.thumb.src = avatar
    npcElements.message.textContent = message
    if(callback) callback()
  }, 3000)
}
function hideComms() {
  npcElements.profile.style.display = 'none'
  log.style.display = 'none'
}
function generateNPC(type, procedural, dept = '', message = '', options = []){
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
    dept: dept,
    message: message,
    options: options
  }
}
function emergencyFuelRequest(){
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
    emergencyFuelPilot.image, 
    emergencyFuelPilot.name, 
    emergencyFuelPilot.dept, 
    message, ()=>{
    clearComms()
    commsButton('Confirm', ()=>{
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
      npcElements.message.textContent = `${sentence[Math.floor(Math.random()*sentence.length)]}`
      player.credits - 10000
      player.setCredits(player.credits - 10000)
      clearComms()
      powerNavigation(true)
    })
    commsButton('Exit', emergencyServiceMenu)
  })
}
function generateShipName() {
    let words = [
      ["Starfire", "Cosmosphere", "Astroblade", "Stellaris", "Galactron", "Nebula", "Celestial", "Interstellar", "Lunar", "Cosmic", "Orion's", "Nova", "Quantum", "Eclipse", "Astroscout", "Cosmic", "Infinity", "Stardust", "Hypernova", "Solar"],
      ["Voyager", "Wing", "Phoenix", "Sentinel", "Serpent", "Fury", "Explorer", "Dawn", "Raider", "Crusader", "Falcon", "Voyager", "Flare"]
    ]
    return `${words[0][Math.floor(rng()*words[0].length)]} ${words[1][Math.floor(rng()*words[1].length)]}`
}
function starportFuelRequest(){
  let estimate = fuelTankCapacity - fuelLevel
  setMessage(`The cost of NovaFuel per gallon is 1 credit. It's literally the cheapest thing you can buy in the galaxy. The government made sure of that. To get you to a full tank your looking at ${estimate} credits.`)
  clearComms()
  commsButton('Confirm', starportRefuel)
  commsButton('Exit', stationMainMenu)
  
}
function fuelLevelAlert(){
  let message = `Danger. Fuel levels are critical. Shutting navigation system down. Recommend Sending a request signal for Emergency Fuel Services.`
  displayComms(player.image, player.shipName, player.shipModel, message)
  clearComms()
  commsButton('Send Emergency Distress Signal', emergencyServiceMenu)
  powerNavigation(false)
}
function clearComms() {
  while (shipComms.firstChild) {
    shipComms.removeChild(shipComms.firstChild);
  }
}
function commsButton(label, func){
  const button = document.createElement('button')
  button.classList.add('btn')
  button.classList.add('btn-primary')
  button.textContent = label
  button.addEventListener('click', func)
  shipComms.appendChild(button)
  return button
}
function stationMainMenu(){
  clearComms()
  hideComms()
  commsButton(player.station.mechanicNPC.dept, stationShipMenu)
  commsButton(player.station.jobNPC.dept, stationJobMenu)
}
function stationShipMenu(){
  clearComms()
  let message = `Welcome to ${player.station.mechanicNPC.dept}. What can I do for you?`
  displayComms(
    player.station.mechanicNPC.image, 
    player.station.mechanicNPC.name,
    player.station.mechanicNPC.dept,
    message,
    ()=>{
      const refuel = commsButton('Refuel', starportFuelRequest)
      if(fuelLevel == fuelTankCapacity) refuel.disabled = true
      commsButton('Exit', stationMainMenu)
    })
}
function stationJobMenu(){
  clearComms()
  displayComms(
    player.station.jobNPC.image,
    player.station.jobNPC.name,
    player.station.jobNPC.dept,
    `Welcome to ${player.station.jobNPC.dept}.`,
    ()=>{
      player.station.jobs.forEach(job =>{
        commsButton(job.type, job.details)
      })
      commsButton('Exit', stationMainMenu)
    }
  )
}
function acceptJob(){
  setMessage(`Great job! It must of been quite a task but you pulled it off. Press the complete job button and we will transfer the funds to your CryptCredits.`)
  clearComms()
  commsButton('Complete Job', completeJob)
  commsButton('Exit', stationMainMenu)
}
function completeJob(){
  player.setCredits(player.credits + 1000)
  setMessage(`We transferred the credits to your account. Check back again anytime your looking for more work.`)
  clearComms()
  commsButton('Exit', stationMainMenu)
}
function setMessage(message) {
  npcElements.message.textContent = message
}
function pick(list, procedural = true){
  if(procedural) 
    return list[Math.floor(rng()*list.length)]
  else 
    return list[Math.floor(Math.random()*list.length)]
}
function emergencyServiceMenu(){
  clearComms()
  displayComms(
    emergencyFuelPilot.image,
    emergencyFuelPilot.name,
    emergencyFuelPilot.dept,
    `I have recieved your emergency signal. How can I help you?`,
    ()=>{
      commsButton('Request Tow Service', emergencyTowRequest)
      commsButton('Request Fuel Service', emergencyFuelRequest)
      commsButton('Exit', fuelLevelAlert)
    }
  )
}
function emergencyTowRequest(){
  clearComms()
  setMessage(`To tow you to the nearest station costs 10000 credits.`)
  commsButton('Confirm', emergencyTow)
  commsButton('Exit', fuelLevelAlert)
}
function emergencyTow(){
  clearComms()
  setMessage(`Sit tight and away we go.`)
  let closestStation = spaceStations[0]
  for(let i = 1; i < spaceStations.length; i++){
    let stationDistance = Math.abs(spaceStations[i].starDistancePerMillionMiles - player.starDistance)
    if(stationDistance < Math.abs(closestStation.starDistancePerMillionMiles - player.starDistance)) {
      closestStation = spaceStations[i]
    }
  }
  movePlayer(closestStation, false)
  player.setCredits(player.credits - 10000)
}
function warpView(){
  pilotWindow.style.backgroundImage = 'url(../img/warp.gif)';
}
function powerNavigation(onoff){
  const navButtons = document.querySelectorAll('.btn-navigate')
  navButtons.forEach(button => {
    button.disabled = !onoff
  })
}
function generateJobs(){
  let jobs = []
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
  let type = pick(types)
  jobs.push({
    type: type,
    details: ()=>{
      setMessage(type)
    }
  })
  return jobs
}
function starportRefuel(){
  const cost = fuelTankCapacity - fuelLevel
  setFuelLevel(fuelTankCapacity)
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
  powerNavigation(true)
  player.setCredits(player.credits - cost)
  clearComms()
  commsButton('Exit', stationMainMenu)
}
function navigationMenu(){
  // Clear navigation list
  while (navigation.firstChild) {
    navigation.removeChild(navigation.firstChild);
  }
  // Build and rebuild navigation list
  spaceStations.sort((a, b) => a.starDistancePerMillionMiles - b.starDistancePerMillionMiles);
  spaceStations.forEach(station => {
    if(station != player.station) {
      const li = document.createElement('li');
      const stationInfo = document.createElement('span')
      li.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-center');
      li.setAttribute('data-station-name', station.name);
      li.setAttribute('data-station-distance', station.starDistancePerMillionMiles);
      stationInfo.textContent = `${station.name} ${station.starDistancePerMillionMiles - player.starDistance} Mm`;
      const button = document.createElement('button');
      button.setAttribute('class', 'btn btn-primary float-end btn-navigate');
      button.textContent = 'Navigate';
      if(fuelLevel <= 0) button.disabled = true
      button.addEventListener('click', () => {
        // Remove highlighting from all list items
        const listItems = document.querySelectorAll('.list-group-item');
        listItems.forEach(item => {
          item.classList.remove('active');
        });
        movePlayer(station)
        // Highlight the clicked list item
        li.classList.add('active')
        hideComms()
        player.isInFlight = true
      })
      li.appendChild(stationInfo);
      li.appendChild(button);
      navigation.appendChild(li);
    }
  })
}
function movePlayer(station, fuel = true) {
  warpView()
  player.isInFlight = true
  clearInterval(navigationInterval)
  // Update player distance every millisecond
  const lightspeed = 5370
  const hackerspeed = 1
  const velocity = (player.starDistance < station.starDistancePerMillionMiles) ? hackerspeed : -hackerspeed
  if(fuel) fuelTankBar.classList.add('progress-bar-animated')
  navigationInterval = setInterval(() => {
    // Increment player distance by 1 Mm per millisecond
    player.starDistance += velocity;
    hudLocation.textContent = station.name;
    // Player has arrived at station
    if (station.starDistancePerMillionMiles - player.starDistance == 0) {
      clearInterval(navigationInterval)
      pilotWindow.style.backgroundImage = station.image;
      player.isInFlight = false
      player.station = station
      stationMainMenu()
      hideComms()
      fuelTankBar.classList.remove('progress-bar-animated')
      navigationMenu()
    }
    updateListContent()
    if(fuel) setFuelLevel(fuelLevel - 1)
  }, 1)
}

hudTitle.textContent = starSystem.name
pilotWindow.style.backgroundImage = starSystem.image
for (let i = 0; i < maxStations; i++) {
  spaceStations.push(generateStation())
}
// order stations
navigationMenu()
// The fuel level is initialized to update the fuel bar
setFuelLevel(fuelLevel)
fuelLevelAlert()
credits.textContent = player.credits
player.shipName = generateShipName()