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
			{kind: enyo.Spinner, showing: false, className: "spinner"},
			{name: "title", kind: enyo.Control, className: "title truncating-text", allowHtml: true}	
		]},
	],
	create: function(){
		this.inherited(arguments);	
		this.feedChanged();
	},

	feedChanged: function(){
		//caption: this.feeds[i].label || this.feeds[i].title, icon: });
		
		this.$.imageContainer.setClassName("imageContainer");
		if(this.getFeed().isFeed){
			this.$.image.setSrc(this.getIcon());
		} else if(this.getFeed().isAll){
			this.$.imageContainer.addClass("all");
		} else if(this.getFeed().isSpecial){
			if(this.getFeed().id === reader.TAGS["star"]){
				this.$.imageContainer.addClass("star");
			} else if(this.getFeed().id === reader.TAGS["share"]){
				this.$.imageContainer.addClass("share");
			}
		} else if(this.getFeed().isLabel){
			this.$.imageContainer.addClass("folder");
		}

		this.$.title.setContent(this.getFeed().label || this.getFeed().title);
		if(this.getFeed().count > 0){
			this.$.count.setShowing(true);
			this.$.count.setContent(this.getFeed().count);		
		} else {
			this.$.count.setShowing(false);
		}

		if(this.getFeed().isLabel === true){
			this.createComponent({kind: "FeedFolderPopup", feeds: [].concat([this.getFeed()], this.getFeed().feeds), onViewFeed: "viewInsideFeed", onViewFeedPopup: "viewFeedPopup"});
			this.render();			
		}
	},
	getIcon: function(){
		/*if(this.getFeed().isAll){
			return "source/images/icon-folder.png";
		} else if(this.getFeed().isSpecial){
			if(this.getFeed().id === reader.TAGS["star"]){
				return "source/images/icon-starred.png";
			} else if(this.getFeed().id === reader.TAGS["share"]){
				return "source/images/icon-shared.png";
			}
		} else if(this.getFeed().isLabel){
			return "source/images/icon-folder.png";
		} else {*/
			return reader.getIconForFeed(this.getFeed().id.replace(/feed\//, ""));
		//}

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
		if(this.getFeed().isFeed === true || this.getFeed().isSpecial || this.inside){
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
	},
	startSpinning: function(){
		this.$.spinner.show();
	},
	stopSpinning: function(){
		if(this.$.spinner){
			this.$.spinner.hide();
		}
	}

});