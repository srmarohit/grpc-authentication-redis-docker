
/** mongoose db connection */

const mongoose = require('mongoose');

 module.exports = mongoose.connect(
    process.env.MONGO_DB_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
      if (!err) {
        console.log("connected");
      }else{
          console.log("problem in MongoDB Connection")
      }
    }
  );

  