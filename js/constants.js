const START_BUTTON = document.getElementById("start-button")
const STOP_BUTTON = document.getElementById("stop-button")

const TIME_COUNT = document.getElementById("time-count")
const TPS_COUNT = document.getElementById("tps-count")
const INHABITANT_COUNT = document.getElementById("inhabitant-count")
const INFECTED_COUNT = document.getElementById("infected-count")
const VACCINATED_COUNT = document.getElementById("vaccinated-count")
const IMMUNE_COUNT = document.getElementById("immune-count")
const DEATH_COUNT = document.getElementById("death-count")
const R_VALUE_COUNT = document.getElementById("r-value-count")
const ENVIRONMENT_COUNT = document.getElementById("environment-count")
const HOUSE_COUNT = document.getElementById("house-count")
const WORKPLACE_COUNT = document.getElementById("workplace-count")
const SCHOOL_COUNT = document.getElementById("school-count")
const INFESTATION_COUNT = document.getElementById("infestation-count")
const VACCINATION_PERCENTAGE_COUNT = document.getElementById("vaccination-percentage-count")
const LOGO_IMG = document.querySelector("header > .logo")

const SIM_CONTENT_CONTAINER = document.querySelector(".sim-content-container")
const CONFIG_CONTAINER_CONTAINER = document.querySelector(".config-container-container")
CONFIG_CONTAINER_CONTAINER.style.marginTop = `${SIM_CONTENT_CONTAINER.clientHeight}px`

const RESET_DEATHS_BUTTON = document.getElementById("reset-deaths-button")
const RESET_TIME_BUTTON = document.getElementById("reset-time-button")

const ADD_HOUSE_BUTTON = document.getElementById("add-house-button")
const ADD_10_HOUSES_BUTTON = document.getElementById("add-10-houses-button")
const ADD_100_HOUSES_BUTTON = document.getElementById("add-100-houses-button")
const ADD_WORKPLACE_BUTTON = document.getElementById("add-workplace-button")
const ADD_SCHOOL_BUTTON = document.getElementById("add-school-button")
const LOAD_PRESET_1_BUTTON = document.getElementById("load-preset-1-button")
const LOAD_PRESET_2_BUTTON = document.getElementById("load-preset-2-button")

const INFECT_RANDOM_BUTTON = document.getElementById("infect-random-button")
const REMOVE_VIRUS_BUTTON = document.getElementById("remove-virus-button")

const INCREASE_VACCINATIONS_BUTTON = document.getElementById("increase-vaccinations-button")
const DECREASE_VACCINATIONS_BUTTON = document.getElementById("decrease-vaccinations-button")

const MAIN_CANVAS = document.getElementById("main-canvas")
const MAIN_CANVAS_CONTEXT = MAIN_CANVAS.getContext("2d")
const PLEASE_CHOOSE_ENVIRONMENT = document.getElementById("please-choose-environment")

const RIGHT_SIDEBAR = document.querySelector(".sidebar.right")
const SHOW_INFECTIONS_PER_DAY_BUTTON = document.getElementById("show-infections-per-day-button")
const SHOW_INFECTED_PER_DAY_BUTTON = document.getElementById("show-infected-per-day-button")
const SHOW_IMMUNE_PER_DAY_BUTTON = document.getElementById("show-immune-per-day-button")
const SHOW_ALIVE_PER_DAY_BUTTON = document.getElementById("show-alive-per-day-button")
const SHOW_STATUS_PER_DAY_BUTTON = document.getElementById("show-status-per-day-button")

const VIEWPLAYER_ID = document.getElementById("viewplayer-id")
const VIEWPLAYER_VACCINATED = document.getElementById("viewplayer-vaccinated")
const VIEWPLAYER_IMMUNE = document.getElementById("viewplayer-immune")
const VIEWPLAYER_INFECTED = document.getElementById("viewplayer-infected")
const VIEWPLAYER_ENVIRONMENT = document.getElementById("viewplayer-environment")
const VIEWPLAYER_AGE = document.getElementById("viewplayer-age")
const VIEWPLAYER_WORKPLACE = document.getElementById("viewplayer-workplace")
const VIEWPLAYER_HOME = document.getElementById("viewplayer-home")
const VIEWPLAYER_QUARANTINE = document.getElementById("viewplayer-quarantine")
const VIEWPLAYER_STAYTICKS = document.getElementById("viewplayer-stayticks")
const VIEWPLAYER_FRIENDS_TABLE = document.getElementById("viewplayer-friends-table")

const VIEWPLAYER_CONTAINER = document.querySelector(".playerinfo-container")
const VIEWPLAYER_OVERLAY = document.querySelector(".playerinfo-overlay")

const VIEW_NO_ENVIRONMENT_BUTTON = document.getElementById("view-no-environment-button")

const SIDEBAR_HOUSES_HEADER = document.getElementById("sidebar-houses-header")
const HOUSES_SECTION = document.getElementById("houses-section")

const TICKS_PER_HOUR = 15
const TICKS_PER_DAY = 360

const CONFIG_FRIENDS_PER_PLAYER = document.getElementById("config-friends-per-player")
const CONFIG_INFECTION_RADIUS = document.getElementById("config-infection-radius")
const CONFIG_INFECTION_CHANCE = document.getElementById("config-infection-chance")
const CONFIG_VISIT_CHANCE = document.getElementById("config-visit-chance")
const CONFIG_INFECTION_LENGTH = document.getElementById("config-infection-length")
const CONFIG_INCUBATION_TIME = document.getElementById("config-incubation-time")
const CONFIG_QUARANTINE_TIME = document.getElementById("config-quarantine-time")
const CONFIG_TEST_CHANCE = document.getElementById("config-test-chance")
const CONFIG_FALSE_NEGATIVE_TEST_RATE = document.getElementById("config-false-negative-test-rate")
const CONFIG_FALSE_POSITIVE_TEST_RATE = document.getElementById("config-false-positive-test-rate")
const CONFIG_VACCINATION_LETHALITY_FACTOR = document.getElementById("config-vaccination-lethality-factor")
const CONFIG_VACCINATION_INFECTION_DURATION_FACTOR = document.getElementById("config-vaccination-infection-duration-factor")
const CONFIG_VACCINATION_INFECTION_PROBABILITY_FACTOR = document.getElementById("config-vaccination-infection-probability-factor")
const CONFIG_LETHALITY_RATE = document.getElementById("config-lethality-rate")
const RESET_CONFIG_BUTTON = document.getElementById("reset-config-button")
const CONFIG_STAYHOME_PROBABILITY = document.getElementById("config-stayhome-probability")

const LOADING_OVERLAY = document.getElementById("loading-overlay")

let ENVIRONMENTS = Array()
let CLOCK = new Clock()
let SELECTED_ENVIRONMENT = null

let DEAD_COUNT = 0
let TOTAL_VISITS = 0
let TOTAL_POSITIVE_TESTS = 0
let TOTAL_NEGATIVE_TESTS = 0
let TOTAL_TESTS = 0
let VACCINATION_PERCENTAGE = 0

let infectionsPerDay = []
let alivePerDay = []
let infectedPerDay = []
let immunePerDay = []

let USED_PLAYER_IDS = Array()

let TPS = 0
let TICK_COUNT = 0

let RUNNING = false
let RUNNING_FUNC = null
let RUNNING_START_TIME = null
let RUNNING_TICKS_COUNT = null
let RUNNING_GRAPH = null

const ENVIRONMENT_TYPE = {
    HOUSE: "Haus",
    WORKPLACE: "Arbeit",
    SCHOOL: "Schule",
    CITY: "Stadt",
}