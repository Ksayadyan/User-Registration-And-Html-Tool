const cryptPassword = require('../../helpers/cryptPassword.js');
const folderCreator = require('../../helpers/UsersImageFolder.js')
const mongod = require("../../models/MongoDb/mongo.js")
const ClassUser = require('../../models/MongoDb/classUserDb.js')
const { db,Users }  = require('../../models/MySQL/MySQLDb.js')


const signup = async (req, res) => {
  try {
    const values = req.body;
    const password = cryptPassword(values.password);
    db.sync();
    //Creating user row in mysql database
    await Users.create({
      name: values.firstName,
      lastname: values.lastName,
      login: values.login,
      password: password,
      gender: values.gender,
      birthday: values.birthday,
      question: values.question,
      answer: values.answer,
      mail: values.email,
      phone: values.phone,

    })

    const sql = `SELECT id FROM users WHERE login = '${values.login}'`;
    //getting users id generated by mysql
    const user = await db.query(sql, {
      type: db.QueryTypes.SELECT,
    })
    folderCreator(user[0]['id']);
    //Creating mongodb user object and sending to database
    if (values.gender === 'male') {
      const obj = new ClassUser(`${user[0]['id']}`, '../defaultImages/male.jpg')
      await mongod.mongo(obj);
    } else {
      const obj = new ClassUser(`${user[0]['id']}`, '../defaultImages/female.jpg')
      await mongod.mongo(obj);
    }
    console.log("Succesfully registered");
    res.send("OK");
  } catch (e) {
    // console.log(`User with login "${values.login}" already exists`);
    console.log(e);
    res.send("Duplicate")
  }
}


const login = async (req, res) => {
  try {
    console.log('signin requrest');
      const post = req.body;
      const login = post.login;
      const password = cryptPassword(post.password);
      const sql = `SELECT * FROM users WHERE login='${login}' and password='${password}'`;
      const user = await db.query(sql, {
        type: db.QueryTypes.SELECT
      });
      //Generate user id
      if (user.length) {
        req.session.userId = user[0]['id'];
        console.log('User id is', user[0]['id']);
        res.redirect('/home');
      } else {
        console.log('User is not found');
        res.send({
          Access: "Denied",
        })
      }
  } catch (e) {
    //minimal handling
    console.log(e);
  }
}




//Signing out specific user
const signout = async (req, res) => {
  if (req.session.userId) {
    req.session.destroy();
    res.send('Logged out');
  } else {
    res.send('Not Authorized')
  }
}

//Saving fetched url in MongoDB

module.exports = {
  signup,
  login,
  signout,

}
