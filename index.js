const apiService = require("./lib/apiService");
const argumentCheckerService = require("./lib/argumentCheckerService");
const questionService = require("./lib/inquirer");
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const nullArg = { _: [] };
let number, numberType;
var argv = require('minimist')(process.argv.slice(2), {
    string: ['_']
});


clear();
console.log(argv);
console.log(
    chalk.yellow(
        figlet.textSync('Nip validator', { horizontalLayout: 'full' })
    )
);
console.log(argv, nullArg);
if (JSON.stringify(argv) !== JSON.stringify(nullArg)) {
    let checkedArguments = argumentCheckerService.checkGivenArguments(argv);
    checkedArguments.NIPs.forEach(numberToCheck => {
        let toCheck = parseInt(numberToCheck);
        apiService.getStatusByNIP(toCheck);
    });
    console.log(checkedArguments);
} else {
    const loadData = () => new Promise((resolve, reject) => {
        numberType = questionService.askForDataToSearch();
        if (numberType !== null) {
            console.log("juz po");
            resolve();
        }
        else console.log("nie zadziała cos");
    })
    loadData().then(result => {
        number = questionService.askForNumberToSearch();
    })
}
// const runTypeQuestion = async () => {
//     numberType = await questionService.askForDataToSearch();
// };
// const runNumberInput = async () => {
//     number = await questionService.askForNumberToSearch(numberType);
// };
// runTypeQuestion();

