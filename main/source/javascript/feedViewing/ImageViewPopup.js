enyo.kind({
	name: "ImageViewPopup",
	kind: enyo.Popup,
	scrim: true,
	modal: true,
	published: {
		image: {}
	},
	style: "height: 100%; width: 100%;",
	className: "enyo-imageViewPopup",
	components: [
		{kind: "enyo.ToolButton", style: "position: absolute; right: 10px; top: 10px; z-index: 1000;", icon: "source/images/menu-icon-close.png", onclick: "close"},
		{name: "imageView", kind: "enyo.ImageView", style: "margin: 30px", height: "100%", flex: 1},
		{kind: enyo.Control, className: "imageTitleText", onclick: "showTitle"},

	],
	imageChanged: function() {
		if(this.lazy) {
			this.validateComponents();
		}
		this.$.imageView.setCenterSrc(this.image.src);
		this.$.control.applyStyle("color", "rgba(0, 0, 0, 0)");
		if(this.image.title){
			this.$.control.show();
			this.$.control.setContent(this.image.title);		
		} else {
			this.$.control.hide();
		}
		this.$.imageView.applyStyle("height", window.innerHeight - this.$.control.getBounds().height - 80 + "px");
	},
	showTitle: function(){
		this.$.control.applyStyle("color", "rgba(255, 255, 255, 1)");
	},
	close: function(){
		this.$.control.applyStyle("color", "rgba(0, 0, 0, 0)");		
		this.inherited(arguments);
	}
})