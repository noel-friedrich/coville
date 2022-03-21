class Player {
    
    constructor(environment, distributeNew=true) {
        this.gaussianError = (randomGaussian() + 0.5)
        this.infected = false
        this.infectedTicks = 0
        this.incubationTicks = 0
        this.immune = false
        this.age = generateAge()
        this.id = generatePlayerId()
        this.vaccinated = false
        this.x = randomInt(0, environment.width - 1)
        this.y = randomInt(0, environment.height - 1)
        this.generateNewTarget(environment)
        this.friends = Array()
        this.currentEnvironment = environment
        this.job = getJob(this.age)
        this.home = environment
        this.workplace = null
        this.stayTicks = 0
        this.quarantineTicks = 0
        this.maxImmuneTicks = Math.round(IMMUNETICKS * this.gaussianError)
        this.maxIncubationTicks = Math.round(INCUBATIONTICKS * this.gaussianError)
        this.lethalityRate = calcLethalityRate(this.age)
        this.infectionChance = INFECTION_CHANCE * this.gaussianError
        this.infectedPlayersCount = 0
        this.reinfectionTime = Math.round(REINFECTION_TIME * this.gaussianError)
        this.infectionDate = null
        this.immunizationDate = null
        if (distributeNew) {
            distributeFriends()
            distributeWorkplaces()
            vaccinatePercentage(VACCINATION_PERCENTAGE)
        }
        this.stayHomeToday = false
    }

    get currEnvName() {
        return this.currentEnvironment.name
    }

    generateNewTarget(environment) {
        this.targetX = randomInt(0, environment.width - 1)
        this.targetY = randomInt(0, environment.height - 1)
    }

    move(env) {
        this.x += (this.targetX > this.x) ? 1 : (this.targetX < this.x) ? -1 : 0
        this.y += (this.targetY > this.y) ? 1 : (this.targetY < this.y) ? -1 : 0
        if (this.x == this.targetX && this.y == this.targetY)
            this.generateNewTarget(env)
        if (this.infected)
            this.infectedTicks++
        if (this.infectedTicks > this.maxImmuneTicks)
            this.immunize()
        if (this.infected && this.incubationTicks > 0)
            this.incubationTicks--
        if (this.stayTicks > 0)
            this.stayTicks--
        if (this.quarantineTicks > 0)
            this.quarantineTicks--
        if (this.immunizationDate != null && this.immunizationDate + this.reinfectionTime < TICK_COUNT) {
            this.unimmunize()
        }
    }

    draw(xStep, yStep) {
        let color = "blue"
        if (this.infected) color = "red"
        if (this.immune) color = "green"
        MAIN_CANVAS_CONTEXT.fillStyle = color
        MAIN_CANVAS_CONTEXT.fillRect(this.x * xStep, this.y * yStep, xStep, yStep)
    }

    vaccinate() {
        if (this.vaccinated) return
        this.vaccinated = true
        this.maxIncubationTicks *= VACCINATION_INFECTION_LENGTH_FACTOR
        this.maxImmuneTicks *= VACCINATION_INFECTION_LENGTH_FACTOR
        this.infectionChance *= VACCINATION_INFECTION_CHANCE_FACTOR
        this.lethalityRate *= VACCINATION_LETHALITY_FACTOR
    }

    unvaccinate() {
        if (!this.vaccinated) return
        this.vaccinated = false
        this.maxIncubationTicks *= 1 / VACCINATION_INFECTION_LENGTH_FACTOR
        this.maxImmuneTicks *= 1 / VACCINATION_INFECTION_LENGTH_FACTOR
        this.infectionChance *= 1 / VACCINATION_INFECTION_CHANCE_FACTOR
        this.lethalityRate *= 1 / VACCINATION_LETHALITY_FACTOR
    }

    immunize() {
        this.immune = true
        this.infected = false
        this.infectedTicks = 0
        if (Math.random() <= this.lethalityRate) {
            this.die()
            DEAD_COUNT++
            this.home.players.splice(this.home.players.indexOf(this), 1)
        }
        this.immunizationDate = TICK_COUNT
    }

    unimmunize() {
        this.immune = false
        this.infected = false
        this.infectedTicks = 0
        this.immunizationDate = null
        this.infectedPlayersCount = 0
    }

    infect() {
        this.infected = true
        this.infectedTicks = 0
        this.incubationTicks = this.maxIncubationTicks
        infectionsPerDay[CLOCK.days] += 1
        this.infectionDate = TICK_COUNT
    }

    removeVirus() {
        this.infected = false
        this.infectedTicks = 0
        this.incubationTicks = 0
        this.immune = false
        this.quarantineTicks = 0
    }

    die() {
        for (let player of getAllPlayers()) {
            if (player.friends.includes(this.id)) {
                player.friends.splice(player.friends.indexOf(this.id), 1)
            }
        }
    }

    onTransfer() {
        this.stayTicks = 0
        if (this.job == ENVIRONMENT_TYPE.CITY) {
            this.stayTicks = TICKS_PER_HOUR * randomInt(1, 3)
        }
    }

    test() {
        if (this.isContagious) {
            if (Math.random() <= TEST_FALSE_NEGATIVE_CHANCE) {
                return false
            } else {
                return true
            }
        } else {
            if (Math.random() <= TEST_FALSE_POSITIVE_CHANCE) {
                return true
            } else {
                return false
            }
        }
    }

    onNewDay() {
        if (this.job == ENVIRONMENT_TYPE.WORKPLACE) {
            this.stayHomeToday = Math.random() <= STAYHOME_PROBABILITY
        }
    }

    sendIntoQuarantine() {
        this.quarantineTicks = QUARANTINE_TICKS
        if (this.currentEnvironment != this.home) {
            transferPlayer(this, this.currentEnvironment, this.home)
        }
    }

    get isContagious() {
        return this.infected && Math.round(this.incubationTicks) == 0
    }

    get isInQuarantine() {
        return this.quarantineTicks > 0
    }

    get isStaying() {
        return this.stayTicks > 0
    }

}

class Environment {

    constructor(name, width, height, type, updateNew=true) {
        this.name = name
        this.width = width
        this.height = height
        this.players = Array()
        this.type = type
        ENVIRONMENTS.push(this)
        if (updateNew)
            updateEnvironmentChoice()
        this.id = ENVIRONMENTS.length
        this.visibleAtSidebar = false
    }

    simulateTick(jobTimes) {
        let visitTime = isVisitTime()
        for (let player of this.players) {
            player.move(this)
            if (player.isContagious)
            for (let otherPlayer of this.players) {
                if (otherPlayer.infected || otherPlayer.immune) continue
                let distance = Math.abs(player.x - otherPlayer.x) + Math.abs(player.y - otherPlayer.y)
                if (distance < INFECTION_RADIUS && Math.random() < otherPlayer.infectionChance) {
                    player.infectedPlayersCount++
                    otherPlayer.infect()
                }
            }

            let jobActive = jobTimes[player.job]
            if (jobActive == undefined)
                jobActive = isJobTime(player.job)
            if (this.type != player.job && jobActive && !player.isInQuarantine && !player.stayHomeToday) {
                if (!(player.job == ENVIRONMENT_TYPE.SCHOOL && MEASURE_CLOSE_SCHOOLS))
                    if (!(player.job == ENVIRONMENT_TYPE.CITY && MEASURE_CLOSE_CITY))
                        transferPlayer(player, this, player.workplace)
            } else if (this == player.workplace && !jobActive && !player.isStaying) {
                transferPlayer(player, this, player.home)
            }

            if (CLOCK.hours == 7 && CLOCK.minutes == 0 && Math.random() <= TEST_CHANCE) {
                let result = player.test()
                TOTAL_TESTS++
                if (result == true) {
                    TOTAL_POSITIVE_TESTS++
                    sendHouseIntoQuarantine(player.home)
                } else {
                    TOTAL_NEGATIVE_TESTS++
                }
            }

            if (visitTime && Math.random() <= VISIT_CHANCE && !player.isInQuarantine) {
                let targetIndex = randomInt(0, player.friends.length - 1)
                let friend = player.friends[targetIndex]
                if (friend && !friend.isInQuarantine) {
                    transferPlayer(player, this, friend.home)
                    player.stayTicks = parseInt(TICKS_PER_HOUR * (Math.random() + 1) * 3)
                    TOTAL_VISITS++
                }
            }
        }
    }

    draw() {
        RUNNING_GRAPH = null
        let xStep = MAIN_CANVAS.width / this.width
        let yStep = MAIN_CANVAS.height / this.height
        MAIN_CANVAS_CONTEXT.clearRect(0, 0, MAIN_CANVAS.width, MAIN_CANVAS.height)
        MAIN_CANVAS_CONTEXT.fillStyle = "white"
        MAIN_CANVAS_CONTEXT.fillRect(0, 0, MAIN_CANVAS.width, MAIN_CANVAS.height)
        MAIN_CANVAS_CONTEXT.fillStyle = "black"
        MAIN_CANVAS_CONTEXT.font = "20px Courier New"
        let addition  = (this.players.length == 0) ? ` (hier ist gerade niemand)` : ` [${this.players.length}]`
        MAIN_CANVAS_CONTEXT.fillText(this.name + addition, 5, 20, MAIN_CANVAS.width)
        for (let player of this.players)
            player.draw(xStep, yStep)
    }
 
}

function sendHouseIntoQuarantine(houseEnv) {
    for (let player of houseEnv.players) {
        player.sendIntoQuarantine()
    }
    houseEnv.quarantineTicks = QUARANTINE_TICKS
}

function getJobTimes() {
    return {
        [ENVIRONMENT_TYPE.WORKPLACE]: isJobTime(ENVIRONMENT_TYPE.WORKPLACE),
        [ENVIRONMENT_TYPE.SCHOOL]: isJobTime(ENVIRONMENT_TYPE.SCHOOL),
    }
}

function transferPlayer(player, currentEnv, targetEnv) {
    if (!targetEnv || targetEnv == currentEnv) return
    currentEnv.players.splice(currentEnv.players.indexOf(player), 1)
    targetEnv.players.push(player)
    player.currentEnvironment = targetEnv
    player.generateNewTarget(targetEnv)
    player.x = player.targetX
    player.y = player.targetY
    player.onTransfer()
}

function calcTPS() {
    let timeInterval = Date.now() - RUNNING_START_TIME
    TPS = RUNNING_TICKS_COUNT / (timeInterval / 1000)
}

function simulateTick() {
    let jobTimes = getJobTimes()
    for (let env of ENVIRONMENTS)
        env.simulateTick(jobTimes)

    RUNNING_TICKS_COUNT += 1
    if (SELECTED_ENVIRONMENT)
        SELECTED_ENVIRONMENT.draw()
    CLOCK.advanceMinutes(4)
    if (CLOCK.days + 1 != infectionsPerDay.length) {
        infectionsPerDay.push(0)
    }
    if (CLOCK.hours == 0 && CLOCK.minutes == 0) {
        calcTPS()
        updateTable()
        let allPlayers = getAllPlayers()
        alivePerDay.push(allPlayers.length)
        infectedPerDay.push(countInfected(allPlayers))
        let rValue = calcRValue(allPlayers)
        rValuePerDay.push(rValue == "-" ? 0 : rValue)
        immunePerDay.push(countImmune(allPlayers))
        allPlayers.forEach(p => p.onNewDay())

        for (let measure of measureMenu.measures) {
            measure.update()
        }
    }
    if (RUNNING_GRAPH)
        RUNNING_GRAPH()

    TICK_COUNT++
}

function simulateXTicks(ticks) {
    for (let i = 0; i < ticks; i++)
        simulateTick()
}

let simulate10Ticks = () => simulateXTicks(10)
let simulate9Ticks = () => simulateXTicks(9)
let simulate8Ticks = () => simulateXTicks(8)
let simulate7Ticks = () => simulateXTicks(7)
let simulate6Ticks = () => simulateXTicks(6)
let simulate5Ticks = () => simulateXTicks(5)
let simulate4Ticks = () => simulateXTicks(4)
let simulate3Ticks = () => simulateXTicks(3)
let simulate2Ticks = () => simulateXTicks(2)
