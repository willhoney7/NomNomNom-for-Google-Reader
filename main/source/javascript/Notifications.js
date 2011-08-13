enyo.kind({
	name: "Notifications",
	kind: enyo.Control,
	components: [

	  	{name: "alarm", kind: "PalmService", service: "palm://com.palm.power/timeout", method: "set", onSuccess: "alarmSuccess", onFailure: "alarmFailure"},
	  	{name: "clearAlarm", kind: "PalmService", service: "palm://com.palm.power/timeout", method: "clear", onSuccess: "alarmSuccess", onFailure: "alarmFailure"},

	  	{kind:"Dashboard", smallicon: "icon24.png", onIconTap: "iconTap", onMessageTap: "messageTap", onUserClose: "dashboardClose", onLayerSwipe: "layerSwiped", appId: null},
	],
	create: function(){
		this.inherited(arguments);
		this.isActive = true;
		this.setupRefresh();

		enyo.application.clearDashboard = enyo.bind(this, this.clearDashboard);
		enyo.application.setupRefresh = enyo.bind(this, this.setupRefresh);
	},

	setupRefresh: function(){
		if(AppPrefs.get("notify") === false){
			console.log("notifications turned off");
			this.$.clearAlarm.call({key: "nomnomnomRefresh"});	

			return;
		}		
		var params = {
			"wakeup": true,
			"key": "nomnomnomRefresh",
			"uri": "palm://com.palm.applicationManager/open",
			"params": '{"id":"com.tibfib.app.nomnomnom","params":{"action": "refresh"}}'
		};

		var d, date, mo, yr, hrs, mins, secs, myDateString;
		function pad(str){
			if(str < 10){
				return '0' + str;
			}
			return str;
		}
		d = new Date();
		console.log("refresh interval " + AppPrefs.get("notifyInterval"));
		d.setTime(d.getTime() + AppPrefs.get("notifyInterval") * 60 * 1000); //ever two minutes
		mo = d.getUTCMonth() + 1;
		date = d.getUTCDate();
		yr = d.getUTCFullYear();
		hrs = d.getUTCHours();
		mins = d.getUTCMinutes();
		secs = d.getUTCSeconds();
		
		myDateString = pad(mo) + "/" + pad(date) + "/" + yr + " " + pad(hrs) + ":" + pad(mins) + ":" + pad(secs);
		params["at"] = myDateString;
		
		this.$.alarm.call(params);	
	},

	//called from this.$.launcer
	handleRefresh: function(){
		
		this.setupRefresh();

		this.raiseNotifications();
	
	},
	clearDashboard: function(){
		if(!this.tappedOnMessage){
			this.$.dashboard.setLayers([]);
		}
		this.tappedOnMessage = false;
	},
	alarmSuccess: function(){
		//console.log("SUCCESS");
	},
	alarmFailure: function(inSender, inError){
		console.log("FAILURE " + inError.errorText);
	},
	raiseNotifications: function(){
		if(reader.load()){
			var self = this;
			var feedsToNotifyFor = AppPrefs.get("notifyFeeds");
			console.log("feedsToNotifyFor " + JSON.stringify(feedsToNotifyFor));

			if(!enyo.windows.getActiveWindow() || (enyo.windows.getActiveWindow() && enyo.windows.getActiveWindow().name !== "main")){
				reader.getUnreadCounts(function(unreadCountsObj){
					//self.$.dashboard.setLayers([]);

					_(feedsToNotifyFor).each(function(value, key, object){
						if(unreadCountsObj[key] > value.count){
							var added = false;
							_(self.$.dashboard.layers).each(function(layer){
								if(layer.key === key){
									added = true;
									if(layer.count !== unreadCountsObj[key]){
										layer.text = unreadCountsObj[key] + " unread articles";
										self.$.dashboard.updateWindow();
									}
								}
							});
							if(!added){
								self.$.dashboard.push({
								    icon: "icon48.png",
								    title: value.title,
								    text: unreadCountsObj[key] + " unread articles",
								    key: key,
								    count: unreadCountsObj[key]
								});	
							}
							
							console.log("RAISE notifications for " + key);
							self.unreadCountsObj = unreadCountsObj;
						} else {
							self.unreadCountsObj = unreadCountsObj;
							self.layerSwiped(this, {key: key});
						}

						
					});	
					
					console.log("unreadCounts " + JSON.stringify(unreadCountsObj));
				}, true);
			} else if(enyo.windows.getActiveWindow() && enyo.windows.getActiveWindow().name === "main"){
				//self.$.dashboard.setLayers([]);
				reader.getUnreadCounts(function(unreadCountsObj){
					self.unreadCountsObj = unreadCountsObj;
					self.dashboardClose();
				});
			}
		} else {
			console.log("Not logged in. Not notifying.")
		}
	},
	layerSwiped: function(inSender, inLayer){
		var feedsToNotifyFor = AppPrefs.get("notifyFeeds");
		//if(this.unreadCountsObj[inLayer.key] > feedsToNotifyFor[inLayer.key]){
			feedsToNotifyFor[inLayer.key].count = this.unreadCountsObj[inLayer.key];		
		//}

		AppPrefs.set("notifyFeeds", feedsToNotifyFor);
	},
	dashboardClose: function(inSender, inLayer){
		var feedsToNotifyFor = AppPrefs.get("notifyFeeds");
		_(feedsToNotifyFor).each(function(value, key, object){
			//if(this.unreadCountsObj[key] > feedsToNotifyFor[key].count){
				feedsToNotifyFor[key].count = this.unreadCountsObj[key];	
			//}		
		}, this);	
		AppPrefs.set("notifyFeeds", feedsToNotifyFor);

	},
	messageTap: function(inSender, inLayer){
		this.tappedOnMessage = true;
		this.owner.relaunch({});
		this.$.dashboard.pop();

		//enyo.application.viewFeed(inSender, inLayer.key);@TODO
	},
	iconTap: function(inSender, inLayer, inEvent){
		this.owner.relaunch({});
		this.clearDashboard();
	}

})