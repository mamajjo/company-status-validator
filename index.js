const apiService = require("./lib/apiService");
const argumentCheckerService = require("./lib/argumentCheckerService");
const questionService = require("./lib/inquirer");
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const nullArg = {
    _: []
};
var argv = require('minimist')(process.argv.slice(2), {
    string: ['_']
});

clear();
console.log(
    chalk.yellow(
        figlet.textSync('Nip validator', {
            horizontalLayout: 'full'
        })
    )
);
let inputBoxHolder = document.getElementById("input-box");
let inputBoxElement = document.createElement("INPUT");
let submitButtonHolder = document.getElementById("button-cell");
let submitButtonElement = document.createElement("button");
let unsuccesfulValidationNumbersHolder = document.getElementById("wrong-number-section")
let unsuccesfulValidationNumbersElement = document.createTextNode("Podane numery nie są prawidłowe: ");
var paragraph = document.getElementById("p");
inputBoxHolder.appendChild(inputBoxElement);
inputBoxElement.setAttribute("type", "text");
inputBoxElement.setAttribute("id", "vat-credential");
inputBoxElement.setAttribute("placeholder", "wprowadź liczby po spacji");
submitButtonHolder.appendChild(submitButtonElement);
submitButtonElement.setAttribute("class", "button");
submitButtonElement.addEventListener('click', function(click, inputString = inputBoxElement.value){
    let numbersToCheck = inputString.split(" ");
    console.log(numbersToCheck);
    if (JSON.stringify(numbersToCheck)) {
        let checkedArguments = argumentCheckerService.checkGivenArguments(numbersToCheck);
        unsuccesfulValidationNumbersElement.nodeValue += checkedArguments.NoValidationPass.join(", ").toString();
        unsuccesfulValidationNumbersHolder.appendChild(unsuccesfulValidationNumbersElement);
        checkedArguments.NIPs.forEach(numberToCheck => {
            let toCheck = parseInt(numberToCheck);
            let response = apiService.getStatusByNIP(toCheck);
            response.then(mes => {
                paragraph.textContent += JSON.stringify(mes);
            })
        });
        checkedArguments.BAs.forEach(numberToCheck => {
            let response = apiService.getStatusByBA(numberToCheck);
            response.then(mes => {
                paragraph.textContent += JSON.stringify(mes);
            })
        })
        checkedArguments.WrongNumbers.forEach(wrongNumber => {
            paragraph.textContent += "nieprawidłowy numer" + wrongNumber
        })
    } else {
        paragraph.textContent +="Podaj numery do sprawdzenia jako argumenty do programu";
    }
});
function populateAnwserTable(table, rows, columns, jsonMessage) {
    if (!table) document.createElement('table');
    for (let i = 0; i < rows; i++) {
        var row = document.createElement('tr');
        for (let j = 0; j < columns; j++) {
            row.appendChild(document.createElement('td'));
            row.cells[j].appendChild(document.createTextNode(jsonMessage[j]))
        }
    }
}