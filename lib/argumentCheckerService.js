module.exports = {
    checkGivenArguments: (args) => {
        let numbersToValidate;
        let argsWithoutVariable = args._;
        let argWithAArgument = args.N;
        let correctedNIPs = [];
        let correctedBAs = [];
        argsWithoutVariable.forEach(number => {
            number = number.replace(/-/g, '');
            if(number.length >= 9 && number.length <= 11 ){
                correctedNIPs.push(number);
            } else if ( number.length == 26) {
                correctedBAs.push(number); 
            }
            console.log(number);
        });
        return {
            NIPs: correctedNIPs,
            BAs: correctedBAs
        };
    }
}