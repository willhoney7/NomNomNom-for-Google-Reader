enyo.kind({
	name: "NomNomNom.FeedView", 
	className: "feedView",
	kind: "ekl.Layout.SlidingPane", 
	flex: 1,
	events: {
		onFeedLoaded: "",
		onViewIcons: ""
	},
	published: {
		feed: {}	
	},
	components: [
		{name: "scrollerSlidingView", kind: enyo.SlidingView, flex: 1, components: [
			{kind: enyo.SnapScroller, autoVertical: false, vertical: false, horizontal: true, autoHorizontal: true, className: "enyo-hflexbox", style: "padding-left: 10px", flex: 1, onSnap: "cardSnap", components: []},
		]},
		{kind: "ItemView", flex: 1, dismissible: true, dismissDistance: 350, showing: false}
	],
	create: function(){
		this.inherited(arguments);
		AppUtils.refreshItems = enyo.bind(this, function(){
			_.each(this.$.snapScroller.getControls(), function(control){
				control.renderPrefs();
			});
			this.$.itemView.renderPrefs();
		});
	},
	loadFeed: function(inFeed){
		this.$.itemView.hide();
		
		//this.setFeed(inFeed);
		
		//this.$.header.setContent(this.getFeed().label || this.getFeed().title);
		var opts = {
			n: 50
		};
			//based on setting, get the num of items.
		if(AppPrefs.get("tapGets") === "unread"){
			//if pref is to get only unread, then if the unread count is > 0, return the feed.count. If there are no unread items, return 50 (read) items.
			if(inFeed.count > 0){
				opts.n = inFeed.count;
				opts.xt = reader.TAGS["read"];
			}
		} else {
			//if pref is not set to get only unread, then set numOfItems 50 or the number of unread items if that is bigger.
			if(inFeed.count > 50){
				opts.n = inFeed.count;
			}
		}
		
		reader.getItems(inFeed.id, enyo.bind(this, function(items){
			if(items.length === 0){
				humane("No Items");
				this.doFeedLoaded(false);
			} else {
				this.setFeed(inFeed);
				this.loadedItems(items); 	
			}
			
		}), opts);

	},
	feedChanged: function(){
		//do do do do
	},
	loadedItems: function(items){

		this.$.itemView.hide(); //@TODO: this fails, bug?

		this.items = items;
		this.nextIndex = 0;

		this.$.snapScroller.destroyControls();

		this.doFeedLoaded(true);
		this.renderSome();
		this.$.snapScroller.setIndex(0);

		this.markViewableCardsRead();
		

	},
	renderSome: function(){
		var components = [], cardLength;
		if(this.nextIndex === this.items.length){
			return;
		}
		if ((this.items.length - this.nextIndex) > 10){
		 	cardLength = (this.nextIndex + 10);
		}	else {
			cardLength = this.items.length;
		};
		//console.log("rendering", this.nextIndex, "through", cardLength-1);

		for(this.nextIndex; this.nextIndex < cardLength; this.nextIndex++){
			components.push({kind: "ItemCard", item: this.items[this.nextIndex], index: this.nextIndex, onclick: "itemClick"});	
		}
		this.$.snapScroller.createComponents(components, {owner: this});
		//setTimeout(enyo.bind(this, function(){ 
			this.$.snapScroller.render();
		//}), 0);

	},

	cardSnap: function(inSender, inIndex){
		
		setTimeout(enyo.bind(this, this.markViewableCardsRead), 0);

		if(this.nextIndex && (this.nextIndex - inIndex) <= 5){
			setTimeout(enyo.bind(this, this.renderSome), 0);
		}
	},

	markViewableCardsRead: function(){
		var cardWidth = parseInt(AppPrefs.get("cardWidth").replace("px", ""), 10) + 20;
		var numVisible = Math.round(this.$.snapScroller.node.offsetWidth/cardWidth);
		var offsetIndex = Math.floor(this.$.snapScroller.getScrollLeft()/cardWidth);
		var controls = this.$.snapScroller.getControls();
		for(var i = offsetIndex; i <= (offsetIndex + numVisible); i++){
			if(controls[i]){
				controls[i].markRead();
				if(i === this.items.length-2){
					controls[i+1].markRead();
				}
			} 
		}

	},
	itemClick: function(inSender, inEvent){
		this.$.scrollerSlidingView.applyStyle("max-width", "345px");
		this.$.snapScroller.setIndex(inSender.getIndex());
		
		this.$.itemView.setShowing(true);
		this.$.itemView.setItem(inSender.getItem());

		inEvent.stopPropagation();
	}
});