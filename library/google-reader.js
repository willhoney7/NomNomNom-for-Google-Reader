/*
	This library requires the underscore library found at http://documentcloud.github.com/underscore/ 
	This library requires the underscore string library found at http://edtsech.github.com/underscore.string/
*/

reader = {
	/*constants*/
	CLIENT: "Tibfib",

	//urls
	LOGIN_URL: "https://www.google.com/accounts/ClientLogin",
	BASE_URL: "http://www.google.com/reader/api/0/",

	STREAM_PATH: "stream/contents/",

	//url suffixes
	TOKEN_SUFFIX: "token",
	SUBSCRIPTIONS_SUFFIX: "subscription/list",
	UNREAD_SUFFIX: "unread-count",

	ALLITEMS_SUFFIX: "user/-/state/com.google/reading-list",
	EDITTAG_SUFFIX: "edit-tag",
	TAGS: {
		"like": "user/-/state/com.google/like",
		"label": "user/-/label/",
		"star": "user/-/state/com.google/starred",
		"read": "user/-/state/com.google/read",
		"share": "user/-/state/com.google/broadcast",
		"keep-unread": "user/-/state/com.google/tracking-kept-unread"	
	},


	/*variables*/
	is_logged_in: false,
	is_authenticated: false,


	_feeds: [],
	setFeeds: function(feeds){
		this._feeds = feeds;	
	},
	getFeeds: function(){
		return this._feeds;	
	},

	_Auth: "",
	getAuth: function(){
		return reader._Auth;	
	},
	setAuth: function(auth){
		reader._Auth = auth;	
	},

	token: "",

	makeRequest: function(obj){
		//make sure we have a method
		if(!obj.method){
			obj.method = "GET";
		}
		//make sure we have a parameters object
		if(!obj.parameters){
			obj.parameters = {};
		}
		//add the necessary parameters to get our requests to function properly

		if(obj.method === "GET"){
			obj.parameters["ck"] = Date.now() || new Date().getTime();
			obj.parameters["accountType"] = "GOOGLE";
			obj.parameters["service"] = "reader";
			obj.parameters["output"] = "json";	
			obj.parameters["client"] = reader.CLIENT;
		}
		//if we have a token, add it to the parameters
		//I'm pretty sure this is worthless
		if(reader.token){
			if(obj.method === "POST"){
				obj.parameters["T"] = reader.token;			
			}
		}
		
		//turn our parameters object into a query string
		var queries = [];
		for (var i in obj.parameters) {
			queries.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj.parameters[i]))
		}
		var queryString = queries.join("&");

		var url = (obj.method === "GET") ? (obj.url + "?" + queryString): (obj.url + "?" + encodeURIComponent("client") + "=" + encodeURIComponent(reader.CLIENT));
		this.request = new XMLHttpRequest();
		this.request.open(obj.method, url, true);

		//set request header
		this.request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');

		if(reader.getAuth()){
			//this one is important. This is how google does authorization.
			this.request.setRequestHeader("Authorization", "GoogleLogin auth=" + reader.getAuth());    	
		}
		var self = this;

		this.request.onreadystatechange = 
			function(){
				if ((self.request.readyState === 4) && self.request.status === 200) {
					if(obj.onSuccess){
						obj.onSuccess(self.request);
					}
				} else if(self.request.readyState === 4){
					if(obj.onFailure){
						obj.onFailure(self.request);
					}
					console.error(self.request);
				}
		};
		
		this.request.send((obj.method === "POST") ? queryString: "");
	
	},

	load: function(){
		reader.is_logged_in = false;
		//check storage for the tokens we need.

		if(localStorage.Auth){
			reader.setAuth(localStorage.Auth);
			reader.is_logged_in = true;

		} 
		return(reader.is_logged_in);
	},

	login: function(email, password, successCallback, failCallback){
		if(email.length === 0 || password.length === 0){
			failCallback("Blank Info...");
		}
		reader.makeRequest({
			method: "GET",
			url: reader.LOGIN_URL,
			parameters: {
				Email: email,
				Passwd: password,
			},
			onSuccess: function(transport){

				localStorage.Auth = _(transport.responseText).lines()[2].replace("Auth=", "");
				reader.load();
				successCallback();
				
			},
			onFailure: function(transport){
				console.error(transport);
				failCallback(reader.normalizeError(transport.responseText));
			},
			onError: function(transport){
				console.error(transport);
				failCallback(reader.normalizeError(transport.responseText));
			}
		})
	},
	getToken: function(successCallback, failCallback){
		reader.makeRequest({
			method: "GET",
			url: reader.BASE_URL + reader.TOKEN_SUFFIX,
			parameters: {
				client: "js-googlereader"
			},
			onSuccess: function(transport){
				reader.token = transport.responseText;
				successCallback();
				
			}, 
			onFailure: function(transport){
				console.error("failed", transport);
				failCallback(reader.normalizeError(transport.responseText));
			}
		});
	},


	getSubscriptions: function(successCallback){
		reader.makeRequest({
			method: "GET",
			url: reader.BASE_URL + reader.SUBSCRIPTIONS_SUFFIX,
			onSuccess: function(transport){
				//save feeds in an organized state.
				reader.setFeeds(reader.organizeSubscriptions(JSON.parse(transport.responseText).subscriptions));
				
				//get unread counts
				reader.getUnreadCounts(function(unreadcounts){

					//apply unread counts to our saved feeds
					reader.setFeedUnreadCounts(unreadcounts);

					//callback with our feeds
					successCallback(reader.getFeeds());
				});
			},
			onFailure: function(transport){
				console.error(transport);
			}
		})
	},
	organizeSubscriptions: function(subscriptions){
		var categories = [
			{label: "All", id: reader.ALLITEMS_SUFFIX, feeds: subscriptions}
		],
		uncategorized = [];

		for(var i = 0; i < subscriptions.length; i++){
			if(subscriptions[i].categories.length === 0){
				uncategorized.push(subscriptions[i]);
			} else {
				_.each(subscriptions[i].categories, function(category){
					var new_category = _.clone(category);
					new_category.feeds = [subscriptions[i]];
					categories.push(new_category);
				});
			}
		}
		//create array of categories with an array fo the applicable feeds
		for(var i = 0; i < categories.length; i++){
			for(var j = (i + 1); j < categories.length; j++){
				if(i == j){
					continue;					
				}
				if(j >= categories.length){
					break;
				}
				if(categories[i].id === categories[j].id){
					categories[i].feeds = categories[i].feeds.concat(categories[j].feeds);
					categories.splice(j--,1);
				}
			}
		}
		_.each(categories, function(category){
			_.sortBy(category.feeds, function(feed){
				return feed.sortid;
			});
		});

		return categories.concat(uncategorized);
	},

	getIconForFeed: function(feedUrl){
		if(feedUrl === reader.ALLITEMS_SUFFIX){
			return "source/images/small_folder.png";
		} else if(_(feedUrl).includes("/label/")){
			return "source/images/small_folder.png";
		} else {
			return "http://www.google.com/s2/favicons?domain_url=" + decodeURI(feedUrl);
		}
	},

	getUnreadCounts: function(successCallback){
		reader.makeRequest({
			url: reader.BASE_URL + reader.UNREAD_SUFFIX,
			onSuccess: function(transport){
				//console.log(transport);
				successCallback(JSON.parse(transport.responseText).unreadcounts);
			}, 
			onFailure: function(transport){
				console.error(transport);
			}		
		});
	},
	setFeedUnreadCounts: function(unreadCounts){
		//do stuff
		_.each(reader.getFeeds(), function(subscription){
			for(var i = 0; i < unreadCounts.length; i++){
				if(subscription.id === unreadCounts[i].id || (subscription.id === reader.ALLITEMS_SUFFIX && _(unreadCounts[i].id).includes("state/com.google/reading-list"))){
					subscription.count = unreadCounts[i].count;
					subscription.newestItemTimestamp = unreadCounts[i].newestItemTimestampUsec;	
				}
			}
		});
	},


	getItems: function(feedUrl, successCallback, opts){
		var params = opts || {};
		
			params.r = "d"
			params.n = params.n || 50;
			
		reader.makeRequest({
			method: "GET",
			url: reader.BASE_URL + reader.STREAM_PATH + feedUrl,
			parameters: params, /*{
				//ot: new Date().getTime(), //ot=[unix timestamp] : The time from which you want to retrieve items. Only items that have been crawled by Google Reader after this time will be returned.
				r: "d",						//r=[d|n|o] : Sort order of item results. d or n gives items in descending date order, o in ascending order.
				//xt: "",					//xt=[exclude target] : Used to exclude certain items from the feed. For example, using xt=user/-/state/com.google/read will exclude items that the current user has marked as read, or xt=feed/[feedurl] will exclude items from a particular feed (obviously not useful in this request, but xt appears in other listing requests).
			},*/
			onSuccess: function(transport){
				successCallback(JSON.parse(transport.responseText).items);
			}, 
			onFailure: function(transport){
				console.error(transport);
			}
		});
	},

	setItemTag: function(feed, item, tag, add, successCallback){
		//feed id
		//item id
		//tag in simple form: "like", "read", "share", "label", "star", "keep-unread"
		//opt is true to add, false to remove

		var params = {
			s: feed,
			i: item,
			async: "true",
			ac: "edit-tags"
		}
		if(add === true){
			params.a = reader.TAGS[tag];
		} else {
			params.r = reader.TAGS[tag];
		}
		reader.makeRequest({
			method: "POST",
			url: reader.BASE_URL + reader.EDITTAG_SUFFIX,
			parameters: params,
			onSuccess: function(transport){
				if(transport.responseText === "OK"){
					successCallback();
					
				}
			}, 
			onFailure: function(transport){
				console.error(transport);
			} 
		})
		
	},

	normalizeError: function(inErrorResponse){
		return _(inErrorResponse).lines()[0].replace("Error=", "").replace(/(\w)([A-Z])/g, "$1 $2");
	}
}