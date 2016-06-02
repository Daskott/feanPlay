describe('posts.svc', function () { 
	beforeEach(module('app')); 

	var PostsService, $httpBackend; 

	beforeEach(inject(function (_PostsService_, _$httpBackend_) { 
		PostsService = _PostsService_ ;
		$httpBackend = _$httpBackend_ ;
	})); 

	afterEach(function () { 
		$httpBackend.flush() 
	}); 

	describe('#fetch', function () { 
		beforeEach(function () { 
			//setup backend: angular does not allow http calls outside of test suite
			$httpBackend
			.expect('GET', '/api/posts')
			.respond([ 
				{username: 'dickeyxxx', body: 'first post'}, 
				{username: 'dickeyxxx', body: 'second post'} 
				]) 
		});

		it('gets 2 posts', function () { 
			PostsService.fetch().success(function (posts) { 
				expect(posts).to.have.length(2) 
			}) 
		}); 
	}) 
})