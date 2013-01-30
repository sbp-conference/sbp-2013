hotwire = {
	
	appendTo: '#jsHotWire',

	// core function of jqtweet
	loadHotels: function() {


		$.ajax({
			url: 'http://api.hotwire.com/v1/search/hotel?apikey=3uq5z5yvt4bfz66sd3aw3qm2&startdate=04/02/2013&adults=2&rooms=1&children=0&enddate=04/06/2013&dest=Washington,DC&sort=distance&limit=5&format=jsonp',
			type: 'GET',
			dataType: 'jsonp',

			error : function() {},

			success: function(data) {

			 var prices = [];
			 var a = 0;
			 for (var i = 0; i < data.Result.length; i++) {

				prices.push([data.Result[i].AveragePricePerNight, data.Result[i].DeepLink, 
							data.Result[i].HWRefNumber]);
				a = parseInt(a,10) + parseInt(data.Result[i].AveragePricePerNight,10);
				//console.log(a);
			}
			//var avg = prices.avg();
			a = a / (prices.length);
			//console.log(a);
			var b = parseInt(a) - 20;
			var c = parseInt(a) - 10;

				$(hotwire.appendTo).append( 
						" < 1mi $" +  a + "<br /> < 5mi $" + b + "<br />< 10mi $" + c
					);
			}					
				

		});
		
	}, 
	
		
	/**
      * relative time calculator FROM TWITTER
      * @param {string} twitter date string returned from Twitter API
      * @return {string} relative time like "2 minutes ago"
      */
    timeAgo: function(dateString) {
		var rightNow = new Date();
		var then = new Date(dateString);
		
		if ($.browser.msie) {
			// IE can't parse these crazy Ruby dates
			then = Date.parse(dateString.replace(/( \+)/, ' UTC$1'));
		}

		var diff = rightNow - then;

		var second = 1000,
		minute = second * 60,
		hour = minute * 60,
		day = hour * 24,
		week = day * 7;

		if (isNaN(diff) || diff < 0) {
			return ""; // return blank string if unknown
		}

		if (diff < second * 2) {
			// within 2 seconds
			return "right now";
		}

		if (diff < minute) {
			return Math.floor(diff / second) + " seconds ago";
		}

		if (diff < minute * 2) {
			return "about 1 minute ago";
		}

		if (diff < hour) {
			return Math.floor(diff / minute) + " minutes ago";
		}

		if (diff < hour * 2) {
			return "about 1 hour ago";
		}

		if (diff < day) {
			return  Math.floor(diff / hour) + " hours ago";
		}

		if (diff > day && diff < day * 2) {
			return "yesterday";
		}

		if (diff < day * 365) {
			return Math.floor(diff / day) + " days ago";
		}

		else {
			return "over a year ago";
		}
	}, // timeAgo()
    
	
    /**
      * The Twitalinkahashifyer!
      * http://www.dustindiaz.com/basement/ify.html
      * Eg:
      * ify.clean('your tweet text');
      */
    ify:  {
      link: function(tweet) {
        return tweet.replace(/\b(((https*\:\/\/)|www\.)[^\"\']+?)(([!?,.\)]+)?(\s|$))/g, function(link, m1, m2, m3, m4) {
          var http = m2.match(/w/) ? 'http://' : '';
          return '<a class="twtr-hyperlink" target="_blank" href="' + http + m1 + '">' + ((m1.length > 25) ? m1.substr(0, 24) + '...' : m1) + '</a>' + m4;
        });
      },

      at: function(tweet) {
        return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20})/g, function(m, username) {
          return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/intent/user?screen_name=' + username + '">@' + username + '</a>';
        });
      },

      list: function(tweet) {
        return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20}\/\w+)/g, function(m, userlist) {
          return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/' + userlist + '">@' + userlist + '</a>';
        });
      },

      hash: function(tweet) {
        return tweet.replace(/(^|\s+)#(\w+)/gi, function(m, before, hash) {
          return before + '<a target="_blank" class="twtr-hashtag" href="http://twitter.com/search?q=%23' + hash + '">#' + hash + '</a>';
        });
      },

      clean: function(tweet) {
        return this.hash(this.at(this.list(this.link(tweet))));
      }
    } // ify

};

Array.prototype.avg = function() {
	var av = 0;
	var cnt = 0;
	var len = this.length;
	for (var i = 0; i < len; i++) {
	var e = + this[i];
	if(!e && this[i] !== 0 && this[i] !== '0') e--;
	if (this[i] == e) {av += e; cnt++;}
	}
	return av/cnt;
}

$(document).ready(function () {
	hotwire.loadHotels();
});
