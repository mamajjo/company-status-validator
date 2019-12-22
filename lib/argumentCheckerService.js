module.exports = {
    checkGivenArguments: (args) => {
        let numbersToValidate;
        let argsWithoutVariable = args._;
        let argWithAArgument = args.N;
        let correctedNIPs = [];
        let correctedBAs = [];
        argsWithoutVariable.forEach(number => {
            number = number.replace(/-/g, '');
            number = number.replace(/\s/g, '');
            if (number.length <= 11) {
                correctedNIPs.push(number);
            } else if (number.length > 11) {
                correctedBAs.push(number);
            }
        });
        return {
            NIPs: correctedNIPs,
            BAs: correctedBAs
        };
    }
}