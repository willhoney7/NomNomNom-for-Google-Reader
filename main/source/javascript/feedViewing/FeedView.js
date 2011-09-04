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
			{name: "cardContainer", kind: "NomNomNom.CardContainer", items: [], flex: 1, index: 0, onArticleView: "viewArticle"},
			{name: "listContainer", kind: enyo.VFlexBox, flex: 1, className: "listContainer itemCard", width: "322px", components: [
				{className: "top"},
				{kind: enyo.VFlexBox, className: "mainContent", flex: 1, style: "overflow: hidden", allowHtml: true, components: [
					{kind: enyo.VirtualList, width: "322px", flex: 1, onSetupRow: "setupRow", className: "virtualList", components: [
						//{kind: enyo.Divider},
						{kind: "ArticleItem", tapHighlight: true, onclick: "articleItemClick"}
					]},
					{kind: enyo.Control, name: "bottomToolbar", className: "scrollfade"},
					/*{kind: enyo.Control, name: "bottomToolbar", className: "bottomToolbar", onclick: "markRead", allowHtml: true, components: [
						{kind: enyo.HFlexBox, className: "content", components: [
							{flex: 1, kind: enyo.Control, name: "feedTitle", onclick: "markAllRead", className: "feedTitle truncating-text", style: "text-align: center; padding-left: 5px", content: "Mark all read"},
						]}
					]}*/
				]},
			]},
			
			
		]},
			
		{kind: "ItemView", flex: 1, dismissible: true, dismissDistance: 350, showing: false}
	],
	create: function(){
		this.inherited(arguments);

		subscribe("feedView", _(function(action, arg1){
			if(action === "markRead"){
				this.markFeedRead(this, arg1);
			} else if(action === "rerenderItems"){
				_.each(this.$.cardContainer.$.snapScroller.getControls(), function(control){
					control.renderPrefs();
				});
				this.$.itemView.renderPrefs();

			}
		}).bind(this));
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
		
		_.defer(enyo.bind(this, function(){
			reader.getItems(inFeed.id, enyo.bind(this, function(items){
				if(items.length === 0){
					humane("No Items");
					this.doFeedLoaded(false);
				} else {
					this.setFeed(inFeed);
					this.loadedItems(items); 	
				}
				
			}), opts);
		}));
		

	},
	feedChanged: function(){
		//doo doo doo doo
	},
	items: [],
	loadedItems: function(items){

		this.items = items;
		if(AppPrefs.get("articleSort") === "oldest"){
			this.items = _(items).reverse();
		}
		this.items = AppUtils.formatArticleArray(this.items);

		this.nextIndex = 0;

		if(AppPrefs.get("articleView") === "cards"){
			this.$.itemView.hide();
			this.$.itemView.setDismissible(true);

			if(this.$.cardContainer.getShowing() === false){
				this.$.cardContainer.show();			
			}
			if(this.$.listContainer.getShowing() === true){
				this.$.listContainer.hide();			
			}
			//this.$.cardContainer.destroyControls();
			this.$.scrollerSlidingView.applyStyle("max-width", null);

			this.doFeedLoaded(true);

			_.defer(enyo.bind(this, function(){
				this.$.cardContainer.setItems(this.items);
				//this.$.cardContainer.setIndex(0);
				
				_.defer(enyo.bind(this, function(){
					//this.$.cardContainer.setIndex(0);
					_.defer(enyo.bind(this, function(){
						//this.markViewableCardsRead();
					}));
				}));

			}));

		} else if(AppPrefs.get("articleView") === "list"){
			this.$.itemView.setDismissible(false);
			this.$.scrollerSlidingView.applyStyle("max-width", "345px");

			if(this.$.cardContainer.getShowing() === true){
				this.$.cardContainer.hide();			
			}
			if(this.$.listContainer.getShowing() === false){
				this.$.listContainer.show();			
			}

			this.doFeedLoaded(true);
			_.defer(enyo.bind(this.$.virtualList, this.$.virtualList.punt));

			this.$.itemView.show();
			this.$.itemView.setItem({});
		}
		
	},
	/*renderSome: function(){
		var components = [], cardLength;
		if(this.nextIndex === this.items.length){
			return;
		}
		this.renderedIndexes = [0, 1, 2, 3, 4, 5];
		this.$.loading.show();
		this.$.loading.applyStyle("width", window.innerWidth + "px");

		if ((this.items.length - this.nextIndex) > 7){
		 	cardLength = (this.nextIndex + 7);
		}	else {
			cardLength = this.items.length;
		};
		//console.log("rendering", this.nextIndex, "through", cardLength-1);
		var startingIndex = this.nextIndex;
		for(this.nextIndex; this.nextIndex < cardLength; this.nextIndex++){
			components.push({kind: "ItemCard", item: this.items[this.nextIndex], index: this.nextIndex, onclick: "itemClick"});	
		}

		_.defer(enyo.bind(this, function(){
			this.$.cardContainer.createComponents(components, {owner: this});
			_.defer(enyo.bind(this, function(){
				//_(this.$.cardContainer.getControls()).each(function(control){
				//	if(control.index < cardLength && control.index >= startingIndex){
				//		console.log("rendering", control.item.title);
				//		_.defer(_.bind(control.render, control));
				// }
				//});
				this.$.cardContainer.render();
				_.defer(enyo.bind(this, function(){
					//if(this.nextIndex > 40){
					//	_(this.$.cardContainer.getControls()).each(function(control, index, array){
					//		if(index < 20){
					//			control.destroy();
					//		}
					//	});
					//}
					this.$.loading.hide();				
				}));
				
			}));
		}));

	},
	renderOne: function(){
		console.log("rendering", this.nextIndex);
		if(this.nextIndex === this.items.length){
			return;
		}
		var createdComponent = this.$.cardContainer.createComponent({kind: "ItemCard", item: this.items[this.nextIndex], index: this.nextIndex, onclick: "itemClick"});
			createdComponent.render();

		this.renderedIndexes.push(this.nextIndex);
		this.renderedIndexes.sort(function(a, b){ return a - b; });
		this.renderedIndexes.shift();

		_(this.$.cardContainer.getControls()).min(function(control){
			if(!control.destroyed){
				return (control.index);	
			}
		}).destroy();

		this.nextIndex++;
	},

	cardSnap: function(inSender, inIndex){
		setTimeout(enyo.bind(this, this.markViewableCardsRead), 100);

		this.activeIndex = inIndex;
		console.log("this.activeIndex", inIndex);

		if(this.$.itemView.showing === true){ //&& AppPrefs.get("viewActiveCardInItemView") === true){
			setTimeout(enyo.bind(this, function(){
				this.itemClick(this.$.cardContainer.getControls()[inIndex], null, true);
			}), 400);
		}

		console.log("this.nextIndex", this.nextIndex);
		console.log("first renderedIndex", this.renderedIndexes[0]);

		if(this.nextIndex && (this.nextIndex - (this.activeIndex + this.renderedIndexes[0])) <= 5){
			_.defer(enyo.bind(this, this.renderOne));
		}

	},

	cardSnapFinish: function(inSender){
		
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
	},*/

	articleItemClick: function(inSender, inEvent){
		this.viewArticle(inSender, inSender.getItem(), inSender);
	},

	viewArticle: function(inSender, article, itemCard){
		this.$.scrollerSlidingView.applyStyle("max-width", "345px");
		
		this.$.itemView.setShowing(true);
		this.$.itemView.setItem(article);
		this.$.itemView.setItemCard(itemCard);

	},

	setupRow: function(inSender, inIndex){
		if(this.items[inIndex]){
			this.$.articleItem.setItem(this.items[inIndex]);
			//this.setupDivider(this.$.articleItem, inIndex);
			return true;
		}	
	},
	setupDivider: function(item, index){
		if(this.items[index + 1]){
			if(this.items[index + 1].name !== this.items[index]){
				item.applyStyle("border-bottom", "none" );
			} else {
				item.applyStyle("border-bottom", "1px solid silver");
			}
				
		} else {
			item.applyStyle("border-bottom", "none" );			
		}	
	},

	markFeedRead: function(inSender, inEvent){
		publish("popups", ["confirm", inEvent, enyo.bind(this, function(){
			reader.markAllAsRead(this.feed.id, enyo.bind(this, function(){
				_(this.items).each(function(item){
					item.read = true;
				});
				
				if(AppPrefs.get("articleView") === "list"){
					this.$.virtualList.refresh();
				} else {
					$(".unread").css("opacity", 0);
				}
			
				publish("icons", ["refresh"]);

			}));	
		})]);
		
	}
});