enyo.kind({
	name: "Launcher",
	kind: "Component",
	components: [	
		{kind: "ApplicationEvents", 
			onUnload: "cleanup"
		},
		{kind: "Notifications"}
	],
	startup: function () {
		var params = enyo.windowParams; 
		this.relaunch(params);
	},
 
	relaunch: function (params) {
 
		// check to see if main app window is already open
		var appWindow = enyo.windows.fetchWindow("mainApp");
 
		if (params.action) {
			switch (params.action) {
				case "refresh":
					this.$.notifications.handleRefresh();
					// open the main window and pass the params along
					//this.openCard("mainApp", params, false);
					break;
			}
		}
		else {
			this.openCard("main", params, false);	
		}
	},
 
	openCard: function (type, windowParams, forceNewCard) {
		var name = type, path, basePath = enyo.fetchAppRootPath(), existingWin;
  
		if (type === "main") {
			path = basePath + "main/index.html";
		}
		// or if we wanted to launch a different window
		else if (type === "somethingElse") {		
			path = basePath + "somethingElse/index.html";
 
		} 
		else {
			console.error("unknown launch type " + type);
			return; // bail out
		}
 
		// open the window	
		var window = enyo.windows.activate(path, name, windowParams);
		return window;
 
	},
 
	cleanup: function () {
		//this.$.notifications.setupRefresh();
	}	
})