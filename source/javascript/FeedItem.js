enyo.kind({
	name: "OuterFeedItem",
	kind: enyo.Control,
	published: {
		feed: ""
	},
	events: {
		onFeedClick: ""
	},
	components: [
		{kind: "Item", className: "outerItem", onclick: "feedClick", tapHighlight: true, layoutKind: "VFlexLayout", components: [
			{kind: enyo.HFlexBox, style: "padding: 10px;", components: [
				{name: "folderImage", onclick: "toggleDrawer", kind: "Image", src:'images/small_folder.png', style:'margin-right: 10px;', showing: false},
            	{name: "caption", allowHtml: true, flex: 1},
			]},
			{
    	    	kind: enyo.BasicDrawer,
    	    	open: false,
    	    	components: [
    	    		{kind: "VFlexBox", width: "100%", components: [
    	    			{kind: enyo.VirtualRepeater, onSetupRow: "setupFolderRow", components: [
	    	    			{kind: "InnerFeedItem", onFeedClick: "doFeedClick"}
		    	    	]}
		    	    ]}
    	    	]
    	    }
			
        ]}
	],
	create: function(){
		this.inherited(arguments);	
	},
	feedChanged: function(){
	    this.$.caption.setContent(this.getFeed().label || this.getFeed().title);
	    this.$.folderImage.setShowing((this.getFeed().feeds !== undefined));
	    		
	},
	feedClick: function(inSender){
		this.doFeedClick(this.getFeed());
	},

	setupFolderRow: function(inSender, inIndex){
		var array = this.getFeed().feeds || [];
		if (array[inIndex]){
			this.$.innerFeedItem.setFeed(array[inIndex]);
			return true;
		}
	},

	toggleDrawer: function(inSender, inIndex){
		if(!this.$.basicDrawer.getOpen() === true){
			this.$.folderImage.setSrc("images/small_folder_open.png");			
		} else {
			this.$.folderImage.setSrc("images/small_folder.png");
		}
		this.$.basicDrawer.setOpen(!this.$.basicDrawer.getOpen());

		return true;
	},

});

enyo.kind({
	name: "InnerFeedItem",
	kind: enyo.Control,
	published: {
		feed: {}
	},
	events: {
		onFeedClick: ""
	},
	components: [
		{kind: enyo.Item, onclick: "feedClick", components: [
			{allowHtml: true}
		]}
	],
	feedChanged: function(){
    	this.$.control.setContent(this.getFeed().title);	
    	//gets set fine				
	},
	feedClick: function(inSender, inEvent){
		this.doFeedClick(this.getFeed());	
		//Always returns ""
		
		return true;	
	}
})