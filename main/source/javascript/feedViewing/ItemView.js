enyo.kind({
	name: "ItemView",
	className: "itemView",
	kind: enyo.SlidingView,
	published: {
		item: {},
		itemCard: {}	
	},
	components: [
		{kind: enyo.Header, components: [
			{name: "title", allowHtml: true, className: "title truncating-text", style: "max-width: 75%"},
			{kind: enyo.Spacer},
			{name: "date", className: "date"}
		]},
		{kind: enyo.Scroller, flex: 1, autoVertical: true, showing: true, components: [
			{name: "launchMediaStreamer", kind: "PalmService", service: "palm://com.palm.applicationManager", method: "open"},
			{kind: enyo.HtmlContent, flex: 1, name: "content", onclick: "contentClick", onLinkClick: "linkClick", className: "articleContent"},
			{kind: enyo.ActivityButton, name: "getMore", width: "300px", style: "margin: 10px", onclick: "more", caption: "Get More Content"},
			{name: "stamp", kind: enyo.Image, src: "source/images/stamp.png", width: "165px", height: "165px", showing: false, style: "position: absolute; left: 0px; right: 0px; top: 0px; bottom: 0px; margin: auto;"}
		]},
		//{name: "webView", kind: enyo.BasicWebView, flex: 1, showing: false},
		{kind: enyo.Toolbar, components: [
			{kind: enyo.GrabButton},
			{kind: enyo.Spacer},
			{kind: enyo.ToolButton, name: "share", onclick: "share", icon: "source/images/menu-icon-share.png"},
			{kind: enyo.ToolButton, name: "star", onclick: "toggleStarred", icon: "source/images/menu-icon-starred-outline.png"},
			{kind: enyo.ToolButton, name: "browser", icon: "source/images/menu-icon-browser.png", onclick: "openInBrowser"},
			{kind: enyo.ToolButton, name: "soundContainer", icon: "source/images/menu-icon-play.png", onclick: "playAudio"},
			//{kind: enyo.ToolButton, name: "getMore", icon: "source/images/menu-icon-info.png", onclick: "more"},
			{kind: enyo.Spacer}
		]},
		{name: "sharePopup", kind: enyo.PopupSelect, onSelect: "sharePopupSelected"},
		//{name: "morePopup", kind: enyo.PopupSelect, onSelect: "morePopupSelected"},
		{name: "launchApp", kind: "PalmService", service: "palm://com.palm.applicationManager", method: "launch"},
		{kind: "ImageViewPopup"}

	],
	create: function(){
		this.inherited(arguments);

		$("img").live("click", enyo.bind(this, function(event){
			if(event.srcElement.className === "feedImage"){
				if(this.showing === true){			
					
					if(!this.$.scroller.isScrolling()){
						this.$.imageViewPopup.openAtCenter();
						this.$.imageViewPopup.setImage(event.srcElement);
					} else {
						setTimeout(enyo.bind(this, function(){
							if(!this.$.scroller.isScrolling()){
								this.$.imageViewPopup.openAtCenter();
								this.$.imageViewPopup.setImage(event.srcElement);	
							}
						}), 100);		
					}
				}
				event.preventDefault();
			}			
		}));

	},
	itemChanged: function(){

		if(_(this.item).isEmpty()){
			this.disabled = true;
			this.$.title.setContent("");
			this.$.date.setContent("");
			this.$.content.setContent("");
			this.$.star.setIcon("source/images/menu-icon-starred-outline.png");
			this.$.soundContainer.hide();
			this.$.getMore.hide();

		} else {
			this.disabled = false;
			this.$.getMore.show();
		}

		this.usingExpanded = false;
		this.$.getMore.setCaption("Get More Content");

		this.$.share.setDisabled(this.disabled);
		this.$.star.setDisabled(this.disabled);
		this.$.browser.setDisabled(this.disabled);
		this.$.stamp.setShowing(this.disabled);

		if(this.disabled){
			return;
		}

		//caption: this.items[i].label || this.items[i].title, icon: });	
		this.$.title.setContent(this.item.title || "");
		this.$.date.setContent(this.item.longFormattedDate || "");

		var itemContent = (this.item.content);
			itemContent = itemContent.replace(/<iframe.*?\/iframe>/ig, ""); //remove iframes. We have to do this because of a webOS bug. iframes launch a browser card...
			
			//$("<div>" + itemContent + "</div>").find("img").addClass("feedImage");
		this.$.content.setContent((this.item.author ? "By " + this.item.author + "<br/>": "") + itemContent);
		
		$('.articleContent').find("img").addClass("feedImage");

		/*this.item.read = true;
		this.item.star = false;
		this.item.shared = false;
		//this.item.keptUnread = false
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
			//if(_(this.item.categories[i]).includes(reader.TAGS["kept-unread"].replace("user/-", ""))){
			//	this.item.keptUnread = true;				
			//}
		};*/
		this.$.star.setIcon((this.item.star ? "source/images/menu-icon-starred.png" : "source/images/menu-icon-starred-outline.png"));

		//this.$.webView.setShowing(false);
		this.$.scroller.setShowing(true);
		this.$.scroller.setScrollTop(0);

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

		this.renderPrefs(); 

	},
	itemCardChanged: function(){
		if(this.itemCard && this.itemCard.markRead && AppPrefs.get("markAsReadFullView")){
			this.itemCard.markRead();
		}	
	},
	renderPrefs: function(){
		this.$.content.applyStyle("font-size", AppPrefs.get("itemViewFontSize"));	
	},
	playAudio: function(){
		//OPEN STREAMING media player
		if(this.sound){
			this.$.launchMediaStreamer.call({target: this.sound});	
		}
	},

	contentClick: function(inSender, inEvent){
		
	},

	linkClick: function(inSender, inUrl){
    	window.location(inUrl);
	},
	
	openInBrowser: function(){
		if(this.item.url){
			window.location = this.item.url;
			/*if(this.$.webView.showing === false){
				this.$.webView.setUrl(this.item.url);
				this.$.webView.setShowing(true);
				this.$.scroller.setShowing(false);
			} else {
				this.$.webView.setShowing(false);
				this.$.scroller.setShowing(true);
				//window.open(this.item.url);
			}*/
		}
	},
	share: function(inSender, inEvent){
		this.shareItems = [
			{caption: $L("Share via SMS"), value: "sms"},
			{caption: $L("Share via Email"), value: "email"},
			{caption: $L("Share via Spaz HD"), value: "spaz"},
			{caption: $L("Add to Instapaper"), value: "instapaper"},
			{caption: $L("Add to Read it Later"), value: "readitlater"}
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
			shortUrl.shorten(this.item.url, {
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
									summary: "Check out this article: " + this.item.title,
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
					if(AppPrefs.get("instapaperUsername") !== ""){
						instapaper.add({url: this.item.url, title: this.item.title}, AppPrefs.get("instapaperAuth"), function(response){
							if(response.status === 201){
								humane("Added to Instapaper!");
							} else if(response.status === 400){
								humane("Bad request or exceeded the rate limit");			
							} else if(response.status === 403){
								humane("Wrong username/password");
							} else if(response.status === 500){
								humane("Service encountered an error. Please try again later");
							}
						});
					} else {
						humane("You must first log in to Instapaper!");
					}
					break; 
				case "readitlater":
					if(AppPrefs.get("readitlaterUsername") !== ""){
						readitlater.add({url: this.item.url, title: this.item.title}, AppPrefs.get("readitlaterUsername"), AppPrefs.get("readitlaterPassword"), function(response){
							if(response.status === 200){
								humane("Added to Read it Later!");
							} else if(response.status === 400){
								humane("Invalid Request");
							} else if(response.status === 401){
								humane("Username and/or Password incorrect");
							} else if(response.status === 501){
								humane("API rate limit exceeded; Try again later");
							} else if(response.status === 503){
								humane("Read It Later's sync server is down for scheduled maintenance.");
							}
						});
					} else {
						humane("You must first log in to Read it Later!");
					}
					break;
				case "googlereader":
					reader.setItemTag(this.item.feed.id, this.item.id, "share", !this.item.shared, enyo.bind(this, function(){
						this.item.shared = !this.item.shared;
					}));
					break;
			}
		}	
	},
	toggleStarred: function(){
		reader.setItemTag(this.item.feed.id, this.item.id, "star", !this.item.star, enyo.bind(this, function(){
			this.item.star = !this.item.star;
			this.$.star.setIcon((this.item.star ? "source/images/menu-icon-starred.png" : "source/images/menu-icon-starred-outline.png"));
			if(this.itemCard){
				this.itemCard.changeStar(this.item.star);
			}
		}));
	},
	changeStar: function(inValue){
		this.$.star.setIcon((inValue ? "source/images/menu-icon-starred.png" : "source/images/menu-icon-starred-outline.png"));		
	},

	more: function(inSender, inEvent){
		if(!AppPrefs.get("seenExpandedInfo")){
			humane("Attempting to get new content... our team of monkeys does not guarantee success!");
			//this.$.expandedInfoPopup.openAtCenter();
			AppPrefs.set("seenExpandedInfo", true);
		}
		if(!this.usingExpanded){	
			this.usingExpanded = true;
			if(!this.item.expandedContent){
				inSender.setActive(true);
				inSender.setDisabled(true);

				readitlater.makeRequest({
					url: "https://text.readitlaterlist.com/v2/text",
					parameters: {
						url: utf8.encode(this.item.url),
						mode: "less",
						images: 0				
					},
					onSuccess: enyo.bind(this, function(transport){
						inSender.setActive(false);
						inSender.setDisabled(false);
						inSender.setCaption("Return to Previous Content");
						this.item.expandedContent = transport.responseText.replace(/<iframe.*?\/iframe>/ig, "");
						this.$.content.setContent(this.item.expandedContent); //remove iframes. We have to do this because of a webOS bug. iframes launch a browser card...
						this.$.scroller.setScrollTop(0);
					}),
					onFailure: function(transport){
						inSender.setActive(false);
						inSender.setDisabled(false);
						humane("Unable to get feed content");
						console.error(transport);
					}
				});
			} else {

				inSender.setCaption("Return to Previous Content");
				inSender.setDisabled(false);
				this.$.content.setContent(this.item.expandedContent); //remove iframes. We have to do this because of a webOS bug. iframes launch a browser card...
				this.$.scroller.setScrollTop(0);
			}
		} else {
			inSender.setCaption("Get More Content");
			inSender.setDisabled(false);

			this.usingExpanded = false;
			this.$.content.setContent(this.item.content);
			this.$.scroller.setScrollTop(0);
		}

		/*var moreItems = [];
		if(this.item.keptUnread === false || this.item.read === true){
			moreItems.push({caption: $L("Keep Unread"), value: "keepunread"});
		}
		if(this.item.read === false){
			moreItems.push({caption: $L("Mark Read"), value: "markRead"});			
		}
			
		this.$.morePopup.setItems(moreItems);
		this.$.morePopup.openAtEvent(inEvent);*/
	},
	morePopupSelected: function(inSender, inSelected){
		if(inSelected.value === "keepunread"){
			reader.setItemTag(this.item.feed.id, this.item.id, "kept-unread", true, enyo.bind(this, function(){
				this.item.keptUnread = true;
				this.item.read = !this.item.keptUnread;
			}));
		} else if(inSelected.value === "markRead"){
			if(this.itemCard && this.itemCard.markRead){
				this.itemCard.markRead();
			}
		}
	}

});