enyo.kind({
	name: "FeedPopup",
	kind: enyo.Control,
	components: [
		{kind: enyo.PopupSelect, onSelect: "popupSelect"},
		{kind: "RenamePopup"},
		{kind: "ConfirmPopup"},
		{name: "labelsPopup", kind: enyo.PopupSelect, onSelect: "labelSelect"}

	],
	showAtEvent: function(event, feed){
		if(this.$.popupSelect.lazy) {
			this.$.popupSelect.validateComponents();
		}
		this.feed = feed;
		var items = [];
		if(!this.feed.isAll){
			items.push({caption: $L("Rename"), value: "rename"});		
		}
		if(this.feed.inside){
			items.push(
				{caption: $L("Remove Label"), value: "removeLabel"} 
			);
		}
		if(this.feed.isFeed){
			items.push(
				{caption: $L("Add Label"), value: "addLabel"}, 
				{caption: $L("Unsubscribe from Feed"), value: "unsubscribeFeed"}
			);
		}
		if(this.feed.count > 0){
			items.unshift({caption: $L("Mark all as Read"), value: "markAllRead"});
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
					AppUtils.refreshIcons();

				}));
				break;
			case "unsubscribeFeed":
				this.$.confirmPopup.showAtEvent(this.event, {title: "Unsubscribe from feed?", doIt: enyo.bind(this, function(inSender){
					reader.unsubscribeFeed(this.feed.id, function(){
						inSender.close();
						AppUtils.viewIcons();
					});
					
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
							caption: item.title,
							labelId: item.id
						})	
					}
					
				}));
				items.push({caption: $L("New label..."), labelId: "new"});
				this.$.labelsPopup.setItems(items);
				this.$.labelsPopup.openAtEvent(this.event);
				break;
			case "removeLabel":
				this.$.confirmPopup.showAtEvent(this.event, {title: "Remove label?", doIt: enyo.bind(this, function(inSender){
					reader.editFeedLabel(this.feed.id, this.feed.inside, false, function(){
						inSender.close();
						AppUtils.refreshIcons();
					});
					
				})});
				break;
			case "removeLabelAll": 
				this.$.confirmPopup.showAtEvent(this.event, {title: "Remove label from all feeds?", doIt: function(inSender){
					inSender.close();
					AppUtils.refreshIcons();

				}});
				break;
		}
	},

	labelSelect: function(inSender, inSelection){
		if(inSelection.labelId === "new"){
			console.log("show new popup");
			this.$.renamePopup.showAtCenter(this.feed, "new label");
		} else {
			if(this.feed.inside){
				this.$.confirmPopup.showAtEvent(this.event, {
					title: "Remove old label?", 
					confirmTitle: "Yes",
					cancelTitle: "No",
					doIt: enyo.bind(this, function(inSender){
						reader.editFeedLabel(this.feed.id, this.feed.inside, false, AppUtils.refreshIcons);
						inSender.close();
					})
				});
			} 
			console.log("Adding label");
			reader.editFeedLabel(this.feed.id, inSelection.labelId, true, AppUtils.refreshIcons);
		}
	}
});
