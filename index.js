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
if (JSON.stringify(argv) !== JSON.stringify(nullArg)) {
    let checkedArguments = argumentCheckerService.checkGivenArguments(argv);
    checkedArguments.NIPs.forEach(numberToCheck => {
        let toCheck = parseInt(numberToCheck);
        apiService.getStatusByNIP(toCheck);
    });
    checkedArguments.BAs.forEach(numberToCheck => {
        apiService.getStatusByBA(numberToCheck);
    })
} else {
    return console.log("Podaj numery do sprawdzenia jako argumenty do programu")
}
