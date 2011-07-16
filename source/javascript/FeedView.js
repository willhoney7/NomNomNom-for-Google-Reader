enyo.kind({
	name: "FeedView", 
	className: "feedView",
	kind: enyo.VFlexBox, 
	flex: 1,
	events: {
		onViewIcons: ""
	},
	components: [
		{kind: enyo.Toolbar, components: [
			{kind: enyo.Control, name: "title", className: "toolbarText", style: "padding-left: 40px"},
			{kind: enyo.GrabButton, onflick: "grabButtonFlick", onclick: "doViewIcons"},
			{kind: enyo.Spacer},
			{kind: enyo.ToolButton, icon: "source/images/menu-icon-new.png"}
		]},
		{kind: enyo.SnapScroller, autoVertical: false, vertical: false, horizontal: true, autoHorizontal: true, className: "enyo-hflexbox", flex: 1, onSnap: "cardSnap", components: [
			//{kind: "FeedPage"}
		]},
	],
	create: function(){
		this.inherited(arguments);	
	},

	grabButtonFlick: function(inSender, inEvent){
		console.error(inEvent);	
		 if (Math.abs(inEvent.yVel) > Math.abs(inEvent.xVel)) {
	         if (inEvent.yVel > 0) {
	    		this.doViewIcons()
	         }
	      }
	},

	loadFeed: function(feed){
		//this.$.header.setContent(this.getFeed().label || this.getFeed().title);
		var opts = {
			n: 50
		};
			//based on setting, get the num of items.
		if(AppPrefs.get("tapGets") === "unread"){
			//if pref is to get only unread, then if the unread count is > 0, return the feed.count. If there are no unread items, return 50 (read) items.
			if(feed.count > 0){
				opts.n = feed.count;
				opts.xt = reader.TAGS["read"];
			}
		} else {
			//if pref is not set to get only unread, then set numOfItems 50 or the number of unread items if that is bigger.
			if(feed.count > 50){
				opts.n = feed.count;
			}
		}

		this.$.title.setContent(feed.label || feed.title);
		
		reader.getItems(feed.id, enyo.bind(this, this.loadedItems), opts);
	},
	loadedItems: function(items){
		this.$.snapScroller.destroyControls();
		this.$.snapScroller.render();

		this.items = items;
		this.nextIndex = 0;

		this.renderSome();
		this.$.snapScroller.snapTo(0);

	},
	renderSome: function(){
		var components = [], cardLength;
		if(this.nextIndex === this.items.length){
			return;
		}
		if ((this.items.length - this.nextIndex) > 50){
		 	cardLength = (this.nextIndex + 50);
		}	else {
			cardLength = this.items.length;
		};
		//console.log("rendering", this.nextIndex, "through", cardLength-1);

		for(this.nextIndex; this.nextIndex < cardLength; this.nextIndex++){
			components.push({kind: "FeedCard", feed: this.items[this.nextIndex]});	
		}
		this.$.snapScroller.createComponents(components, {owner: this});
		this.$.snapScroller.render();
	},

	cardSnap: function(inSender, inIndex){
		//this.$.snapScroller.getControls()[inIndex].markRead();
	
		//console.log("card snap", inIndex, "this.nextIndex", this.nextIndex);
		if(this.nextIndex && (this.nextIndex - inIndex) <= 5){
			this.renderSome();
		}
	},

	markViewableCardsRead: function(){
		var index =  this.$.snapScroller.getIndex();
		this.$.snapScroller.getControls()
	}
});