function countPlayers() {
    let count = 0
    for (let environment of ENVIRONMENTS)
        count += environment.players.length
    return count
}

function getAllPlayers() {
    let players = Array()
    for (let environment of ENVIRONMENTS)
        players = players.concat(environment.players)
    return players
}

function countInfected(allPlayers) {
    let count = 0
    for (let player of allPlayers)
        if (player.infected)
            count++
    return count
}

function countIncidence(allPlayers) {
    let incidence = countInfected(allPlayers) / allPlayers.length * 100000
    return isNaN(incidence) ? 0 : Math.round(incidence)
}

function getRandomInGaussian(mean, stdDev) {
    let u = 0, v = 0
    while (u === 0) u = Math.random() //Converting [0,1) to (0,1)
    while (v === 0) v = Math.random()
    let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)
    num = num / 10.0 + 0.5 // Translate to 0 -> 1
    num = num * stdDev + mean // Scale to 0 -> N
    return num
}

function randomGaussian() {
    return getRandomInGaussian(0, 1)
}

function countVaccinated(allPlayers) {
    let count = 0
    for (let player of allPlayers)
        if (player.vaccinated)
            count++
    return count
}

function countImmune(allPlayers) {
    let count = 0
    for (let player of allPlayers)
        if (player.immune)
            count++
    return count
}

function roundNum(num, decimals) {
    let factor = Math.pow(10, decimals)
    return Math.round(num * factor) / factor
}

function calcTickDiff(tickDate) {
    return TICK_COUNT - tickDate
}

function calcRValue(allPlayers) {
    let r = 0
    let immunePlayers = allPlayers.filter(p => p.immune && calcTickDiff(p.immunizationDate) <= TICKS_PER_DAY * 14)
    for (let player of immunePlayers)
        r += player.infectedPlayersCount
    if (r == 0 || immunePlayers.length == 0)
        return "-"
    return roundNum(r / immunePlayers.length, 2)
}

function countEnvironmentType(type) {
    let count = 0; 
    for (let environment of ENVIRONMENTS)
        if (environment.type == type)
            count++
    return count
}

function updateStatus() {
    if (RUNNING) {
        START_BUTTON.style.display = "none"
        STOP_BUTTON.style.display = "inline"
    } else {
        STOP_BUTTON.style.display = "none"
        START_BUTTON.style.display = "inline"
    }
}

function start(force=false) {
    if (!force) {
        //run checks
        let skippedWarning = true
        if (ENVIRONMENTS.length == 0) {
            skippedWarning = confirm("Es existieren noch keine Umgebungen.\nTrotzdem fortfahren?")
        } else if (countEnvironmentType(ENVIRONMENT_TYPE.HOUSE) == 0) {
            skippedWarning = confirm("Coville hat noch keine Einwohner.\nTrotzdem fortfahren?")
        } else if (countInfected(getAllPlayers()) == 0) {
            skippedWarning = confirm("Es sind aktuell keine Spieler infiziert.\nTrotzdem fortfahren?")
        }
        if (!skippedWarning) {
            RUNNING = false
            return
        }
    }

    RUNNING_FUNC = setInterval(simulate8Ticks, 0)
    RUNNING_START_TIME = Date.now()
    RUNNING_TICKS_COUNT = 0
    LOGO_IMG.classList.add("rotating")
}

function stop() {
    TPS = 0
    if (RUNNING_FUNC)
        clearInterval(RUNNING_FUNC)
    RUNNING_FUNC = null
    LOGO_IMG.classList.remove("rotating")
}

function changeStatus(event) {
    RUNNING = !RUNNING
    if (RUNNING) {
        start(event.shiftKey)
    } else {
        stop()
    }
    updateStatus()
    updateTable()
}

START_BUTTON.addEventListener("click", changeStatus)
STOP_BUTTON.addEventListener("click", changeStatus)

function updateCanvasSize(canvasSizeFactor=0.9) {
    let container = document.querySelector(".sim-content-container")
    if (container.clientWidth > container.clientHeight) {
        MAIN_CANVAS.width  = container.clientHeight * canvasSizeFactor
        MAIN_CANVAS.height = container.clientHeight * canvasSizeFactor
    } else {
        MAIN_CANVAS.width  = container.clientWidth * canvasSizeFactor
        MAIN_CANVAS.height = container.clientWidth * canvasSizeFactor
    }
    PLEASE_CHOOSE_ENVIRONMENT.style.width = MAIN_CANVAS.width + "px"
}
updateCanvasSize()

function updateTable() {
    TIME_COUNT.textContent = String(CLOCK)
    TPS_COUNT.textContent = parseInt(TPS)
    let allPlayers = getAllPlayers()
    INHABITANT_COUNT.textContent = allPlayers.length
    let immune = countImmune(allPlayers)
    let infected = countInfected(allPlayers)
    INFECTED_COUNT.textContent = infected
    INCIDENCE_COUNT.textContent = roundNum(countIncidence(allPlayers), 2)
    VACCINATED_COUNT.textContent = countVaccinated(allPlayers)
    IMMUNE_COUNT.textContent = immune
    R_VALUE_COUNT.textContent = calcRValue(allPlayers)
    DEATH_COUNT.textContent = DEAD_COUNT
    let infestation = parseInt((infected + immune) / allPlayers.length * 100)
    INFESTATION_COUNT.textContent = (isNaN(infestation)) ? "0%" : (infestation + "%")
    ENVIRONMENT_COUNT.textContent = ENVIRONMENTS.length
    HOUSE_COUNT.textContent = countEnvironmentType(ENVIRONMENT_TYPE.HOUSE)
    WORKPLACE_COUNT.textContent = countEnvironmentType(ENVIRONMENT_TYPE.WORKPLACE)
    SCHOOL_COUNT.textContent = countEnvironmentType(ENVIRONMENT_TYPE.SCHOOL)
    VACCINATION_PERCENTAGE_COUNT.textContent = VACCINATION_PERCENTAGE + "%"
}

function generateAge() {
    let distribution = [
        3975,4072,4115,4135,4017,3961,3822,3815,3728,3819,
        3766,3860,3843,3771,3809,3893,3904,3989,4146,4454,
        4627,4746,4976,4941,4873,4943,5089,5162,5338,5825,
        5728,5862,5721,5586,5403,5354,5336,5430,5349,5360,
        5093,5022,4975,4867,4749,4787,4814,5219,5733,5934,
        6377,6664,6816,6983,6996,7091,6996,6727,6572,6315,
        6102,5724,5542,5331,5093,4906,4681,4622,4482,4433,
        4242,3832,3530,3010,2566,3378,3361,3170,3700,3720,
        3493,3071,2674,2381,2083,1730,1221,1047,909,794,
        626,499,354,254,175,109,72,50,33,22
    ]
    let total = 410295

    if (Math.random() >= 0.5) {
        distribution = [
            3773,3869,3908,3942,3803,3753,3616,3604,3529,3617,
            3557,3656,3623,3545,3595,3674,3674,3730,3838,4086,
            4161,4312,4500,4504,4441,4527,4692,4792,4964,5409,
            5363,5473,5368,5300,5148,5126,5151,5260,5245,5276,
            5024,4951,4900,4821,4682,4757,4794,5168,5662,5862,
            6262,6545,6711,6872,6873,6996,6932,6716,6625,6397,
            6198,5846,5705,5547,5385,5304,5130,5103,4978,4947,
            4738,4282,4014,3471,3051,4026,4042,3872,4663,4827,
            4649,4189,3762,3472,3165,2740,2037,1853,1704,1598,
            1343,1128,892,727,573,416,301,217,157,102
        ]
        total = 421108
    }

    let randomCount = Math.floor(Math.random() * total)
    let i = 0
    for (i = 0; i < 100; i++) {
        randomCount -= distribution[i]
        if (randomCount <= 0)
            break
    }
    return i + 1
}

function generatePeoplePerHouse() {
    let distribution = [0.406, 0.34, 0.121, 0.098, 0.035]
    let randomCount = Math.random()
    let i = 0
    for (i = 0; i < distribution.length; i++) {
        randomCount -= distribution[i]
        if (randomCount <= 0)
            break
    }
    return i + 1
}

function clearCanvas() {
    MAIN_CANVAS_CONTEXT.clearRect(0, 0, MAIN_CANVAS.width, MAIN_CANVAS.height)
}

function typeIndex(env) {
    switch(env.type) {
        case ENVIRONMENT_TYPE.CITY: return 0
        case ENVIRONMENT_TYPE.HOUSE: return 1
        case ENVIRONMENT_TYPE.WORKPLACE: return 2
        case ENVIRONMENT_TYPE.SCHOOL: return 3
        default: return 4
    }
}

function getCityWalkProbability() {
    return (TICKS_PER_DAY) * 7
	switch(CLOCK.hours) {
		case 0: return 10000 * 8
		case 1: return 15000 * 8
		case 2: return 20000 * 8
		case 3: return 30000 * 8
		case 4: return 15000 * 8
		case 5: return 10000 * 8
		case 6: return 5000 * 8
		case 7: return 1500 * 8
		case 8: return 1200 * 8
		case 9: return 1000 * 8
		case 10: return 1000 * 8
		case 11: return 1000 * 8
		case 12: return 1000 * 8
		case 13: return 600 * 8
		case 14: return 400 * 8
		case 15: return 300 * 8
		case 16: return 300 * 8
		case 17: return 700 * 8
		case 18: return 1000 * 8
		case 19: return 3000 * 8
		case 20: return 5000 * 8
		case 21: return 7000 * 8
		case 22: return 8000 * 8
		case 23: return 9000 * 8
	}
}

function isVisitTime() {
    return CLOCK.hours >= 18 && CLOCK.hours <= 23
}

function isJobTime(job) {
    let hours = CLOCK.hours
    switch (job) {
        case ENVIRONMENT_TYPE.SCHOOL: return (hours >= 8 && 14 > hours);
        case ENVIRONMENT_TYPE.WORKPLACE: return (hours > 9 && 17 > hours);
        case ENVIRONMENT_TYPE.CITY: return randomInt(0, getCityWalkProbability(hours)) == 0;
    }
}

function getJob(age) {
    if (age > 6 && age <= 18) {
        return ENVIRONMENT_TYPE.SCHOOL
    } else if (age > 6 && age <= 68) {
        return ENVIRONMENT_TYPE.WORKPLACE
    }
    return ENVIRONMENT_TYPE.CITY
}

function randomEnvironment(type) {
    let randomEnvs = ENVIRONMENTS.filter(env => env.type == type)
    return randomEnvs[randomInt(0, randomEnvs.length - 1)]
}

SEARCH_ENVIRONMENT_INPUT.addEventListener("input", function() {
    let searchValue = SEARCH_ENVIRONMENT_INPUT.value.toLowerCase().replace(/\s/g, "")
    if (searchValue.length == 0) {
        SIDEBAR_SEARCH_MODE = false
        NO_ENVIRONMENTS_FOUND_INFO.style.display = "none"
    } else {
        SIDEBAR_SEARCH_MODE = true
        SEARCH_ENVIRONMENTS_CACHE = ENVIRONMENTS.filter(env => env.name.toLowerCase().replace(/\s/g, "").includes(searchValue))
        if (SEARCH_ENVIRONMENTS_CACHE.length == 0) {
            NO_ENVIRONMENTS_FOUND_INFO.style.display = "block"
        } else {
            NO_ENVIRONMENTS_FOUND_INFO.style.display = "none"
        }
    }
    updateEnvironmentChoice()
})

function updateEnvironmentChoice() {
    for (let ele of document.querySelectorAll(".sidebar.right .envchoice"))
        ele.remove()

    ENVIRONMENTS.sort((a, b) => {
        return typeIndex(a) - typeIndex(b)
    })

    ENVIRONMENTS.forEach(env => env.visibleAtSidebar = false)   
    if (SIDEBAR_SEARCH_MODE == false) {
        let firstHouse = ENVIRONMENTS.find(env => env.type == ENVIRONMENT_TYPE.HOUSE)
        let firstSchool = ENVIRONMENTS.find(env => env.type == ENVIRONMENT_TYPE.SCHOOL)
        let firstWorkplace = ENVIRONMENTS.find(env => env.type == ENVIRONMENT_TYPE.WORKPLACE)
        let firstCity = ENVIRONMENTS.find(env => env.type == ENVIRONMENT_TYPE.CITY)
        if (firstCity) firstCity.visibleAtSidebar = true
        if (firstWorkplace) firstWorkplace.visibleAtSidebar = true
        if (firstSchool) firstSchool.visibleAtSidebar = true
        if (firstHouse) firstHouse.visibleAtSidebar = true
    }
    
    let shownEnvironments
    TOO_MANY_ENVIRONMENTS_FOUND_INFO.style.display = "none"
    if (SIDEBAR_SEARCH_MODE) {
        shownEnvironments = SEARCH_ENVIRONMENTS_CACHE
        if (shownEnvironments.length > 10) {
            shownEnvironments = shownEnvironments.slice(0, 10)
            TOO_MANY_ENVIRONMENTS_FOUND_INFO.style.display = "block"
        }
    } else {
        shownEnvironments = ENVIRONMENTS.filter(env => env.visibleAtSidebar)
    }
    for (let environment of shownEnvironments) {
        let button = document.createElement("button")
        let deleteButton = document.createElement("button")
        deleteButton.textContent = "-"
        deleteButton.classList.add("delete")
        button.classList.add("envchoice")
        let buttonText = environment.name
        if (SIDEBAR_SEARCH_MODE == false) {
            let envTypeCount = countEnvironmentType(environment.type)
            if (envTypeCount > 1)
                buttonText += ` (von ${envTypeCount})`
        }
        button.textContent = buttonText
        button.appendChild(deleteButton)
        RIGHT_SIDEBAR.appendChild(button)
        if (SELECTED_ENVIRONMENT != null && environment.name == SELECTED_ENVIRONMENT.name)
            button.classList.add("selected")

        button.addEventListener("click", () => {
            if (ENVIRONMENTS.includes(environment)) {
                SELECTED_ENVIRONMENT = environment
                environment.draw()
                updateEnvironmentChoice()
            }
        })

        deleteButton.addEventListener("click", () => {
            ENVIRONMENTS.splice(ENVIRONMENTS.indexOf(environment), 1)
            updateTable()
            SELECTED_ENVIRONMENT = null
            clearCanvas()
            updateEnvironmentChoice()
        })
    }

    let warningStatus = (SELECTED_ENVIRONMENT == null) ? "block" : "none"
    PLEASE_CHOOSE_ENVIRONMENT.style.display = warningStatus
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function randomInt(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function generatePlayerId() {
    let playerId = ""
    let chars = "0123456789ABCDEF"
    for (let i = 0; i < 6; i++)
        playerId += chars[randomInt(0, chars.length - 1)]
    if (USED_PLAYER_IDS.includes(playerId))
        return generatePlayerId()
    USED_PLAYER_IDS.push(playerId)
    return "0x" + playerId
}

RESET_DEATHS_BUTTON.addEventListener("click", event => {
    DEAD_COUNT = 0
    updateTable()
})

RESET_TIME_BUTTON.addEventListener("click", event => {
    CLOCK.reset()
    infectionsPerDay = Array()
    infectedPerDay = Array()
    immunePerDay = Array()
    alivePerDay = Array()
    rValuePerDay = Array()
    if (RUNNING_GRAPH) RUNNING_GRAPH()
    updateTable()
})

function playerFromId(id) {
    for (let player of getAllPlayers()) {
        if (player.id == id)
            return player
    }
    return null
}

function viewPlayerInfo(player, x, y) {
    VIEWPLAYER_CONTAINER.style.display = "block"
    VIEWPLAYER_CONTAINER.style.left = x + "px"
    VIEWPLAYER_CONTAINER.style.top = y + "px"
    VIEWPLAYER_ID.textContent = player.id
    VIEWPLAYER_IMMUNE.textContent = player.immune ? "Ja" : "Nein"
    VIEWPLAYER_VACCINATED.textContent = player.vaccinated ? "Ja" : "Nein"
    VIEWPLAYER_INFECTED.textContent = player.infected ? "Ja" : "Nein"
    VIEWPLAYER_ENVIRONMENT.textContent = player.currEnvName
    VIEWPLAYER_AGE.textContent = player.age
    VIEWPLAYER_WORKPLACE.textContent = (player.workplace) ? player.workplace.name : "-"
    VIEWPLAYER_HOME.textContent = (player.home) ? player.home.name : "-"
    VIEWPLAYER_QUARANTINE.textContent = (player.quarantineTicks > 0) ? (player.quarantineTicks + " ticks") : "Nein"
    VIEWPLAYER_STAYTICKS.textContent = player.stayTicks + " ticks"
    VIEWPLAYER_FRIENDS_TABLE.innerHTML = ""
    for (let friend of player.friends) {
        let element = document.createElement("div")
        element.classList.add("rowvalue")
        element.textContent = `${friend.id} (${friend.currEnvName})`
        VIEWPLAYER_FRIENDS_TABLE.appendChild(element)
        element.onclick = event => {
            viewPlayerInfo(playerFromId(friend.id), x, y)
        }
    }
    VIEWPLAYER_OVERLAY.style.display = "block"
    VIEWPLAYER_OVERLAY.onclick = () => {
        VIEWPLAYER_OVERLAY.style.display = "none"
        VIEWPLAYER_CONTAINER.style.display = "none"
    }
}

function getRandomPlayer(playerList) {
    return playerList[randomInt(0, playerList.length - 1)]
}

function distributeFriends() {
    let allPlayers = getAllPlayers()
    for (let player of allPlayers) {
        player.friends = []
        let currIt = 0
        for (let i = 0; i < FRIENDS_PER_PLAYER; i++) {
            currIt++
            if (currIt > 30) break
            let friend = getRandomPlayer(allPlayers)
            if (friend != player && !player.friends.includes(friend))
                player.friends.push(friend)
            else
                i--
        }
    }
}

function distributeWorkplaces() {
    for (let player of getAllPlayers()) {
        player.workplace = randomEnvironment(player.job)
    }
}

VIEW_NO_ENVIRONMENT_BUTTON.addEventListener("click", event => {
    SELECTED_ENVIRONMENT = null
    RUNNING_GRAPH = null
    clearCanvas()
    updateEnvironmentChoice()
})

function vaccinatePercentage(percentage) {
    for (let player of getAllPlayers()) {
        if (Math.random() < percentage / 100)
            player.vaccinate()
        else
            player.unvaccinate()
    }
}

function increaseVaccinations() {
    VACCINATION_PERCENTAGE += 5
    if (VACCINATION_PERCENTAGE > 100)
        VACCINATION_PERCENTAGE = 100
    vaccinatePercentage(VACCINATION_PERCENTAGE)
    updateTable()
}
INCREASE_VACCINATIONS_BUTTON.addEventListener("click", increaseVaccinations)

function decreaseVaccinations() {
    VACCINATION_PERCENTAGE -= 5
    if (VACCINATION_PERCENTAGE < 0)
        VACCINATION_PERCENTAGE = 0
    vaccinatePercentage(VACCINATION_PERCENTAGE)
    updateTable()
}
DECREASE_VACCINATIONS_BUTTON.addEventListener("click", decreaseVaccinations)

function visitPage(url) {
    window.open(url, "_blank")
}

function uploadStatus(skipChecks=false) {
    // run checks
    if (!skipChecks) {
        if (alivePerDay.length < 5) {
            alert("Es m??ssen mindestens 5 Tage gespielt werden!")
            return
        }
        if (countImmune(getAllPlayers()) == 0 && countInfected(getAllPlayers()) == 0) {
            alert("Es hat noch kein Infektionsgeschehen stattgefunden!")
            return
        }
    }

    let params = {
        title: prompt("Unter welchem Titel willst du diesen Verlauf ver??ffentlichen?", ""),
        data_version: 2,
        data: JSON.stringify(getCurrentJSONState())
    }

    if (params.title == null) return

    if (params.title.length < 1 || params.title.length > 50) {
        alert("Der Titel muss zwischen 1 und 50 Zeichen lang sein!")
        return
    }

    let uploadApi = "https://www.noel-friedrich.de/coville/api/upload.php"

    let paramString = ""

    for (let param in params) {
        paramString += param + "=" + encodeURIComponent(params[param]) + "&"
    }

    paramString = paramString.substring(0, paramString.length - 1)

    fetch(uploadApi, {
        method: "POST",
        body: new URLSearchParams(paramString)
    }).catch(error => {
        alert("Es ist ein Fehler aufgetreten:\n" + error)
    }).then(response => {
        if (response.ok) {
            alert("Dein Status wurde erfolgreich hochgeladen!")
        } else {
            alert("Es ist ein Fehler aufgetreten:\n" + response.statusText)
        }
    })
}

UPLOAD_STATUS_BUTTON.addEventListener("click", () => uploadStatus())
