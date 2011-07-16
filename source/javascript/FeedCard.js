enyo.kind({
	name: "FeedCard", 
	className: "feedCard",
	kind: enyo.VFlexBox, 
	allowHtml: true,
	width: AppPrefs.get("cardWidth"),
	published: {
		feed: {},
		read: false
	},
	components: [
		{kind: enyo.VFlexBox, flex: 1, style: "overflow: hidden", allowHtml: true, components: [
			{kind: enyo.HFlexBox, className: "header", components: [
				{kind: enyo.Control, flex: 1, name: "title", className: "title", allowHtml: true},
				{kind: enyo.Control, name: "date", className: "date"}
			]},
			{kind: enyo.HtmlContent, name: "content", className: "content"}
		]},
		{kind: enyo.HFlexBox, name: "bottomToolbar", className: "bottomToolbar", onclick: "markRead", allowHtml: true, components: [
			{kind: enyo.Image, name: "unread", src: "source/images/unread.png", style: "position: absolute; margin-top: 5px", showing: false},
			{kind: enyo.Control, name: "feedTitle", className: "truncating-text", flex: 1, allowHtml: true}
		]}
		
	],
	create: function(){
		this.inherited(arguments);	
		this.feedChanged();
	},
	feedChanged: function(){
		//caption: this.feeds[i].label || this.feeds[i].title, icon: });	
		var feedContent = (this.feed.summary) ? this.feed.summary.content || "": (this.feed.content) ? this.feed.content.content || "": "";
		var firstImageURL = $("<div>" + feedContent + "</div>").find("img:first").attr("src");
		this.$.title.setContent(this.feed.title);
		this.$.date.setContent(AppUtils.formatDate(this.feed.updated));

		var content = //"<div class='title truncating-text'>" + this.feed.title + "</div>"
					 (firstImageURL ? ("<img src = '" + firstImageURL + "' class = 'firstImage' />") : "")
					+ "<div class='summary'>" + htmlToText(feedContent) + "</div>";
		
		this.$.content.setContent(content);

		this.feed.read = false;
		for(var i = 0; i < this.feed.categories.length; i++){
			var re = /user\/\d+\/state\/com.google\/read$/i;
			if(re.test(this.feed.categories[i])){
				this.feed.read = true;
				break;
			}
		};
		this.$.unread.setShowing(!this.feed.read);
		this.$.feedTitle.setContent(this.feed.origin.title);

		
	},
	markRead: function(){
		if(this.feed.read === false){
			reader.setItemTag(this.feed.origin.streamId, this.feed.id, "read", true, enyo.bind(this, function(){
				this.feed.read = true;
				this.$.unread.setShowing(!this.feed.read);

			}));
		}
	},

});