enyo.kind({
	name: "GoogleReader",
	kind: enyo.VFlexBox,
	height: "100%",
	className: "googleReader",
	components: [
		{kind: "Pane", flex: 1, transitionKind: "enyo.transitions.Fade", components: [
		    {kind: "FeedList", onViewFeed: "viewFeed", onflick: "flick"},
		    {kind: "FeedView", onViewIcons: "viewIcons"}
		]},		
		{kind: enyo.Spinner, style: "position: fixed; left: 50%; top: 50%;", showing: true},
		{kind: "LoginPopup", name: "login", onLoginSuccess: "loginSuccess"},
	],
	create: function(){
		this.inherited(arguments);
		
		reader.load();

		if(reader.is_logged_in === true){
			this.loginSuccess();
		}
	},
	rendered: function(){
		if(reader.is_logged_in === false){
	   	 	this.$.login.showAtCenter();
		}	
	},

	loginSuccess: function(){
		this.getToken();
	},

	getToken: function(){
		reader.getToken(enyo.bind(this, this.getSubscriptions), enyo.bind(this, this.reportError));	
	},


	getSubscriptions: function(){
		reader.getSubscriptions(enyo.bind(this, function(subscriptions){
			this.$.spinner.hide();
			this.$.feedList.load();
		}));
	},

	flick: function(inSender, inEvent){
		console.error(inEvent);	
		 if (Math.abs(inEvent.yVel) > Math.abs(inEvent.xVel)) {
	         if (inEvent.yVel < 0) {
	    		this.$.pane.selectViewByIndex(1);
	         } //else {
	          //  this.$.pane.back();
	        // }
	      }

	},
	viewIcons: function(inSender){
		this.$.pane.selectViewByIndex(0);	
	},
	viewFeed: function(inSender, inFeed){
	    this.$.pane.selectViewByIndex(1);
	    this.$.feedView.loadFeed(inFeed);	
	},

	loadFeed: function(inSender, inFeed){
		this.$.feedPreviewList.setFeed(inFeed);
	},
	loadItem: function(inSender, inEvent){
		this.$.itemView.setItem(inSender.items[inEvent.rowIndex]);
	}
});