let {Router} = require('express');
let router = Router();
let ObjectID=require('mongodb').ObjectID;
let HttpError = require('error').HttpError;

/* GET home page. */
router.get('/',function (req,res,next) {res.render("index",{
  })
});

router.get('/', function(req, res, next) {
  res.render("index", { title: 'Express' });
});

let User =require('../models/users').User;

router.get('/users',function (req,res,next) {
  User.find({},function (err,users) {
    if(err) return next(err);
    res.json(users);
  });
});

router.get('/user/:id',function (req,res,next) {
  try {
    let id =new ObjectID(req.params.id);
  }catch (e) {
   return next(404);
  }
  
  User.findById(id,function (err,user) {
    if(err) return next(err);
    if (!user){
      next(404);
    }
    res.json(user);
  });
});

module.exports = router;
