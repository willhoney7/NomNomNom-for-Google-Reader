enyo.kind({
	name: "FeedList", 
	className: "feedList",
	kind: enyo.VFlexBox, 
	events: {
		onViewFeed: ""
	},
	components: [
		{kind: enyo.SnapScroller, autoVertical: false, vertical: false, flex: 1, components: [
			//{kind: "FeedPage"}
		]},
		{kind: enyo.Toolbar, components: [
			{kind: enyo.Spacer},
			{kind: enyo.ToolButton, icon: "source/images/menu-icon-new.png"}
		]},
	],
	create: function(){
		this.inherited(arguments);	
	},

	load: function(){
		//eventually support pages
		this.$.snapScroller.createComponent({kind: "FeedPage", feeds: gReader.feeds, onViewFeed: "doViewFeed"}, {owner: this});
		this.$.snapScroller.render();
	}
});