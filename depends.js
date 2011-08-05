enyo.depends(
	//load vendors
	"vendors/underscore-min.js",
	"vendors/underscore.string.min.js",
	"vendors/jsHtmlToText.js",
	"vendors/jquery-1.6.2.min.js",
	"vendors/spazcore-shorturls.js",
	"vendors/humane.js",
	"vendors/humane-themes/bold-dark.css",
	"vendors/ekl/Layout/",
	"vendors/ekl/Popup/",


	//load the google reader library
	"library/google-reader.js",

	//load helpers
	"source/javascript/helpers/AppUtils.js",
	"source/javascript/helpers/AppPrefs.js",

	//ekls
	"source/javascript/GoogleReaderPopup.js",
	
	"source/javascript/NomNomNom.js",

	//toolbar
	"source/javascript/toolbar/Toolbar.js",
		"source/javascript/toolbar/PreferencesPopup.js",
		"source/javascript/toolbar/AddFeedPopup.js",

	//feedManagement
	"source/javascript/feedManagement/FeedIconList.js",
		"source/javascript/feedManagement/LoginPopup.js",
		"source/javascript/feedManagement/FeedIcon.js",
			"source/javascript/feedManagement/FeedFolderPopup.js",
			"source/javascript/feedManagement/RenamePopup.js",
			"source/javascript/feedManagement/ManageLabelsPopup.js",
			"source/javascript/feedManagement/FeedPopup.js",
			"source/javascript/feedManagement/ConfirmPopup.js",

	//feedViewing
	"source/javascript/feedViewing/FeedView.js",
		"source/javascript/feedViewing/ItemCard.js",
		"source/javascript/feedViewing/ItemView.js",
	
	//css
	"source/css/core.css"
);