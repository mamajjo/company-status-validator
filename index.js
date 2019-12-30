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
var paragraph = document.getElementById("p");
inputBoxHolder.appendChild(inputBoxElement);
inputBoxElement.setAttribute("type", "text");
inputBoxElement.setAttribute("placeholder", "wprowadź liczby po spacji");
submitButtonHolder.appendChild(submitButtonElement);
submitButtonElement.setAttribute("class", "button");
submitButtonElement.addEventListener('click', function(click, numbersToCheck = inputBoxElement.textContent){
    console.log(inputBoxElement.textContent);
    if (!JSON.stringify(numbersToCheck)) {
        let checkedArguments = argumentCheckerService.checkGivenArguments(numbersToCheck);
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
verifyTaxStatus: numbersToCheck => {
    
}