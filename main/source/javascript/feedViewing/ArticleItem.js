enyo.kind({
	name: "ArticleItem",
	kind: enyo.Item,
	published: {
		item: {}
	},
	components: [
		{kind: enyo.HFlexBox, className: "articleItem", components: [
			{name: "unread", className: "unreadBar", style: "opacity: 0"},
			{kind: enyo.VFlexBox, flex: 1, components: [
				{name: "itemTitle", className: "itemTitle", allowHtml: true},
				{name: "feedTitle", className: "feedTitle truncating-text", allowHtml: true}
			]}
		]}
	],
	create: function(){
		this.inherited(arguments);
	},
	itemChanged: function(){
		this.$.itemTitle.setContent(this.item.title);
		this.$.feedTitle.setContent(this.item.feed.title);
		this.$.unread.applyStyle("opacity", this.item.read ? 0 : 1);
	},
	markRead: function(){
		if(this.item.read === false){
			reader.setItemTag(this.item.feed.id, this.item.id, "read", true, enyo.bind(this, function(response){
				this.item.read = true;
				this.$.unread.applyStyle("opacity", (this.item.read ? 0 : 1))
				reader.decrementUnreadCount(this.item.feed.id, function(){
					publish("icons", ["reloadUnreadCounts"]);
				});	
			}));
		}
	},
	setRead: function(inReadState){
		this.item.read = inReadState;
		this.$.unread.applyStyle("opacity", (this.item.read ? 0 : 1))
	}
});