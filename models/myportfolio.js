
module.exports = function(sequelize, Sequelize) {
	return(sequelize.define('portfolio', {
	title: Sequelize.STRING,
	body: Sequelize.TEXT,
    technology:Sequelize.TEXT 
	// imageFilename: {
	// 		type:         Sequelize.STRING,
	// 		allowNull:    false,
	// 		defaultValue: '',
	// 		validate: {
	// 			notEmpty: {
	// 				msg: 'Image is required'
	// 			}
	// 		}
	// 	}
	}, {
		defaultScope: {
			order: [['createdAt', 'DESC']]
		},
	   getterMethods: {
			url: function() {
				return('/');
			},
			imageUrl: function() {
				return(`https://s3.amazonaws.com/myblogandportfolio/portfolio/${this.id}`);
			},
			imageThumbnailUrl: function() {
				return(`${this.imageUrl}-thumbnail`);
			}

	  }
	}));
};

