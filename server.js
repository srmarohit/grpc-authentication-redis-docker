// import environment module
require('dotenv/config');

//Mongo DB Configuration
require("./db/mongodb");

// request service controller
const userController = require("./controller/userController")

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
    "registerUser" : userController().register,  // add registerUser method to RPC method registerUser
    "loginUser" : userController().login  // add registerUser method to RPC method registerUser
});





