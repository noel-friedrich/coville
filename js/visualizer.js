function plotPrepare() {
    SELECTED_ENVIRONMENT = null
    PLEASE_CHOOSE_ENVIRONMENT.style.display = "none"
}

function scrollCanvasIntoView() {
    SIM_CONTENT_CONTAINER.scrollTo({
        top: 0,
        behavior: "smooth"
    })
}

SHOW_ALIVE_PER_DAY_BUTTON.addEventListener("click", scrollCanvasIntoView)
SHOW_INFECTED_PER_DAY_BUTTON.addEventListener("click", scrollCanvasIntoView)
SHOW_INFECTIONS_PER_DAY_BUTTON.addEventListener("click", scrollCanvasIntoView)
SHOW_IMMUNE_PER_DAY_BUTTON.addEventListener("click", scrollCanvasIntoView)
SHOW_STATUS_PER_DAY_BUTTON.addEventListener("click", scrollCanvasIntoView)
SHOW_R_VALUE_PER_DAY_BUTTON.addEventListener("click", scrollCanvasIntoView)

function plotInfectionsPerDay() {
    plotPrepare()
    MAIN_CANVAS.plot(infectionsPerDay, "Tage", "Infektionen")
    RUNNING_GRAPH = plotInfectionsPerDay
}

SHOW_INFECTIONS_PER_DAY_BUTTON.addEventListener("click", plotInfectionsPerDay)

function plotInfectedPerDay() {
    plotPrepare()
    MAIN_CANVAS.plot(infectedPerDay, "Tage", "Infizierte", [], [], [], ["blue", "blue", "blue", "blue"])
    RUNNING_GRAPH = plotInfectedPerDay
}

SHOW_INFECTED_PER_DAY_BUTTON.addEventListener("click", plotInfectedPerDay)

function plotImmunePerDay() {
    plotPrepare()
    MAIN_CANVAS.plot(immunePerDay, "Tage", "Genesene", [], [], [], ["green", "green", "green", "green"])
    RUNNING_GRAPH = plotImmunePerDay
}

SHOW_IMMUNE_PER_DAY_BUTTON.addEventListener("click", plotImmunePerDay)

function plotAlivePerDay() {
    plotPrepare()
    MAIN_CANVAS.plot(alivePerDay, "Tage", "Lebende", [], [], [], ["red", "red", "red", "red"])
    RUNNING_GRAPH = plotAlivePerDay
}

SHOW_ALIVE_PER_DAY_BUTTON.addEventListener("click", plotAlivePerDay)

function plotStatusPerDay() {
    plotPrepare()
    MAIN_CANVAS.plot(
        alivePerDay,
        "Tage",
        "Personen",
        infectedPerDay,
        immunePerDay
    )
    RUNNING_GRAPH = plotStatusPerDay
}

SHOW_STATUS_PER_DAY_BUTTON.addEventListener("click", plotStatusPerDay)

function plotRValuePerDay() {
    plotPrepare()
    let reference1Array = []
    for (let i = 0; i < rValuePerDay.length; i++) {
        reference1Array.push(1.0)
    }
    MAIN_CANVAS.plot(
        rValuePerDay,
        "Tage",
        "R-Wert (14d)",
        reference1Array, [], [],
        ["orange", "black", "red", "red"]
    )
    RUNNING_GRAPH = plotRValuePerDay
}

SHOW_R_VALUE_PER_DAY_BUTTON.addEventListener("click", plotRValuePerDay)
