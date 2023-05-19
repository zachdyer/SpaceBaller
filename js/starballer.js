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
  starID: 3,
  image: `img/player-spaceship-3.png`,
  shipName: 'StarBaller',
  shipModel: 'Planetary Cruiser',
  station: null,
  isInFlight: false,
  credits: 0,
  setCredits: (amount)=>{
    player.credits = amount
    credits.textContent = player.credits
  },
  jobs: [],
  location: null
}
let rng = new Math.seedrandom(player.starID)
let maxStations = Math.floor(rng() * maxSpaceStationImages) + 1
let starSystem = generateStarSystem(player.starID)
const npcElements = {
  avatar: document.querySelector('#npc-avatar'),
  thumb: document.querySelector('#npc-chat-avatar'),
  profile: document.querySelector('#npc'),
  message: document.querySelector('#npc-message'),
  name: document.querySelector('#npc-name'),
  dept: document.querySelector('#npc-dept')
}

function generateStation() {
  const spaceStationNames1 = pick(["Lunaris", "Stellar", "Nebula", "Galactic", "Astrocore", "Celestial", "Orion", "Cosmos", "Infinity", "Nova", "Serenity", "Quantum", "Interstellar", "Aurora", "Cosmic", "Pulsar", "Eclipse", "Astrostar", "Supernova", "Astroverse"]);
  const spaceStationNames2 = pick(["Station", "Nexus", "Prime", "Horizon", "Citadel", "Outpost", "Haven", "Orbital", "Command", "Vertex", "Hub", "Base", "Sanctuary", "Observatory", "Gateway", "Spire", "Expanse", "Fortress", "Refuge", "Center"]);
  const company = pick(["Systems", "Industrial", "Corporation", "Science", "Enterprises", "Union", "Core", "Tec", "Dynamic", "Industries", "Industry", "Commercial"])
  const stationName = `${spaceStationNames1} ${spaceStationNames2}`
  let companyName = `${stationName} ${company}`
  console.log(companyName)
  return {
    name: stationName,
    image: `url(../img/space-station-${Math.floor(rng() * maxSpaceStationImages) + 1}.png)`,
    starDistance: Math.floor(rng() * 5000),
    mechanicNPC: generateNPC('mechanic', true, `${stationName} Shipyard`),
    jobNPC: generateNPC('office', true, companyName),
    jobs: [],
    company: companyName,
    payPerMillionMiles: Math.floor(rng() * 8) + 2
  }
}
function generateStarSystem(id) {
  let rng = new Math.seedrandom(id)
  const word1 = ["Alpha", "Sirius", "Betelgeuse", "Proxima", "Vega", "Polaris", "Antares", "Deneb", "Epsilon", "Tau", "Wolf", "Kepler", "Trappist", "Gliese", "HD", "Eta", "Zeta", "Sagittarius", "Cygnus", "Orion"];
  const word2 = ["Eridani", "Ceti", "359", "186", "1", "581", "209458", "Carinae", "Reticuli", "A*", "X-1", "Nebula"];
  const totalStations = Math.floor(rng() * 10) + 2
  for (let i = 0; i < totalStations; i++) {
    spaceStations.push(generateStation())
  }
  // Sort stations by star distance
  spaceStations.sort((a, b) => a.starDistance - b.starDistance);
  return {
    name: `${word1[Math.floor(rng() * word1.length)]} ${word2[Math.floor(rng() * word2.length)]}`,
    image: `url(../img/star-system-${Math.floor(rng() * maxStarSystemImages) + 1}.png)`,
    stations: spaceStations
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
function displayComms(avatar = 'img/loader.gif', name = 'Loading Contact...', dept = 'Loading Info...', message = '', callback = null, delay = Math.random()*3000){
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
  }, delay)
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
      ["Starfire", "Cosmosphere", "Astroblade", "Stellaris", "Galactron", "Nebula", "Celestial", "Interstellar", "Lunar", "Cosmic", "Orion's", "Nova", "Quantum", "Eclipse", "Astroscout", "Cosmic", "Infinity", "Stardust", "Hypernova", "Solar", "Aurora", "Spectrum", "Astroflux", "Celestia", "Astroverse"],
      ["Voyager", "Wing", "Phoenix", "Sentinel", "Serpent", "Fury", "Explorer", "Dawn", "Raider", "Crusader", "Falcon", "Voyager", "Flare", "Cosmos", "Nighthawk", "Horizon", "Supernova", "Nova", "Stargazer", "Nebulus", "Stellar", "Aether", "Elysium", "Orbiter", "Infinity"]
    ];

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
  commsButton(player.station.company, stationJobMenu)
  player.location = player.station.name
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
    player.location = player.station.mechanicNPC.dept
}
function stationJobMenu(){
  clearComms()
  let message = `Welcome to ${player.station.company}.`
  player.station.jobs.forEach(job => {
    if(job.status == 'active') {
      message = `How's that ${job.type} going? If you have an questions check your active missions file.`
    }
  })
  displayComms(
    player.station.jobNPC.image,
    player.station.jobNPC.name,
    player.station.company,
    message,
    ()=>{
      player.station.jobs.forEach(job => {
        if(job.status == 'available')
          commsButton(job.type, job.details)
      })
      commsButton('Exit', stationMainMenu)
      player.location = player.station.company
      activeContracts()
    }
  )
  
}
function acceptJob(job){
  setMessage(`I've uploaded your contract data to ${player.shipName}. `)
  clearComms()
  commsButton('Exit', stationMainMenu)
  addJob(job)
  document.querySelector('#active-jobs-header').style.display = 'block'
  player.jobs.push(job)
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
    let stationDistance = Math.abs(spaceStations[i].starDistance - player.starDistance)
    if(stationDistance < Math.abs(closestStation.starDistance - player.starDistance)) {
      closestStation = spaceStations[i]
    }
  }
  movePlayer(closestStation, false)
  updateCredits(-10000)
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
function generateJob(jobStation){
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
  if(type == 'Data Delivery') {
    let availableStations = spaceStations.filter((station) => station != jobStation)
    missionStation = pick(availableStations, false)
    let totalDistance = Math.abs(missionStation.starDistance - jobStation.starDistance)
    pay = totalDistance * jobStation.payPerMillionMiles
    message = `${type} Contract: Deliver ${jobStation.company} encrypted data to ${missionStation.company}. ${jobStation.company} pays ${jobStation.payPerMillionMiles} credits per million miles traveled. ${jobStation.company} agrees to pay ${pay} CryptoCredits on confirmed delivery.`
  }
  let job = {
    type: type,
    details: ()=>{
      setMessage(message)
      clearComms()
      commsButton('Accept', ()=> {
        job.status = 'active'
        acceptJob(job)
      })
      commsButton('Exit', stationMainMenu)
    },
    pay: pay,
    status: 'available',
    info: message,
    destination: missionStation,
    jobStation: jobStation
  }
  return job
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
  updateCredits(-cost)
  clearComms()
  commsButton('Exit', stationMainMenu)
  navigationMenu()
}
function navigationMenu(){
  // Clear navigation list
  while (navigation.firstChild) {
    navigation.removeChild(navigation.firstChild);
  }
  let closestStation = findClosestStation()
  // Build and rebuild navigation list
  spaceStations.forEach(station => {
    const li = document.createElement('li');
    const stationInfo = document.createElement('span')
    li.setAttribute('class', 'list-group-item d-flex justify-content-between align-items-center bg-dark text-bg-dark');
    li.setAttribute('data-station-name', station.name);
    li.setAttribute('data-station-distance', station.starDistance);
    const distance = Math.abs(station.starDistance - player.starDistance)
    stationInfo.textContent = `${station.name} ${distance} Mm`;
    const button = document.createElement('button');
    button.setAttribute('class', 'btn btn-primary float-end btn-navigate');
    button.textContent = 'Navigate';
    if(fuelLevel <= 0 || station == player.station) {
      button.disabled = true
    } else {
      button.disabled = false
    }
    button.addEventListener('click', () => {
      // Remove highlighting from all list items
      const listItems = document.querySelectorAll('.list-group-item');
      listItems.forEach(item => {
        item.classList.remove('active');
      });
      movePlayer(station)
      // Highlight the clicked list item
      // li.classList.add('active')
      hideComms()
      player.isInFlight = true
      clearComms()
    })
    li.appendChild(stationInfo);
    li.appendChild(button);
    if(station == closestStation) li.classList.add('active')
    navigation.appendChild(li);
    
  })
}
function movePlayer(station, fuel = true) {
  warpView()
  player.isInFlight = true
  clearInterval(navigationInterval)
  // Update player distance every millisecond
  const lightspeed = 5370
  const hackerspeed = 1
  const velocity = (player.starDistance < station.starDistance) ? hackerspeed : -hackerspeed
  if(fuel) fuelTankBar.classList.add('progress-bar-animated')
  powerNavigation(true)
  navigationInterval = setInterval(() => {
    // Increment player distance by 1 million miles per millisecond
    player.starDistance += velocity;
    hudLocation.textContent = station.name;
    // Player has arrived at station
    if (station.starDistance - player.starDistance == 0) {
      clearInterval(navigationInterval)
      pilotWindow.style.backgroundImage = station.image;
      player.isInFlight = false
      player.station = station
      stationMainMenu()
      hideComms()
      fuelTankBar.classList.remove('progress-bar-animated')
      navigationMenu()
      player.location = player.station.name
      activeContracts()
    }
    updateListContent()
    navigationMenu()
    if(fuel) setFuelLevel(fuelLevel - 1)
  }, 1)
}
function addJob(job){
  const button = document.createElement('button')
  button.classList.add('btn')
  button.classList.add('btn-primary')
  if(player.station == job.destination && player.location == job.destination.company) {
    button.textContent = `Complete ${job.type}`
    button.addEventListener('click', ()=>{
      displayComms(
        job.destination.jobNPC.image,
        job.destination.jobNPC.name,
        job.destination.company,
        `You brought the data! I can finally login now. Thanks for delivering it here all the way from ${job.jobStation.name}.`,
        ()=>{
          player.jobs = remove(player.jobs, job)
          updateCredits(job.pay)
          activeContracts()
          job.jobStation.jobs.forEach(job => {
            if (job === job) {
              job.jobStation.jobs = remove(job.jobStation.jobs, job)
              job.jobStation.jobs.push(generateJob(job.jobStation))
            }
          });
          
        }
      )
    })
  } else {
    button.textContent = `${job.destination.name} ${job.type}`
    button.addEventListener('click', ()=>{
      displayComms(
        player.image,
        player.shipName,
        player.shipModel,
        job.info, 
        null, 1    
      )
    })
  }
  document.querySelector('#active-jobs').appendChild(button)
  return button
}
function startGame(fuel = 0, credits = 0, station = null, starID = 0){
  hudTitle.textContent = starSystem.name
  pilotWindow.style.backgroundImage = starSystem.image
  spaceStations.forEach(station =>{
    station.jobs.push(generateJob(station))
  })
  setFuelLevel(fuel)
  if(fuel == 0) fuelLevelAlert()
  player.setCredits(credits)
  if(station) {
    player.station = station
    player.location = player.station.name
    player.starDistance = player.station.starDistance
    stationMainMenu()
    pilotWindow.style.backgroundImage = player.station.image
  }
  navigationMenu()
  // Closes the dialogue box
  document.querySelector('#dialogue-close').addEventListener('click', () => {
    document.querySelector('#dialogue-box').close();
  })
  if(player.location) {
    hudLocation.textContent = player.location
  }
}
function activeContracts(){
  const activeJobs = document.querySelector('#active-jobs')
  while (activeJobs.firstChild) {
    activeJobs.removeChild(activeJobs.firstChild);
  }
  if(player.jobs.length) {
    document.querySelector('#active-jobs-header').style.display = 'block'
    player.jobs.forEach(job => {
      addJob(job)
    })
  } else {
    document.querySelector('#active-jobs-header').style.display = 'none'
  }
}
function remove(array, element) {
  return array.filter(item => item !== element);
}
function showModal(title, message){
  const dialogueBox = document.querySelector('#dialogue-box')
  dialogueBox.showModal()
  document.querySelector('#dialogue-title').textContent = title
  document.querySelector('#dialogue-message').textContent = message
}
function updateCredits(amount){
  player.setCredits(player.credits + amount)
  if(amount > 0) {
    showModal('CryptoCredits', `Your account was credited ${amount} credits.`)
  } else {
    showModal('CryptoCredits', `Your account was debited ${amount} credits.`)
  }
}
function findClosestStation() {
  let closestStation = spaceStations[0];
  spaceStations.forEach(station => {
    if (Math.abs(station.starDistance - player.starDistance) < Math.abs(closestStation.starDistance - player.starDistance)) {
      closestStation = station;
    }
  });
  return closestStation;
}

startGame(0, 0, null, player.starID)