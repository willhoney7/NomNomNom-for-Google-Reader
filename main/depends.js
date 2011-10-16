enyo.depends(
	//load vendors
	"../vendors/underscore-min.js",
	"../vendors/underscore.string.min.js",
	"../vendors/utf-8.js",
	"../vendors/zepto.min.js",
	"../vendors/minpubsub.js",
	"../vendors/morf.js",
	"../vendors/jsHtmlToText.js",
	"../vendors/spazcore-shorturls.js",
	"../vendors/humane.js",
	"../vendors/humane-themes/bold-dark.css",
	"../vendors/ekl/Layout/",
	"../vendors/ekl/Popup/",

	//load the google reader library
	"../library/localStorageWrapper.js",
	"../library/google-reader.js",


	//load helpers
	"source/javascript/helpers/instapaper.js",
	"source/javascript/helpers/readitlater.js",

	"source/javascript/helpers/AppUtils.js",
	"source/javascript/helpers/AppPrefs.js",
	
	//ekls
	"source/javascript/GoogleReaderPopup.js",

	"source/javascript/NomNomNom.js",

	//toolbar
	"source/javascript/toolbar/Toolbar.js",
		"source/javascript/toolbar/PreferencesPopup.js",
		"source/javascript/toolbar/AddFeedPopup.js",
		"source/javascript/toolbar/AboutPopup.js",

	//feedManagement
	"source/javascript/feedManagement/FeedIconList.js",
		"source/javascript/feedManagement/LoginPopup.js",
		"source/javascript/feedManagement/FeedIcon.js",
			"source/javascript/feedManagement/FeedFolderPopup.js",
			"source/javascript/feedManagement/RenamePopup.js",
			"source/javascript/feedManagement/ManageLabelsPopup.js",
			"source/javascript/feedManagement/FeedPopup.js",
			"source/javascript/feedManagement/ConfirmPopup.js",
			"source/javascript/feedManagement/ClassyButton.js",

	//feedViewing
	"source/javascript/feedViewing/FeedView.js",
		"source/javascript/feedViewing/ItemCard.js",
		"source/javascript/feedViewing/ArticleItem.js",
		"source/javascript/feedViewing/ImageViewPopup.js",
		"source/javascript/feedViewing/ItemView.js",
		"source/javascript/feedViewing/CardContainer.js",
		"source/javascript/feedViewing/CardPage.js",
	
	//css
	"source/css/core.css"
);