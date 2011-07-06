enyo.kind({
	name: "GoogleReader",
	kind: enyo.VFlexBox,
	components: [
		{name: "slidingPane", kind: "SlidingPane", flex: 1, components: [
			{kind: "Subscriptions", onFeedClick: "loadFeed"},
			{kind: "FeedPreviewList", onItemClick: "loadItem"},
			{kind: "ItemView"}

		]}
	],
	loadFeed: function(inSender, inFeed){
		this.$.feedPreviewList.setFeed(inFeed);
	},
	loadItem: function(inSender, inEvent){
		this.$.itemView.setItem(inSender.items[inEvent.rowIndex]);
	}
});