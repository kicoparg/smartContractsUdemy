const assert = require('assert');
const AssertionErro = require('assert').AssertionError;
const Web3 = require('web3');//lo ponemos en mayuscula porque es un constructor y necesitamos una instancia

const provider = new Web3.providers.HttpProvider("HTTP://127.0.0.1:7545");
const web3 = new Web3(provider);

const {interface, bytecode} = require('../scripts/compile');

let accounts;
let usersContract;

beforeEach(async() => {
    accounts = await web3.eth.getAccounts();
    usersContract = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({ data: bytecode})
        .send({ from: accounts[0], gas: '1000000'});
});

describe('The UsersContract' , async() =>{
    it('should deploy', () => {
        console.log(usersContract.options.address);
        assert.ok(usersContract.options.address);
    });

    it('should join a user', async() => {
        let name = 'Francisco';
        let surName = 'Vendola';

        await usersContract.methods.join(name, surName)//metodo creado por mi
            .send({from: accounts[0], gas: '500000'});
    });


    it('should retrive a user', async() =>{
        let name = 'Francisco';
        let surName = 'Vendola';

        await usersContract.methods.join(name, surName)//metodo creado por mi
            .send({from: accounts[0], gas: '500000'});

        let user = await usersContract.methods.getUser(accounts[0]).call();

        assert.equal(name, user[0]);
        assert.equal(surName,user[1]);
    });


    it('should not allow joinig an account twice', async() =>{

        await usersContract.methods.join('Pedro', 'Lopez')
            .send({from: accounts[1], gas: '500000'});

        try{
            await usersContract.methods.join('Ana', 'Gomez')
            .send({from: accounts[1], gas: '500000'});
            assert.fail('same accoun cant join twice');
        }
        catch(e){
            if(e instanceof AssertionErro){
                assert.fail(e.message);
            }

        }

    });

    it('shuld not allow retrive a non user registered', async() =>{
        try{
            await usersContract.methods.getUser(accounts[0]).call();
            assert.fail('retrive an unsuscribe address');
        }
        catch(e){
            if(e instanceof AssertionErro){
                assert.fail(e.message);
            }
        }

    });

    it('should retrive total users', async() =>{
        await usersContract.methods.join('Pedro', 'Lopez')
        .send({from: accounts[0], gas: '500000'});

        await usersContract.methods.join('juan', 'Valdez')
        .send({from: accounts[1], gas: '500000'});

        let cant = await usersContract.methods.totalUsers().call();

        assert.equal(cant,2);
    });

});
