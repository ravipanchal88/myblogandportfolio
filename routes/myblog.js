var express      = require('express');
var models       = require('../models/index');
var multer       = require('multer');
var sharp        = require('sharp');
var aws          = require('aws-sdk');
var s3           = new aws.S3({region: 'us-east-1'});
//var uploadHandler = multer({dest: 'public/images/posts'});
var Post         = models.post;
var uploadHandler = multer();
var router = express.Router();


/**/
router.get('/', function(req, res) {
	Post.findAll().then(function(result) {
		res.render('myblog/index', {
			posts: result
		});
	});
});


// Search.
router.get('/search', function(req, res) {
	console.log("Search test");
	var query     = req.query.query;
	var condition = `%${query}%`;
	console.log("Search test2");
	Post.findAndCountAll({
		where: {
			$or: {
				title: {
					$iLike: condition
				},
				body: {
					$iLike: condition
				}
			}
		}
	}).then(function(result) {
		res.render('myblog/search', {
			query: query,
			count: result.count,
			posts: result.rows
		});
	});
});


//Blog New - Get request
router.get('/new', function(req, res) {
	res.render('myblog/new', {title:"New Blog Post"});
});


//Showing all blogposts

router.get('/show', function(req, res) {
	res.render('myblog/show', {posts :posts});
});


// Request Route for New  POrtfolio Request
// router.post('/new', function(req, res) {
// 	Post.create({
// 		title: req.body.title,
// 		body:  req.body.body
// 	}).then(function(post) {
// 		res.redirect('/');
// 	})
	
// });
//

//Creating a Blog Post via imagedatabase
// router.post('/new', uploadHandler.single('image'), function(request, response) {
// 	console.log("in image");
// 	Post.create({
// 		title:         request.body.title,
// 		body:          request.body.body,
// 		slug:          "ravi",
// 		imageFilename: (request.file && request.file.filename)
// 	}).then(function(post) {
// 		sharp(request.file.path)
// 		.resize(500, 500)
// 		.max()
// 		.withoutEnlargement()
// 		.toFile(`${request.file.path}-thumbnail`, function() {
// 			response.redirect('/myblog');
// 		});
// 	}).catch(function(error) {
// 		response.render('myblog/show', {
// 			post:   request.body,
// 			errors: error.errors
// 		});
// 	});
// });

//
//create post via AWS

router.post('/new', uploadHandler.single('image'), function(request, response) {
	console.log("in image");
	Post.create({
		title:         request.body.title,
		body:          request.body.body,
		slug:          "ravi"
	}).then(function(post) {
		sharp(request.file.buffer)
		.resize(300, 300)
		.max()
		.withoutEnlargement()
		.toBuffer()
		.then(function(thumbnail) {
			s3.upload({
				Bucket:     'myblogandportfolio',
				Key:        `posts/${post.id}`,
				Body:        request.file.buffer,
				ACL:        'public-read',
				ContentType: request.file.mimetype
			}, function(error, data) {
				s3.upload({
					Bucket:     'myblogandportfolio',
					Key:        `posts/${post.id}-thumbnail`,
					Body:        thumbnail,
					ACL:        'public-read',
					ContentType: request.file.mimetype
				}, function(error, data) {
					response.redirect('/myblog');
				});
			});
		});
	}).catch(function(error) {
		response.render('myblog/new', {
			post:   request.body,
			errors: error.errors
		});
	});
});



//Showing the Image
router.get('/:title',function(req,res){
	console.log("test0523");
	Post.findOne(
			{ where :
				{ title:req.params.title}
			}).then(function(result){
			res.render('myblog/show',
			{
				post: result
			});
		});
});

module.exports = router;
