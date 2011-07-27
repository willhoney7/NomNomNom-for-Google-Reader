enyo.kind({
	name: "FeedIcon", 
	className: "feedIcon",
	kind: enyo.VFlexBox, 
	published: {
		feed: []
	},	
	events: {
		onViewFeed: "",
		onViewFeedPopup: ""
	},
	components: [
		{kind: enyo.VFlexBox, className: "icon", width: "120px", onclick: "viewFeed", onmousehold: "viewFeedPopup", components: [
			{name: "imageContainer", kind: enyo.VFlexBox, className: "imageContainer", components: [
				{kind: enyo.Image, className: "image"},
				{kind: enyo.Spacer},
				{kind: enyo.Control, name: "count", className: "unreadCount"},
			]},
			{name: "title", kind: enyo.Control, className: "title truncating-text", allowHtml: true}	
		]},
	],
	create: function(){
		this.inherited(arguments);	
		this.feedChanged();
	},
	feedChanged: function(){
		//caption: this.feeds[i].label || this.feeds[i].title, icon: });	
		this.$.image.setSrc(reader.getIconForFeed(this.getFeed().id.replace(/feed\//, "")));
		this.$.title.setContent(this.getFeed().label || this.getFeed().title);
		if(this.getFeed().count > 0){
			this.$.count.setShowing(true);
			this.$.count.setContent(this.getFeed().count);		
		} else {
			this.$.count.setShowing(false);
		}

		if(this.getFeed().isLabel === true && !this.getFeed().isAll){
			this.createComponent({kind: "FeedFolderPopup", feeds: [].concat([this.getFeed()], this.getFeed().feeds), onViewFeed: "viewInsideFeed", onViewFeedPopup: "viewFeedPopup"});
			this.render();			
		}
	},
	updateUnreadCount: function(){
		if(this.getFeed().count > 0){
			this.$.count.setShowing(true);
			this.$.count.setContent(this.getFeed().count);		
		} else {
			this.$.count.setShowing(false);
		}			
	},
	viewFeed: function(inSender, inEvent){
		if(this.getFeed().isFeed === true || this.getFeed().id === reader.ALLITEMS_SUFFIX || this.inside){
			this.doViewFeed(this.feed);
		} else {
			this.$.feedFolderPopup.showAtControl(this.$.imageContainer);
		}
	},
	viewFeedPopup: function(inSender, inEvent, inFeed){
		this.doViewFeedPopup(inFeed || this.feed, inEvent);	
	},
	viewInsideFeed: function(inSender, inFeed){
		this.doViewFeed(inFeed);		
	}

});