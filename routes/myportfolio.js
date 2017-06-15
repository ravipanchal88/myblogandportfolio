var express = require('express');
var models  = require('../models/index');
var multer  = require('multer');
var sharp   = require('sharp');
var Post    = models.post;
var Portfolio = models.portfolio;
var uploadHandler = multer({dest: 'public/images/posts'});
var router = express.Router();

/**/
router.get('/', function(req, res) {
	Portfolio.findAll().then(function(result) {
		console.log("testttttt")
		res.render('myportfolio/index', {
			portfolios: result
		});
		console.log(JSON.stringify(result));
	});

	
});

router.get('/new', function(req, res) {
	res.render('myportfolio/new', {title:"New Blog Post"});
});



router.get('/:title',function(req,res){
	console.log("testtt for portfolios");
	Portfolio.findOne(
			{ where :
				{ title:req.params.title}
			}).then(function(result){
			res.render('myportfolio)',
			{
				portfolios: result
			});
		});
});

router.get('/show', function(req, res) {
	res.render('myportfolio/show', {portfolios :portfolios});
});


router.post('/new', uploadHandler.single('image'), function(req, res) {
// 	Imagepost.create({
// 		title:         request.body.title,
// 		body:          request.body.body,
		
// 		imageFilename: (request.file && request.file.filename)

// router.post('/new', function(req, res) {
	console.log("In the portfolio post loop");
	Portfolio.create({
		title: req.body.title,
		body:  req.body.body,
		technology:'Javascipt,node.js,postgres',
		imageFilename: (req.file && req.file.filename)
	}).then(function(post) {
		console.log("insharop loop");
		sharp(req.file.path)
		.resize(500, 500)
		.max()
		.withoutEnlargement()
		.toFile(`${req.file.path}-thumbnail`, function() {
			res.redirect('/myportfolio');
		});
	}).catch(function(error) {
		console.log("in error loop");
		res.render('myportfolio', {
			portfolios:   req.body,
			errors: error.errors
		});
	});
});
	


module.exports = router;
