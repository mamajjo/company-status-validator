const numericalWeightsArray = [6,5,7,2,3,4,5,6,7];
const numericalPLNumber = "2521";
function nipValidation(nip) {
    let nipToValidate = nip.toString().split("");
    let controlSum = 0;
    for (let index = 0; index < nipToValidate.length - 1; index++) {
        const number = nipToValidate[index];
        controlSum += number * numericalWeightsArray[index];
    }
    if (controlSum % 11 == nipToValidate[nipToValidate.length-1]) {
        return true;
    }
    else return false;
}

function bankAccountNumberValidation(ba) {
    let numberToValidate = ba + numericalPLNumber;
    numberToValidate = numberToValidate.split("");
    numberToValidate.push(numberToValidate.shift());
    numberToValidate.push(numberToValidate.shift());
    numberToValidate.join();
    numberToValidate = numberToValidate.toString()
    numberToValidate = numberToValidate.replace(/,/g, '');
    const preformatedNumber = BigInt(numberToValidate);
    let controlSum = preformatedNumber % 97n; 
    if (controlSum == 1n) {
        return true;
    }
    else return false;
}

module.exports = {
    checkGivenArguments: (args) => {
        let numberToValidate;
        let argsWithoutVariable = args;
        let argWithAArgument = args.N;
        let correctedNIPs = [];
        let correctedBAs = [];
        let wrongNumbers = [];
        argsWithoutVariable.forEach(number => {
            number = number.replace(/-/g, '');
            number = number.replace(/\s/g, '');
            if (number.length == 10 ) {
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