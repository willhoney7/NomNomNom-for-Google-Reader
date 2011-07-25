enyo.kind({
	name: "ItemCard", 
	className: "itemCard",
	kind: enyo.VFlexBox, 
	allowHtml: true,
	width: AppPrefs.get("cardWidth"),
	published: {
		item: {},
		index: 0,
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
			{kind: enyo.Control, name: "feedTitle", className: "feedTitle truncating-text", flex: 1, allowHtml: true}
		]}
		
	],
	create: function(){
		this.inherited(arguments);	
		this.itemChanged();
	},
	itemChanged: function(){
		//caption: this.items[i].label || this.items[i].title, icon: });	
		var itemContent = (this.item.summary) ? this.item.summary.content || "": (this.item.content) ? this.item.content.content || "": "";
		var firstImageURL = $("<div>" + itemContent + "</div>").find("img:first").attr("src");
		this.$.title.setContent(this.item.title);
		this.$.date.setContent(AppUtils.formatDate(this.item.updated));

		var content = //"<div class='title truncating-text'>" + this.item.title + "</div>"
					 (firstImageURL ? ("<img src = '" + firstImageURL + "' class = 'firstImage' />") : "")
					+ "<div class='summary'>" + htmlToText(itemContent) + "</div>";
		
		this.$.content.setContent(content);

		this.item.read = false;
		for(var i = 0; i < this.item.categories.length; i++){
			var re = /user\/\d+\/state\/com.google\/read$/i;
			if(re.test(this.item.categories[i])){
				this.item.read = true;
				break;
			}
		};
		this.$.unread.setShowing(!this.item.read);
		this.$.feedTitle.setContent(this.item.origin.title);

		
	},
	markRead: function(){
		if(this.item.read === false){
			reader.setItemTag(this.item.origin.streamId, this.item.id, "read", true, enyo.bind(this, function(response){
				this.item.read = true;
				this.$.unread.setShowing(false);

			}));
		}
	},

});