enyo.kind({
	name: "GoogleReader",
	kind: enyo.VFlexBox,
	components: [
		{name: "slidingPane", kind: "SlidingPane", flex: 1, components: [
			{kind: "Subscriptions", onFeedClick: "loadFeed"},
			{kind: "FeedPreviewList"}
		]}
	],
	loadFeed: function(inSender, inFeed){
		this.$.feedPreviewList.setFeed(inFeed);
	}
});