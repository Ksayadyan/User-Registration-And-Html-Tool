const cryptPassword = require('./cryptPassword.js');
const fs = require("fs")
const mongod = require("./mongo.js")
const ClassUser = require('./classUserDb.js')

module.exports.signup = async (req, res) => {
  let value = req.body;
  let password = cryptPassword(value.password);
  try {
    db.sync()
    await Users.create({
      name: value.firstName,
      lastname: value.lastName,
      login: value.login,
      password: password,
      gender: value.gender,
      birthday: value.birthday,
      question: value.question,
      answer: value.answer,
      mail: value.email,
      phone: value.telephone,
    })
    res.send("OK");
    let sql = `SELECT id FROM users WHERE login = '${value.login}'`
    let user = await db.query(sql, {
      type: db.QueryTypes.SELECT,
    })
    fs.mkdir(`./user-images/Client${user[0]['id']}/`, (err) => {
      if (err) throw err;
      console.log("Folder created");
    })

    console.log(user, 'this is mongodb id');
    if(value.gender === 'male'){
      let obj = new ClassUser(`${user[0]['id']}`,'../defaultImages/male.jpg')
      await mongod.mongo(obj);
    }else{
      let obj = new ClassUser(`${user[0]['id']}`,'../defaultImages/female.jpg')
      await mongod.mongo(obj);
    }

    console.log("Succesfully registered")
  } catch (e) {
    console.log(`User with login "${value.login}" already exists`);
    res.send("Duplicate")
  }
}
module.exports.login = async (req, res) => {
  try {
    console.log('signin requrest');
    let message = '';
    if (req.method === 'POST') {
      let post = req.body;
      let login = post.login;
      console.log(post, 'this is post');
      console.log(login, 'this is login');
      console.log(post.password, 'this is password');
      let password = cryptPassword(post.password);
      let sql = `SELECT * FROM users WHERE login='${login}' and password='${password}'`;
      let user = await db.query(sql, {
        type: db.QueryTypes.SELECT
      });
      //console.log(user,'this is user');
      if (user.length) {
        req.session.userId = user[0]['id'];
        console.log('User id is', user[0]['id']);
        res.redirect('/home');
      } else {
        console.log('User is not found');
      }
    }
  } catch (e) {
    console.log(e);
  }
}

module.exports.profile = async (req, res) => {
  try {
    let userId = req.session.userId;
    if (userId == null) {
      res.redirect('/login');
      return;
    }
    let sql = `SELECT * FROM users WHERE id='${userId}'`;
    let user = await db.query(sql, {
      type: db.QueryTypes.SELECT
    });
    console.log(user, 'User found');
    let obj = {
      name: user[0]['name'],
      lastname: user[0]['lastname']
    }
    mongod.findAndSendUserInfo(userId,res,obj)
  } catch (e) {
    console.log('Error while redirecting');
  }
}

module.exports.imageUpload = (req,res) => {
  if(!req.session.userId){
    console.log('Not authentificated');
    res.send('Not authentificated');
  }else{
    if(!req.files){
      console.log('No files uploaded');
      res.send('No files');
    }else{
      let image = req.files.image;
      console.log(req.files.image.name,' this is file name');
      console.log(`./user-images/Client${req.userId}/${req.files.image.name}`, 'log for right place');
      image.mv(`./user-images/Client${req.session.userId}/${req.files.image.name}`,(err)=>{
        if(err){
           res.send('Internal error')
           return;
        }
        res.send('File uploaded')
      })
    }
  }

}
