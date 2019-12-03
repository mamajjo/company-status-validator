module.exports = {
    checkGivenArguments: (args) => {
        let numbersToValidate;
        let argsWithoutVariable = args._;
        let argWithAArgument = args.N;
        let correctedNumbers = [];
        argsWithoutVariable.forEach(number => {
            number = number.replace(/-/g, '');
            correctedNumbers.push(number);
            console.log(number);
        });
        return correctedNumbers;
    }
}