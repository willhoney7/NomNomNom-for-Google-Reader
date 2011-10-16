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
		{name: "scrollerSlidingView", flex: 1, components: [
			{name: "cardContainer", kind: "NomNomNom.CardContainer", items: [], flex: 1, index: 0, onArticleView: "viewArticle"},
			{name: "listContainer", kind: enyo.VFlexBox, flex: 1, className: "listContainer itemCard", width: "322px", components: [
				{className: "top"},
				{kind: enyo.VFlexBox, className: "mainContent", flex: 1, style: "overflow: hidden", allowHtml: true, components: [
					{kind: enyo.VirtualList, width: "322px", flex: 1, onSetupRow: "setupRow", className: "virtualList", components: [
						//{kind: enyo.Divider},
						{kind: "ArticleItem", tapHighlight: false, onclick: "articleItemClick"}
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
			} else if(action === "refresh"){
				this.loadFeed(this.feed, true);
			}
		}).bind(this));
	},
	loadFeed: function(inFeed, noHide){
		this.feed = inFeed;

		if(!noHide){
			this.$.itemView.hide();		
		}
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

	articleItemClick: function(inSender, inEvent){
		this.viewArticle(inSender, inSender.getItem(), inSender);
	},

	viewArticle: function(inSender, article, itemCard, index){
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
		publish("popups", ["confirm", inEvent, {
			title: "Mark all read?",
			doIt: enyo.bind(this, function(){
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
			})
		}]);
		
	}
});