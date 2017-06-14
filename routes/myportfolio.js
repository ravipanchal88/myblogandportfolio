var express = require('express');
var models  = require('../models/index');
var multer  = require('multer');
var sharp   = require('sharp');
var Post    = models.post;
var Portfolio = models.portfolio;
var uploadHandler = multer({dest: 'public/images/posts'});
var router = express.Router();

var pager = require('pagination');

var pagination = require('pagination');
// var paginator = pagination.create('search', {prelink:'/', current: 1, rowsPerPage: 200, totalResult: 10020});
// console.log(paginator.render());





/**/
router.get('/', function(req, res) {
	Portfolio.findAll().then(function(result) {
		res.render('myportfolio/index', {
			portfolios: result
		});
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
			}).then(function(portfolio){
			res.render('myportfolio/show',
			{
				portfolio: portfolio
			});
		});
});

router.get('/show', function(req, res) {
	res.render('myportfolio/show', {portfolios :portfolios});
});

router.post('/new', function(req, res) {
	console.log("Inthe portfolio post loop");
	Portfolio.create({
		title: req.body.title,
		body:  req.body.body,
		imageFilename: (req.file && req.file.filename)
	}).then(function(post) {
		sharp(req.file.path)
		.resize(500, 500)
		.max()
		.withoutEnlargement()
		.toFile(`${req.file.path}-thumbnail`, function() {
			res.redirect('/myportfolio');
		});
	}).catch(function(error) {
		res.render('myportfolio/show', {
			portfolio:   req.body,
			errors: error.errors
		});
	});
});
	


module.exports = router;
