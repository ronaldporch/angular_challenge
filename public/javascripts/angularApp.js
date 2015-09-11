var app = angular.module('angularChallenge', ['ui.router']);

app.config(['$stateProvider','$urlRouterProvider', function($stateProvider, $urlRouterProvider){
	$stateProvider
		.state('main',{
			url: '/main',
			templateUrl: 'partials/main.html',
			controller: 'MainCtrl'
		})
		.state('register',{
			url: '/register',
			templateUrl: 'partials/register.html',
			controller: 'AuthCtrl',
			onEnter: ['$state', 'auth', '$stateParams', '$http', function($state, auth, $stateParams, $http){
    			if(auth.isLoggedIn()){
      				$state.go('main');
    			}
  			}],
		})
		.state('login',{
			url: '/login/:id',
			templateUrl: 'partials/login.html',
			controller: 'AuthCtrl',
			onEnter: ['$state', 'auth', '$stateParams', '$http', function($state, auth, $stateParams, $http){
    			if(auth.isLoggedIn()){
      				$state.go('main');
    			}
  			}],
  			resolve: {
  				authPromise: ['auth', '$http', '$stateParams', function(auth, $http, $stateParams){
  					if($stateParams.id){
    					$http.get('/login/' + $stateParams.id).success(function(data){
    					auth.userName = data;
    				})	
    			}
  				}]
  			}
		})
		.state('logout',{
			url: '/logout',
			onEnter: ['$state', 'auth', function($state, auth){
				auth.logout();
				$state.go('main');
			}]
		})
	$urlRouterProvider.otherwise('main')	
}]);

app.factory('auth',['$http','$window',function($http,$window){
	var auth = {};
	auth.getToken = function(){
		return $window.localStorage['angular_challenge_token'] || $window.sessionStorage['angular_challenge_token']
	}
	auth.setToken = function(token, persist){
		console.log("Did It");
		console.log(persist);
		if(persist){
			$window.localStorage['angular_challenge_token'] = token;
		}else{
			$window.sessionStorage['angular_challenge_token'] = token;
		}
	}

	auth.isLoggedIn = function(){
		var token = auth.getToken();
		if(token){
			console.log(token);
			var payload = JSON.parse($window.atob(token.split('.')[1]))
			console.log(payload.exp)
			console.log(Date.now())
			return payload.exp > Date.now()
		}else{
			return false;
		}
	}

	auth.currentUser = function(){
		if(auth.isLoggedIn()){
			console.log('Is logged in');
			var token = auth.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]))
			return payload.username
		}
	}

	auth.register = function(user){
		return $http.post('/register', user).success(function(data){

		})
	}
	auth.login = function(user){
		return $http.post('/login', user).success(function(data){
			auth.setToken(data.token, user.checkbox)
		})
	}
	auth.logout = function(){
		$window.localStorage.removeItem('angular_challenge_token');
		$window.sessionStorage.removeItem('angular_challenge_token');
	}
	return auth;
}])

app.factory('message', [function(){
	var message = "Thank you for trying out the app!"
	return message
}])

app.controller('MainCtrl', ['$scope', 'auth', function($scope, auth){
	$scope.addToken = auth.setToken
	$scope.isLoggedIn = auth.isLoggedIn;
}])
app.controller('AuthCtrl', ['$scope','auth','$state', function($scope, auth, $state){
	$scope.user = {}
	$scope.user.username = auth.userName;
	$scope.register = function(){
		auth.register($scope.user).error(function(error){
			$scope.error = error
		})
	}
	$scope.login = function(){
		console.log($scope.user)
		auth.login($scope.user).error(function(error){
			$scope.error = error
		}).then(function(){
			$state.go('main')
		})
	}
}])

app.controller('navCtrl', ['$scope', 'auth', function($scope, auth){
	$scope.isLoggedIn = auth.isLoggedIn;
	$scope.currentUser = auth.currentUser;
}])