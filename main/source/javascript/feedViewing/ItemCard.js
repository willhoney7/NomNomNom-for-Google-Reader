enyo.kind({
	name: "ItemCard", 
	className: "itemCard",
	kind: enyo.VFlexBox, 
	allowHtml: true,
	//width: AppPrefs.get("cardWidth"),
	published: {
		item: {},
		index: 0,
		snapIndex: 0,
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
					{kind: enyo.HtmlContent, name: "summary", className: "summary", style: "padding-bottom: 20px"}
				]},
			]},
			{kind: enyo.Control, name: "bottomToolbar", className: "bottomToolbar", onclick: "toggleRead", allowHtml: true, components: [
				{kind: enyo.HFlexBox, className: "content bottomContent", components: [
					{kind: enyo.Image, name: "unread", className: "unread", src: "source/images/unread.png", style: "opacity: 1"},
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
		//this.indexChanged();
	},
	itemChanged: function(){
		//this.item = this.owner.items[this.index];

		if(!this.item){
			return;
		}

		this.$.image.hide();
		this.$.scroller.setScrollTop(0);

		if(this.item.firstImageURL){
			var img = new Image(), self = this;
			img.onload = function() {
				if(this.width < 50 || this.height < 50){
					self.$.image.setShowing(false);
				} else {
					self.$.image.setShowing(true);
					self.$.image.setSrc(self.item.firstImageURL);

				}
			};
			img.src = this.item.firstImageURL;
		}

		this.$.title.setContent(this.item.title);
		this.$.feedTitle.setContent(this.item.feed.title);
		this.$.date.setContent(this.item.formattedDate);	
		this.$.summary.setContent(this.item.condensedContent);

		this.$.star.setSrc(this.item.star ? "source/images/star_yes.png" : "source/images/star_no.png");
		this.$.unread.setShowing(!this.item.read);
		this.$.unread.applyStyle("opacity", (this.item.read ? 0 : 1))

		this.renderPrefs();
	},
	rendered: function(){
		this.inherited(arguments);

		this.$.feedTitle.applyStyle("max-width", this.$.bottomToolbar.getBounds().width - 65 - this.$.date.getBounds().width + "px");
	},
	renderPrefs: function(){
		this.$.summary.applyStyle("font-size", AppPrefs.get("itemCardFontSize"));	
	},
	resized: function(){
		console.log("resized");	
	},
	markRead: function(inSender, inEvent){
		if(this.item.read === false){
			_.defer(enyo.bind(this, function(){
				reader.setItemTag(this.item.feed.id, this.item.id, "read", true, enyo.bind(this, function(response){
					this.item.read = true;
					//this.item.categories.push(reader.TAGS["read"]);
					this.$.unread.applyStyle("opacity", (this.item.read ? 0 : 1));
					_.delay(enyo.bind(this, function(){
						this.$.unread.setShowing(!this.item.read);
					}), 300);
					reader.decrementUnreadCount(this.item.feed.id, function(){
						publish("icons", ["reloadUnreadCounts"]);
					});
				}));	
			}));	
		}

		if(inEvent){
			inEvent.stopPropagation();
		}
	},
	toggleRead: function(inSender, inEvent){
		if(inEvent){
			inEvent.stopPropagation();
			inEvent.preventDefault();
		}

		//console.log("ITEM IS FRESH? " + this.item.fresh);
		if(!this.item.fresh && this.item.read){
			humane("Unable to mark unread");
			return;
		}
		
		_.defer(enyo.bind(this, function(){
			reader.setItemTag(this.item.feed.id, this.item.id, "read", !this.item.read, enyo.bind(this, function(response){
				this.item.read = !this.item.read;
				this.$.unread.setShowing(true);
				//if(this.item.read){
				//} else {
					_.delay(enyo.bind(this, function(){
						this.$.unread.setShowing(!this.item.read);
					}), 500);
				//}
				this.$.unread.applyStyle("opacity", (this.item.read ? 0 : 1));
				
				/*reader.decrementUnreadCount(this.item.feed.id, function(){
					publish("icons", ["reloadUnreadCounts"]);
				});*/
			}));	
		}));		
		
		
	},
	setRead: function(inReadState){
		this.item.read = inReadState;
		this.$.unread.setShowing(!this.item.read);
		this.$.unread.applyStyle("opacity", (this.item.read ? 0 : 1));
	},

	toggleStarred: function(inSender, inEvent){

		//change the image so the user knows it worked
		this.$.star.setSrc((!this.item.star ? "source/images/star_yes.png" : "source/images/star_no.png"));
		
		reader.setItemTag(this.item.feed.id, this.item.id, "star", !this.item.star, enyo.bind(this, function(){
			this.item.star = !this.item.star;
			//make sure the the correct image is shown
			this.$.star.setSrc((this.item.star ? "source/images/star_yes.png" : "source/images/star_no.png"));
		
			//this is bad form
			if(this.owner.owner.$.itemView.getItem().id === this.item.id){
				this.owner.owner.$.itemView.changeStar(this.item.star);
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