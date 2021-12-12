// import grpc and protoloader
const grpc = require("@grpc/grpc-js");
const proto_loader = require("@grpc/proto-loader");

// get package definition
const packageDef = proto_loader.loadSync("./protobuf/user.proto", {}) ;

// create grpc object
const grpcObj = grpc.loadPackageDefinition(packageDef);

// get package from proto
const UserPackage = grpcObj.userPackage ;

// create client
const client = new UserPackage.User("localhost:40000", grpc.credentials.createInsecure());

// execute User service method registerUser
client.registerUser({
    "name" : "Rohit Sharma",
    "email" : "admin@gmail.com",
    "password" : "admin123"
}, (err, response) => {
    if(err){
        return console.log("err : ",err)
    }

    // print response
    console.log(response);
});