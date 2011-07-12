enyo.kind({
	name: "FeedCard", 
	className: "feedCard",
	kind: enyo.VFlexBox, 
	allowHtml: true,
	width: "320px",
	published: {
		feed: {}
	},
	components: [
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
		
		this.setContent(content);

		//this.$.title.setContent(this.feed.title);
		//this.$.summary.setContent(feedContent);
		//this.$.feedTitle.setContent(this.feed.origin.title);
	}

});