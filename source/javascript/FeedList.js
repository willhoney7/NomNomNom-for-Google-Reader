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
			{kind: enyo.Control, content: "Google Reader", style: "color: white; margin: 0px 10px; font-size: 18px;"},
			{kind: enyo.Spacer},
			{kind: enyo.ToolButton, icon: "source/images/menu-icon-new.png"},
			{kind: enyo.ToolButton, icon: "source/images/menu-icon-settings.png"}
		]},
	],
	create: function(){
		this.inherited(arguments);	
	},

	load: function(){
		//eventually support pages
		this.$.snapScroller.createComponent({kind: "FeedPage", feeds: reader.getFeeds(), onViewFeed: "doViewFeed"}, {owner: this});
		this.$.snapScroller.render();
	}
});