enyo.kind({
	name: "FeedPreviewList", 
	kind: enyo.SlidingView, 
	//width: "320px", 
	flex: 1,
	events: {
		onFeedClick: ""	
	},
	published: {
		feed: ""	
	},
	components: [
		{kind: "Header", content: ""},
		{name: "list", kind: enyo.VirtualList, flex: 1, onSetupRow: "setupRow", components: [
			{kind: "Item", className:"feedItem", tapHighlight: true, components: [
				{name: "title", className: "title"},
				{name: "summary", className: "summary", allowHtml: true}
			]}
		]},
		{kind: "Toolbar", components: [
			{kind: "GrabButton"}
		]}
	],
	items: [],
	feedChanged: function(inOldValue){
		this.$.header.setContent(this.getFeed().label || this.getFeed().title);

		if(this.getFeed().id === reader.FEED_ALL_ID){
			reader.getAllItems(enyo.bind(this, this.loadedItems));
		}
	},
	loadedItems: function(items){
		this.items = items;
		this.$.list.refresh();
	},
	setupRow: function(inSender, inIndex){
		if(this.items[inIndex]){
			this.$.title.setContent(this.items[inIndex].title);
			var content = (this.items[inIndex].summary) ? this.items[inIndex].summary.content || "": (this.items[inIndex].content) ? this.items[inIndex].content.content || "": "";
			this.$.summary.setContent(decodeURI(content));

			return true;
		}
	}

});