enyo.kind({
	name: "ItemView",
	className: "itemView",
	kind: enyo.SlidingView,
	published: {
		item: {}	
	},
	components: [
		{kind: enyo.Header, components: [
			{name: "title", className: "title"},
			{kind: enyo.Spacer},
			{name: "date", className: "date"}
		]},
		{kind: enyo.Scroller, flex: 1, showing: true, components: [
			{name: "soundContainer", kind: enyo.HFlexBox, flex: 1, style: "background-color: white; -webkit-border-radius: 10px; margin: 10px; padding: 3px", components: [
				{kind: "ToolButton", name: "playButton", icon: "source/images/menu-icon-play.png", onclick: "playAudio"},
				{kind: enyo.Control, content: "Play Audio", style: "position: relative; top: 10px;"},
				{name: "launchMediaStreamer", kind: "PalmService", service: "palm://com.palm.applicationManager", method: "open"}
			]},
			{kind: enyo.HtmlContent, flex: 1, name: "content", className: "content"}
		]},
		{name: "webView", kind: enyo.BasicWebView, flex: 1, showing: false},
		{kind: enyo.Toolbar, components: [
			{kind: enyo.GrabButton},
			{kind: enyo.Spacer},
			{kind: enyo.ToolButton, name: "share", onclick: "share", icon: "source/images/menu-icon-share.png"},
			{kind: enyo.ToolButton, name: "star", onclick: "toggleStarred", icon: "source/images/menu-icon-starred-outline.png"},
			{kind: enyo.ToolButton, icon: "source/images/menu-icon-browser.png", onclick: "openInBrowser"},
			{kind: enyo.Spacer}
		]},

		{name: "sharePopup", kind: enyo.PopupSelect, onSelect: "sharePopupSelected"},
		{name: "launchApp", kind: "PalmService", service: "palm://com.palm.applicationManager", method: "launch"}

	],
	create: function(){
		this.inherited(arguments);
	},
	itemChanged: function(){
		//caption: this.items[i].label || this.items[i].title, icon: });	
		this.$.title.setContent(this.item.title);
		this.$.date.setContent(AppUtils.formatLongDate(this.item.updated))

		var itemContent = (this.item.content) ? this.item.content.content || "": (this.item.summary) ? this.item.summary.content || "": "";		
		this.$.content.setContent((this.item.author ? "By " + this.item.author + "<br/>": "<br/>") + itemContent);

		this.item.read = true;
		this.item.star = false;
		this.item.shared = false;
		for(var i = 0; i < this.item.categories.length; i++){
			if(_(this.item.categories[i]).includes(reader.TAGS["fresh"].replace("user/-", ""))){
				this.item.read = false;				
			}
			if(_(this.item.categories[i]).includes(reader.TAGS["star"].replace("user/-", ""))){
				this.item.star = true;				
			}
			if(_(this.item.categories[i]).includes(reader.TAGS["share"].replace("user/-", ""))){
				this.item.shared = true;				
			}
		};
		this.$.star.setIcon((this.item.star ? "source/images/menu-icon-starred.png" : "source/images/menu-icon-starred-outline.png"));

		this.$.webView.setShowing(false);
		this.$.scroller.setShowing(true);


		if(this.item.enclosure && this.item.enclosure.length > 0){
			for(var i = 0; i < this.item.enclosure.length; i++){
				if(_(this.item.enclosure[i].type).includes("audio")){
					this.sound = this.item.enclosure[i].href;					
					this.$.soundContainer.show();
					break;
				} else {
					this.$.soundContainer.hide();
				}
			}
		} else {
			this.$.soundContainer.hide();
		}

		//this.$.unread.setShowing(!this.item.read);
		//this.$.feedTitle.setContent(this.item.origin.title);

		//this.$.pane.selectViewByName("view");
	},
	playAudio: function(){
		//OPEN STREAMING media player
		if(this.sound){
			this.$.launchMediaStreamer.call({target: this.sound});	
		}
	},
	
	openInBrowser: function(){
		if(this.item.alternate && this.item.alternate[0] && this.item.alternate[0].href){
			window.location = this.item.alternate[0].href;
			/*if(this.$.webView.showing === false){
				this.$.webView.setUrl(this.item.alternate[0].href);
				this.$.webView.setShowing(true);
				this.$.scroller.setShowing(false);
			} else {
				this.$.webView.setShowing(false);
				this.$.scroller.setShowing(true);
				//window.open(this.item.alternate[0].href);
			}*/
		}
	},
	share: function(inSender, inEvent){
		this.shareItems = [
			{caption: $L("Share via SMS"), value: "sms"},
			{caption: $L("Share via Email"), value: "email"},
			{caption: $L("Share via Spaz HD"), value: "spaz"},
			//{caption: $L("Add to Instapaper"), value: "instapaper"}
		];
		if(this.item.shared){
			this.shareItems.unshift({caption: $L("Unshare from Google Reader"), value: "googlereader"});
		} else {
			this.shareItems.unshift({caption: $L("Share via Google Reader"), value: "googlereader"});			
		}
		this.$.sharePopup.setItems(this.shareItems);
		this.$.sharePopup.openAtEvent(inEvent);
	},
	sharePopupSelected: function(inSender, inSelected){
		if(inSelected.value === "sms" || inSelected.value === "email" || inSelected.value === "spaz"){
			var shortUrl = new SpazShortURL(SPAZCORE_SHORTURL_SERVICE_JMP);
			shortUrl.shorten(this.item.alternate[0].href, {
				onSuccess: enyo.bind(this, function(obj){
					
					//get the max character length we can have.
					var maxCharLength = (inSelected.value === "spaz") ? 140 : inSelected.value === "sms" ? 160 : 500;
					var identifier = (inSelected.value === "spaz")? " #nomnomnomRSS" : (inSelected.value === "sms") ? " via NomNomNom" : " via NomNomNom for Google Reader";
					//truncate the title based on the maxCharLength minus the thing we will add.
					var sharedString = _(this.item.title).truncate(maxCharLength - (" " + obj.shorturl).length - identifier.length - 3);
						//add the short url and the hashtag
						sharedString += " " + obj.shorturl + identifier;
					
					switch(inSelected.value){
						case "sms":
							this.$.launchApp.call({
								id:"com.palm.app.messaging", 
								params: {
									compose: {
										messageText: sharedString
									}
								}	
							});
							break;
						case "email":
							this.$.launchApp.call({
								id: 'com.palm.app.email',
								params: {
									summary: "Check out this Article",
									text: sharedString
								}
							});
							break;
						case "spaz":
							this.$.launchApp.call({
								id: "com.funkatron.app.spaz-hd",
								params: {
									action: "post",
									msg: sharedString
								}
							});
							break;
					}
				}),
				onError: function(){
					console.error(arguments);
				},
				apiopts: {
					login: "nomnomnomrss",
					apiKey: "R_4e97d35ac9f28c9d0dc6dd6e428552a3"
				}
			})
		}
		else {
			switch(inSelected.value){
				case "instapaper":
				
					break; 
				case "googlereader":
					reader.setItemTag(this.item.origin.streamId, this.item.id, "share", !this.item.shared, enyo.bind(this, function(){
						this.item.shared = !this.item.shared;
					}));
					break;
			}
		}	
	},
	toggleStarred: function(){
		reader.setItemTag(this.item.origin.streamId, this.item.id, "star", !this.item.star, enyo.bind(this, function(){
			this.item.star = !this.item.star;
			this.$.star.setIcon((this.item.star ? "source/images/menu-icon-starred.png" : "source/images/menu-icon-starred-outline.png"));
		}));
	}
});