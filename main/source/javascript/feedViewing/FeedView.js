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
			{name: "cardContainer", kind: enyo.SnapScroller, autoVertical: false, vertical: false, horizontal: true, autoHorizontal: true, className: "enyo-hflexbox", style: "padding-left: 10px", flex: 1, onSnap: "cardSnap", onSnapFinish: "cardSnapFinish", components: []},
			/*{name: "listContainer", kind: enyo.VFlexBox, flex: 1, className: "listContainer itemCard", width: "322px", components: [
				{className: "top"},
				{kind: enyo.VFlexBox, className: "mainContent", flex: 1, style: "overflow: hidden", allowHtml: true, components: [
					{kind: enyo.VirtualList, width: "322px", flex: 1, onSetupRow: "setupRow", className: "virtualList", components: [
						{kind: "ArticleItem", onclick: "articleItemClick"}
					]},
					{kind: enyo.Control, height: "50px"},
					{kind: enyo.Control, name: "bottomToolbar", className: "bottomToolbar", onclick: "markRead", allowHtml: true, components: [
						{kind: enyo.HFlexBox, className: "content", components: [
							{kind: enyo.Control, name: "feedTitle", className: "feedTitle truncating-text", allowHtml: true},
							{kind: enyo.Spacer},
							{kind: enyo.Control, name: "date", className: "date"},
							{name: "star", kind: enyo.Image, onclick: "toggleStarred", src: "source/images/star_no.png"}
						]}
					]}
				]},
			]}	*/
			
			
		]},
			
		{kind: "ItemView", flex: 1, dismissible: true, dismissDistance: 350, showing: false}
	],
	create: function(){
		this.inherited(arguments);
		AppUtils.refreshItems = enyo.bind(this, function(){
			_.each(this.$.cardContainer.getControls(), function(control){
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

		this.items = items;
		this.nextIndex = 0;

		if(AppPrefs.get("articleView") === "cards"){
			this.$.itemView.hide();
			this.$.itemView.setDismissible(true);
			//this.$.listContainer.hide();
			this.$.cardContainer.show();
			this.$.cardContainer.destroyControls();
			this.$.scrollerSlidingView.applyStyle("max-width", null);


			this.doFeedLoaded(true);
			this.renderSome();
			this.$.cardContainer.setIndex(0);

			this.markViewableCardsRead();
		} else if(AppPrefs.get("articleView") === "list"){
			this.$.itemView.setDismissible(false);
			this.$.scrollerSlidingView.applyStyle("max-width", "345px");

			this.$.cardContainer.hide();
			//this.$.listContainer.show();

			this.doFeedLoaded(true);
			this.$.virtualList.refresh();

			this.$.itemView.show();
			this.$.itemView.setItem({});
		}
		
	},
	renderSome: function(){
		var components = [], cardLength;
		if(this.nextIndex === this.items.length){
			return;
		}
		if ((this.items.length - this.nextIndex) > 15){
		 	cardLength = (this.nextIndex + 15);
		}	else {
			cardLength = this.items.length;
		};
		//console.log("rendering", this.nextIndex, "through", cardLength-1);

		for(this.nextIndex; this.nextIndex < cardLength; this.nextIndex++){
			components.push({kind: "ItemCard", item: this.items[this.nextIndex], index: this.nextIndex, onclick: "itemClick"});	
		}

		this.$.cardContainer.createComponents(components, {owner: this});
		
		setTimeout(enyo.bind(this, function(){ 
			this.$.cardContainer.render();
		}), 10);

	},

	cardSnap: function(inSender, inIndex){
		setTimeout(enyo.bind(this, this.markViewableCardsRead), 0);

		this.activeIndex = inIndex;

		if(this.$.itemView.showing === true){ //&& AppPrefs.get("viewActiveCardInItemView") === true){
			setTimeout(enyo.bind(this, function(){
				this.itemClick(this.$.cardContainer.getControls()[inIndex], null, true);
			}), 400);
		}

	},

	cardSnapFinish: function(inSender){
		if(this.nextIndex && (this.nextIndex - this.activeIndex) <= 5){
			setTimeout(enyo.bind(this, this.renderSome), 0);
		}
	},

	markViewableCardsRead: function(){
		if(AppPrefs.get("autoMarkAsRead") === false){
			return;
		}
		var cardWidth = parseInt(AppPrefs.get("cardWidth").replace("px", ""), 10) + 20;
		var numVisible = Math.round(this.$.cardContainer.node.offsetWidth/cardWidth);
		var offsetIndex = Math.floor(this.$.cardContainer.getScrollLeft()/cardWidth);
		var controls = this.$.cardContainer.getControls();
		for(var i = offsetIndex; i <= (offsetIndex + numVisible); i++){
			if(controls[i]){
				controls[i].markRead();
				if(i === this.items.length-2){
					controls[i+1].markRead();
				}
			} 
		}

	},
	articleItemClick: function(inSender, inEvent){
		
		this.itemClick(inSender, inEvent, true);
	},
	itemClick: function(inSender, inEvent, noSnap){
		this.$.scrollerSlidingView.applyStyle("max-width", "345px");
		
		if(!noSnap){		
			this.$.cardContainer.setIndex(inSender.getIndex());
		}
		
		this.$.itemView.setShowing(true);
		this.$.itemView.setItem(inSender.getItem());
		this.$.itemView.setItemCard(inSender);

		if(inEvent){
			inEvent.stopPropagation();		
		}
	},

	setupRow: function(inSender, inIndex){
		if(this.items[inIndex]){
			this.$.articleItem.setItem(this.items[inIndex]);
			return true;
		}	
	},
});