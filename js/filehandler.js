function downloadFile(fileName, content) {
    let element = document.createElement('a')
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(content))
    element.setAttribute('download', fileName)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
}

function getCurrentJSONState() {
    return {
        statistics: {
            infectionsPerDay: infectionsPerDay,
            infectedPerDay: infectedPerDay,
            alivePerDay: alivePerDay,
            immunePerDay: immunePerDay,
            rValuePerDay: rValuePerDay
        },  
        clock: CLOCK.timeStamp,
        vaccinated: countVaccinated(getAllPlayers()),
        vaccinationPercentage: VACCINATION_PERCENTAGE,
        config: getConfigJSON(),
        environments: {
            total: ENVIRONMENTS.length,
            houses: countEnvironmentType(ENVIRONMENT_TYPE.HOUSE),
            schools: countEnvironmentType(ENVIRONMENT_TYPE.SCHOOL),
            workplaces: countEnvironmentType(ENVIRONMENT_TYPE.WORKPLACE),
            citys: countEnvironmentType(ENVIRONMENT_TYPE.CITY)
        },
        measures: measureMenu.toJSON()
    }
}
