class Player {
    
    constructor(environment, distributeNew=true) {
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
        this.currEnvName = environment.name
        this.job = getJob(this.age)
        this.home = environment
        this.workplace = null
        this.stayTicks = 0
        this.quarantineTicks = 0
        this.maxImmuneTicks = IMMUNETICKS
        this.maxIncubationTicks = INCUBATIONTICKS
        this.lethalityRate = calcLethalityRate(this.age)
        this.infectionChance = INFECTION_CHANCE
        this.infectedPlayersCount = 0
        this.immunizationDate = null
        if (distributeNew) {
            distributeFriends()
            distributeWorkplaces()
            vaccinatePercentage(VACCINATION_PERCENTAGE)
        }
        this.stayHomeToday = false
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

    infect() {
        this.infected = true
        this.infectedTicks = 0
        this.incubationTicks = this.maxIncubationTicks
        infectionsPerDay[CLOCK.days] += 1
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
        if (this.infected) {
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
    }

    simulateTick(jobTimes) {
        let visitTime = isVisitTime()
        for (let player of this.players) {
            player.move(this)
            if (player.infected && player.incubationTicks == 0)
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
            if (this.type != player.job && jobActive && player.quarantineTicks == 0 && !player.stayHomeToday) {
                transferPlayer(player, this, player.workplace)
            } else if (this == player.workplace && !jobActive && player.stayTicks == 0) {
                transferPlayer(player, this, player.home)
            }

            if (visitTime && Math.random() <= VISIT_CHANCE) {
                let targetIndex = randomInt(0, player.friends.length - 1)
                let friend = player.friends[targetIndex]
                if (friend && friend.quarantineTicks == 0) {
                    transferPlayer(player, this, friend.home)
                    player.stayTicks = TICKS_PER_HOUR * randomInt(1, 3)
                    TOTAL_VISITS++
                }
            }

            if (CLOCK.hours == 8 && CLOCK.minutes == 0 && Math.random() <= TEST_CHANCE) {
                let result = player.test()
                TOTAL_TESTS++
                if (result == true) {
                    TOTAL_POSITIVE_TESTS++
                    for (let familyMember of player.home.players) {
                        familyMember.quarantineTicks = QUARANTINE_TICKS
                        player.home.quarantineTicks = QUARANTINE_TICKS
                    }
                } else {
                    TOTAL_NEGATIVE_TESTS++
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
    player.currEnvName = targetEnv.name
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
    calcTPS()
    if ((RUNNING_TICKS_COUNT - 1) % TICKS_PER_DAY == 0)
        updateTable()
    if (SELECTED_ENVIRONMENT)
        SELECTED_ENVIRONMENT.draw()
    CLOCK.advanceMinutes(4)
    if (CLOCK.days + 1 != infectionsPerDay.length) {
        infectionsPerDay.push(0)
    }
    if (CLOCK.hours == 0 && CLOCK.minutes == 0) {
        let allPlayers = getAllPlayers()
        alivePerDay.push(allPlayers.length)
        infectedPerDay.push(countInfected(allPlayers))
        immunePerDay.push(countImmune(allPlayers))
        allPlayers.forEach(p => p.onNewDay())
    }
    if (RUNNING_GRAPH)
        RUNNING_GRAPH()

    TICK_COUNT++
}