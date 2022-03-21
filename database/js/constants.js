const MAIN_CANVAS = document.getElementById("main-canvas")
const MAIN_CONTEXT = MAIN_CANVAS.getContext("2d")

const MAIN_CANVAS_CONTAINER = document.querySelector(".sim-content-container")
let canvasSize = Math.min(MAIN_CANVAS_CONTAINER.clientWidth, MAIN_CANVAS_CONTAINER.clientHeight)
MAIN_CANVAS.width = canvasSize * 0.9
MAIN_CANVAS.height = canvasSize * 0.9

const SIMULATIONS_CONTAINER = document.querySelector(".simulations-container")
const PLEASE_CHOOSE_ENVIRONMENT = document.getElementById("please-choose-environment")

const TIME_COUNT = document.getElementById("time-count")
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

const SHOW_INFECTIONS_PER_DAY_BUTTON = document.getElementById("show-infections-per-day-button")
const SHOW_INFECTED_PER_DAY_BUTTON = document.getElementById("show-infected-per-day-button")
const SHOW_IMMUNE_PER_DAY_BUTTON = document.getElementById("show-immune-per-day-button")
const SHOW_ALIVE_PER_DAY_BUTTON = document.getElementById("show-alive-per-day-button")
const SHOW_STATUS_PER_DAY_BUTTON = document.getElementById("show-status-per-day-button")
const SHOW_R_VALUE_PER_DAY_BUTTON = document.getElementById("show-r-value-per-day-button")
const DOWNLOAD_CSV_BUTTON = document.getElementById("download-data-table-button")
const DOWNLOAD_JSON_BUTTON = document.getElementById("download-data-table-json-button")

const CONFIG_FRIENDS_PER_PLAYER = document.getElementById("config-friends_per_player")
const CONFIG_INFECTION_RADIUS = document.getElementById("config-infection_radius")
const CONFIG_INFECTION_CHANCE = document.getElementById("config-infection_chance")
const CONFIG_IMMUNETICKS = document.getElementById("config-immuneticks")
const CONFIG_INCUBATIONTICKS = document.getElementById("config-incubationticks")
const CONFIG_LETHALITY_RATE = document.getElementById("config-lethality_rate")
const CONFIG_QUARANTINE_TICKS = document.getElementById("config-quarantine_ticks")
const CONFIG_STAYHOME_PROBABILITY = document.getElementById("config-stayhome_probability")
const CONFIG_TEST_CHANCE = document.getElementById("config-test_chance")
const CONFIG_TEST_FALSE_POSITIVE_CHANCE = document.getElementById("config-test_false_positive_chance")
const CONFIG_TEST_FALSE_NEGATIVE_CHANCE = document.getElementById("config-test_false_negative_chance")
const CONFIG_VACCINATION_INFECTION_CHANCE_FACTOR = document.getElementById("config-vaccination_infection_chance_factor")
const CONFIG_VACCINATION_INFECTION_LENGTH_FACTOR = document.getElementById("config-vaccination_infection_length_factor")
const CONFIG_VACCINATION_LETHALITY_FACTOR = document.getElementById("config-vaccination_lethality_factor")
const CONFIG_VISIT_CHANCE = document.getElementById("config-visit_chance")
const CONFIG_REINFECTION_TIME = document.getElementById("config-reinfection_time")

const PARAMETER_HEADER = document.getElementById("parameter-header")
const CONTROL_BAR = document.querySelector(".control-bar")

const DATA_TABLE_BODY = document.getElementById("data-table-body")

const LOADING_OVERLAY = document.getElementById("loading-overlay")

const SIMULATIONS_SEARCH_INPUT = document.getElementById("simulations-search-input")
const NO_SEARCH_RESULTS = document.getElementById("no-search-results")

let SIMULATIONS = null
let SELECTED_SIMULATION = null
