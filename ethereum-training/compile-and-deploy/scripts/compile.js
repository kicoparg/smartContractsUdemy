const path = require('path');
const fs = require('fs');
const solc = require('solc');//Es el compilador de Solidity qye ya estla en este paquete
const chalk = require('chalk');
/*
leemos el código fuente de nuestro contrato UserContract.sol que está un nivel más arriba y 
dentro de la carpeta contracts
*/

const contractPath = path.resolve(__dirname,'../contracts', 'UsersContract.sol');
const source = fs.readFileSync(contractPath,'utf8');

//console.log(source);

/*
compilaremos solo el smartcontract que nos interesa, pues en un archivo de smartcontracts
puede haber varios
*/
/*
const {interface, bytecode} = solc.compile(source,1).contracts[':UsersContract'];

console.log(chalk.green(bytecode));
console.log(chalk.cyan(interface));
*/

module.exports = solc.compile(source,1).contracts[':UsersContract'];

