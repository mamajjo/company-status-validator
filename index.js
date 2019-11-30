const apiService = require("./lib/apiService");
const questionService = require("./lib/inquirer");
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');


clear();
console.log(
    chalk.yellow(
        figlet.textSync('Nip validator', {horizontalLayout:'full'})
    )
);
apiService.getStatusByNIP(7282635947);
let number, numberType;
const runTypeQuestion = async () => {
    numberType = await questionService.askForDataToSearch();
};
const runNumberInput = async () => {
    number = await questionService.askForNumberToSearch(numberType);
};
runTypeQuestion();

