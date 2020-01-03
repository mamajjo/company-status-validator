const apiService = require("./lib/apiService");
const argumentCheckerService = require("./lib/argumentCheckerService");
const clear = require('clear');
const Tabulator = require('tabulator-tables');
const nullArg = {
    _: []
};
var argv = require('minimist')(process.argv.slice(2), {
    string: ['_']
});

clear();
let checkedArguments;
let resultData = [];
let inputBoxHolder = document.getElementById("input-box");
let inputBoxElement = document.createElement("INPUT");
let submitButtonHolder = document.getElementById("button-cell");
let submitButtonElement = document.createElement("button");
let unsuccesfulValidationNumbersHolder = document.getElementById("wrong-number-section")
let unsuccesfulValidationNumbersElement = document.createTextNode("");
var paragraph = document.getElementById("p");
inputBoxHolder.appendChild(inputBoxElement);
inputBoxElement.setAttribute("type", "text");
inputBoxElement.setAttribute("id", "vat-credential");
inputBoxElement.setAttribute("placeholder", "wprowadź liczby po spacji");
submitButtonHolder.appendChild(submitButtonElement);
submitButtonElement.setAttribute("class", "button");
submitButtonElement.textContent = "Sprawdź numery!";
let resultTable = new Tabulator("#result-table", {
    height:"200px",
    layout:"fitColumns",
    data: resultData,
    reactiveData: true,
    columns:[
        {title:"Nazwa", field:"name", width:300, widthGrow: 3},
        {title:"NIP", field:"nip", align:"right", width:88, minWidth:88},
        {title:"Numer Konta Bankowego", field:"ba", align:"right", width:208, minWidth:208},
        {title:"Adres siedziby", field:"address", align:"right", width:300, widthGrow: 3},
        {title:"Status", field:"statusVat", align:"center", width:80},
    ]
});
submitButtonElement.addEventListener('click', function(click, inputString = inputBoxElement.value){
    paragraph.textContent = "";
    let numbersToCheck = inputString.split(/\s+(?=([^"]*"[^"]*")*[^"]*$)|,/).join("").split("\"");
    console.log(numbersToCheck);
    // 
    if (JSON.stringify(numbersToCheck)) {
        checkedArguments = argumentCheckerService.checkGivenArguments(numbersToCheck);
        unsuccesfulValidationNumbersElement.nodeValue = ("");
        if (checkedArguments.NoValidationPass.length > 0){
            unsuccesfulValidationNumbersElement.nodeValue += ("Podane numery nie są prawidłowe: ");
            unsuccesfulValidationNumbersElement.nodeValue += checkedArguments.NoValidationPass.join(", ").toString();
            unsuccesfulValidationNumbersHolder.appendChild(unsuccesfulValidationNumbersElement);
        }
        checkedArguments.NIPs.forEach(numberToCheck => {
            let toCheck = parseInt(numberToCheck);
            let response = apiService.getStatusByNIP(toCheck);
            response.then(mes => {
                resultData.push({name: mes.name, nip: mes.nipID, ba:mes.baID, address: mes.address, statusVat: mes.statusVat})
            })
        });
        checkedArguments.BAs.forEach(numberToCheck => {
            let response = apiService.getStatusByBA(numberToCheck);
            response.then(mes => {
                resultData.push({name: mes.name, nip: mes.nipID, ba:mes.baID, address: mes.address, statusVat: mes.statusVat});
            })
        })
        checkedArguments.WrongNumbers.forEach(wrongNumber => {
            paragraph.textContent += "Nieprawidłowy numer" + wrongNumber
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