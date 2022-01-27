var express = require('express');
const req = require('express/lib/request');
var router = express.Router();

var userModel = require('../models/users')
var journeyModel = require('../models/journey');


// Get Search Page
router.get('/homepage', function (req, res, next) {
  console.log("---homepage page")

  res.render('search')
})

router.post('/search', async function (req, res, next) {
  console.log("---search route")
  // console.log(req.body)

  var from = req.body.fromFromFront;
  var to = req.body.toFromFront;
  var date = req.body.dateFromFront;
  console.log("---from / to / date:", from, to, date)

  // En cours
  // await UserModel.findOne( { lastname: "doe" } );

  res.render('search')
})



// const mongoose = require('mongoose');

// // useNewUrlParser ;)
// var options = {
//   connectTimeoutMS: 5000,
//   useNewUrlParser: true,
//   useUnifiedTopology: true
//  };

// // --------------------- BDD -----------------------------------------------------
// mongoose.connect('mongodb+srv://mathieu:orszulak@cluster0.lmgzj.mongodb.net/ticketac?retryWrites=true&w=majority',
//    options,
//    function(err) {
//     if (err) {
//       console.log(`error, failed to connect to the database because --> ${err}`);
//     } else {
//       console.info('*** Database Ticketac connection : Success ***');
//     }
//    }
// );

// var journeySchema = mongoose.Schema({
//   departure: String,
//   arrival: String,
//   date: Date,
//   departureTime: String,
//   price: Number,
// });

// var journeyModel = mongoose.model('journey', journeySchema);

// var city = ["Paris","Marseille","Nantes","Lyon","Rennes","Melun","Bordeaux","Lille"]
// var date = ["2018-11-20","2018-11-21","2018-11-22","2018-11-23","2018-11-24"]



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login');
});



// Post sign-up
router.post('/sign-up', async function(req,res,next){

  var searchUser = await userModel.findOne({
    email: req.body.emailFromFront
  })
  
  console.log('searchUser', searchUser);

  if(!searchUser){
    var newUser = new userModel({
      name: req.body.nameFromFront,
      firstname: req.body.firstnameFromFront,
      email: req.body.emailFromFront,
      password: req.body.passwordFromFront,
    })
  
    var newUserSave = await newUser.save();

    console.log('newUserSave', newUserSave);
    console.log('req.session', req.session);
  
    req.session.user = {
      firstname: newUserSave.firstname, 
      id: newUserSave._id
    };
  
    res.redirect('/search')
  } else {
    res.redirect('/')
  }
  
  console.log('req.session2', req.session);

});


// Post sign-in
router.post('/sign-in', async function(req,res,next){

  console.log("req.body", req.body)
  
  var searchUser = await userModel.findOne({
    email: req.body.emailFromFront,
    password: req.body.passwordFromFront
  })

  console.log('searchUser', searchUser);

  if(searchUser!= null){
    req.session.user = {
      name: searchUser.name, 
      id: searchUser._id
    }
    res.redirect('/search')
  } else {
    res.render('login')
  }
  console.log('req.session2', req.session);
  
});


//GET No Trains available
router.get('/notrain', function(req, res, next) {
  res.render('notrain');
});


// // Remplissage de la base de donnée, une fois suffit
// router.get('/save', async function(req, res, next) {

//   // How many journeys we want
//   var count = 300

//   // Save  ---------------------------------------------------
//     for(var i = 0; i< count; i++){

//     departureCity = city[Math.floor(Math.random() * Math.floor(city.length))]
//     arrivalCity = city[Math.floor(Math.random() * Math.floor(city.length))]

//     if(departureCity != arrivalCity){

//       var newUser = new journeyModel ({
//         departure: departureCity , 
//         arrival: arrivalCity, 
//         date: date[Math.floor(Math.random() * Math.floor(date.length))],
//         departureTime:Math.floor(Math.random() * Math.floor(23)) + ":00",
//         price: Math.floor(Math.random() * Math.floor(125)) + 25,
//       });
       
//        await newUser.save();

//     }

//   }
//   res.render('index', { title: 'Express' });
// });


// Cette route est juste une verification du Save.
// Vous pouvez choisir de la garder ou la supprimer.

// router.get('/result', function(req, res, next) {

//   // Permet de savoir combien de trajets il y a par ville en base
//   for(i=0; i<city.length; i++){

//     journeyModel.find( 
//       { departure: city[i] } , //filtre
  
//       function (err, journey) {

//           console.log(`Nombre de trajets au départ de ${journey[0].departure} : `, journey.length);
//       }
//     )

//   }


//   res.render('index', { title: 'Express' });
// });

module.exports = router;
