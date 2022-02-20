function canvasFillCircle(x, y, radius, color) {
    MAIN_CANVAS_CONTEXT.fillStyle = color
    MAIN_CANVAS_CONTEXT.beginPath()
    MAIN_CANVAS_CONTEXT.arc(x, y, radius, 0, 2 * Math.PI)
    MAIN_CANVAS_CONTEXT.fill()
}

function canvasDrawText(x, y, text, color="grey", textAlign="center") {
    MAIN_CANVAS_CONTEXT.fillStyle = color
    MAIN_CANVAS_CONTEXT.font = "20px fontAwesome"
    MAIN_CANVAS_CONTEXT.textAlign = textAlign
    MAIN_CANVAS_CONTEXT.fillText(text, x, y)
    MAIN_CANVAS_CONTEXT.textAlign = "left"
}

function drawGrid(xStep, yStep) {
    MAIN_CANVAS_CONTEXT.strokeStyle = "gray"
    // y axis
    MAIN_CANVAS_CONTEXT.beginPath()
    MAIN_CANVAS_CONTEXT.moveTo(40, 20)
    MAIN_CANVAS_CONTEXT.lineTo(40, MAIN_CANVAS.height - 30)
    MAIN_CANVAS_CONTEXT.stroke()
    // x axis
    MAIN_CANVAS_CONTEXT.beginPath()
    MAIN_CANVAS_CONTEXT.moveTo(30, MAIN_CANVAS.height - 40)
    MAIN_CANVAS_CONTEXT.lineTo(MAIN_CANVAS.width - 20, MAIN_CANVAS.height - 40)
    MAIN_CANVAS_CONTEXT.stroke()
}

function drawData(xStep, yStep, data, color) {
    let circleRadius = 5 - Math.floor(data.length / 50) * 2
    if (circleRadius < 1) circleRadius = 1
    for (let i = 0; i < data.length; i++) {
        let x = i * xStep + MAIN_CANVAS.width * 0.1
        let y = MAIN_CANVAS.height - data[i] * yStep - MAIN_CANVAS.height * 0.1
        canvasFillCircle(x, y, circleRadius, color)
    }
    MAIN_CANVAS_CONTEXT.beginPath()
    MAIN_CANVAS_CONTEXT.strokeStyle = color
    MAIN_CANVAS_CONTEXT.lineWidth = 2
    for (let i = 1; i < data.length; i++) {
        MAIN_CANVAS_CONTEXT.moveTo(
            (i - 1) * xStep + MAIN_CANVAS.width * 0.1,
            MAIN_CANVAS.height - data[i - 1] * yStep - MAIN_CANVAS.height * 0.1
        )
        MAIN_CANVAS_CONTEXT.lineTo(
            i * xStep + MAIN_CANVAS.width * 0.1,
            MAIN_CANVAS.height - data[i] * yStep - MAIN_CANVAS.height * 0.1
        )
    }
    MAIN_CANVAS_CONTEXT.stroke()
}

function plot(data, xName=null, yName=null, data1=[], data2=[], data3=[], colors=["red", "blue", "green", "orange"]) {
    clearCanvas()
    MAIN_CANVAS_CONTEXT.lineWidth = 2

    data = data.filter(x => !isNaN(x))
    data1 = data1.filter(x => !isNaN(x))
    data2 = data2.filter(x => !isNaN(x))
    data3 = data3.filter(x => !isNaN(x))

    let maxValue = Math.max(...data, ...data1, ...data2, ...data3)
    if (maxValue == Math.min(...data, ...data1, ...data2, ...data3)) maxValue += 1
    let yStep = MAIN_CANVAS.height * 0.8 / maxValue
    let xStep = MAIN_CANVAS.width * 0.85 / (data.length - 1)
    if (xName) {
        canvasDrawText(MAIN_CANVAS.width / 2, MAIN_CANVAS.height - 20, xName, "grey")
    }
    if (yName) {
        MAIN_CANVAS_CONTEXT.save()
        MAIN_CANVAS_CONTEXT.translate(MAIN_CANVAS.height / 2, MAIN_CANVAS.height / 2)
        MAIN_CANVAS_CONTEXT.rotate(Math.PI / 2)
        canvasDrawText(0, MAIN_CANVAS.height / 2 - 20, yName, "grey")
        MAIN_CANVAS_CONTEXT.restore()
    }

    drawGrid(xStep, yStep)

    canvasDrawText(MAIN_CANVAS.width - 35, MAIN_CANVAS.height - 45, data.length)
    canvasDrawText(45, MAIN_CANVAS.height * 0.07, maxValue, "grey", "left")

    drawData(xStep, yStep, data, colors[0])
    drawData(xStep, yStep, data1, colors[1])
    drawData(xStep, yStep, data2, colors[2])
    drawData(xStep, yStep, data3, colors[3])

    if (data.length < 2)
        canvasDrawText(MAIN_CANVAS.width / 2, MAIN_CANVAS.height / 2, "Bisher ungenügend Daten vorhanden", "grey", "center")
}

function plotPrepare() {
    SELECTED_ENVIRONMENT = null
    PLEASE_CHOOSE_ENVIRONMENT.style.display = "none"
}

function plotInfectionsPerDay() {
    plotPrepare()
    plot(infectionsPerDay, "Tage", "Infektionen")
    RUNNING_GRAPH = plotInfectionsPerDay
}

SHOW_INFECTIONS_PER_DAY_BUTTON.addEventListener("click", plotInfectionsPerDay)

function plotInfectedPerDay() {
    plotPrepare()
    plot(infectedPerDay, "Tage", "Infizierte", [], [], [], ["blue", "blue", "blue", "blue"])
    RUNNING_GRAPH = plotInfectedPerDay
}

SHOW_INFECTED_PER_DAY_BUTTON.addEventListener("click", plotInfectedPerDay)

function plotImmunePerDay() {
    plotPrepare()
    plot(immunePerDay, "Tage", "Genesene", [], [], [], ["green", "green", "green", "green"])
    RUNNING_GRAPH = plotImmunePerDay
}

SHOW_IMMUNE_PER_DAY_BUTTON.addEventListener("click", plotImmunePerDay)

function plotAlivePerDay() {
    plotPrepare()
    plot(alivePerDay, "Tage", "Lebende", [], [], [], ["red", "red", "red", "red"])
    RUNNING_GRAPH = plotAlivePerDay
}

SHOW_ALIVE_PER_DAY_BUTTON.addEventListener("click", plotAlivePerDay)

function plotStatusPerDay() {
    plotPrepare()
    plot(
        alivePerDay,
        "Tage",
        "Personen",
        infectedPerDay,
        immunePerDay
    )
    RUNNING_GRAPH = plotStatusPerDay
}

SHOW_STATUS_PER_DAY_BUTTON.addEventListener("click", plotStatusPerDay)