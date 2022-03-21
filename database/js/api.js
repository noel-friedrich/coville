class Simulation {
    constructor(jsonData) {
        this.id = jsonData.id
        this.title = jsonData.title
        this.uploadDate = jsonData.uploaded_at
        this.dataVersion = jsonData.data_version
        let rawData = JSON.parse(jsonData.data)
        this.statistics = rawData.statistics
        this.environments = rawData.environments
        this.clock = new Clock()
        this.clock.timeStamp = rawData.clock
        this.config = rawData.config
        this.html = Object()
        this.canvas = null
        this.context = null
        this.vaccinationPercentage = rawData.vaccinationPercentage
        this.vaccinationCount = rawData.vaccinated
        this.measures = rawData.measures
    }

    addToDOM(parent) {
        this.html.container = document.createElement("div")
        this.html.container.classList.add("simulation-overview-container")
        this.canvas = document.createElement("canvas")
        this.canvas.width = parent.clientWidth * 0.8
        this.canvas.height = this.canvas.width * 0.6
        this.context = this.canvas.getContext("2d")
        this.html.title = document.createElement("h3")
        this.html.title.textContent = this.title
        this.html.canvasOverlay = document.createElement("div")
        this.html.canvasOverlay.classList.add("canvas-overlay")
        this.html.container.appendChild(this.html.title)
        this.html.container.appendChild(this.canvas)
        this.html.container.appendChild(this.html.canvasOverlay)
        parent.appendChild(this.html.container)

        this.canvas.plot(this.statistics.infectedPerDay)
        this.html.container.addEventListener("click", function() {
            if (SELECTED_SIMULATION == this) return
            LOADING_OVERLAY.style.display = "block"
            setTimeout(function() {
                this.load()
                LOADING_OVERLAY.style.display = "none"
            }.bind(this), 300)
        }.bind(this))
    }

    load() {
        document.querySelectorAll(".selected").forEach(e => e.classList.remove("selected"))
        this.html.container.classList.add("selected")
        this.loadTable()
        this.loadDataTable()
        this.loadParameterTable()
        this.loadMeasures()
        SELECTED_SIMULATION = this
        PLEASE_CHOOSE_ENVIRONMENT.style.display = "none"
        MAIN_CANVAS.plot(this.statistics.infectionsPerDay, "Tage", "Infektionen")
    }

    loadTable() {
        TIME_COUNT.textContent = this.clock.toString()
        INHABITANT_COUNT.textContent = this.statistics.alivePerDay.slice(-1)[0]
        INFECTED_COUNT.textContent = this.statistics.infectedPerDay.slice(-1)[0]
        VACCINATED_COUNT.textContent = this.vaccinationCount
        IMMUNE_COUNT.textContent = this.statistics.immunePerDay.slice(-1)[0]
        let aliveAtStart = this.statistics.alivePerDay[0]
        let aliveAtEnd = this.statistics.alivePerDay.slice(-1)[0]
        DEATH_COUNT.textContent = aliveAtStart - aliveAtEnd
        R_VALUE_COUNT.textContent = this.statistics.rValuePerDay.slice(-1)[0]
        let infestation = (this.statistics.infectedPerDay.slice(-1)[0] + this.statistics.immunePerDay.slice(-1)[0]) / aliveAtEnd * 100
        INFESTATION_COUNT.textContent = infestation.toFixed(2) + "%"
        ENVIRONMENT_COUNT.textContent = this.environments.total
        HOUSE_COUNT.textContent = this.environments.houses
        WORKPLACE_COUNT.textContent = this.environments.workplaces
        SCHOOL_COUNT.textContent = this.environments.schools
    }

    get dataTableData() {
        let alivePrevDay = this.statistics.alivePerDay[0]
        let data = Array()
        for (let i = 0; i < this.statistics.alivePerDay.length; i++) {
            let alive = this.statistics.alivePerDay[i]
            let infected = this.statistics.infectedPerDay[i]
            let immune = this.statistics.immunePerDay[i]
            let rValue = this.statistics.rValuePerDay[i]
            let deaths = alivePrevDay - alive
            alivePrevDay = alive
            let infestation = (infected + immune) / alive * 100
            data.push([i + 1, alive, infected, immune, deaths, infestation, rValue])
        }
        return {
            alivePerDay: data.map(e => e[1]),
            infectedPerDay: data.map(e => e[2]),
            immunePerDay: data.map(e => e[3]),
            deathsPerDay: data.map(e => e[4]),
            infestationsPerDay: data.map(e => e[5]),
            rValuePerDay: data.map(e => e[6])
        }
    }

    loadMeasures() {
        document.querySelectorAll(".tempMeasure").forEach(e => e.remove())
        if (!this.measures) {
            let p = document.createElement("p")
            p.classList.add("tempMeasure")
            p.textContent = "Keine Maßnahmen"
            CONTROL_BAR.insertBefore(p, PARAMETER_HEADER)
            return
        }
        let list = document.createElement("ul")
        list.classList.add("tempMeasure")
        CONTROL_BAR.insertBefore(list, PARAMETER_HEADER)
        this.measures.forEach(m => {
            let li = document.createElement("li")
            li.textContent = `${m.name}: ${m.description} ${m.value ? (m.value) : ""}`
            list.appendChild(li)
            let ul = document.createElement("ul")
            list.appendChild(ul)
            let li2 = document.createElement("li")
            let t = m.trigger
            li2.textContent = `${t.description} ${t.value ? (t.value) : ""}`
            ul.appendChild(li2)
        })
    }

    loadDataTable() {
        this.dataTableRows = Array()
        DATA_TABLE_BODY.innerHTML = ""
        function addTD(tr, text) {
            let td = document.createElement("td")
            td.textContent = text
            tr.appendChild(td)
        }
        let alivePrevDay = this.statistics.alivePerDay[0]
        for (let i = 0; i < this.statistics.alivePerDay.length; i++) {
            let tr = document.createElement("tr")
            addTD(tr, i + 1)
            addTD(tr, this.statistics.alivePerDay[i])
            addTD(tr, this.statistics.infectedPerDay[i])
            addTD(tr, this.statistics.immunePerDay[i])
            addTD(tr, alivePrevDay - this.statistics.alivePerDay[i])
            alivePrevDay = this.statistics.alivePerDay[i]
            let infestation = (this.statistics.infectedPerDay[i] + this.statistics.immunePerDay[i]) / this.statistics.alivePerDay[i] * 100
            addTD(tr, infestation.toFixed(2))
            addTD(tr, this.statistics.rValuePerDay[i])
            DATA_TABLE_BODY.appendChild(tr)
            this.dataTableRows.push(tr)
        }
    }

    loadParameterTable() {
        let tableValDict = {
            FRIENDS_PER_PLAYER: CONFIG_FRIENDS_PER_PLAYER,
            IMMUNETICKS: CONFIG_IMMUNETICKS,
            INFECTION_RADIUS: CONFIG_INFECTION_RADIUS,
            INFECTION_CHANCE: CONFIG_INFECTION_CHANCE,
            LETHALITY_RATE: CONFIG_LETHALITY_RATE,
            INCUBATIONTICKS: CONFIG_INCUBATIONTICKS,
            QUARANTINE_TICKS: CONFIG_QUARANTINE_TICKS,
            STAYHOME_PROBABILITY: CONFIG_STAYHOME_PROBABILITY,
            TEST_CHANCE: CONFIG_TEST_CHANCE,
            TEST_FALSE_POSITIVE_CHANCE: CONFIG_TEST_FALSE_POSITIVE_CHANCE,
            TEST_FALSE_NEGATIVE_CHANCE: CONFIG_TEST_FALSE_NEGATIVE_CHANCE,
            VACCINATION_INFECTION_LENGTH_FACTOR: CONFIG_VACCINATION_INFECTION_LENGTH_FACTOR,
            VACCINATION_INFECTION_CHANCE_FACTOR: CONFIG_VACCINATION_INFECTION_CHANCE_FACTOR,
            VACCINATION_LETHALITY_FACTOR: CONFIG_VACCINATION_LETHALITY_FACTOR,
            VISIT_CHANCE: CONFIG_VISIT_CHANCE,
        }
        if (this.config["REINFECTION_TIME"])
            tableValDict["REINFECTION_TIME"] = CONFIG_REINFECTION_TIME
        for (let config of Object.keys(tableValDict)) {
            tableValDict[config].textContent = this.config[config]
        }
    }

    toJSON() {
        return JSON.stringify(this.dataTableData)
    }

    toCSV(sep=";", lineSep="\n") {
        let alivePrevDay = this.statistics.alivePerDay[0]
        let outString = `Tage${sep}Einwohner${sep}Infizierte${sep}Genesen${sep}Gestorben${sep}Durchseuchung${sep}R-Wert (14d)${lineSep}`
        for (let i = 0; i < this.statistics.alivePerDay.length; i++) {
            outString += `${i+1}${sep}`
            outString += `${this.statistics.alivePerDay[i]}${sep}`
            outString += `${this.statistics.infectedPerDay[i]}${sep}`
            outString += `${this.statistics.immunePerDay[i]}${sep}`
            outString += `${alivePrevDay - this.statistics.alivePerDay[i]}${sep}`
            alivePrevDay = this.statistics.alivePerDay[i]
            let infestation = (this.statistics.infectedPerDay[i] + this.statistics.immunePerDay[i]) / this.statistics.alivePerDay[i] * 100
            outString += `${infestation.toFixed(2)}${sep}`
            outString += `${this.statistics.rValuePerDay[i]}${lineSep}`
        }
        return outString
    }
}

async function getSimulations() {
    let apiUrl = "https://www.noel-friedrich.de/coville/api/get-uploads.php"
    let response = await fetch(apiUrl)
    return (await response.json()).map(json => new Simulation(json))
}
