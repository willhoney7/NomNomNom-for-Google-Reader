(function(){
	window.readitlater = {};

	var api_key = "9a0T3t7bg2cH7pi2dSd4b92u89pfU8fY"; //GET YOUR OWN FOOL!

	readitlater.makeRequest = function(obj){

		if(!obj.parameters){
			obj.parameters = {};
		}

		obj.parameters.apikey = api_key;

		var queries = [];
		for (var i in obj.parameters) {
			queries.push(encodeURIComponent(i) + "=" + encodeURIComponent(obj.parameters[i]));
		}
		var queryString = queries.join("&");

		var url = obj.url + "?" + queryString;
		
		var request = new XMLHttpRequest();
		request.open("POST", url, true);
		
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

	readitlater.authenticate = function(username, password, callback){
		readitlater.makeRequest({
			url: "https://readitlaterlist.com/v2/auth",
			parameters: {
				username: username,
				password: password				
			},
			onSuccess: callback,
			onFailure: callback
		});
	};

	readitlater.add = function(obj, username, password, callback){
		readitlater.makeRequest({
			url: "https://readitlaterlist.com/v2/add",
			parameters: {
				username: username,
				password: password,
				url: obj.url,
				title: utf8.encode(obj.title)
			},
			onSuccess: callback,
			onFailure: callback
		});
	}


})();