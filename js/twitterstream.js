    (function() {
		var UpdatePanel = {
			init : function(options) {
				this.options = $.extend({
					interval : 5000,
					number : 3,
					hijackTweet : false
				}, options);

				this.updater();
			},

			updater : function() {
				(function updateBox() {
					this.timer = setTimeout(function() {
						updateIt();
						updateBox();
					}, UpdatePanel.options.interval);
				})();

				// get the ball rolling
				updateIt();

				function updateIt() {
					$.ajax({
						type : 'GET',
						url : UpdatePanel.options.url,
						dataType : 'jsonp',

						error : function() {},

						success : function(results) {
							var theTweets = '',
								 elem = UpdatePanel.options.elem.empty();

							$.each(results.results, function(index, tweet) {
								if ( UpdatePanel.options.hijackTweet ) {
									tweet.text = tweet.text.replace(/sbp2013/ig, '<b>sbp2013</b>');
								}

								if ( index === UpdatePanel.options.number ) {
									return false;
								}
								else {
									theTweets += '<li class="tweet"><img src="' + tweet.profile_image_url + '" style="float:left;padding-right:6px;"> '
                                    + tweet.created_at + " " + tweet.from_user + ': '  + tweet.text + '</li>';
								}
							});
							elem.append(theTweets);
						}
					});
				}
			},

			clearUpdater : function() {
				clearTimeout(this.timer);
			}
		};
		window.UpdatePanel = UpdatePanel;
	})();

	UpdatePanel.init({
		interval : 5000,
		number : 5,
		url : "http://search.twitter.com/search.json?q=sbp2013",
		elem : $('#tweets'),
		hijackTweet : true
	});