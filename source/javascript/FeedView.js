enyo.kind({
	name: "FeedView", 
	className: "feedView",
	kind: enyo.SlidingPane, 
	flex: 1,
	events: {
		onViewIcons: ""
	},
	components: [
		{name: "scrollerSlidingView", kind: enyo.SlidingView, flex: 1, components: [
			{kind: enyo.SnapScroller, autoVertical: false, vertical: false, horizontal: true, autoHorizontal: true, className: "enyo-hflexbox", flex: 1, onSnap: "cardSnap", components: []},
		]},
		{kind: "ItemView", flex: 1,dismissible: true, dismissDistance: 350, showing: false}
	],
	create: function(){
		this.inherited(arguments);	
	},

	loadFeed: function(feed){
		//this.$.header.setContent(this.getFeed().label || this.getFeed().title);
		var opts = {
			n: 50
		};
			//based on setting, get the num of items.
		if(AppPrefs.get("tapGets") === "unread"){
			//if pref is to get only unread, then if the unread count is > 0, return the feed.count. If there are no unread items, return 50 (read) items.
			if(feed.count > 0){
				opts.n = feed.count;
				opts.xt = reader.TAGS["read"];
			}
		} else {
			//if pref is not set to get only unread, then set numOfItems 50 or the number of unread items if that is bigger.
			if(feed.count > 50){
				opts.n = feed.count;
			}
		}
		
		reader.getItems(feed.id, enyo.bind(this, this.loadedItems), opts);
	},
	loadedItems: function(items){
		this.$.snapScroller.destroyControls();
		this.$.snapScroller.render();

		this.items = items;
		this.nextIndex = 0;

		this.renderSome();
		this.$.snapScroller.setIndex(0);

	},
	renderSome: function(){
		var components = [], cardLength;
		if(this.nextIndex === this.items.length){
			return;
		}
		if ((this.items.length - this.nextIndex) > 50){
		 	cardLength = (this.nextIndex + 50);
		}	else {
			cardLength = this.items.length;
		};
		//console.log("rendering", this.nextIndex, "through", cardLength-1);

		for(this.nextIndex; this.nextIndex < cardLength; this.nextIndex++){
			components.push({kind: "ItemCard", item: this.items[this.nextIndex], index: this.nextIndex, onclick: "itemClick"});	
		}
		this.$.snapScroller.createComponents(components, {owner: this});
		this.$.snapScroller.render();

		this.markViewableCardsRead();
	},

	cardSnap: function(inSender, inIndex){
		//this.$.snapScroller.getControls()[inIndex].markRead();
		this.markViewableCardsRead();

		//console.log("card snap", inIndex, "this.nextIndex", this.nextIndex);
		if(this.nextIndex && (this.nextIndex - inIndex) <= 5){
			this.renderSome();
		}
	},

	markViewableCardsRead: function(){
		var cardWidth = parseInt(AppPrefs.get("cardWidth").replace("px", ""), 10) + 10;
		var numVisible = Math.round(this.$.snapScroller.node.offsetWidth/cardWidth);
		var offsetIndex = Math.floor(this.$.snapScroller.getScrollLeft()/cardWidth);
		var controls = this.$.snapScroller.getControls();
		for(var i = offsetIndex; i <= (offsetIndex + numVisible); i++){
			if(controls[i]){
				controls[i].markRead();
			}
		}

	},
	itemClick: function(inSender, inEvent){
		this.$.scrollerSlidingView.applyStyle("max-width", "330px");
		this.$.snapScroller.setIndex(inSender.getIndex());
		
		this.$.itemView.setShowing(true);
		this.$.itemView.setItem(inSender.getItem());
		console.log(inSender);
	}
});