enyo.kind({
	name: "FeedPopup",
	kind: enyo.Control,
	components: [
		{kind: "ekl.Popup.PopupSelect", name: "popupSelect", onClose: "popupClosed", onSelect: "popupSelect"},
		{kind: "RenamePopup"},
		{kind: "ConfirmPopup"},
		{name: "labelsPopup", kind: enyo.PopupSelect, onSelect: "labelSelect"}

	],
	showAtEvent: function(event, feed){
		if(this.$.popupSelect.lazy) {
			this.$.popupSelect.validateComponents();
		}
		this.feed = feed;
		this.refreshIconsFlag = false;
		var items = [];

		if(this.feed.count > 0){
			items.push({caption: $L("Mark all as Read"), value: "markAllRead"});
		}
		if(!this.feed.isSpecial){
			items.push(
				{caption: $L("Rename"), value: "rename"}
			);
		}
		if(this.feed.isFeed){			
			var labels = [];
			_.each(reader.getLabels(), enyo.bind(this, function(item){
				var exists = false;
				_.each(this.feed.categories, function(categories){
					if(item.id === categories.id){
						exists = true;
					}
				});
				labels.push({
					kind: enyo.Item,
					labelId: item.id,
					layoutKind: "HFlexLayout",
					style: "padding: 5px 10px; background-color: rgba(50, 50, 50, .2)",
					components: [
						{content:  item.title, flex: 1, style: "font-size: 16px; line-height: 30px; padding-right: 10px;"},
						{kind: enyo.CheckBox, checked: exists, onChange: "labelCheckboxChanged", labelId: item.id, owner: this},
					]
				});				
			}));
			
			labels.push({
				kind: enyo.Item,
				tapHighlight: true,
				labelId: "new",
				layoutKind: "HFlexLayout",
				onclick: "newLabel",
				owner: this,
				style: "padding: 5px 10px; background-color: rgba(50, 50, 50, .2)",
				components: [
					{content:  $L("Add new label..."), flex: 1, style: "font-style: italic; font-size: 16px; line-height: 30px; padding-right: 10px;"},
				]
			});

			items.push(
				{caption: $L("Labels"), components: labels}
			);
		}
		if(this.feed.isFeed){
			items.push(
				{caption: $L("Unsubscribe from Feed"), value: "unsubscribeFeed"}
			);
		}
		if(!this.feed.isSpecial){// || this.feed.isAll){
			if(AppPrefs.get("notify") === true){
				var feedsToNotifyFor = AppPrefs.get("notifyFeeds"), obj;
				if(feedsToNotifyFor[this.feed.id]){
					obj = {caption: $L("Stop Notifications"), value: "stopNotifications"};
				} else {
					obj = {caption: $L("Notify of new articles"), value: "startNotifications"};
				}
				items.push(obj);
			}
		}

		
		this.event = event;
		if(items.length > 0){
			this.$.popupSelect.setItems(items);
			this.$.popupSelect.openAtEvent(event);	
		}
		
	},
	popupSelect: function(inSender, inSelection){
		switch(inSelection.value){
			case "rename":
				this.$.popupSelect.close();
				this.$.renamePopup.showAtCenter(this.feed);
				break;
			case "markAllRead":
				reader.markAllAsRead(this.feed.id, enyo.bind(this, function(){
					this.$.popupSelect.close();
					publish("icons", ["refresh"]);

				}));
				break;
			case "unsubscribeFeed":
				this.$.confirmPopup.showAtEvent(this.event, {title: "Unsubscribe from feed?", doIt: enyo.bind(this, function(inSender){
					reader.unsubscribeFeed(this.feed.id, enyo.bind(this, function(){
						var feedsToNotifyFor = AppPrefs.get("notifyFeeds");
						delete feedsToNotifyFor[this.feed.id];
						AppPrefs.set("notifyFeeds", feedsToNotifyFor);
						
						inSender.close();
						publish("nomnomnom", ["viewIcons"]);
					}));
					
				})});
				break;
			case "addLabel":
				var items = [];
				_.each(reader.getLabels(), enyo.bind(this, function(item){
					var exists = false;
					_.each(this.feed.categories, function(categories){
						if(item.id === categories.id){
							exists = true;
						}
					});
					if(!exists){
						items.push({
							kind: enyo.Item,
							caption: item.title,
							labelId: item.id,
							layoutKind: "HFlexLayout",
							style: "padding: 5px 10px",
							components: [
								//{kind: enyo.HFlexBox, style: "font-size: 16px",components: [
									{content:  item.title, flex: 1, style: "font-size: 16px; line-height: 30px; padding-right: 10px;"},
									{kind: enyo.CheckBox},
								//]}
							]
						})	
					}
					
				}));
				items.push({caption: $L("New label..."), style: "font-style: italic", labelId: "new"});
				this.$.labelsPopup.setItems(items);
				this.$.labelsPopup.openAtEvent(this.event);
				break;
			case "removeLabel":
				this.$.confirmPopup.showAtEvent(this.event, {title: "Remove label?", doIt: enyo.bind(this, function(inSender){
					reader.editFeedLabel(this.feed.id, this.feed.inside, false, function(){
						inSender.close();
						publish("icons", ["refresh"]);
					});
					
				})});
				break;
			case "removeLabelAll": 
				this.$.confirmPopup.showAtEvent(this.event, {title: "Remove label from all feeds?", doIt: function(inSender){
					inSender.close();
					publish("icons", ["refresh"]);

				}});
				break;
			case "stopNotifications":
				var feedsToNotifyFor = AppPrefs.get("notifyFeeds");
				delete feedsToNotifyFor[this.feed.id];
				AppPrefs.set("notifyFeeds", feedsToNotifyFor);
				break;
			case "startNotifications":
				var feedsToNotifyFor = AppPrefs.get("notifyFeeds");
				feedsToNotifyFor[this.feed.id] = {count: this.feed.count, title: this.feed.title};
				AppPrefs.set("notifyFeeds", feedsToNotifyFor);
				break;
		}
	},

	labelSelect: function(inSender, inSelection){
		if(inSelection.labelId === "new"){
			this.$.renamePopup.showAtCenter(this.feed, "new label");
		} else {
			if(this.feed.inside){
				this.$.confirmPopup.showAtEvent(this.event, {
					title: "Remove old label?", 
					confirmTitle: "Yes",
					cancelTitle: "No",
					doIt: enyo.bind(this, function(inSender){
						reader.editFeedLabel(this.feed.id, this.feed.inside, false, function(){
							publish("icons", ["refresh"]);
						});
						inSender.close();
					})
				});
			} 
			reader.editFeedLabel(this.feed.id, inSelection.labelId, true, function(){
				publish("icons", ["refresh"]);
			});
		}
	},

	labelCheckboxChanged: function(inSender){
		this.refreshIconsFlag = true;
		reader.editFeedLabel(this.feed.id, inSender.labelId, inSender.checked, function(){});		
	},
	newLabel: function(inSender){
		this.$.popupSelect.close();
		this.$.renamePopup.showAtCenter(this.feed, "new label");		
	},
	popupClosed: function(){
		if(this.refreshIconsFlag === true){
			publish("icons", ["refresh"]);
		}
	}
});
