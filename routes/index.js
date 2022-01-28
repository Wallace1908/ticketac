var express = require('express');
const req = require('express/lib/request');
var router = express.Router();

var userModel = require('../models/users')
var journeyModel = require('../models/journey');

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
  
    res.redirect('/homepage')
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
    res.redirect('/homepage')
  } else {
    res.render('login')
  }
  console.log('req.session2', req.session);
  
});

// Get Search Page
router.get('/homepage', function (req, res, next) {
  console.log("---homepage route / search view")

  res.render('search')
})

router.post('/search', async function (req, res, next) {
  console.log("---search route")
  console.log("req body", req.body)

  var from = req.body.fromFromFront;
  var to = req.body.toFromFront;
  var date = new Date(req.body.dateFromFront);
  console.log("---from / to / date:", from, to, date)

  var results = await journeyModel.find( { departure: from, arrival: to, date:date } );
  console.log("results", results);

  if(results.length === 0){
    // console.log("#1")
    res.redirect('/notrain');
    // console.log("#2")
  } else {
    // console.log("#3")
    res.render('availability', { date:date, results:results })
  }
});

//GET No Train available
router.get('/notrain', function(req, res, next) {
  console.log("---no train route")

  res.render('notrain');
});


//GET Availability
router.get('/availability', function(req, res, next) {
  res.render('availability');
});


//GET Tickets
router.get('/tickets', async function(req, res, next) {
  console.log("---req.query", req.query)

  if(req.session.trainCard == undefined){
    req.session.trainCard = []
  }
  console.log("---trainCard", req.session.trainCard)

  var trainId = req.query.id

  var trainToAdd = await journeyModel.findById(trainId);
  console.log("---trainToAdd", trainToAdd)

  req.session.trainCard.push(trainToAdd)
  console.log("---req.session.trainCard after push", req.session.trainCard)





  res.render('tickets', {trainCard:req.session.trainCard});
});


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
