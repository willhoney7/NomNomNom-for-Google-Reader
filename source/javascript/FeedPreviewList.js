enyo.kind({
	name: "FeedPreviewList", 
	kind: enyo.SlidingView, 
	width: "320px", 
	//flex: 1,
	events: {
		onItemClick: ""	
	},
	published: {
		feed: ""	
	},
	components: [
		{kind: "Header", content: ""},
		{name: "list", kind: enyo.VirtualList, flex: 1, onSetupRow: "setupRow", components: [
			{kind: "Item", className:"feedItem", onclick: "doItemClick", tapHighlight: true, components: [
				{name: "title", className: "title", flex: 1, allowHtml: true},
				{name: "feedTitle", className: "feedTitle"},

				{name: "summary", className: "summary", allowHtml: true},
			]}
		]},
		{kind: "Toolbar", components: [
			{kind: "GrabButton"}
		]}
	],
	create: function(){
		this.inherited(arguments);	
	},
	items: [],
	feedChanged: function(inOldValue){
		this.$.header.setContent(this.getFeed().label || this.getFeed().title);

		reader.getItems(this.getFeed().id, enyo.bind(this, this.loadedItems));
	},
	loadedItems: function(items){
		this.items = items;
		this.$.list.punt();
	},
	setupRow: function(inSender, inIndex){
		if(this.items[inIndex]){
			this.$.title.setContent(this.items[inIndex].title);
			var content = (this.items[inIndex].summary) ? this.items[inIndex].summary.content || "": (this.items[inIndex].content) ? this.items[inIndex].content.content || "": "";
			//this.$.summary.setContent((content));
			this.$.feedTitle.setContent(this.items[inIndex].origin.title);

			return true;
		}
	}

});