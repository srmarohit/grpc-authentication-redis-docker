// import npms modules
const bcrypt = require("bcrypt");

// import User model
const User = require("../model/user");

module.exports = function userController() {
  return {
    register: async (call, callback) => {
      // define registerUser method

      // hashing the password with bcrypt
      const hashPass = await bcrypt.hash(call.request.password, 10);

      // create New User
      const user = new User({
        name: call.request.name,
        email: call.request.email,
        password: hashPass,
      });

      try {
        await user.save();
      } catch (e) {
        console.log("error in save : ", e);
        return callback(null, {
          name: "Error to save",
          email: "Error to save",
        });
      }

      //users.push(user);
      console.log(user);

      // execute callback defined by the client has two arg error | response
      callback(null, { name: user.name, email: user.email });
    },

    // define loginUser
    login: async (call, callback) => {
      // const isMatched = async (user) => await bcrypt.compare(call.request.password, user.password) && user.email === call.request.email ;

      // ( async () => {
      //     const shouldFilter = await Promise.all(users.map(isMatched));
      //     const filteredUsers = users.filter((user, index) => shouldFilter[index]);

      //     if(!filteredUsers.length){
      //         console.log("true exec")
      //         callback(null, {"name" : "not found", "email" : "not found"})
      //     }else{
      //         console.log("false exec")
      //         callback(null, {"name" : filteredUsers[0].name, "email" : filteredUsers[0].email})
      //     }
      // })();

      const user = await User.login(call.request.email, call.request.password);

      console.log(user);

      if (!user) {
        return callback(null, { name: "not found", email: "not found" });
      }

      callback(null, { name: user.name, email: user.email });
    },
  };
};
