const apiService = require("./lib/apiService");
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
