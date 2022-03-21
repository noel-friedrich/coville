let FRIENDS_PER_PLAYER = 3
let INFECTION_RADIUS = 3
let INFECTION_CHANCE = 0.05 // 5%
let VISIT_CHANCE = 0.0005 // https://www.youtube.com/watch?v=Ac08-99XPKw
let IMMUNETICKS = TICKS_PER_DAY * 7
let INCUBATIONTICKS = TICKS_PER_DAY * 3
let QUARANTINE_TICKS = TICKS_PER_DAY * 7
let TEST_CHANCE = 0.0
let TEST_FALSE_NEGATIVE_CHANCE = 0.2
let TEST_FALSE_POSITIVE_CHANCE = 0
let VACCINATION_LETHALITY_FACTOR = 0.1 // 10 times less likely to die
let VACCINATION_INFECTION_LENGTH_FACTOR = 0.9 // 20% shorter infection
let VACCINATION_INFECTION_CHANCE_FACTOR = 0.25 // 70% chance of infection
let STAYHOME_PROBABILITY = 0
let REINFECTION_TIME = TICKS_PER_DAY * 9999

let calcLethalityRate = alter => 0.0688 * Math.pow(1.0648, alter) / 100

const OG_FRIENDS_PER_PLAYER = FRIENDS_PER_PLAYER
const OG_INFECTION_RADIUS = INFECTION_RADIUS
const OG_INFECTION_CHANCE = INFECTION_CHANCE
const OG_VISIT_CHANCE = VISIT_CHANCE
const OG_IMMUNETICKS = IMMUNETICKS
const OG_INCUBATIONTICKS = INCUBATIONTICKS
const OG_QUARANTINE_TICKS = QUARANTINE_TICKS
const OG_TEST_CHANCE = TEST_CHANCE
const OG_TEST_FALSE_NEGATIVE_CHANCE = TEST_FALSE_NEGATIVE_CHANCE
const OG_TEST_FALSE_POSITIVE_CHANCE = TEST_FALSE_POSITIVE_CHANCE
const OG_VACCINATION_LETHALITY_FACTOR = VACCINATION_LETHALITY_FACTOR
const OG_VACCINATION_INFECTION_LENGTH_FACTOR = VACCINATION_INFECTION_LENGTH_FACTOR
const OG_VACCINATION_INFECTION_CHANCE_FACTOR = VACCINATION_INFECTION_CHANCE_FACTOR
const OG_LETHALITY_RATE = "0.0688*1.0648^alter"
const OG_STAYHOME_PROBABILITY = STAYHOME_PROBABILITY
const OG_REINFECTION_TIME = REINFECTION_TIME

function resetConfig() {
    CONFIG_FRIENDS_PER_PLAYER.value = OG_FRIENDS_PER_PLAYER
    CONFIG_INFECTION_RADIUS.value = OG_INFECTION_RADIUS
    CONFIG_INFECTION_CHANCE.value = OG_INFECTION_CHANCE
    CONFIG_VISIT_CHANCE.value = OG_VISIT_CHANCE
    CONFIG_INFECTION_LENGTH.value = OG_IMMUNETICKS / TICKS_PER_DAY
    CONFIG_INCUBATION_TIME.value = OG_INCUBATIONTICKS / TICKS_PER_DAY
    CONFIG_QUARANTINE_TIME.value = OG_QUARANTINE_TICKS / TICKS_PER_DAY
    CONFIG_TEST_CHANCE.value = OG_TEST_CHANCE
    CONFIG_FALSE_NEGATIVE_TEST_RATE.value = OG_TEST_FALSE_NEGATIVE_CHANCE
    CONFIG_FALSE_POSITIVE_TEST_RATE.value = OG_TEST_FALSE_POSITIVE_CHANCE
    CONFIG_VACCINATION_LETHALITY_FACTOR.value = OG_VACCINATION_LETHALITY_FACTOR
    CONFIG_VACCINATION_INFECTION_DURATION_FACTOR.value = OG_VACCINATION_INFECTION_LENGTH_FACTOR
    CONFIG_VACCINATION_INFECTION_PROBABILITY_FACTOR.value = OG_VACCINATION_INFECTION_CHANCE_FACTOR
    CONFIG_LETHALITY_RATE.value = OG_LETHALITY_RATE
    CONFIG_STAYHOME_PROBABILITY.value = OG_STAYHOME_PROBABILITY
    CONFIG_REINFECTION_TIME.value = OG_REINFECTION_TIME

    FRIENDS_PER_PLAYER = OG_FRIENDS_PER_PLAYER
    INFECTION_RADIUS = OG_INFECTION_RADIUS
    INFECTION_CHANCE = OG_INFECTION_CHANCE
    VISIT_CHANCE = OG_VISIT_CHANCE
    IMMUNETICKS = OG_IMMUNETICKS
    INCUBATIONTICKS = OG_INCUBATIONTICKS
    QUARANTINE_TICKS = OG_QUARANTINE_TICKS
    TEST_CHANCE = OG_TEST_CHANCE
    TEST_FALSE_NEGATIVE_CHANCE = OG_TEST_FALSE_NEGATIVE_CHANCE
    TEST_FALSE_POSITIVE_CHANCE = OG_TEST_FALSE_POSITIVE_CHANCE
    VACCINATION_LETHALITY_FACTOR = OG_VACCINATION_LETHALITY_FACTOR
    VACCINATION_INFECTION_LENGTH_FACTOR = OG_VACCINATION_INFECTION_LENGTH_FACTOR
    VACCINATION_INFECTION_CHANCE_FACTOR = OG_VACCINATION_INFECTION_CHANCE_FACTOR
    calcLethalityRate = alter => 0.0688 * Math.pow(1.0648, alter) / 100
    STAYHOME_PROBABILITY = OG_STAYHOME_PROBABILITY
}

function getConfigJSON() {
    return {
        FRIENDS_PER_PLAYER: FRIENDS_PER_PLAYER,
        INFECTION_RADIUS: INFECTION_RADIUS,
        INFECTION_CHANCE: INFECTION_CHANCE,
        VISIT_CHANCE: VISIT_CHANCE,
        IMMUNETICKS: IMMUNETICKS,
        INCUBATIONTICKS: INCUBATIONTICKS,
        QUARANTINE_TICKS: QUARANTINE_TICKS,
        TEST_CHANCE: TEST_CHANCE,
        TEST_FALSE_NEGATIVE_CHANCE: TEST_FALSE_NEGATIVE_CHANCE,
        TEST_FALSE_POSITIVE_CHANCE: TEST_FALSE_POSITIVE_CHANCE,
        VACCINATION_LETHALITY_FACTOR: VACCINATION_LETHALITY_FACTOR,
        VACCINATION_INFECTION_LENGTH_FACTOR: VACCINATION_INFECTION_LENGTH_FACTOR,
        VACCINATION_INFECTION_CHANCE_FACTOR: VACCINATION_INFECTION_CHANCE_FACTOR,
        STAYHOME_PROBABILITY: STAYHOME_PROBABILITY,
        REINFECTION_TIME: REINFECTION_TIME,
        LETHALITY_RATE: String(calcLethalityRate)
    }
}

function updateConfigTable() {
    CONFIG_FRIENDS_PER_PLAYER.value = FRIENDS_PER_PLAYER
    CONFIG_INFECTION_RADIUS.value = INFECTION_RADIUS
    CONFIG_INFECTION_CHANCE.value = INFECTION_CHANCE
    CONFIG_VISIT_CHANCE.value = VISIT_CHANCE
    CONFIG_INFECTION_LENGTH.value = IMMUNETICKS / TICKS_PER_DAY
    CONFIG_INCUBATION_TIME.value = INCUBATIONTICKS / TICKS_PER_DAY
    CONFIG_QUARANTINE_TIME.value = QUARANTINE_TICKS / TICKS_PER_DAY
    CONFIG_TEST_CHANCE.value = TEST_CHANCE
    CONFIG_FALSE_NEGATIVE_TEST_RATE.value = TEST_FALSE_NEGATIVE_CHANCE
    CONFIG_FALSE_POSITIVE_TEST_RATE.value = TEST_FALSE_POSITIVE_CHANCE
    CONFIG_VACCINATION_LETHALITY_FACTOR.value = VACCINATION_LETHALITY_FACTOR
    CONFIG_VACCINATION_INFECTION_DURATION_FACTOR.value = VACCINATION_INFECTION_LENGTH_FACTOR
    CONFIG_VACCINATION_INFECTION_PROBABILITY_FACTOR.value = VACCINATION_INFECTION_CHANCE_FACTOR
    CONFIG_STAYHOME_PROBABILITY.value = STAYHOME_PROBABILITY
    CONFIG_REINFECTION_TIME.value = REINFECTION_TIME
}

CONFIG_REINFECTION_TIME.addEventListener("change", event => {
    REINFECTION_TIME = event.target.value * TICKS_PER_DAY
    for (let player of getAllPlayers()) {
        player.reinfectionTime = Math.round(REINFECTION_TIME * player.gaussianError)
    }
})

RESET_CONFIG_BUTTON.addEventListener('click', resetConfig)

CONFIG_STAYHOME_PROBABILITY.addEventListener("change", event => {
    STAYHOME_PROBABILITY = parseFloat(event.target.value)
})

CONFIG_FRIENDS_PER_PLAYER.addEventListener("change", event => {
    FRIENDS_PER_PLAYER = parseInt(event.target.value)
    distributeFriends()
})

CONFIG_INFECTION_RADIUS.addEventListener("change", event => {
    INFECTION_RADIUS = parseInt(event.target.value)
})

CONFIG_INFECTION_CHANCE.addEventListener("change", event => {
    INFECTION_CHANCE = parseFloat(event.target.value)
    for (let player of getAllPlayers()) {
        player.infectionChance = INFECTION_CHANCE * player.gaussianError
        if (player.vaccinated)
            player.infectionChance *= VACCINATION_INFECTION_CHANCE_FACTOR
    }
})

CONFIG_VISIT_CHANCE.addEventListener("change", event => {
    VISIT_CHANCE = parseFloat(event.target.value)
})

CONFIG_INFECTION_LENGTH.addEventListener("change", event => {
    IMMUNETICKS = TICKS_PER_DAY * parseFloat(event.target.value)
    for (let player of getAllPlayers()) {
        player.maxImmuneTicks = Math.round(IMMUNETICKS * player.gaussianError)
        if (player.vaccinated)
            player.maxImmuneTicks = Math.round(VACCINATION_INFECTION_LENGTH_FACTOR * player.maxImmuneTicks)
    }
})

CONFIG_INCUBATION_TIME.addEventListener("change", event => {
    let vaccinatedPlayers = getAllPlayers().filter(p => p.vaccinated)
    for (let player of vaccinatedPlayers) {
        player.unvaccinate()
    }
    INCUBATIONTICKS = Math.round(TICKS_PER_DAY * parseFloat(event.target.value))
    for (let player of vaccinatedPlayers) {
        player.vaccinate()
    }
})

CONFIG_QUARANTINE_TIME.addEventListener("change", event => {
    QUARANTINE_TICKS = TICKS_PER_DAY * parseFloat(event.target.value)
})

CONFIG_TEST_CHANCE.addEventListener("change", event => {
    TEST_CHANCE = parseFloat(event.target.value)
})

CONFIG_FALSE_NEGATIVE_TEST_RATE.addEventListener("change", event => {
    TEST_FALSE_NEGATIVE_CHANCE = parseFloat(event.target.value)
})

CONFIG_FALSE_POSITIVE_TEST_RATE.addEventListener("change", event => {
    TEST_FALSE_POSITIVE_CHANCE = parseFloat(event.target.value)
})

CONFIG_VACCINATION_LETHALITY_FACTOR.addEventListener("change", event => {
    VACCINATION_LETHALITY_FACTOR = parseFloat(event.target.value)
    for (let player of getAllPlayers().filter(p => p.vaccinated)) {
        player.lethalityRate = LETHALITY_RATE * VACCINATION_LETHALITY_FACTOR
    }
})

CONFIG_VACCINATION_INFECTION_DURATION_FACTOR.addEventListener("change", event => {
    let vaccinatedPlayers = getAllPlayers().filter(p => p.vaccinated)
    for (let player of vaccinatedPlayers) {
        player.unvaccinate()
    }
    VACCINATION_INFECTION_LENGTH_FACTOR = parseFloat(event.target.value)
    for (let player of vaccinatedPlayers) {
        player.vaccinate()
    }
})

CONFIG_VACCINATION_INFECTION_PROBABILITY_FACTOR.addEventListener("change", event => {
    let vaccinatedPlayers = getAllPlayers().filter(p => p.vaccinated)
    for (let player of vaccinatedPlayers) {
        player.unvaccinate()
    }
    VACCINATION_INFECTION_CHANCE_FACTOR = parseFloat(event.target.value)
    for (let player of vaccinatedPlayers) {
        player.vaccinate()
    }
})

CONFIG_LETHALITY_RATE.addEventListener("change", event => {
    let funcStr = event.target.value
    funcStr = funcStr.replace(/([\d\.]+)\s*\^\s*([a-zA-Z]+)/g, "Math.pow($1, $2)")
    funcStr = funcStr.replace(/([a-zA-Z]+)\s*\^\s*([\d\.]+)/g, "Math.pow($1, $2)")
    calcLethalityRate = eval(`alter => ${funcStr} / 100`)
    for (let player of getAllPlayers()) {
        player.lethalityRate = calcLethalityRate(player.age)
        if (player.vaccinated)
            player.lethalityRate *= VACCINATION_LETHALITY_FACTOR
    }
})
