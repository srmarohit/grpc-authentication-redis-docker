// import npms modules
const bcrypt = require("bcrypt");

// import grpc and protoloader
const grpc = require("@grpc/grpc-js");
const proto_loader = require("@grpc/proto-loader");

//get packege definition 
const packageDef = proto_loader.loadSync("./protobuf/user.proto", {});

// create grpc object 
const grpcObj = grpc.loadPackageDefinition(packageDef);

// get package from proto 
const UserPackage = grpcObj.userPackage ;


// create the GRPC Server
const server = new grpc.Server();

// server binds with default ip/port with inSecure credentials(not applied any kind SSL/TLS certficates) 
server.bindAsync("0.0.0.0:40000", grpc.ServerCredentials.createInsecure(), ()=>{
    // start the server
    server.start();
    console.log("server started..")
});

// add service to the server
server.addService(UserPackage.User.service, {
    "registerUser" : registerUser,  // add registerUser method to RPC method registerUser
    "loginUser" : loginUser  // add registerUser method to RPC method registerUser
});

// create temporary users list
const users = [];

// define registerUser method
async function registerUser(call, callback){

    // hashing the password with bcrypt
    const hashPass = await bcrypt.hash(call.request.password, 10);

    // create New User
    const user = {
        "name" : call.request.name ,
        "email" : call.request.email ,
        "password" : hashPass
    }

    users.push(user);
    console.log(user)
    
    // execute callback defined by the client has two arg error | response
    callback(null, {"name" : user.name, "email" : user.email})

}

// define loginUser
 function loginUser(call, callback){

    const isMatched = async (user) => await bcrypt.compare(call.request.password, user.password) && user.email === call.request.email ;

    ( async () => {
        const shouldFilter = await Promise.all(users.map(isMatched));
        const filteredUsers = users.filter((user, index) => shouldFilter[index]);
            
        if(!filteredUsers.length){
            console.log("true exec")
            callback(null, {"name" : "not found", "email" : "not found"})
        }else{
            console.log("false exec")
            callback(null, {"name" : filteredUsers[0].name, "email" : filteredUsers[0].email})
        }
    })();
}

