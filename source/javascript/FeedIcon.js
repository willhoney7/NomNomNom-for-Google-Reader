enyo.kind({
	name: "FeedIcon", 
	className: "feedIcon",
	kind: enyo.Control, 
	height: "100px",
	width: "100px",
	published: {
		feed: []
	},
	components: [
		{kind: enyo.Control, className: "imageContainer", components: [
			{kind: enyo.Image, className: "image"},
			{kind: enyo.Control, name: "count", className: "unreadCount"},
		]},
		{name: "title", kind: enyo.Control, className: "title truncating-text", allowHtml: true}
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
	}

});