enyo.kind({
	name: "ekl.Layout.SlidingView",
	kind: enyo.SlidingView,
	published: {
	    nodragleft: false,
	},
	
	calcSlideMin: function() {        
        if (this.nodragleft) {
            return 0;
        } else {
            return this.inherited(arguments);
        }
	},
	hide: function(){
		console.error("AHIDING");
		this.inherited(arguments);
		console.error("HIDING");
	}
});