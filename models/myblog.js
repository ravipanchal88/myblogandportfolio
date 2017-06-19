module.exports = function(sequelize, DataTypes) {
	return(sequelize.define('post', {
		title: {
			type:      DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: 'Title is required'
				}
			}
		},
		body: {
			type:      DataTypes.TEXT,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: 'Body is required'
				}
			}
		},
		slug: {
			type:      DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: {
					msg: 'Slug is required'
				},
				notContains: {
					args: [[' ']],
					msg:  'Slug cannot contain spaces'
				}
			}
		},
		
	}, {
		defaultScope: {
			order: [['createdAt', 'DESC']]
		},
	  getterMethods: {
			url: function() {
				return(`/blog/${this.slug}`);
			},
			imageUrl: function() {
				return(`https://s3.amazonaws.com/myblogandportfolio/posts/${this.id}`);
			},
			imageThumbnailUrl: function() {
				return(`${this.imageUrl}-thumbnail`);
			}
	  },
   //  classMethods: {
   //    associate: function(models) {
   //      models.post.belongsTo(models.user);
   //      models.post.hasMany(models.comment);
   //    },
			// findWithSlug: function(slug) {
			// 	return(this.findOne({
			// 		where: {
			// 			slug: slug
			// 		},
			// 		include: [
			// 			sequelize.models.user,
			// 			sequelize.models.comment
			// 		],
			// 		order: [
			// 			[sequelize.models.comment, 'createdAt', 'DESC']
			// 		]
			// 	}));
			// }
   //  }
	}));
};