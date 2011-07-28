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
			{kind: enyo.HtmlContent, flex: 1, name: "content", className: "content"}
		]},
		{name: "webView", kind: enyo.BasicWebView, flex: 1, showing: false},
		{kind: enyo.Toolbar, components: [
			{kind: enyo.GrabButton},
			{kind: enyo.Spacer},
			{kind: enyo.ToolButton, name: "share", onclick: "toggleShared", icon: "source/images/menu-icon-shared-outline.png"},
			{kind: enyo.ToolButton, name: "star", onclick: "toggleStarred", icon: "source/images/menu-icon-starred-outline.png"},
			{kind: enyo.ToolButton, icon: "source/images/menu-icon-browser.png", onclick: "openInBrowser"},
			{kind: enyo.Spacer}
		]}
	],
	itemChanged: function(){
		//caption: this.items[i].label || this.items[i].title, icon: });	
		this.$.title.setContent(this.item.title);
		this.$.date.setContent(AppUtils.formatLongDate(this.item.updated))

		var itemContent = (this.item.content) ? this.item.content.content || "": (this.item.summary) ? this.item.summary.content || "": "";		
		this.$.content.setContent((this.item.author ? "By " + this.item.author : "") + itemContent);

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
		this.$.share.setIcon((this.item.shared ? "source/images/menu-icon-shared.png" : "source/images/menu-icon-shared-outline.png"));
		this.$.star.setIcon((this.item.star ? "source/images/menu-icon-starred.png" : "source/images/menu-icon-starred-outline.png"));

		this.$.webView.setShowing(false);
		this.$.scroller.setShowing(true);

		//this.$.unread.setShowing(!this.item.read);
		//this.$.feedTitle.setContent(this.item.origin.title);

		//this.$.pane.selectViewByName("view");
	},
	openInBrowser: function(){
		if(this.item.alternate && this.item.alternate[0] && this.item.alternate[0].href){
			if(this.$.webView.showing === false){
				this.$.webView.setUrl(this.item.alternate[0].href);
				this.$.webView.setShowing(true);
				this.$.scroller.setShowing(false);
			} else {
				this.$.webView.setShowing(false);
				this.$.scroller.setShowing(true);
				//window.open(this.item.alternate[0].href);
			}
		}
	},

	toggleStarred: function(){
		reader.setItemTag(this.item.origin.streamId, this.item.id, "star", !this.item.star, enyo.bind(this, function(){
			this.item.star = !this.item.star;
			this.$.star.setIcon((this.item.star ? "source/images/menu-icon-starred.png" : "source/images/menu-icon-starred-outline.png"));
		}));
	},
	toggleShared: function(){
		reader.setItemTag(this.item.origin.streamId, this.item.id, "share", !this.item.shared, enyo.bind(this, function(){
			this.item.shared = !this.item.shared;
			this.$.share.setIcon((this.item.shared ? "source/images/menu-icon-shared.png" : "source/images/menu-icon-shared-outline.png"));
		}));
	}
});