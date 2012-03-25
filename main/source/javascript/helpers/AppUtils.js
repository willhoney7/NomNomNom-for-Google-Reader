(function(){
	window.AppUtils = {};

	try {
		var dateFormat = new enyo.g11n.DateFmt({date: "short", dateComponents: "dm"});
		AppUtils.formatDate = function(timestamp){
			var d = new Date(timestamp * 1000);
			return dateFormat.format(d);
		}
		var longDateFormat = new enyo.g11n.DateFmt({date: "EEE, MMM d,", time: "medium"});
		AppUtils.formatLongDate = function(timestamp){
			var d = new Date(timestamp * 1000);
			return longDateFormat.format(d);
		}
	} catch(e){
		AppUtils.formatDate = function(timestamp){
			var d = new Date(timestamp * 1000);
			var date = d.getUTCDate(), hrs = d.getUTCHours(), mins = d.getUTCMinutes();

			return date + " " + hrs + ":" + mins;
		}
		AppUtils.formatLongDate = function(timestamp){
			var d = new Date(timestamp * 1000);
			var mo = d.getUTCMonth() + 1, date = d.getUTCDate(), hrs = d.getUTCHours(), mins = d.getUTCMinutes();

			return mo + "/" + date + " " + hrs + ":" + mins;
		}
	}

	AppUtils.formatArticleArray = function(array){
		var newArray = [];
		_(array).each(function(article){
			newArray.push(AppUtils.formatArticle(article));
		});

		return newArray;
	};

	var readRegExp = new RegExp(reader.TAGS["read"].replace("user/-", "") + "$", "ig");
	AppUtils.formatArticle = function(item){
		var url = (item.alternate && item.alternate[0]) ? item.alternate[0].href : item.origin.htmlUrl || item.origin.streamId;
		var condensedItem = {
			id: item.id,
			title: item.title,
			author: item.author,
			url: url,
			feed: {
				title: item.origin.title,
				id: item.origin.streamId
			},
			formattedDate: AppUtils.formatDate(item.updated),
			longFormattedDate: AppUtils.formatLongDate(item.updated),
			content: (item.summary) ? item.summary.content || "": (item.content) ? item.content.content || "": "",
			enclosure: item.enclosure,
			fresh: false,
			read: false,
			star: false,
			shared: false,
			_orig: _.clone(item)
		};

		condensedItem.firstImageURL = $("<div>" + condensedItem.content + "</div>").find("img").first().attr("src");
		condensedItem.condensedContent = htmlToText(condensedItem.content);

		for(var i = 0; i < item.categories.length; i++){
			if(readRegExp.test(item.categories[i])){
				condensedItem.read = true;				
			}
			if(_(item.categories[i]).includes(reader.TAGS["star"].replace("user/-", ""))){
				condensedItem.star = true;				
			}
			if(_(item.categories[i]).includes(reader.TAGS["share"].replace("user/-", ""))){
				condensedItem.shared = true;				
			}
			if(_(item.categories[i]).includes(reader.TAGS["fresh"].replace("user/-", ""))){
				condensedItem.fresh = true;				
			}
		};
		
		return condensedItem;
	}

	AppUtils.getOrientation = function(){
		return (enyo.getWindowOrientation() === "left" || enyo.getWindowOrientation() === "right") ? "portrait" : "landscape";
	}

})();