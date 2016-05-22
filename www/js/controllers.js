angular.module('starter.controllers', [])

// Login
.controller('LoginCtrl', function($scope, $state) {
	// Login
	$scope.login = function(social) {
		// Verify if is an anonymous login
		if (social == "anonymous") {
			localStorage.user_id = 0;
  			localStorage.token = 0;
  			localStorage.user_name = 'Anonymous';
  			localStorage.user_photo = 'img/no-photo.png';

			new Firebase(firebase + "/users").push({
	    		user_name: "Anonymous",
	    		token: localStorage.token,
	    		timestamp: Firebase.ServerValue.TIMESTAMP
	    	});

	    	$state.go("tab.trends");
		}
		else {
			// Call Firebase auth popup
			new Firebase("https://tooh.firebaseio.com").authWithOAuthPopup(social, function(error, authData) {
				// If there is an error, go anonymoys
				if (error) {
					alert("Sorry, something went wrong. Try anonymous :)")
				} else {
					// Save user data on mobile
					localStorage.user_id = authData.uid;

					// Twitter
					if (social == 'twitter') {
						localStorage.user_name = authData.twitter.displayName;
						localStorage.user_photo = authData.twitter.profileImageURL;
					}

					// Facebook
					if (social == 'facebook') {
						localStorage.user_name = authData.facebook.displayName;
						localStorage.user_photo = authData.facebook.profileImageURL;	
					}

					// Google
					if (social == 'google') {
						localStorage.user_name = authData.google.displayName;
						localStorage.user_photo = authData.google.profileImageURL;	
					}

					// Github
					if (social == 'github') {
						localStorage.user_name = authData.github.displayName;
						localStorage.user_photo = authData.github.profileImageURL;	
					}

					// Set to Firebase
					new Firebase(firebase + "/users/" + localStorage.user_id).set({
			    		user_name: localStorage.user_name,
			    		user_photo: localStorage.user_photo,
			    		token: localStorage.token,
			    		timestamp: Firebase.ServerValue.TIMESTAMP
			    	});

					// Change state
					$state.go("tab.trends");
				}
		    });
		}
	};
})

// Trends
.controller('TrendsCtrl', function($scope, $rootScope, $state, $firebaseObject) {
	// Loading
	$scope.loading = true;

	// Firebase
	$scope.trends = $firebaseObject(new Firebase(firebase + "/chats").orderByChild("trending").equalTo(true));

	// Wait to load
	$scope.trends.$loaded(function() {
		// Loading
		$scope.loading = false;
	});

	// Open chat
	$scope.openChat = function(chat) {
		$state.go("tab.trend", { id: chat });
	}

	// Join
	$scope.join = function() {
		// Get join
		var join = $("#join").val();

		// Verify if there is a join
	    if (join != "") {
	    	// Change state
	    	$state.go("tab.trend", { id: "#" + join.replace("#", "") });

	    	// Keep history
	    	localStorage.history += "#" + join.replace("#", "");

	    	// Clean
	    	$("#join").val("");
	    }
	};

	// Show tabs
	$rootScope.hideTabs = false;
})

// Trend
.controller('TrendCtrl', function($scope, $rootScope, $stateParams, $firebaseObject, $ionicScrollDelegate) {
	// Loading
	$scope.loading = true;

	// Title
	$scope.title = $stateParams.id;

	// Firebase
	$scope.chat = $firebaseObject(new Firebase(firebase + "/chats/" + $stateParams.id.replace('#', '')));	

	// Wait to load
	$scope.chat.$loaded(function() {
		// Loading
		$scope.loading = false;

		// Scroll
		if ($scope.chat.length > 0) {
			$ionicScrollDelegate.scrollBottom(false);
		}
	});

	// Comment
	$scope.comment = function() {
		// Get comment
		var comment = $("#comment").val();

		// Verify if there is a comment
	    if (comment != "") {
	    	// Push to Firebase
	    	new Firebase(firebase + "/chats/" + $stateParams.id.replace('#', '') + '/comments').push({
	    		user_id: localStorage.user_id,
	    		user_name: localStorage.user_name,
	    		user_photo: localStorage.user_photo,
	    		comment: comment,
	    		timestamp: Firebase.ServerValue.TIMESTAMP
	    	});

	    	// Clean
	    	$("#comment").val("");
	    	$("#comment").focus();

	    	// Scroll
	    	$ionicScrollDelegate.scrollBottom(false);
	    }
	};

	// Hide tabs
	$rootScope.hideTabs = true;
})

// Profile
.controller('ProfileCtrl', function($scope, $rootScope, $state) {
	// User
	$scope.user_id = localStorage.user_id;
	$scope.user_name = localStorage.user_name;
	$scope.user_photo = localStorage.user_photo;

	// Suggestions
	$scope.suggestions = ['world', 'nature', 'sports', 'tv', 'movies', 'games', 'general'];

	// History
	$scope.history = localStorage.history.split("#");

	// Open chat
	$scope.openChat = function(chat) {
		$state.go("tab.profile-trend", { id: chat });
	}

	// Logout
  	$scope.logout = function() {
		$state.go("login");
	};

	// Clear
	$scope.clear = function() {
		localStorage.history = new Array();

		$scope.history = localStorage.history;
	};

	// Show tabs
	$rootScope.hideTabs = false;
});