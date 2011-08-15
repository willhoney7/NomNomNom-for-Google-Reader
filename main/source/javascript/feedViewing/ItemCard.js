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
		{className: "top"},
		{kind: enyo.VFlexBox, className: "mainContent", flex: 1, style: "overflow: hidden", allowHtml: true, components: [
			{kind: enyo.HFlexBox, className: "header", components: [
				{kind: enyo.Control, flex: 1, name: "title", className: "title", allowHtml: true},
			]},
			{kind: enyo.Scroller, flex: 1, autoVertical: true, components: [
				{kind: enyo.Control, flex: 1, className: "content", components: [
					{kind: enyo.Image, className: "firstImage", showing: true},
					{kind: enyo.HtmlContent, name: "summary", className: "summary"}
				]},
			]},
			{kind: enyo.Control, name: "bottomToolbar", className: "bottomToolbar", onclick: "markRead", allowHtml: true, components: [
				{kind: enyo.HFlexBox, className: "content", components: [
					{kind: enyo.Image, name: "unread", className: "unread", src: "source/images/unread.png", style: "opacity: 0"},
					{kind: enyo.Control, name: "feedTitle", className: "feedTitle truncating-text", allowHtml: true},
					{kind: enyo.Spacer},
					{kind: enyo.Control, name: "date", className: "date"},
					{name: "star", kind: enyo.Image, onclick: "toggleStarred", src: "source/images/star_no.png"}
				]}
			]}
		]},
		
		
	],
	create: function(){
		this.inherited(arguments);	
		this.itemChanged();
	},
	itemChanged: function(){
		//caption: this.items[i].label || this.items[i].title, icon: });	
		var itemContent = (this.item.summary) ? this.item.summary.content || "": (this.item.content) ? this.item.content.content || "": "";
		var firstImageURL = $("<div>" + itemContent + "</div>").find("img").first().attr("src");
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
		
		this.$.summary.setContent(htmlToText(itemContent) + "<br/><br/><br/><br/>");
				
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

		if(this.item.star){
			this.$.star.setSrc("source/images/star_yes.png");
		}

		this.$.unread.applyStyle("opacity", (this.item.read ? 0 : 1))
		this.$.feedTitle.setContent(this.item.origin.title);

		this.renderPrefs();
		
	},
	rendered: function(){
		this.inherited(arguments);

		this.$.feedTitle.applyStyle("max-width", this.$.bottomToolbar.getBounds().width - 65 - this.$.date.getBounds().width + "px");
	},
	renderPrefs: function(){
		this.$.summary.applyStyle("font-size", AppPrefs.get("itemCardFontSize"));	
	},
	markRead: function(){
		if(this.item.read === false){
			reader.setItemTag(this.item.origin.streamId, this.item.id, "read", true, enyo.bind(this, function(response){
				this.item.read = true;
				this.$.unread.applyStyle("opacity", (this.item.read ? 0 : 1))
				reader.decrementUnreadCount(this.item.origin.streamId, AppUtils.refreshUnreadCounts);
			}));
		}
	},

	toggleStarred: function(inSender, inEvent){

		//change the image so the user knows it worked
		this.$.star.setSrc((!this.item.star ? "source/images/star_yes.png" : "source/images/star_no.png"));
		
		reader.setItemTag(this.item.origin.streamId, this.item.id, "star", !this.item.star, enyo.bind(this, function(){
			this.item.star = !this.item.star;
			//make sure the the correct image is shown
			this.$.star.setSrc((this.item.star ? "source/images/star_yes.png" : "source/images/star_no.png"));
		
			//this is bad form
			if(this.owner.$.itemView.getItem().id === this.item.id){
				this.owner.$.itemView.changeStar(this.item.star);
			}
		}));

		if(inEvent){
			inEvent.stopPropagation();
		}

		
	},
	changeStar: function(inValue){
		this.$.star.setSrc((inValue ? "source/images/star_yes.png" : "source/images/star_no.png"));		
	}

});