const inquirer = require('inquirer');
module.exports = {
    askForDataToSearch: () => {
        const questions = [
            {
                name: 'type',
                type: 'checkbox',
                message:"Wybierz jaki numer wprowadzisz (NIP/#konta bankowego)",
                choices: [
                    new inquirer.Separator('ELOWA'),
                    {
                        name: "NIP"
                    },
                    {
                        name: "# konta bankowego"
                    }
                ],
                validate: function(anwser){
                    if(anwser.length < 1 || anwser.length >= 2){
                        return "Musisz zaznaczyć jedną odpowiedź"
                    }
                    return true;;
                }
                
            }
        ]
        return inquirer.prompt(questions);
    },
    askForNumberToSearch: (type) => {
        const questions = [ 
            {
                name: 'number',
                type: 'input',
                message: function() {
                    if (type == "NIP") {
                        return "podaj numer nip"
                    } else {
                        return "podaj numer konta bankowego"
                    }
                },
                validate: function(value) {
                    var pass = value.match(/^\d+$/);
                    if(pass){
                        return true;
                    }
                    return "Podaj numer bez spacji"
                }
            }
        ]
        return inquirer.prompt(questions);
    }
}