(function(){
	window.instapaper = {};

	instapaper.makeRequest = function(obj){

		var queries = [];
		for (var i in obj.parameters) {
			queries.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj.parameters[i]));
		}
		var queryString = queries.join("&");

		var url = obj.url + "?" + queryString;
		
		var request = new XMLHttpRequest();
		request.open("POST", url, true);

		request.setRequestHeader('Authorization', 'Basic ' + obj.auth);
		
		request.onreadystatechange = function(){
			if ((request.readyState === 4) && (request.status === 200 || request.status === 201)) {
				if(obj.onSuccess){
					obj.onSuccess(request);
				}
			} else if(request.readyState === 4){
				
				if(obj.onFailure){
					obj.onFailure(request);
				}

				console.error(request);
			}
		};
		
		request.send();
	
	};

	instapaper.makeAuth = function(username, password){
		return btoa(utf8.encode(username) + ':' + utf8.encode(password));
	};

	instapaper.authenticate = function(username, password, callback){
		instapaper.makeRequest({
			url: "https://www.instapaper.com/api/authenticate",
			auth: instapaper.makeAuth(username, password),
			onSuccess: callback,
			onFailure: callback
		});
	},
	instapaper.add = function(obj, auth, callback){
		instapaper.makeRequest({
			url: "https://www.instapaper.com/api/add",
			auth: auth,
			parameters: {
				url: obj.url,
				title: utf8.encode(obj.title)
			},
			onSuccess: callback,
			onFailure: callback
		});
	}


})();