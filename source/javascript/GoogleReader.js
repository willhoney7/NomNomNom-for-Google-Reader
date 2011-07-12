enyo.kind({
	name: "GoogleReader",
	kind: enyo.VFlexBox,
	height: "100%",
	className: "googleReader",
	components: [
		{kind: "Pane", flex: 1, onflick: "flick", transitionKind: "enyo.transitions.Fade", components: [
		    {kind: "FeedList", onViewFeed: "viewFeed"},
		    {kind: "FeedView"}
		]},		
		{kind: enyo.Spinner, style: "position: fixed; left: 50%; top: 50%;", showing: true},
		{kind: "LoginPopup", name: "login", onLoginSuccess: "loginSuccess"},
	],
	create: function(){
		window.gReader = {};

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
			gReader.feeds = AppUtils.processSubscriptions(subscriptions);
			this.$.spinner.hide();
			this.$.feedList.load();
		}));
	},

	flick: function(inSender, inEvent){
		console.error(inEvent);	
		 if (Math.abs(inEvent.yVel) > Math.abs(inEvent.xVel)) {
	         //left to right
	         if (inEvent.yVel < 0) {
	            this.$.pane.next();
	         } else {
	            this.$.pane.back();
	         }
	      }

	},

	viewFeed: function(inSender, inFeed){
	    this.$.pane.next();
	    this.$.feedView.loadFeed(inFeed);	
	},

	loadFeed: function(inSender, inFeed){
		this.$.feedPreviewList.setFeed(inFeed);
	},
	loadItem: function(inSender, inEvent){
		this.$.itemView.setItem(inSender.items[inEvent.rowIndex]);
	}
});