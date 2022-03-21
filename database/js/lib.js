function visitPage(url) {
    window.open(url, "_blank")
}

function warningNoSelection() {
    alert("Es ist noch keine Simulation ausgewählt");
}

SHOW_ALIVE_PER_DAY_BUTTON.addEventListener("click", () => {
    if (!SELECTED_SIMULATION) {
        warningNoSelection()
        return
    }
    MAIN_CANVAS.plot(
        SELECTED_SIMULATION.statistics.alivePerDay,
        "Tage", "Lebende", [], [], [],
        ["red", "red", "red", "red"]
    )
})

SHOW_IMMUNE_PER_DAY_BUTTON.addEventListener("click", () => {
    if (!SELECTED_SIMULATION) {
        warningNoSelection()
        return
    }
    MAIN_CANVAS.plot(
        SELECTED_SIMULATION.statistics.immunePerDay,
        "Tage", "Genesene", [], [], [],
        ["green", "green", "green", "green"]
    )
})

SHOW_INFECTED_PER_DAY_BUTTON.addEventListener("click", () => {
    if (!SELECTED_SIMULATION) {
        warningNoSelection()
        return
    }
    MAIN_CANVAS.plot(
        SELECTED_SIMULATION.statistics.infectedPerDay,
        "Tage", "Infizierte", [], [], [],
        ["blue", "blue", "blue", "blue"]
    )
})

SHOW_INFECTIONS_PER_DAY_BUTTON.addEventListener("click", () => {
    if (!SELECTED_SIMULATION) {
        warningNoSelection()
        return
    }
    MAIN_CANVAS.plot(
        SELECTED_SIMULATION.statistics.infectionsPerDay,
        "Tage", "Infektionen", [], [], [],
        ["red", "red", "red", "red"]
    )
})

SHOW_R_VALUE_PER_DAY_BUTTON.addEventListener("click", () => {
    if (!SELECTED_SIMULATION) {
        warningNoSelection()
        return
    }
    MAIN_CANVAS.plot(
        SELECTED_SIMULATION.statistics.rValuePerDay,
        "Tage", "R-Wert (14d)", [], [], [],
        ["orange", "red", "red", "red"]
    )
})

SHOW_STATUS_PER_DAY_BUTTON.addEventListener("click", () => {
    if (!SELECTED_SIMULATION) {
        warningNoSelection()
        return
    }
    MAIN_CANVAS.plot(
        SELECTED_SIMULATION.statistics.alivePerDay,
        "Tage", "Personen",
        SELECTED_SIMULATION.statistics.infectedPerDay,
        SELECTED_SIMULATION.statistics.immunePerDay
    )
})

function downloadFile(fileName, content) {
    let element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
    element.setAttribute('download', fileName)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
}

DOWNLOAD_CSV_BUTTON.addEventListener("click", () => {
    if (!SELECTED_SIMULATION) {
        warningNoSelection()
        return
    }
    downloadFile(`${SELECTED_SIMULATION.title}.csv`, SELECTED_SIMULATION.toCSV())
})

DOWNLOAD_JSON_BUTTON.addEventListener("click", () => {
    if (!SELECTED_SIMULATION) {
        warningNoSelection()
        return
    }
    downloadFile(`${SELECTED_SIMULATION.title}.json`, SELECTED_SIMULATION.toJSON())
})
