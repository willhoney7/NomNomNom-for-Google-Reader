enyo.kind({
	name: "FeedPopup",
	kind: enyo.Control,
	components: [
		{kind: enyo.PopupList, onSelect: "popupSelect"},
		{kind: "RenamePopup"},
		{kind: "ConfirmPopup"}

	],
	showAtEvent: function(event, feed){
		if(this.$.popupList.lazy) {
			this.$.popupList.validateComponents();
		}
		this.feed = feed;
		var items = [
			{caption: $L("Rename"), value: "rename"}
		];
		if(this.feed.isFeed){
			items.push(
				//{caption: $L("Add Label"), value: "addLabel"}, 
				{caption: $L("Unsubscribe from Feed"), value: "unsubscribeFeed"}
			);
		} else {
			//items.push(
			//	{caption: $L("Remove Tag"), value: "removeTag"}
			//);
		}
		if(this.feed.count > 0){
			items.unshift({caption: $L("Mark all as Read"), value: "markAllRead"});
		}
		this.items = items;
		this.event = event;
		this.$.popupList.setItems(items);
		this.$.popupList.openAtEvent(event);
	},
	popupSelect: function(inSender, inSelection){
		switch(this.items[inSelection].value){
			case "rename":
				this.$.popupList.close();
				this.$.renamePopup.showAtCenter(this.feed);
				break;
			case "addLabel":
				
				break;
			case "markAllRead":
				reader.markAllAsRead(this.feed.id, enyo.bind(this, function(){
					this.$.popupList.close();
					AppUtils.refreshIcons();

				}));
				break;
			case "unsubscribeFeed":
				this.$.confirmPopup.showAtEvent(this.event, {title: "Unsubscribe from feed?", doIt: enyo.bind(this, function(inSender){
					reader.unsubscribeFeed(this.feed.id, function(){
						inSender.close();
						AppUtils.refreshIcons();	
					});
					
				})});
				break;
			case "removeTag":
				this.$.confirmPopup.showAtEvent(this.event, {title: "Remove tag?", doIt: function(inSender){
					inSender.close();
					AppUtils.refreshIcons();
				}});
				break;
		}
	}
});
