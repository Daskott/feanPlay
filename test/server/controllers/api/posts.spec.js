var expect = require('chai').expect;
var api = require('../../support/api' );
var Post = require('../../../../models/posts');
var Users = require('../../../../models/users');

describe('controllers.api.posts', function () {
	beforeEach(function (done) {
		Post.remove({}, done);
	});

	describe('GET /api/posts', function () {
		beforeEach(function (done) {
			var posts = [
				{body: 'post1', username: 'dickeyxxx'},
				{body: 'post2', username: 'dickeyxxx'},
				{body: 'post3', username: 'dickeyxxx'}
			]
			Post.create(posts, done);
		});

		it('has 3 posts', function (done) {
			api.get('/api/posts')
			.expect(200)
			.expect(function (response) {
				expect(response.body).to.have.length(3)
			}).end(done)
		})
	})
})
