let city = new Environment(ENVIRONMENT_TYPE.CITY, 300, 300, ENVIRONMENT_TYPE.CITY)
city.visibleAtSidebar = true
updateEnvironmentChoice()

MAIN_CANVAS.addEventListener("click", event => {
    if (!SELECTED_ENVIRONMENT) return
    let rect = MAIN_CANVAS.getBoundingClientRect()
    let mouseX = event.clientX - rect.left
    let mouseY = event.clientY - rect.top
    let xStep = MAIN_CANVAS.width / SELECTED_ENVIRONMENT.width
    let yStep = MAIN_CANVAS.height / SELECTED_ENVIRONMENT.height
    let x = Math.floor(mouseX / xStep)
    let y = Math.floor(mouseY / yStep)
    for (let player of SELECTED_ENVIRONMENT.players) {
        if (player.x == x && player.y == y) {
            let yPos = event.clientY
            VIEWPLAYER_CONTAINER.style.display = "block"
            if (yPos + VIEWPLAYER_CONTAINER.clientHeight + 20 > document.body.clientHeight) {
                yPos = document.body.clientHeight - VIEWPLAYER_CONTAINER.clientHeight - 20
            }
            viewPlayerInfo(player, event.clientX, yPos)
        }
    }
})

function getLargestEnvironmentNum(type) {
    let offset = type.length
    let largest = 0
    for (let environment of ENVIRONMENTS)
        if (environment.type == type)
            largest = Math.max(largest, parseInt(environment.name.substring(offset)))
    return largest
}

function addHouseFast() {
    let largestHouseNum = getLargestEnvironmentNum(ENVIRONMENT_TYPE.HOUSE)
    let envName = `${ENVIRONMENT_TYPE.HOUSE} ${largestHouseNum + 1}`
    let env = new Environment(envName, 8, 8, ENVIRONMENT_TYPE.HOUSE, false)
    let amountPlayers = generatePeoplePerHouse()
    for (let i = 0; i < amountPlayers; i++) {
        let player = new Player(env, false)
        env.players.push(player)
    }
}

function addWorkplaceFast() {
    let largestWorkplaceNum = getLargestEnvironmentNum(ENVIRONMENT_TYPE.WORKPLACE)
    let envName = `${ENVIRONMENT_TYPE.WORKPLACE} ${largestWorkplaceNum + 1}`
    new Environment(envName, 100, 100, ENVIRONMENT_TYPE.WORKPLACE)
}

function addSchoolFast() {
    let largestSchoolNum = getLargestEnvironmentNum(ENVIRONMENT_TYPE.SCHOOL)
    let envName = `${ENVIRONMENT_TYPE.SCHOOL} ${largestSchoolNum + 1}`
    new Environment(envName, 100, 100, ENVIRONMENT_TYPE.SCHOOL)
}

function configAfterFastAdd() {
    distributeFriends()
    distributeWorkplaces()
    vaccinatePercentage(VACCINATION_PERCENTAGE)
    updateEnvironmentChoice()
    updateTable()
    if (RUNNING_GRAPH)
        PLEASE_CHOOSE_ENVIRONMENT.style.display = "none"
}

ADD_HOUSE_BUTTON.addEventListener("click", event => {
    addHouseFast()
    configAfterFastAdd()
})

ADD_10_HOUSES_BUTTON.addEventListener("click", event => {
    for (let i = 0; i < 10; i++) {
        addHouseFast()
    }
    configAfterFastAdd()
})

ADD_100_HOUSES_BUTTON.addEventListener("click", event => {
    for (let i = 0; i < 100; i++) {
        addHouseFast()
    }
    configAfterFastAdd()
})

ADD_WORKPLACE_BUTTON.addEventListener("click", event => {
    let largestWorkplaceNum = getLargestEnvironmentNum(ENVIRONMENT_TYPE.WORKPLACE)
    let envName = `${ENVIRONMENT_TYPE.WORKPLACE} ${largestWorkplaceNum + 1}`
    let env = new Environment(envName, 100, 100, ENVIRONMENT_TYPE.WORKPLACE)
    distributeWorkplaces()
    updateEnvironmentChoice()
    updateTable()
})

ADD_SCHOOL_BUTTON.addEventListener("click", event => {
    let largestSchoolNum = getLargestEnvironmentNum(ENVIRONMENT_TYPE.SCHOOL)
    let envName = `${ENVIRONMENT_TYPE.SCHOOL} ${largestSchoolNum + 1}`
    let env = new Environment(envName, 100, 100, ENVIRONMENT_TYPE.SCHOOL)
    distributeWorkplaces()
    updateEnvironmentChoice()
    updateTable()
})

function infectRandom() {
    let allPlayers = getAllPlayers()
    let randomPlayer = allPlayers[randomInt(0, allPlayers.length - 1)]
    for (let i = 0; i < 100; i++) {
        if (!randomPlayer.infected) break
        randomPlayer = allPlayers[randomInt(0, allPlayers.length - 1)]
    }
    randomPlayer.infect()
}

INFECT_RANDOM_BUTTON.addEventListener("click", event => {
    infectRandom()
    updateTable()
    if (SELECTED_ENVIRONMENT)
        SELECTED_ENVIRONMENT.draw()
    if (RUNNING_GRAPH)
        RUNNING_GRAPH()
})

INFECT_5_RANDOM_BUTTON.addEventListener("click", event => {
    for (let i = 0; i < 5; i++) {
        infectRandom()
    }
    updateTable()
    if (SELECTED_ENVIRONMENT)
        SELECTED_ENVIRONMENT.draw()
    if (RUNNING_GRAPH)
        RUNNING_GRAPH()
})

REMOVE_VIRUS_BUTTON.addEventListener("click", event => {
    let allPlayers = getAllPlayers()
    for (let player of allPlayers) {
        player.removeVirus()
    }
    updateTable()
    if (SELECTED_ENVIRONMENT)
        SELECTED_ENVIRONMENT.draw()
    if (RUNNING_GRAPH)
        RUNNING_GRAPH()
})

function loadConfig(config) {
    LOADING_OVERLAY.style.display = "block"
    setTimeout(() => {
        for (let i = 0; i < config.houses; i++) addHouseFast()
        for (let i = 0; i < config.workplaces; i++) addWorkplaceFast()
        for (let i = 0; i < config.schools; i++) addSchoolFast()
        for (let i = 0; i < config.infect; i++) infectRandom()
        configAfterFastAdd()
        LOADING_OVERLAY.style.display = "none"
    }, 100)
}

LOAD_PRESET_1_BUTTON.addEventListener("click", event => {
    loadConfig({
        houses: 500,
        workplaces: 20,
        schools: 2,
        infect: 10
    })
})

LOAD_PRESET_2_BUTTON.addEventListener("click", event => {
    loadConfig({
        houses: 5000,
        workplaces: 200,
        schools: 20,
        infect: 15
    })
})

updateTable()
