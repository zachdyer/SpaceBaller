let maxSpaceStationImages = 7
let maxStarSystemImages = 5
let hudTitle = document.querySelector('#hud-title')
let hudLocation = document.querySelector('#hud-location')
let navigation = document.querySelector('#navigation')
let spaceStations = []
let fuelTankCapacity = 5000
let fuelLevel = 5000
let fuelTankBar = document.querySelector('#fuel-tank')
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
  location: null,
  documents: [],
  ship: null,
  pilotLicense: null,
  name: `SpaceBaller`
}
let rng = new Math.seedrandom(player.starID)
let maxStations = Math.floor(rng() * maxSpaceStationImages) + 1
let starSystem = generateStarSystem(player.starID)

function generateStation() {
  const spaceStationNames1 = pick(["Lunaris", "Stellar", "Nebula", "Galactic", "Astrocore", "Celestial", "Orion", "Cosmos", "Infinity", "Nova", "Serenity", "Quantum", "Interstellar", "Aurora", "Cosmic", "Pulsar", "Eclipse", "Astrostar", "Supernova", "Astroverse"]);
  const spaceStationNames2 = pick(["Station", "Nexus", "Prime", "Horizon", "Citadel", "Outpost", "Haven", "Orbital", "Command", "Vertex", "Hub", "Base", "Sanctuary", "Observatory", "Gateway", "Spire", "Expanse", "Fortress", "Refuge", "Center"]);
  const company = pick(["Systems", "Industrial", "Corporation", "Science", "Enterprises", "Union", "Core", "Tec", "Dynamic", "Industries", "Industry", "Commercial"])
  const stationName = `${spaceStationNames1} ${spaceStationNames2}`
  let companyName = `${stationName} ${company}`
  console.log(companyName)
  return {
    name: stationName,
    image: `img/space-station-${Math.floor(rng() * maxSpaceStationImages) + 1}.png`,
    starDistance: Math.floor(rng() * 5000),
    mechanicNPC: generateNPC('mechanic', true, `${stationName} Shipyard`, null, `img/sci-fi-shipyard (${Math.floor(rng()* 13)+ 1}).png`),
    jobNPC: generateNPC('office', true, companyName, null, `img/sci-fi-office-bg (${Math.floor(rng()* 22)+ 1}).png`),
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
    image: `img/star-system-${Math.floor(rng() * maxStarSystemImages) + 1}.png`,
    stations: spaceStations
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
function setFuelLevel(amount){
  fuelLevel = amount
  if(amount)
    fuelTankBar.style.width = `${Math.floor(amount / fuelTankCapacity * 100)}%`
  else
    fuelTankBar.style.width = `0%`
}
function displayComms(avatar = 'img/loader.gif', name = 'Loading Contact...', dept = 'Loading Info...', message = '', callback = null, delay = 2000, bgImg = null){
  showComms()
  setAvatarImage(`img/loader.gif`)
  if(bgImg) {
    setBackgroundImage(`img/bg-transition.gif`)
    toggleBGSway(false)
  }
  setAvatarTitle(name)
  setAvatarSubtitle(dept)
  setMessage(`Attempting to connect to ${dept}.`)
  setTimeout(()=> {
    setAvatarImage(avatar)
    setMessage(message)
    if(bgImg) {
      setBackgroundImage(bgImg)
      toggleMonitorTransparency(false)
    }
    if(callback) callback()
  }, delay)
}
function generateNPC(type, procedural, dept = '', message = '', bgImg = null){
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
    bgImg: bgImg
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
      setMessage(`${sentence[Math.floor(Math.random()*sentence.length)]}`)
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
  toggleMonitorTransparency(false)
  setAvatarImage(player.station.mechanicNPC.image)
  setAvatarTitle(player.station.mechanicNPC.name)
  setAvatarSubtitle(player.station.mechanicNPC.dept)
  clearComms()
  if(player.ship) {
    let mileage = fuelTankCapacity - fuelLevel
    let estimate = mileage * 2
    if(mileage > 0) {
      setMessage(`Your odometer reads ${mileage} million miles. The cost of NovaFuel per gallon is 1 credit. And the rental is 1 credit per million miles. Total cost for the rental and gas is ${estimate} credits.`)
      commsButton('Confirm', ()=>starportRefuel(estimate))
    } else {
      setMessage(`Our system shows you have a full tank.`)
    }
  } else {
    setMessage(`What ship? It might help if you had a ship to fuel. You can rent a ship for 2 credit per million miles. But you need your pilots license to rent one. Don't look at me like that. It's the law. You can register for a pilots license at ${player.station.company} Main Office.`)
  }
  commsButton(`Refuel Ship`, starportFuelRequest)
  commsButton(`Rent Ship`, rentShip)
  commsButton('Exit', stationShipMenu)
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
  toggleAvatar(false)
  commsButton(player.station.mechanicNPC.dept, ()=>stationShipMenu(2000))
  commsButton(player.station.company, ()=> stationJobMenu(2000))
}
function stationShipMenu(){
  loadScreen(
    player.station.mechanicNPC.dept, 
    `Attempting to connect to ${player.station.mechanicNPC.dept}.`, 
    ()=>{
      const message = `Welcome to the ${player.station.mechanicNPC.dept}. What can I do for you?`
      toggleMonitorTransparency(false)
      setAvatarImage(player.station.mechanicNPC.image)
      setAvatarTitle(player.station.mechanicNPC.name)
      setAvatarSubtitle(player.station.mechanicNPC.dept)
      setMessage(message)
      setBackgroundImage(player.station.mechanicNPC.bgImg)
      toggleBGSway(false)
      commsButton('Refuel Ship', starportFuelRequest)
      commsButton(`Rent Ship`, rentShip)
      commsButton('Exit', exitStation)
      player.location = player.station.mechanicNPC.dept
  })
}
function stationJobMenu(delay = 2000, message){
  clearComms()
  if(!message) message = `Welcome to ${player.station.company}. How can I help you?`
  player.station.jobs.forEach(job => {
    if(job.status == 'active') {
      message = `If you have an questions about your active job check your ${job.jobStation.company} contract labeled ${job.destination.name} ${job.type} in your documents.`
    }
  })
  displayComms(
    player.station.jobNPC.image,
    player.station.jobNPC.name,
    player.station.company,
    message,
    ()=>{
      player.location = player.station.company
      player.jobs.forEach(job => {
        if(job.destination.company == player.location) addCompleteJobBtn(job)
      })
      player.station.jobs.forEach(job => {
        if(job.status == 'available')
          commsButton(`${job.destination.name} ${job.type}`, job.details)
      })
      if(!player.pilotLicense) commsButton(`${starSystem.name} Pilot License`, pilotLicense)
      commsButton('Exit', exitStation)
      documentsMenu()
      toggleBGSway(false)
    }, delay, player.station.jobNPC.bgImg
  )
}
function acceptJob(job, doc){
  if(player.pilotLicense) {
    loadScreen(`Downloading Contract File`,`Processing ${job.type} Contract.`,()=>{
      job.status = 'active'
      addDoc(
        doc.title,
        doc.doc,
        doc.image
      )
      toggleMonitorTransparency(false)
      setAvatarImage(player.station.jobNPC.image)
      setAvatarTitle(player.station.jobNPC.name)
      setAvatarSubtitle(player.station.company)
      setBackgroundImage(player.station.jobNPC.bgImg)
      setMessage(`I've uploaded your contract data to your documents.`)
      commsButton('Exit', ()=> stationJobMenu(0))
      player.jobs.push(job)
      document.querySelector('#active-jobs-header').style.display = 'block'
    })
  } else {
    setMessage(`${player.station.company} requires a pilots license for delivery contracts. You can register for one here at our main office for 1000 credits.`)
  }
}
function setMessage(message) {
  document.querySelector('#npc-message').innerHTML = message
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
  setBackgroundImage('img/warp.gif');
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
      let doc = {
        image: `img/sci-fi-data (${Math.floor(rng()*10)+1}).png`,
        title: `${job.destination.name} ${job.type} Contract`,
        doc: message
      }
      viewDoc(doc)
      clearComms()
      commsButton(`Job Contract`, job.details)
      commsButton(`Accept Contract`, ()=> acceptJob(job, doc))
      commsButton('Cancel', ()=> stationJobMenu(0))
    },
    pay: pay,
    status: 'available',
    info: message,
    destination: missionStation,
    jobStation: jobStation,
    image: `img/sci-fi-data (${Math.floor(rng()*10)+1}).png`
  }
  return job
}
function starportRefuel(cost){
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
  commsButton('Exit', exitStation)
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
      toggleAvatar(false)
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
  warpView();
  player.isInFlight = true;
  const lightspeed = 5370;
  const hackerspeed = 1;
  const velocity = (player.starDistance < station.starDistance) ? hackerspeed : -hackerspeed;
  if (fuel) fuelTankBar.classList.add('progress-bar-animated');
  powerNavigation(true);
  function animate() {
    player.starDistance += velocity;
    hudLocation.textContent = station.name;
    if (station.starDistance - player.starDistance === 0) {
      setBackgroundImage(station.image);
      player.isInFlight = false;
      player.station = station;
      stationMainMenu();
      toggleAvatar(false);
      fuelTankBar.classList.remove('progress-bar-animated');
      navigationMenu();
      player.location = player.station.name;
      documentsMenu();
    } else {
      updateNavigator();
      navigationMenu();
      if (fuel) setFuelLevel(fuelLevel - 1);
      requestAnimationFrame(animate);
    }
  } 
  let navigationInterval = requestAnimationFrame(animate);
}
function addCompleteJobBtn(job){
  if(job) {
    if(player.station == job.destination && player.location == job.destination.company) {
      commsButton(`Deliver Encrypted Data`,()=>{
        loadScreen(`Encrypted Data Delivery`, 
        `Delivering encrypted data to ${player.station.company}.`,
        ()=>completeJob(job))
      })
    }
  }
}
function startGame(station = null){
  hudTitle.textContent = starSystem.name
  setBackgroundImage(starSystem.image)
  spaceStations.forEach(station =>{
    station.jobs.push(generateJob(station))
  })
  setFuelLevel(fuelLevel)
  if(fuelLevel == 0) fuelLevelAlert()
  player.setCredits(player.credits)
  if(station) {
    player.station = station
    player.location = player.station.name
    player.starDistance = player.station.starDistance
    exitStation()
    setBackgroundImage(player.station.image)
  }
  navigationMenu()
  // Closes the dialogue box
  document.querySelector('#dialogue-close').addEventListener('click', () => {
    document.querySelector('#dialogue-box').close();
  })
  if(player.location) {
    hudLocation.textContent = player.location
  }
  if(!player.ship) {
    toggleGuages(false)
    toggleBGSway(false)
  }
}
function documentsMenu(){
  const activeJobs = document.querySelector('#active-jobs')
  while (activeJobs.firstChild) {
    activeJobs.removeChild(activeJobs.firstChild);
  }
  if(player.jobs.length || player.documents.length) {
    document.querySelector('#active-jobs-header').style.display = 'block'
    player.documents.forEach(doc => {
      const button = document.createElement('button')
      button.classList.add('btn')
      button.classList.add('btn-primary')
      button.textContent = doc.title
      button.addEventListener('click', ()=> viewDoc(doc))
      document.querySelector('#active-jobs').appendChild(button)
    })
  } else {
    document.querySelector('#active-jobs-header').style.display = 'none'
  }
}
function remove(array, element) {
  return array.filter(item => item !== element);
}
function showModal(title, message, confirm = null){
  const dialogueBox = document.querySelector('#dialogue-box')
  dialogueBox.showModal()
  document.querySelector('#dialogue-title').textContent = title
  document.querySelector('#dialogue-message').textContent = message
  const confirmBtn = document.querySelector('#dialogue-confirm')
  if(confirm) { 
    confirmBtn.classList.remove('d-none')
    confirmBtn.addEventListener('click', confirm)
  } else {
    confirmBtn.classList.add('d-none')
  }
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
function exitStation(){
  toggleAvatar(false)
  clearComms()
  setBackgroundImage(`img/bg-transition.gif`)
  toggleMonitorTransparency(true)
  setTimeout(()=>{
    setBackgroundImage(player.station.image)
    toggleBGSway(true)
    player.location = player.station.name
    stationMainMenu()
  },2000)
}
function pilotLicense(){
  showModal(`${starSystem.name} Pilot License`, `The ${starSystem.name} Pilot License is required for commercial level flight in ${starSystem.name}. The registration cost is 1000 credits. Enter your name and confirm.`, registerPilotLicense)
  document.querySelector('#dialogue-text-input').classList.remove('d-none')
  document.querySelector('#dialogue-text-input').value = player.name
}
function registerPilotLicense(){
  const name = document.querySelector('#dialogue-text-input').value
  player.name = name
  player.pilotLicense = {
    name: name,
    starSystem: starSystem.name,
    signature: player.station.jobNPC.name,
    issuer: player.station.company,
    code: `COM-${player.station.starDistance}`
  }
  hideModalInput()
  closeModal()
  updateCredits(-1000)
  addDoc(`${starSystem.name} Pilots License`, 
  `<b>${player.pilotLicense.starSystem} Commercial Pilot's License</b><br>License Holder's Name: ${name}<br>License Number: ${player.pilotLicense.code}<br>Issuer: ${player.pilotLicense.issuer}<br>Issuer Signature: ${player.pilotLicense.signature}`, 
  `img/official-doc (${Math.floor(rng()*4)+1}).png`)
  stationJobMenu(0, `Congrats, ${player.name}! I've registered your pilot license into the ${starSystem.name} archives and your application has already been approved. You should receive your pilots license in your documents soon.`)
}
function closeModal(){
  document.querySelector('#dialogue-box').close();
}
function hideModalInput(){
  document.querySelector('#dialogue-text-input').classList.add('d-none')
}
function showModalInput(){
  document.querySelector('#dialogue-text-input').classList.remove('d-none')
}
function addDoc(title, doc, image){
  player.documents.push({title: title, doc: doc, image: image})
  documentsMenu()
}
function viewDoc(doc){
  showComms()
  toggleMonitorTransparency(true)
  setAvatarImage(doc.image)
  setAvatarTitle(doc.title)
  setAvatarSubtitle(`Archived Document`)
  setMessage(doc.doc)
}
function setAvatarImage(path){
  document.querySelector('#npc-avatar').style.backgroundImage = `url('${path}')`
  document.querySelector('#npc-chat-avatar').src = path
}
function showComms(){
  document.querySelector('#npc').style.display = 'block'
  toggleMessage(true)
}
function rentShip(){
  setMessage(`You can rent a ship for 1 credit per million miles. You won't have to pay until you fill up with gas at a station. All pilots are required to have a commercial pilots license before they can rent a ship.`)
  clearComms()
  commsButton(`Agree`, addShip)
  commsButton(`Cancel`, stationShipMenu)
}
function setBackgroundImage(image){
  document.querySelector('#pilot-window').style.backgroundImage = `url('${image}')`
}
function toggleBGSway(bool = true) {
  if(bool)
    document.querySelector('#pilot-window').classList.add('sway-animation')
  else
    document.querySelector('#pilot-window').classList.remove('sway-animation')
}
function setAvatarTitle(title){
  document.querySelector('#npc-name').textContent = title
}
function setAvatarSubtitle(subtitle) {
  document.querySelector('#npc-dept').textContent = subtitle
}
function loadScreen(title, message, callback, timeout = 2000){
  toggleAvatar(true)
  clearComms()
  setAvatarImage(`img/loader.gif`)
  setBackgroundImage(`img/bg-transition.gif`)
  setAvatarTitle(`Connecting to`)
  setAvatarSubtitle(title)
  setMessage(message)
  setTimeout(()=>{
    callback()
  }, timeout)
}
function toggleMessage(on = true){
  const log = document.querySelector('#log')
  if(on) log.style.display = 'block'
  else log.style.display = 'none'
}
function toggleAvatar(on) {
  if(on) {
    document.querySelector('#npc').style.display = 'block'
    toggleMessage(true)
  } else {
    document.querySelector('#npc').style.display = 'none'
    toggleMessage(false)
  }
}
function addShip(){
  if(player.pilotLicense) {
    setMessage(`Let's see your pilots license. Everything looks in order here. `)
    player.ship = true
    toggleGuages(true)
  } else {
    setMessage(`You need to go to ${player.station.company} Main Office to get your pilot's license. You can buy one for 1000 credits.`)
  }
  clearComms()
  commsButton('Refuel Ship', starportFuelRequest)
  commsButton(`Rent Ship`, rentShip)
  commsButton('Exit', exitStation)
}
function toggleGuages(on){
  const fuel = document.querySelector('#fuel-guage')
  if(on) fuel.style.visibility = 'visible'
  else fuel .style.visibility = 'hidden'
}
function toggleMonitorTransparency(on = true) {
  let monitor = document.querySelector('#monitor')
  if(on)  monitor.classList.add('opacity-75')
  else    monitor.classList.remove('opacity-75')
}
function completeJob(job){
  player.jobs = remove(player.jobs, job)
  updateCredits(job.pay)
  documentsMenu()
  job.jobStation.jobs.forEach(job => {
    if (job === job) {
      job.jobStation.jobs = remove(job.jobStation.jobs, job)
      job.jobStation.jobs.push(generateJob(job.jobStation))
    }
  })
  setAvatarImage(job.destination.jobNPC.image)
  setAvatarTitle(job.destination.jobNPC.name)
  setAvatarSubtitle(job.destination.jobNPC.company)
  setMessage(`You brought the data! I can finally login now. Thanks for delivering it here all the way from ${job.jobStation.name}.`)
  setBackgroundImage(job.destination.jobNPC.bgImg)
  commsButton(`Exit`, stationJobMenu)
}

startGame(spaceStations[0])