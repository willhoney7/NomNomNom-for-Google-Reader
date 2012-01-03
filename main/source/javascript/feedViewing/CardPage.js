enyo.kind({
	name: "NomNomNom.CardPage",
	kind: enyo.HFlexBox,
	//className: "enyo-vflexbox",
	style: "padding-left: 10px", 
	published: {
		items: [],
		page: 0
	},
	events: {
		onArticleView: ""	
	},
	components: [
		{name: "card0",  kind: "ItemCard", onclick: "itemClick"},
		{name: "card1",  kind: "ItemCard", onclick: "itemClick"},
		{name: "card2",  kind: "ItemCard", onclick: "itemClick"},
		{kind: "ApplicationEvents", onWindowRotated: "windowRotated"},

	],
	rendered: function(){
		this.inherited(arguments);

		this.windowRotated();
	},
	itemsChanged: function(){
		for(var i = 0; i < 3; i++){
			if(this.items[i]){
				this.$["card" + i].setItem(this.items[i]);
				this.$["card" + i].setShowing(true);
			} else {
				this.$["card" + i].setShowing(false);
				this.$["card" + i].setItem(undefined);
			}	
		}
		
	},
	markRead: function(){
		for(var i = 0; i < 3; i++){
			if(this.items[i]){
				this.$["card" + i].markRead();
			}
		}
	},

	windowRotated: function(){
		var orientation = AppUtils.getOrientation();
		this.addClass(orientation);
		this.removeClass(orientation === "portrait" ? "landscape" : "portrait");

	},

	itemClick: function(inSender, inEvent){
		this.doArticleView(this.items[parseInt(inSender.name.replace("card", ""), 10)], inSender, parseInt(inSender.name.replace("card", ""), 10), this.page);

		if(inEvent){
			inEvent.stopPropagation();		
		}
	},
	viewArticle: function(){
		this.doArticleView(this.items[0], this.$.card0, 0, this.page, true);		
	}
})