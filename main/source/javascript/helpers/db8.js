var db8 = ({
	domain: "com.tibfib.app.nomnomnom",
	setup: function(callback){
		this.putKinds(callback);	
	},
	kinds: [
		{
			"kindID": db8.domain + ".playlists:1",
			//"name": "playlists",
			"indices": [
				{"name": "name", "props": [{"name": "name", "type":"single"}]},
				{"name": "type", "props": [{"name": "type", "type":"single"}]}
			]
		},
		{
			"kindID": db8.domain + ".favorites:1",
			//	"name": "playlists",
			"indices": [
				{"name": "id", "props": [{"name": "id", "type":"single"}]},
				{"name": "position", "props": [{"name": "position", "type":"single"}]}
			]
		},
		{
			"kindID": db8.domain + ".data:1",
			"indices": [
				{"name": "id", "props": [{"name": "id", "type":"single"}]}, //obj _id
				{"name": "lastUpdate", "props": [{"name": "lastUpdate", "type":"single"}]},
				
				{"name": "searchKey", "props": [
					{"name": "searchKey", "type":"single", "tokenize": "all", "collate": "primary"}
				]},
				{"name": "objType", "props": [{"name": "objType", "type":"single"}]}, 				
				{"name": "orderKey", "props": [{"name": "orderKey", "type":"single"}]}, 
				{"name": "display", "props": [{"name": "display", "type":"single"}]}, 
				{"name": "secondary", "props": [{"name": "secondary", "type":"single"}]}, 
				
				{"name": "playCount", "props": [{"name": "playCount"}]},
				{"name": "lastPlayed", "props": [{"name": "lastPlayed"}]}, 
				{"name": "rating", "props": [{"name": "rating"}]} 
			]
		},
	],
	putKinds: function(callback) {
		/*var quickCookie = new Mojo.Model.Cookie('quickCookie_mojoPlayer');
		if (!quickCookie || (quickCookie && quickCookie.get() !== Mojo.Controller.appInfo.version)){
			db8.DB.delKind(db8.domain + ".data:1").then(function(future) {
				var result = future.result;
				if (result.returnValue === true)           
					Mojo.Log.info("delKind success");
				else{  
					result = future.exception;
					Mojo.Log.info("delKind failure: Err code=" + result.errorCode + "Err message=" + result.message); 
				}
			});
			quickCookie.put(Mojo.Controller.appInfo.version);
			//koto.justType.setupIndexingDashboard();
		}*/
		function putKind(i){
			db8.DB.putKind(db8.kinds[i].kindID, db8.domain, db8.kinds[i].indices).then(function(future){
				if (future.result.returnValue === false) {
				   console.log("putKind Failure.");
				}
				if (i === (db8.kinds.length-1)){
					db8.putOrigObjs(callback);
				}
			});
		}
		for(var i = 0; i < this.kinds.length; i++ ) {
			putKind(i);
		} 
	},
	putOrigObjs: function(callback){
		var query = {"select" : ["name"], "from":db8.domain + ".playlists:1", "where":[{"prop":"name","op":"=","val":"_now_playing"}]};
		this.exec(query, function(results){
			if (results.length < 1){
				db8.put({
					_kind: db8.domain + ".playlists:1",
					name: "_now_playing",
					type: "hide",
					songs: koto.nowPlaying.currentInfo.songs.clone(),
					unshuffledSongs: koto.nowPlaying.currentInfo.unshuffledSongs.clone(),
					index: koto.nowPlaying.currentInfo.index
				});
			}
		});
		
		var query = {"select" : ["name"], "from":db8.domain + ".playlists:1", "where":[{"prop":"type","op":"=","val":"auto"}]};
		this.exec(query, function(results){
			if (results.length < 3){
				db8.putArray([
					{
						_kind: db8.domain + ".playlists:1",
						name: $L("Top Rated"),
						type: "auto",
						songsQuery: {"select" : ["id"], "from":db8.domain + ".data:1", "where":[{"prop":"rating","op":">","val":0}], "orderBy":"rating", "desc": true}
					},
					{
						_kind: db8.domain + ".playlists:1",
						name: $L("Most Played"),
						type: "auto",
						songsQuery: {"select" : ["id"], "from":db8.domain + ".data:1", "where":[{"prop":"playCount","op":">","val":0}], "orderBy":"playCount", "desc": true}
					},
					{
						_kind: db8.domain + ".playlists:1",
						name: $L("Recently Played"),
						type: "auto",
						songsQuery: {"select" : ["id"], "from":db8.domain + ".data:1", "where":[{"prop":"lastPlayed","op":">","val":0}], "orderBy":"lastPlayed", "desc": true}
					}				
				], callback);
			} else {
				callback();
			}
		});
	},
	exec: function(query, callback, ignoreNext){
		db8.DB.find(query, false, false).then(function(future) {
			var result = future.result;   
			if (result.returnValue === true){ // Success
				callback(result.results, (result.next === undefined));
				if (result.next && !ignoreNext){
					query.page = result.next;
					db8.exec(query, callback);
				}
			}
			else {// Failure
				console.log("find failure: Err code=" + future.exception.errorCode + "Err message=" + future.exception.message); 
			}
		});
	
	},
	put: function(object, callback){
		db8.DB.put([object]).then(function(future){
			var result = future.result;
			if (result.returnValue === true){
				if (callback){
					callback(result.results[0].id);
				}
					//console.log("put success, c.id="+result.results[0].id+", c.rev="+result.results[0].rev);			
			}
			else
				console.log("put failure: Err code=" + future.exception.errorCode + "Err message=" + future.exception.message); 
	   });
	},
	putArray: function(array, callback){
		db8.DB.put(array).then(function(future){
			var result = future.result;
			if (result.returnValue === true){
				//console.log("put success, c.id="+result.results[0].id+", c.rev="+result.results[0].rev);			
			}
			else {
				console.error("put failure: Err code=" + future.exception.errorCode + "Err message=" + future.exception.message); 				
			}

			if(callback){
				callback();
			}
	   });
	},
	mergeArray: function(array, callback){
		db8.DB.merge(array).then(function(future) {
			if (future.result.returnValue === true){
				if (callback){
					callback();
				}
				//console.log("merge success, number updated = "+future.result.results.length);
			}else
				console.log("merge failure: Err code=" + future.exception.errorCode + "Err message=" + future.exception.message); 
		});
	},
	merge: function(query, updatedProps, callback){
		db8.DB.merge(query, updatedProps).then(function(future) {
			if (future.result.returnValue === true){
				if (callback){
					callback();
				}
				//console.log("merge success, number updated = "+future.result.count);
			}else
				console.log("merge failure: Err code=" + future.exception.errorCode + "Err message=" + future.exception.message); 
		});
	},
	getObjsById: function(obj_ids, callback){
		db8.DB.get(obj_ids).then(function(future) {
			callback(future.result.results);
		}); 
	},
	del: function(query, callback){
		db8.DB.del(query).then(function(future) {
			if (future.result.returnValue === true){      
				if (callback){
					callback();
				}
			}
			else {
				("del failure: Err code=" + future.exception.errorCode + "Err message=" + future.exception.message); 
			}
		}); 
	}
});