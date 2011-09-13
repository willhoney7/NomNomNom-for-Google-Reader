enyo.kind({
	name: "enyo.MegaSnapScroller",
	kind: enyo.SnapScroller,
	create: function(){
		this.inherited(arguments);
		this.$.scroll.kFrictionDamping = 0.75;
		this.$.scroll.kSpringDamping = 0.8;
		this.$.scroll.kFrictionEpsilon = 0.1;	
	},
	scrollStop: function() {
		this.inherited(arguments);
		this.doScrollStop();
	}
});

enyo.kind({
	name: "NomNomNom.CardContainer",
	kind: enyo.VFlexBox,
	published: {
		items: [],
		index: 0
	},
	events: {
		onArticleView: "",
	},
	components: [
		{name: "snapScroller", kind: enyo.MegaSnapScroller, flex: 1, autoVertical: false, vertical: false, horizontal: true, autoHorizontal: true, className: "enyo-hflexbox", style: "padding-left: 10px", flex: 1, onSnap: "cardSnap", onSnapFinish: "cardSnapFinish", onScrollStop: "scrollStop", components: []},
		{name: "loading", className: "loading", showing: false, components: [
			{content: "Loading...", className: "text"}
		]}
	],
	create: function(){
		this.inherited(arguments);

		this.changeIndex = _.throttle(enyo.bind(this, function(){
			//console.error("throttled triggered");
			this.setIndex(this.activeIndex);					
		}), 50);
	},
	itemsChanged: function(){
		var controls = this.$.snapScroller.getControls();
		this.itemIndex = 0;

		if(_(controls).size() > 0){
			_.each(controls, enyo.bind(this, function(control, index){
				if(this.items[index]){
					control.show();
					//control.setItem(this.items[index]);
					control.setIndex(index);	
				} else {
					control.hide();
				}
				
			}));
			//console.error("already has controls");
		} else {
			//console.error("need to create initial controls");

			var components = [], cardLength = 8;//(this.items.length > 8) ? 8 : this.items.length;
			for(var i = 0; i < cardLength; i++){
				components.push({kind: "ItemCard", item: this.items[i], index: i, snapIndex: i, showing: (this.items[i] ? true : false), onclick: "itemClick"});	
			}
			_.defer(enyo.bind(this, function(){
				this.$.snapScroller.createComponents(components, {owner: this});
				_.defer(enyo.bind(this, function(){
					this.$.snapScroller.render();
				}));
			}));
		}
		this.$.snapScroller.setIndex(0);				
	},
	cardSnap: function(inSender, inIndex){
		//console.error("card snapped");
		this.itemClicked = false;
		this.activeIndex = inIndex;
		//this.changeIndex();
	},
	cardSnapFinish: function(){
		//console.error("CARD SNAP FINISH");	
		this.changeIndex();
	},
	scrollStop: function(){
		//console.error("scroll stoppped " + this.activeIndex);
		this.changeIndex();
	},
	itemIndex: 0,
	indexChanged: function(){
		if(this.oldIndex === this.index && this.index > 1){
			_.defer(enyo.bind(this, this.markViewableCardsRead));
			return;
		}

		if (this.items.length < 9) {
			if(!this.itemClicked){
				if(this.owner.$.itemView.showing === true){
					_.defer(enyo.bind(this, function(){
						this.itemClick(this.$.snapScroller.getControls()[this.index], null, true);
						this.itemClicked = false;		
					}));
				}
			}
			return;
		}

		this.oldIndex = this.index;

		var renderTrigger = 3;

		if(this.index > renderTrigger){			
			var controls = this.$.snapScroller.getControls();
			if(_(controls).size() > 0){
				this.itemIndex += (this.index - 1);

				_.each(controls, enyo.bind(this, function(control, index){
					var itemIndex = index + this.itemIndex;					
					if(this.items[itemIndex]){
						control.show();
						//control.setItem(this.items[index]);
						//control.setSnapIndex(index);
						//console.log("set item " + this.items[itemIndex].title);
						control.setIndex(itemIndex);
					} else {
						control.hide();
					}
					
				}));	
			}
			this.viewedIndex = 1;//this.index - renderTrigger;
			//console.error("snapping to " + this.viewedIndex);
			this.$.snapScroller.setIndex(this.viewedIndex);

			this.index = this.viewedIndex;

		} else if (this.index < 1) {

			var controls = this.$.snapScroller.getControls();
			if(_(controls).size() > 0){
				this.itemIndex--;			
	
				_.each(controls, enyo.bind(this, function(control, index){
					//console.error("index " + index);
					//console.error("this.itemIndex " + this.itemIndex);
					var itemIndex = index + this.itemIndex;					
					if(this.items[itemIndex]){
						control.show();
						//control.setItem(this.items[index]);
						//control.setSnapIndex(index);
						control.setIndex(itemIndex);
					} else {
						control.hide();
					}
				}));	
			}
		

			this.viewedIndex = this.index + 1;
			//this.$.snapScroller.setScrollLeft(this.$.snapScroller.scrollLeft+322);
			this.$.snapScroller.setIndex(this.viewedIndex);
			this.index = 1;

		} else {
			this.viewedIndex = this.index;
			this.index = 1;
		}
		if(!this.itemClicked){
			if(this.owner.$.itemView.showing === true){
				_.defer(enyo.bind(this, function(){
					this.itemClick(this.$.snapScroller.getControls()[this.viewedIndex], null, true);
					this.itemClicked = false;		
				}));
			}
		}
		_.defer(enyo.bind(this, this.markViewableCardsRead));
	
	},
	markViewableCardsRead: function(){
		if(AppPrefs.get("autoMarkAsRead") === false){
			return;
		}
		var cardWidth = parseInt(AppPrefs.get("cardWidth").replace("px", ""), 10) + 20;
		var numVisible = Math.floor(this.$.snapScroller.node.offsetWidth/cardWidth);
		var offsetIndex = Math.floor(this.$.snapScroller.getScrollLeft()/cardWidth);
		var controls = this.$.snapScroller.getControls();
		for(var i = offsetIndex; i <= (offsetIndex + numVisible); i++){
			if(controls[i]){
				controls[i].markRead();
				//if(i === this.items.length-2){
				//	controls[i+1].markRead();
				//}
			} 
		}

	},

	itemClick: function(inSender, inEvent, noSnap){
			
		//console.log("insender.index " + inSender.index);
		
		//console.log("insender.snapindex " + inSender.snapIndex);

		if(inSender.index === undefined || inSender.snapIndex === undefined) {
			return;
		}

		this.doArticleView(this.items[inSender.index], inSender);

		if(!noSnap){	
			this.itemClicked = true;
	
			//console.error("snapIndex " + inSender.snapIndex);
			this.$.snapScroller.setIndex(inSender.snapIndex);
			this.setIndex(inSender.snapIndex);
		}
		
		if(inEvent){
			inEvent.stopPropagation();		
		}
	},

});