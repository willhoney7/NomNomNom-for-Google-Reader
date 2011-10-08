enyo.kind({
	name: "ArticleItem",
	kind: enyo.Item,
	published: {
		item: {}
	},
	components: [
		{name: "articleBox", kind: enyo.HFlexBox, className: "articleItem", components: [
			{name: "unread", className: "unreadBar", style: "opacity: 0"},
			{name: "swipeStuff", kind: enyo.VFlexBox, flex: 1, style: "background-color: #F2EDE9;", components: [
				{name: "itemTitle", className: "itemTitle", allowHtml: true},
				{kind: enyo.HFlexBox, components: [
					{name: "feedTitle", className: "feedTitle truncating-text", flex: 1, allowHtml: true},
					{name: "date", className: "feedTitle", style: "padding-right: 5px"}
				]}
			]},
		]},
		{name: "star", className: "starBar", style: "opacity: 0"},
	],
	create: function(){
		this.inherited(arguments);
	},
	itemChanged: function(){
		this.$.itemTitle.setContent(this.item.title);
		this.$.feedTitle.setContent(this.item.feed.title);
		this.$.date.setContent(this.item.formattedDate);
		this.$.unread.applyStyle("opacity", this.item.read ? 0 : 1);
		this.$.star.applyStyle("opacity", (this.item.star ? 1 : 0));
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
	toggleRead: function(){

		//console.log("ITEM IS FRESH? " + this.item.fresh);
		if(!this.item.fresh && this.item.read){
			humane("Unable to mark unread");
			return;
		}
		var newState = !this.item.read;
		_.delay(enyo.bind(this, function(){
			this.$.unread.applyStyle("opacity", (newState ? 0 : 1));
		}), 200);
		
		_.defer(enyo.bind(this, function(){
	
			reader.setItemTag(this.item.feed.id, this.item.id, "read", !this.item.read, enyo.bind(this, function(response){
				this.item.read = !this.item.read;
				this.$.unread.applyStyle("opacity", (this.item.read ? 0 : 1));
				
				/*reader.decrementUnreadCount(this.item.feed.id, function(){
					publish("icons", ["reloadUnreadCounts"]);
				});*/
			}));	
		}));

	},
	toggleStar: function(){

		var newState = !this.item.star;
		_.delay(enyo.bind(this, function(){
			this.$.star.applyStyle("opacity", (newState ? 1 : 0));
		}), 200);

		reader.setItemTag(this.item.feed.id, this.item.id, "star", !this.item.star, enyo.bind(this, function(response){
			this.item.star = !this.item.star;
			this.$.star.applyStyle("opacity", (this.item.star ? 1 : 0));
		}));
	},
	setRead: function(inReadState){
		this.item.read = inReadState;
		this.$.unread.applyStyle("opacity", (this.item.read ? 0 : 1));
	},
	allowLeft: true,

	flickHandler: function(inSender, inEvent) {
		// we need to squelch flicks if we are dragging to prevent spillover into scrollers
		return this.handlingDrag;
	},
	dragstartHandler: function(inSender, inEvent) {
		this.resetPosition();
		if (inEvent.horizontal && this.$.swipeStuff.hasNode()) {
			this.index = inEvent.rowIndex;
			this.handlingDrag = true;
			
			var dx = this.getDx(inEvent);
			if(dx > 0){
				this.deltaDir = "left";
				this.toggleRead();
			} else if(dx < 0){
				this.deltaDir = "right";
				this.toggleStar();
			}
			return true;			
		} else {
			return this.fire("ondragstart", inEvent);
		}
	},
	dragHandler: function(inSender, inEvent) {
		var dx = this.getDx(inEvent);
		if (this.handlingDrag) {
			if(this.deltaDir === "left"){
				if(dx < 0){
					dx = 0;
				} else if (dx > 35){
					dx = 35;
				}

				this.$.swipeStuff.node.style.webkitTransform = "translate3d(" + dx + "px, 0, 0)";

			} else  if(this.deltaDir === "right"){	
				if(dx > 0){
					dx = 0;
				} else if(dx < -35){
					dx = -35;
				}
				this.$.articleBox.node.style.webkitTransform = "translate3d(" + dx + "px, 0, 0)";
								
			} 
			return true;
		}
	},
	dragfinishHandler: function(inSender, inEvent) {
		if (this.handlingDrag) {
			var dx = this.getDx(inEvent);
			inEvent.preventClick();
			this.handlingDrag = false;
			this.resetPosition();
			return true;
		} else {
			this.fire("ondragfinish", inEvent);
		}
	},
	handleSwipe: function() {
		
	},
	resetPosition: function() {
		if(this.deltaDir === "left"){
			this.$.swipeStuff.node.style.webkitTransform = "";

		} else if(this.deltaDir === "right" && this.$.articleBox.hasNode()){	
			this.$.articleBox.node.style.webkitTransform = "";

		} 
		
	},
	getDx: function(inEvent) {
		// Obey allowLeft in calculation of dx values.
		return inEvent.dx > 0 || this.allowLeft ? inEvent.dx : 0;
	}
});