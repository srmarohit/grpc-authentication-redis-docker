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
     
      const user = await User.login(call.request.email, call.request.password);

      console.log(user);

      if (!user) {
        return callback(null, { name: "not found", email: "not found" });
      }

      callback(null, { name: user.name, email: user.email });
    },
  };
};
