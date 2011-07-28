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
			{kind: enyo.Control, className: "content", components: [
				{kind: enyo.Image, className: "firstImage", showing: true},
				{kind: enyo.HtmlContent, name: "summary", className: "summary"}
			]}
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
		console.log($("<div>" + itemContent + "</div>").find("img:first"));
		var img = new Image(), self = this;
		img.onload = function() {
			if(this.width < 50 || this.height < 50){
				self.$.image.setShowing(false);
			}
		};
		img.src = firstImageURL;

		this.$.title.setContent(this.item.title);
		if(firstImageURL){
			this.$.image.setSrc(firstImageURL);
			this.$.image.setShowing(true);
		}
		this.$.date.setContent(AppUtils.formatDate(this.item.updated));
		
		this.$.summary.setContent(htmlToText(itemContent));

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
				reader.decrementUnreadCount(this.item.origin.streamId, AppUtils.refreshUnreadCounts);
			}));
		}
	},

});