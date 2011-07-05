AppUtils = {
	processSubscriptions: function(subscriptions){
		var categories = [
				{label: "All", id: reader.FEED_ALL_ID, feeds: subscriptions}
			],
			uncategorized = [];

		for(var i = 0; i < subscriptions.length; i++){
			if(subscriptions[i].categories.length === 0){
				uncategorized.push(subscriptions[i]);
			} else {
				_.each(subscriptions[i].categories, function(category){
					var new_category = _.clone(category);
					new_category.feeds = [subscriptions[i]];
					categories.push(new_category);
				});
			}
		}
		//create array of categories with an array fo the applicable feeds
		for(var i = 0; i < categories.length; i++){
			for(var j = (i + 1); j < categories.length; j++){
				if(i == j){
					continue;					
				}
				if(j >= categories.length){
					break;
				}
				if(categories[i].id === categories[j].id){
					categories[i].feeds = categories[i].feeds.concat(categories[j].feeds);
					categories.splice(j--,1);
				}
			}
		}
		_.each(categories, function(category){
			_.sortBy(category.feeds, function(feed){
				return feed.sortid;
			});
		});

		return categories.concat(uncategorized);
	}
}