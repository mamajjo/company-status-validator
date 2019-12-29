module.exports = {
    checkGivenArguments: (args) => {
        let numbersToValidate;
        let argsWithoutVariable = args._;
        let argWithAArgument = args.N;
        let correctedNIPs = [];
        let correctedBAs = [];
        let wrongNumbers = [];
        argsWithoutVariable.forEach(number => {
            number = number.replace(/-/g, '');
            number = number.replace(/\s/g, '');
            if (number.length == 10) {
                correctedNIPs.push(number);
            } else if (number.length == 26) {
                correctedBAs.push(number);
            }
            else wrongNumbers.push(number);
        });
        return {
            NIPs: correctedNIPs,
            BAs: correctedBAs,
            WrongNumbers: wrongNumbers
        };
    }
}