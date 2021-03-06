var express = require('express');
var models  = require('../models/index');
var multer  = require('multer');
var sharp   = require('sharp');
var Post    = models.post;
var Portfolio = models.portfolio;
var aws          = require('aws-sdk');
var s3           = new aws.S3({region: 'us-east-2'});
var uploadHandler = multer();
//var uploadHandler = multer({dest: 'public/images/posts'});
var router = express.Router();

/**/
router.get('/', function(req, res) {
	Portfolio.findAll().then(function(result) {
		//console.log("testttttt")
		res.render('myportfolio/index', {
			portfolios: result
		});
		//console.log(JSON.stringify(result));
	});

	
});

router.get('/new', function(req, res) {
	res.render('myportfolio/new', {title:"New Portfolio Item"});
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

//Creating Portfolio Post using Imagedb
// router.post('/new', uploadHandler.single('image'), function(req, res) {
// // 	Imagepost.create({
// // 		title:         request.body.title,
// // 		body:          request.body.body,
		
// // 		imageFilename: (request.file && request.file.filename)

// // router.post('/new', function(req, res) {
// 	console.log("In the portfolio post loop");
// 	Portfolio.create({
// 		title: req.body.title,
// 		body:  req.body.body,
// 		technology:'Javascipt,node.js,postgres',
// 		imageFilename: (req.file && req.file.filename)
// 	}).then(function(post) {
// 		console.log("insharop loop");
// 		sharp(req.file.path)
// 		.resize(500, 500)
// 		.max()
// 		.withoutEnlargement()
// 		.toFile(`${req.file.path}-thumbnail`, function() {
// 			res.redirect('/myportfolio');
// 		});
// 	}).catch(function(error) {
// 		console.log("in error loop");
// 		res.render('myportfolio', {
// 			portfolios:   req.body,
// 			errors: error.errors
// 		});
// 	});
// });


router.post('/new', uploadHandler.single('image'), function(request, response) {
	console.log("portfolio in image");
	Portfolio.create({
		title:         request.body.title,
		body:          request.body.body,
		technology:'Javascipt,node.js,postgres'
	}).then(function(portfolio) {
		sharp(request.file.buffer)
		.resize(300, 300)
		.max()
		.withoutEnlargement()
		.toBuffer()
		.then(function(thumbnail) {
			s3.upload({
				Bucket:     'myblogandportfolio',
				Key:        `portfolio/${portfolio.id}`,
				Body:        request.file.buffer,
				ACL:        'public-read',
				ContentType: request.file.mimetype
			}, function(error, data) {
				s3.upload({
					Bucket:     'myblogandportfolio',
					Key:        `portfolio/${portfolio.id}-thumbnail`,
					Body:        thumbnail,
					ACL:        'public-read',
					ContentType: request.file.mimetype
				}, function(error, data) {
					response.redirect('/myportfolio');
				});
			});
		});
	}).catch(function(error) {
		response.render('myportfolio/index', {
			post:   request.body,
			errors: error.errors
		});
	});
});
	


module.exports = router;
