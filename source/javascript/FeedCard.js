enyo.kind({
	name: "FeedCard", 
	className: "feedCard",
	kind: enyo.VFlexBox, 
	allowHtml: true,
	width: "320px",
	published: {
		feed: {},
		read: false
	},
	components: [
		{kind: enyo.VFlexBox, flex: 1, allowHtml: true, className: "content"},
		{kind: enyo.Control, name: "bottomToolbar", className: "bottomToolbar"}
		//{name: "title", kind: enyo.Control, className: "title truncating-text", allowHtml: true},
		//{name: "summary", className: "summary", allowHtml: true, flex: 1},
	],
	create: function(){
		this.inherited(arguments);	
		this.feedChanged();
	},
	feedChanged: function(){
		//caption: this.feeds[i].label || this.feeds[i].title, icon: });	
		var feedContent = (this.feed.summary) ? this.feed.summary.content || "": (this.feed.content) ? this.feed.content.content || "": "";
		var firstImageURL = $("<div>" + feedContent + "</div>").find("img:first").attr("src");

		var content = "<div class='title truncating-text'>" + this.feed.title + "</div>"
					+ (firstImageURL ? ("<img src = '" + firstImageURL + "' />") : "")
					+ "<div class='summary'>" + htmlToText(feedContent) + "</div>";
		
		this.$.vFlexBox.setContent(content);

		this.feed.read = false;
		for(var i = 0; i < this.feed.categories.length; i++){
			var re = /user\/\d+\/state\/com.google\/read$/i;
			if(re.test(this.feed.categories[i])){
				this.feed.read = true;
				break;
			}
		};
		this.$.bottomToolbar.addRemoveClass("unread", !this.feed.read);
		this.$.bottomToolbar.setContent(this.feed.origin.title);
		
	},
	markRead: function(){
		reader.setItemTag(this.feed.origin.streamId, this.feed.id, "read", true, enyo.bind(this, function(){
			console.log("success");
			this.feed.read = true;
			this.$.bottomToolbar.removeClass("unread");

		}));
	},

});