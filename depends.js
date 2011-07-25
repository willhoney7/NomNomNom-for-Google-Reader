enyo.depends(
	//load vendors
	"vendors/underscore-min.js",
	"vendors/underscore.string.min.js",
	"vendors/jsHtmlToText.js",
	"vendors/jquery-1.6.2.min.js",

	//load the google reader library
	"library/google-reader.js",

	//load helpers
	"source/javascript/helpers/AppUtils.js",
	"source/javascript/helpers/AppPrefs.js",

	//popups
	"source/javascript/GoogleReaderPopup.js",
	"source/javascript/LoginPopup.js",
	"source/javascript/AddFeedPopup.js",
	"source/javascript/FeedPopup.js",
		"source/javascript/RenamePopup.js",
		"source/javascript/ConfirmPopup.js",


	//views
	"source/javascript/GoogleReader.js",
	"source/javascript/IconList.js",
		"source/javascript/FeedIcon.js",
	"source/javascript/Toolbar.js",
	"source/javascript/FeedView.js",
		"source/javascript/ItemCard.js",
		"source/javascript/ItemView.js",
	
	//css
	"source/css/core.css"
);