# Company Validator How To

This app is created to help validating if company's VAT tax status

## Installing

To run the app you need to install node.js environment on your local computer
https://nodejs.org/en/

## Using

To start simply type node index.js [place here NIP or bank account number] [next number] (..)

## Allowed number formats
### NIP
You can type number in following format:
* xxx-xxx-xx-xx
* xxxxxxxxxx
* "xxxxxxxxxx"
* "xxx-xxx-xx-xx"
### Bank Account
* "xxxxxxxxxxxxxxxxxxxxxxxxxx"
* "xx xxxx xxxx xxxx xxxx xxxx xxxx"
* "xxxxxxxxxxxxxxxxxxxxxxxxxx"

## History
Your searchings will be saved to history.log file. If it doesn't exist, program will create it in program directory

## Issues

One of common issue might be a faulty npm install procedure. To fix it install https://github.com/imkimchi/ni
```
npm i -g better-npm-install
```
And then in root folder type with index.js
```
ni
```