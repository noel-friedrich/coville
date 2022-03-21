let CONNECTNG_STATUS = {
    active: false,
    measure: null,
    trigger: null
}

class Position {

    constructor(x, y) {
        this.x = x
        this.y = y
    }

    static random(canvas) {
        return new Position(
            Math.floor(Math.random() * (canvas.width - 200)),
            Math.floor(Math.random() * (canvas.height - 100))
        )
    }

    static fromMouseevent(event, rect) {
        return new Position(
            event.clientX - rect.left,
            event.clientY - rect.top
        )
    }

    pythogerianDistance(other) {
        return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2))
    }

    naiveDistance(other) {
        let x = Math.abs(this.x - other.x)
        let y = Math.abs(this.y - other.y)
        return x + y
    }

}

let draggingMeasure = null

const MeasureType = {
    NONE: 0,
    CLOSE_SCHOOLS: 1,
    CLOSE_WORKPLACES: 2,
    REDUCE_VISITS: 3,
    TEST_RATE: 4,
    VACCINATION_RATE: 5,
    CLOSE_CITY: 6,
}

const MeasureTypeTranslations = {
    [MeasureType.NONE]: "Keine Maßnahme",
    [MeasureType.CLOSE_SCHOOLS]: "Schulen schließen",
    [MeasureType.CLOSE_WORKPLACES]: "Arbeitsplätze schließen",
    [MeasureType.REDUCE_VISITS]: "Besuche reduzieren",
    [MeasureType.TEST_RATE]: "Testrate verändern",
    [MeasureType.VACCINATION_RATE]: "Impfrate verändern",
    [MeasureType.CLOSE_CITY]: "Innenstadt schließen",
}

class Measure {

    constructor(parent) {
        this.parent = parent
        this.type = MeasureType.NONE
        this.name = "Maßnahme"
        this.description = ""
        this.position = new Position(0, 0)
        this.trigger = null
        this.lastEvaluation = false
        this.constructHTML()
    }

    boilerPlateHTML() {
        let container = document.createElement("div")
        container.classList.add("measure")
        let title = document.createElement("h3")
        let deleteButton = document.createElement("button")
        deleteButton.classList.add("delete-button")
        deleteButton.textContent = "x"
        this.deleteButton = deleteButton
        deleteButton.onclick = function() {
            this.parent.removeMeasure(this)
        }.bind(this)
        title.textContent = this.name
        let description = document.createElement("p")
        description.textContent = this.description

        container.appendChild(title)
        if (this.description) container.appendChild(description)
        container.appendChild(deleteButton)
        container.onmousemove = function(e) {
            if (CONNECTNG_STATUS.active) return
            if (e.target == container) {
                container.style.cursor = "move"
            } else {
                container.style.cursor = "initial"
            }
        }.bind(this)

        container.onmousedown = function(e) {
            if (CONNECTNG_STATUS.active) return
            if (e.target != container && e.target != title) return
            draggingMeasure = this
        }.bind(this)

        return container
    }

    set pos(position) {
        this.position = position
        this.html.style.left = position.x + "px"
        this.html.style.top = position.y + "px"
        this.parent.updateHooks()
    }

    constructHTML() {
        let container = this.boilerPlateHTML()
        let selectMeasure = document.createElement("select")
        for (let type in MeasureType) {
            let option = document.createElement("option")
            option.value = MeasureType[type]
            option.textContent = MeasureTypeTranslations[MeasureType[type]]
            selectMeasure.appendChild(option)
        }
        container.appendChild(selectMeasure)
        this.html = container

        selectMeasure.onchange = function(e) {
            if (selectMeasure.value == MeasureType.NONE) return
            let newThis = new MeasureClasses[selectMeasure.value](this.parent)
            newThis.pos = this.position
            newThis.trigger = this.trigger
            let index = this.parent.measures.indexOf(this)
            this.parent.measures[index] = newThis
            this.parent.update()
        }.bind(this)
    }

    executeMeasure() {
        // do nothing
    }

    get hook() {
        return new Position(
            this.position.x + this.html.clientWidth / 2,
            this.position.y - 10
        )
    }

    update() {
        if (!this.trigger || this.type == MeasureType.NONE) return
        let previousEval = this.lastEvaluation
        let newEval = this.trigger.evaluate()
        if (previousEval == newEval) return
        if (newEval == true) {
            console.log(`${this.name} triggered`, this)
            this.html.classList.add("triggered")
            this.execute()
        } else if (newEval == false) {
            console.log(`${this.name} untriggered`, this)
            this.html.classList.remove("triggered")
            this.deconstruct()
        }
        this.lastEvaluation = newEval
    }

    toJSON() {
        return {
            type: this.type,
            name: this.name,
            description: this.description,
            trigger: this.trigger.toJSON(),
            value: this.value
        }
    }

}

class MeasureCloseSchools extends Measure {
    
    constructor(parent) {
        super(parent)
        this.type = MeasureType.CLOSE_SCHOOLS
        this.name = "Schulen schließen"
        this.description = "Schließen aller Schulen (Digitales Lernen)"
        this.constructHTML()
    }
    
    constructHTML() {
        this.html = this.boilerPlateHTML()
    }

    execute() {
        MEASURE_CLOSE_SCHOOLS = true
    }

    deconstruct() {
        MEASURE_CLOSE_SCHOOLS = false
    }
    
}

class MeasureCloseWorkplaces extends Measure {

    constructor(parent) {
        super(parent)
        this.type = MeasureType.CLOSE_WORKPLACES
        this.name = "Home-Office"
        this.description = "Verpflichtendes Arbeiten von zuhause wenn möglich"
        this.constructHTML()
    }

    constructHTML() {
        this.html = this.boilerPlateHTML()
    }

    execute() {
        STAYHOME_PROBABILITY = 0.95
        updateConfigTable()
    }

    deconstruct() {
        STAYHOME_PROBABILITY = 0
        updateConfigTable()
    }

}

class MeasureReduceContacts extends Measure {

    constructor(parent) {
        super(parent)
        this.type = MeasureType.REDUCE_VISITS
        this.name = "Social Distancing"
        this.description = "Veränderung der Besuchschance um einen Faktor von"
        this.value = 0.5
        this.constructHTML()
    }

    constructHTML() {
        this.html = this.boilerPlateHTML()
        let factorInput = document.createElement("input")
        factorInput.type = "number"
        factorInput.min = 0
        factorInput.max = 10
        factorInput.value = this.value
        factorInput.onchange = function() {
            this.value = factorInput.value
        }.bind(this)
        this.html.appendChild(factorInput)
    }

    execute() {
        VISIT_CHANCE *= this.value
        updateConfigTable()
    }

    deconstruct() {
        VISIT_CHANCE /= this.value
        updateConfigTable()
    }

}

class MeasureTestRate extends Measure {

    constructor(parent) {
        super(parent)
        this.type = MeasureType.TEST_RATE
        this.name = "Testrate"
        this.description = "Setzen der Testrate auf"
        this.value = 0.5
        this.constructHTML()
    }

    constructHTML() {
        this.html = this.boilerPlateHTML()
        let factorInput = document.createElement("input")
        factorInput.type = "number"
        factorInput.min = 0
        factorInput.max = 10
        factorInput.value = this.value
        factorInput.onchange = function() {
            this.value = factorInput.value
        }.bind(this)
        this.html.appendChild(factorInput)
    }

    execute() {
        this.prevTestrate = TEST_CHANCE
        TEST_CHANCE = this.value
        updateConfigTable()
    }

    deconstruct() {
        TEST_CHANCE = this.prevTestrate
        updateConfigTable()
    }

}

class MeasureVaccinationRate extends Measure {

    constructor(parent) {
        super(parent)
        this.type = MeasureType.TEST_RATE
        this.name = "Impfrate erhöhen"
        this.description = "Erhöhung der Impfrate um (in %)"
        this.value = 20
        this.constructHTML()
        this.executed = false
    }

    constructHTML() {
        this.html = this.boilerPlateHTML()
        let factorInput = document.createElement("input")
        factorInput.type = "number"
        factorInput.min = 0
        factorInput.max = 100
        factorInput.value = this.value
        factorInput.onchange = function() {
            this.value = factorInput.value
        }.bind(this)
        this.html.appendChild(factorInput)
    }

    execute() {
        if (this.executed) return
        VACCINATION_PERCENTAGE = parseInt(VACCINATION_PERCENTAGE) + parseInt(this.value)
        VACCINATION_PERCENTAGE = Math.min(VACCINATION_PERCENTAGE, 100)
        VACCINATION_PERCENTAGE = Math.max(VACCINATION_PERCENTAGE, 0)
        vaccinatePercentage(VACCINATION_PERCENTAGE)
        updateTable()
        this.executed = true
    }

    deconstruct() {
        // don't do anything
    }

}

class MeasureCloseCity extends Measure {

    constructor(parent) {
        super(parent)
        this.type = MeasureType.CLOSE_CITY
        this.name = "Stadt schließen"
        this.description = "Temporäres Entfernen der Stadt-Umgebung"
        this.constructHTML()
    }

    constructHTML() {
        this.html = this.boilerPlateHTML()
    }

    execute() {
        MEASURE_CLOSE_CITY = true
    }

    deconstruct() {
        MEASURE_CLOSE_CITY = false
    }

}

const MeasureClasses = {
    [MeasureType.CLOSE_SCHOOLS]: MeasureCloseSchools,
    [MeasureType.CLOSE_WORKPLACES]: MeasureCloseWorkplaces,
    [MeasureType.REDUCE_VISITS]: MeasureReduceContacts,
    [MeasureType.TEST_RATE]: MeasureTestRate,
    [MeasureType.VACCINATION_RATE]: MeasureVaccinationRate,
    [MeasureType.CLOSE_CITY]: MeasureCloseCity
}

const TriggerType = {
    NONE: 0,
    INCIDENCE: 1,
    INFESTATION: 2,
    TIME_DELAY: 3,
}

const TriggerTypeTranslation = {
    [TriggerType.NONE]: "Kein Trigger",
    [TriggerType.INCIDENCE]: "Inzidenz-Trigger",
    [TriggerType.INFESTATION]: "Durchseuchungs-Trigger",
    [TriggerType.TIME_DELAY]: "Zeit-Trigger",
}

class Trigger {
    constructor(parent) {
        this.parent = parent
        this.type = TriggerType.NONE
        this.value = 0
        this.position = new Position(0, 0)
        this.name = "Trigger"
        this.description = ""
        this.lastEvaluation = false
        this.constructHTML()
    }

    boilerPlateHTML() {
        let container = document.createElement("div")
        container.classList.add("trigger")
        let title = document.createElement("h3")
        let deleteButton = document.createElement("button")
        deleteButton.classList.add("delete-button")
        deleteButton.textContent = "x"
        this.deleteButton = deleteButton
        deleteButton.onclick = function() {
            this.parent.removeTrigger(this)
        }.bind(this)
        title.textContent = this.name
        container.appendChild(title)
        let description = document.createElement("p")
        description.textContent = this.description
        if (this.description) container.appendChild(description)
        container.appendChild(deleteButton)
        container.onmousemove = function(e) {
            if (CONNECTNG_STATUS.active) return
            if (e.target == container) {
                container.style.cursor = "move"
            } else {
                container.style.cursor = "initial"
            }
        }.bind(this)

        container.onmousedown = function(e) {
            if (CONNECTNG_STATUS.active) return
            if (e.target != container && e.target != title) return
            draggingMeasure = this
        }.bind(this)
        return container
    }

    constructHTML() {
        let container = this.boilerPlateHTML()
        let selectTrigger = document.createElement("select")
        for (let type in TriggerType) {
            let option = document.createElement("option")
            option.value = TriggerType[type]
            option.textContent = TriggerTypeTranslation[TriggerType[type]]
            selectTrigger.appendChild(option)
        }
        container.appendChild(selectTrigger)
        this.html = container

        selectTrigger.onchange = function() {
            if (selectTrigger.value == TriggerType.NONE) return
            let newThis = new TriggerClasses[selectTrigger.value](this.parent)
            newThis.pos = this.position
            let index = this.parent.triggers.indexOf(this)
            this.parent.triggers[index] = newThis
            for (let measure of this.parent.measures) {
                if (measure.trigger == this) {
                    measure.trigger = newThis
                }
            }
            this.parent.update()
        }.bind(this)
    }

    set pos(position) {
        this.position = position
        this.html.style.left = position.x + "px"
        this.html.style.top = position.y + "px"
        this.parent.updateHooks()
    }

    get hook() {
        return new Position(
            this.position.x + this.html.clientWidth / 2,
            this.position.y + this.html.clientHeight + 12
        )
    }

    toJSON() {
        return {
            type: this.type,
            value: this.value,
            name: this.name,
            description: this.description
        }
    }
}

class TriggerIncidence extends Trigger {

    constructor(parent) {
        super(parent)
        this.type = TriggerType.INCIDENCE
        this.name = "Inzidenz"
        this.description = "Wenn 7-Tage Inzidenz über"
        this.value = 100
        this.constructHTML()
    }

    constructHTML() {
        let container = this.boilerPlateHTML()
        let inzidenzInput = document.createElement("input")
        inzidenzInput.type = "number"
        inzidenzInput.min = 0
        inzidenzInput.max = 1000000
        inzidenzInput.step = 10
        inzidenzInput.value = this.value
        inzidenzInput.onchange = function() {
            this.value = inzidenzInput.value
        }.bind(this)
        container.appendChild(inzidenzInput)
        this.html = container

    }

    evaluate() {
        let evaluation = countIncidence(getAllPlayers()) > this.value
        if (evaluation) {
            this.html.classList.add("triggered")
        } else if (this.html.classList.contains("triggered")) {
            this.html.classList.remove("triggered")
        }
        this.lastEvaluation = evaluation
        return evaluation
    }

}

class TriggerInfestation extends Trigger {

    constructor(parent) {
        super(parent)
        this.type = TriggerType.INFESTATION
        this.name = "Durchseuchung"
        this.description = "Wenn Durchseuchung über (in %)"
        this.value = 50
        this.constructHTML()
    }

    constructHTML() {
        let container = this.boilerPlateHTML()
        let infestationInput = document.createElement("input")
        infestationInput.type = "number"
        infestationInput.min = 0
        infestationInput.max = 100
        infestationInput.step = 10
        infestationInput.value = this.value
        infestationInput.onchange = function() {
            this.value = infestationInput.value
        }.bind(this)
        container.appendChild(infestationInput)
        this.html = container
    }

    evaluate() {
        let allPlayers = getAllPlayers()
        let infestation = (countImmune(allPlayers) + countInfected(allPlayers)) / allPlayers.length * 100
        let evaluation = infestation > this.value
        if (evaluation) {
            this.html.classList.add("triggered")
        } else if (this.html.classList.contains("triggered")) {
            this.html.classList.remove("triggered")
        }
        this.lastEvaluation = evaluation
        return evaluation
    }

}

class TriggerTime extends Trigger {
    
        constructor(parent) {
            super(parent)
            this.type = TriggerType.TIME_DELAY
            this.name = "Zeit"
            this.description = "Von Tag"
            this.startDay = 10
            this.endDay = 20
            this.constructHTML()
        }

        makeTimeinput(val) {
            let timeInput = document.createElement("input")
            timeInput.type = "number"
            timeInput.min = 0
            timeInput.max = 1000
            timeInput.step = 1
            timeInput.value = val
            return timeInput
        }
    
        constructHTML() {
            let container = this.boilerPlateHTML()
            let startDayInput = this.makeTimeinput(this.startDay)
            startDayInput.onchange = function() {
                this.startDay = parseInt(startDayInput.value)
            }.bind(this)
            let endDayInput = this.makeTimeinput(this.endDay)
            endDayInput.onchange = function() {
                this.endDay = parseInt(endDayInput.value)
            }.bind(this)
            let p1 = document.createElement("p")
            p1.textContent = "bis tag"
            container.appendChild(startDayInput)
            container.appendChild(p1)
            container.appendChild(endDayInput)
            this.html = container
        }

        evaluate() {
            let evaluation = this.startDay <= CLOCK.days && CLOCK.days <= this.endDay
            if (evaluation) {
                this.html.classList.add("triggered")
            } else if (this.html.classList.contains("triggered")) {
                this.html.classList.remove("triggered")
            }
            this.lastEvaluation = evaluation
            return evaluation
        }
    
}

const TriggerClasses = {
    [TriggerType.INCIDENCE]: TriggerIncidence,
    [TriggerType.INFESTATION]: TriggerInfestation,
    [TriggerType.TIME_DELAY]: TriggerTime
}

function drawMeasureMenuCanvasBackground() {
    MEASUREMENU_CANVAS_CONTEXT.lineWidth = 2
    MEASUREMENU_CANVAS_CONTEXT.strokeStyle = "rgba(0,0,0,0.1)"
    function drawLine(x1, y1, x2, y2) {
        MEASUREMENU_CANVAS_CONTEXT.beginPath()
        MEASUREMENU_CANVAS_CONTEXT.moveTo(x1, y1)
        MEASUREMENU_CANVAS_CONTEXT.lineTo(x2, y2)
        MEASUREMENU_CANVAS_CONTEXT.stroke()
    }
    for (let x = -10; x < MEASUREMENU_CANVAS.width; x += 30) {
        drawLine(x, 0, x, MEASUREMENU_CANVAS.height)
    }
    for (let y = -10; y < MEASUREMENU_CANVAS.height; y += 30) {
        drawLine(0, y, MEASUREMENU_CANVAS.width, y)
    }
}

class MeasureMenu {

    getTriggerfromHookPos(hookPos) {
        for (let trigger of this.triggers) {
            if (trigger.hook.pythogerianDistance(hookPos) < 10) {
                return trigger
            }
        }
        return null
    }

    getMeasurefromHookPos(hookPos) {
        for (let measure of this.measures) {
            if (measure.hook.pythogerianDistance(hookPos) < 10) {
                return measure
            }
        }
        return null
    }

    toJSON() {
        return this.measures
            .filter(measure => measure.trigger)
            .filter(measure => measure.trigger.type != TriggerType.NONE)
            .filter(measure => measure.type != MeasureType.NONE)
            .map(measure => measure.toJSON())
    }

    constructor() {
        this.measures = Array()
        this.triggers = Array()
        
        this.canvas = MEASUREMENU_CANVAS
        this.context = MEASUREMENU_CANVAS_CONTEXT

        MEASUREMENU_INNER.onmousemove = function(e) {
            let rect = MEASUREMENU_INNER.getBoundingClientRect()
            let mousePos = Position.fromMouseevent(e, rect)

            if (CONNECTNG_STATUS.active) {
                this.updateHooks()
                if (CONNECTNG_STATUS.measure) {
                    let hook = CONNECTNG_STATUS.measure.hook
                    this.context.strokeStyle = "black"
                    this.context.beginPath()
                    this.context.moveTo(hook.x, hook.y)
                    this.context.lineTo(mousePos.x, mousePos.y)
                    this.context.stroke()
                } else if (CONNECTNG_STATUS.trigger) {
                    let hook = CONNECTNG_STATUS.trigger.hook
                    this.context.strokeStyle = "black"
                    this.context.beginPath()
                    this.context.moveTo(hook.x, hook.y)
                    this.context.lineTo(mousePos.x, mousePos.y)
                    this.context.stroke()
                }
            } else if (draggingMeasure) {
                draggingMeasure.pos = new Position(
                    mousePos.x - draggingMeasure.html.clientWidth / 2,
                    mousePos.y - 20
                )
            }

            let selectedMeasure = this.getMeasurefromHookPos(mousePos)
            if (selectedMeasure) {
                MEASUREMENU_INNER.style.cursor = "pointer"
                return
            } else {
                MEASUREMENU_INNER.style.cursor = "initial"
            }
            let selectedTrigger = this.getTriggerfromHookPos(mousePos)
            if (selectedTrigger) {
                MEASUREMENU_INNER.style.cursor = "pointer"
                return
            } else {
                MEASUREMENU_INNER.style.cursor = "initial"
            }
        }.bind(this)

        MEASUREMENU_INNER.onclick = function(e) {
            let rect = MEASUREMENU_INNER.getBoundingClientRect()
            let mousePos = Position.fromMouseevent(e, rect)
            let selectedMeasure = this.getMeasurefromHookPos(mousePos)
            if (selectedMeasure && !CONNECTNG_STATUS.active) {
                if (selectedMeasure.trigger) {
                    selectedMeasure.trigger = null
                    this.updateHooks()
                    return
                }
                CONNECTNG_STATUS.active = true
                CONNECTNG_STATUS.measure = selectedMeasure
                return
            }
            if (selectedMeasure && CONNECTNG_STATUS.active
            && !CONNECTNG_STATUS.measure && CONNECTNG_STATUS.trigger) {
                selectedMeasure.trigger = CONNECTNG_STATUS.trigger
                CONNECTNG_STATUS.active = false
                CONNECTNG_STATUS.trigger = null
                CONNECTNG_STATUS.measure = null
                this.update()
                return
            }

            let selectedTrigger = this.getTriggerfromHookPos(mousePos)
            if (selectedTrigger && !CONNECTNG_STATUS.active) {
                CONNECTNG_STATUS.active = true
                CONNECTNG_STATUS.trigger = selectedTrigger
                return
            }
            if (selectedTrigger && CONNECTNG_STATUS.active
            && !CONNECTNG_STATUS.trigger && CONNECTNG_STATUS.measure) {
                CONNECTNG_STATUS.measure.trigger = selectedTrigger
                CONNECTNG_STATUS.active = false
                CONNECTNG_STATUS.trigger = null
                CONNECTNG_STATUS.measure = null
                this.update()
                return
            }
            CONNECTNG_STATUS.active = false
            CONNECTNG_STATUS.trigger = null
            CONNECTNG_STATUS.measure = null
            this.updateHooks()
        }.bind(this)
    }

    biasedRandomPosition(canvas, samples=10) {
        let bestDistance = 0
        let bestPosition = null
        for (let i = 0; i < samples; i++) {
            let position = Position.random(canvas)
            if (this.measures.length)
            position = new Position(
                position.x + this.measures[0].html.clientWidth / 2,
                position.y + this.measures[0].html.clientHeight / 2
            )
            let nearestDistance = Infinity
            for (let measure of this.measures) {
                let distance = position.pythogerianDistance(new Position(
                    measure.position.x + measure.html.clientWidth / 2,
                    measure.position.y + measure.html.clientHeight / 2
                ))
                if (distance < nearestDistance) {
                    nearestDistance = distance
                }
            }
            for (let trigger of this.triggers) {
                let distance = position.pythogerianDistance(new Position(
                    trigger.position.x + trigger.html.clientWidth / 2,
                    trigger.position.y + trigger.html.clientHeight / 2
                ))
                if (distance < nearestDistance) {
                    nearestDistance = distance
                }
            }
            if (nearestDistance > bestDistance) {
                bestDistance = nearestDistance
                bestPosition = position
            }
        }
        return bestPosition
    }

    addMeasure() {
        let measure = new Measure(this)
        measure.pos = this.biasedRandomPosition(this.canvas)
        this.measures.push(measure)
        this.update()
        return measure
    }

    removeMeasure(measure) {
        let index = this.measures.indexOf(measure)
        this.measures.splice(index, 1)
        this.update()
    }

    addTrigger() {
        let trigger = new Trigger(this)
        trigger.pos = this.biasedRandomPosition(this.canvas)
        this.triggers.push(trigger)
        this.update()
        return trigger
    }

    removeTrigger(trigger) {
        let index = this.triggers.indexOf(trigger)
        this.triggers.splice(index, 1)
        for (let measure of this.measures) {
            if (measure.trigger == trigger) {
                measure.trigger = null
            }
        }
        this.update()
    }

    updateHooks() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)
        drawMeasureMenuCanvasBackground()
        for (let measure of this.measures) {
            let hookPos = measure.hook
            this.context.beginPath()
            this.context.arc(hookPos.x, hookPos.y, 7, 0, 2 * Math.PI)
            this.context.strokeStyle = "black"
            this.context.stroke()
        }
        for (let trigger of this.triggers) {
            let hookPos = trigger.hook
            this.context.beginPath()
            this.context.arc(hookPos.x, hookPos.y, 7, 0, 2 * Math.PI)
            this.context.strokeStyle = "black"
            this.context.stroke()
        }
        for (let measure of this.measures) {
            if (measure.trigger) {
                let hookPos = measure.trigger.hook
                this.context.beginPath()
                this.context.moveTo(measure.hook.x, measure.hook.y)
                this.context.lineTo(hookPos.x, hookPos.y)
                this.context.strokeStyle = "black"
                this.context.stroke()
            }
        }
    }

    update() {
        MEASUREMENU_INNER.innerHTML = ""
        for (let measure of this.measures) {
            MEASUREMENU_INNER.appendChild(measure.html)
        }
        for (let trigger of this.triggers) {
            MEASUREMENU_INNER.appendChild(trigger.html)
        }
        this.updateHooks()
    }

}

let measureMenu = new MeasureMenu()
MEASUREMENU_ADD_TRIGGER_BUTTON.addEventListener("click", measureMenu.addTrigger.bind(measureMenu))
MEASUREMENU_ADD_MEASURE_BUTTON.addEventListener("click", measureMenu.addMeasure.bind(measureMenu))

drawMeasureMenuCanvasBackground()

document.body.onmouseup = function(e) {
    draggingMeasure = null
}
