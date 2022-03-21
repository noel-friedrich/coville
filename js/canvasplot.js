function canvasFillCircle(context, x, y, radius, color) {
    context.fillStyle = color
    context.beginPath()
    context.arc(x, y, radius, 0, 2 * Math.PI)
    context.fill()
}

function canvasDrawText(context, x, y, text, color="grey", textAlign="center") {
    context.fillStyle = color
    context.font = "20px fontAwesome"
    context.textAlign = textAlign
    context.fillText(text, x, y)
    context.textAlign = "left"
}

function drawGrid(canvas, context, xStep, yStep) {
    context.strokeStyle = "gray"
    // y axis
    context.beginPath()
    context.moveTo(40, 20)
    context.lineTo(40, canvas.height - 30)
    context.stroke()
    // x axis
    context.beginPath()
    context.moveTo(30, canvas.height - 40)
    context.lineTo(canvas.width - 20, canvas.height - 40)
    context.stroke()
}

function drawData(canvas, context, xStep, yStep, data, color) {
    let circleRadius = (canvas.width * 0.8) / data.length * 0.5
    if (circleRadius > 5) circleRadius = 5
    for (let i = 0; i < data.length; i++) {
        let x = i * xStep + 60
        let y = canvas.height - data[i] * yStep - 60
        canvasFillCircle(context, x, y, circleRadius, color)
    }
    context.beginPath()
    context.strokeStyle = color
    context.lineWidth = 2
    for (let i = 1; i < data.length; i++) {
        context.moveTo(
            (i - 1) * xStep + 60,
            canvas.height - data[i - 1] * yStep - 60
        )
        context.lineTo(
            i * xStep + 60,
            canvas.height - data[i] * yStep - 60
        )
    }
    context.stroke()
}

HTMLCanvasElement.prototype.plot = function(data, xName=null, yName=null, data1=[], data2=[], data3=[], colors=["red", "blue", "green", "orange"]) {
    let CONTEXT2D = this.getContext("2d")
    CONTEXT2D.lineWidth = 2
    
    CONTEXT2D.clearRect(0, 0, this.width, this.height)
    
    data = data.filter(x => !isNaN(x))
    data1 = data1.filter(x => !isNaN(x))
    data2 = data2.filter(x => !isNaN(x))
    data3 = data3.filter(x => !isNaN(x))

    let maxValue = Math.max(...data, ...data1, ...data2, ...data3)
    if (maxValue == Math.min(...data, ...data1, ...data2, ...data3)) maxValue += 1
    let yStep = (this.height - 60) * 0.9 / maxValue
    let xStep = (this.width - 60) * 0.9 / (data.length - 1)
    if (xName) {
        canvasDrawText(CONTEXT2D, this.width / 2, this.height - 20, xName, "grey")
    }
    if (yName) {
        CONTEXT2D.save()
        CONTEXT2D.translate(this.height / 2, this.height / 2)
        CONTEXT2D.rotate(Math.PI / 2)
        canvasDrawText(CONTEXT2D, 0, this.height / 2 - 20, yName, "grey")
        CONTEXT2D.restore()
    }

    drawGrid(this, CONTEXT2D, xStep, yStep)

    canvasDrawText(CONTEXT2D, this.width - 35, this.height - 45, data.length)
    canvasDrawText(CONTEXT2D, 45, 35, maxValue, "grey", "left")

    drawData(this, CONTEXT2D, xStep, yStep, data, colors[0])
    drawData(this, CONTEXT2D, xStep, yStep, data1, colors[1])
    drawData(this, CONTEXT2D, xStep, yStep, data2, colors[2])
    drawData(this, CONTEXT2D, xStep, yStep, data3, colors[3])

    if (data.length < 2)
        canvasDrawText(CONTEXT2D, this.width / 2, this.height / 2, "Bisher ungenügend Daten vorhanden", "grey", "center")
}
