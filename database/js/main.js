async function main() {
    SIMULATIONS = await getSimulations()
    for (let i = SIMULATIONS.length - 1; i >= 0; i--) {
        SIMULATIONS[i].addToDOM(SIMULATIONS_CONTAINER)
    }
    LOADING_OVERLAY.style.display = "none"
}

main()

MAIN_CANVAS.onmousemove = function(event) {
    if (!SELECTED_SIMULATION) return
    let rect = MAIN_CANVAS.getBoundingClientRect()
    let mousePos = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top
    }
    if (mousePos.x <= 60 || mousePos.x >= MAIN_CANVAS.width - 60) return
    let xStep = (MAIN_CANVAS.width - 120) / SELECTED_SIMULATION.statistics.alivePerDay.length
    let gridX = Math.floor(mousePos.x / xStep) - 3
    for (let tr of SELECTED_SIMULATION.dataTableRows) {
        if (tr.classList.contains("graphHover")) {
            tr.classList.remove("graphHover")
        }
    }
    let tr = SELECTED_SIMULATION.dataTableRows[gridX]
    if (tr)
        tr.classList.add("graphHover")
}

SIMULATIONS_SEARCH_INPUT.oninput = function() {
    if (SIMULATIONS_SEARCH_INPUT.value.length == 0) {
        SIMULATIONS.forEach(simulation => {
            simulation.html.container.style.display = "block"
        })
        NO_SEARCH_RESULTS.style.display = "none"
        return
    }
    let search = SIMULATIONS_SEARCH_INPUT.value.toLowerCase().replace(/\s/g, "")
    let foundOne = false
    for (let simulation of SIMULATIONS) {
        if (simulation.title.toLowerCase().replace(/\s/g, "").includes(search)) {
            simulation.html.container.style.display = "block"
            foundOne = true
        } else {
            simulation.html.container.style.display = "none"
        }
    }
    if (foundOne) {
        NO_SEARCH_RESULTS.style.display = "none"
    } else {
        NO_SEARCH_RESULTS.style.display = "block"
    }
}
