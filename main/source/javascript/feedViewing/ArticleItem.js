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
		this.item.read = false;
		this.item.star = false;
		this.item.shared = false;
		var readRegExp = new RegExp(reader.TAGS["read"].replace("user/-", "") + "$", "ig");
		for(var i = 0; i < this.item.categories.length; i++){
			if(readRegExp.test(this.item.categories[i])){
				this.item.read = true;				
			}
			if(_(this.item.categories[i]).includes(reader.TAGS["star"].replace("user/-", ""))){
				this.item.star = true;				
			}
			if(_(this.item.categories[i]).includes(reader.TAGS["share"].replace("user/-", ""))){
				this.item.shared = true;				
			}
		};

		this.$.feedTitle.setContent(this.item.origin.title);

		this.$.unread.applyStyle("opacity", this.item.read ? 0 : 1);
	},
	markRead: function(){
		if(this.item.read === false){
			reader.setItemTag(this.item.origin.streamId, this.item.id, "read", true, enyo.bind(this, function(response){
				this.item.read = true;
				this.$.unread.applyStyle("opacity", (this.item.read ? 0 : 1))
				reader.decrementUnreadCount(this.item.origin.streamId, AppUtils.refreshUnreadCounts);
			}));
		}
	}
});