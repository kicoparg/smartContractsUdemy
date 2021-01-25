pragma solidity ^0.4.24;


/*
Coleccion unica de usuarios con su cuenta de ethereum,
pudiendo elegir un nombre y un apellido
*/
contract UsersContract {

    struct User {
        string name;
        string surName;
    }

    mapping(address => User) private users;
    mapping(address => bool) private joinedUsers;//Usuarios que ya se registraron
    address[] total;

    function join(string name, string surName) public{
        /*
        funcion que ejecutaran los usuarios para registrarse
        */
        require(!userJoined(msg.sender));
        User storage user = users[msg.sender];//dirección que ejecuta la transaccion
        user.name = name;
        user.surName = surName;
        
        //grabo que esta direccion ya está almacenada
        joinedUsers[msg.sender] = true;
        total.push(msg.sender);
    }

    function getUser(address addr) public view returns (string, string){
        /*
        funcion que recupera los datos del usuario si existe
        */
        require(userJoined(msg.sender));
        User memory user = users[addr];
        return (user.name, user.surName);

    }

    function userJoined(address addr) private view returns(bool){
        return joinedUsers[addr];
    }

    function totalUsers() public view returns(uint){

        return total.length;
    }
}

