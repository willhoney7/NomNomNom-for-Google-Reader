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
			{kind: enyo.ToolButton, icon: "source/images/menu-icon-share.png"},
			{kind: enyo.ToolButton, icon: "source/images/menu-icon-starred-outline.png"},
			{kind: enyo.ToolButton, icon: "source/images/menu-icon-browser.png", onclick: "openInBrowser"},
			{kind: enyo.Spacer}
		]}
	],
	itemChanged: function(){
		//caption: this.items[i].label || this.items[i].title, icon: });	
		var itemContent = (this.item.summary) ? this.item.summary.content || "": (this.item.content) ? this.item.content.content || "": "";
		var firstImageURL = $("<div>" + itemContent + "</div>").find("img:first").attr("src");
		this.$.title.setContent(this.item.title);
		this.$.date.setContent(AppUtils.formatLongDate(this.item.updated))
		
		this.$.content.setContent(itemContent);

		this.item.read = false;
		for(var i = 0; i < this.item.categories.length; i++){
			var re = /user\/\d+\/state\/com.google\/read$/i;
			if(re.test(this.item.categories[i])){
				this.item.read = true;
				break;
			}
		};
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
	}
});