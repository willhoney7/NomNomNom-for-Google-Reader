/*jslint 
browser: true,
nomen: false,
debug: true,
forin: true,
undef: true,
white: false,
onevar: false 
 */

/**
 * A library to do url shortening 
 */

/**
 * Constants to refer to services 
 */
/**
 * @constant 
 */
var SPAZCORE_SHORTURL_SERVICE_ISGD	  = 'is.gd';
/**
 * @constant 
 */
var SPAZCORE_SHORTURL_SERVICE_BITLY	  = 'bit.ly';
/**
 * @constant 
 */
var SPAZCORE_SHORTURL_SERVICE_JMP     = 'j.mp';
/**
 * @constant 
 */
var SPAZCORE_SHORTURL_SERVICE_GOOGLE  = 'goo.gl';
/**
 * @constant 
 */
var SPAZCORE_SHORTURL_SERVICE_GOLOOKAT  = 'go.ly';

/**
 * Constructor
 * @param {string} service	the name of a service. Preferrably one of the SPAZCORE_SHORTURL_SERVICE_* constants
 * @class SpazShortURL
 * @constructor
 */
function SpazShortURL(service) {
	
	this.api = this.getAPIObj(service);
	
	this.expanded_cache = {};
	
}


SpazShortURL.prototype.services = {};
	
SpazShortURL.prototype.services[SPAZCORE_SHORTURL_SERVICE_BITLY] = {
	'url'	  : 'http://api.bit.ly/v3/shorten',
	'getData' : function(longurl, opts) {
	    var data = {
	        'longurl':longurl,
	        'login':opts.login,
	        'apiKey':opts.apiKey,
	        'format':'json'
	    };
		return data;
	},
	'method':'GET',
	'processResult' : function(data, longurl) {
		var result = JSON.parse(data);

		if (result.data && result.data.long_url) {
		    result.longurl = result.data.long_url;
			result.shorturl = result.data.url;
		}
		return result;
	}
};

SpazShortURL.prototype.services[SPAZCORE_SHORTURL_SERVICE_JMP] = {
	'url'	  : 'http://api.j.mp/v3/shorten',
	'getData' : function(longurl, opts){
	    var data = {
	        'longurl':longurl,
	        'login':opts.login,
	        'apiKey':opts.apiKey,
	        'format':'json'
	    };
		return data;
	},
	'method':'GET',
	'processResult' : function(data, longurl) {
		var result = JSON.parse(data);

		if (result.data && result.data.long_url) {
		    result.longurl = result.data.long_url;
			result.shorturl = result.data.url;
		}
		return result;
	}
};

SpazShortURL.prototype.services[SPAZCORE_SHORTURL_SERVICE_ISGD] = {
	'url'	  : 'http://is.gd/create.php',
	'getData' : function(longurl, opts) {
		return { 'url':longurl, 'format':'simple' };
	}
};

SpazShortURL.prototype.services[SPAZCORE_SHORTURL_SERVICE_GOLOOKAT] = {
	'url'	  : 'http://api.golook.at/',
	'getData' : function(longurl, opts) {
		return { 'url':longurl, 'output_format':'json', 'anybase':1 };
	},
	'method':'GET',
	'processResult' : function(data, longurl) {
		var result = JSON.parse(data);

		if (result.orig_url && result.short_url) {
		    result.longurl = result.orig_url;
			result.shorturl = result.short_url;
		}
		return result;
	}
};

SpazShortURL.prototype.services[SPAZCORE_SHORTURL_SERVICE_GOOGLE] = {
	'url'	  : 'https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyBMFTY7VjWGoXeFwbiY7vXoqAssjTr0od0',
	// 'url'	  : 'https://www.googleapis.com/urlshortener/v1/url',
	'contentType':'application/json',
	'getData' : function(longurl, opts) {
		return JSON.stringify({ 'longUrl':longurl  });
	},
	'processResult' : function(data, longurl) {
		var result = JSON.parse(data);
		
		if (result.longUrl && result.id) {
			result.longurl = longurl; // google re-encodes characters so we need to use the original we passed
			result.shorturl = result.id;
		}
		return result;
	}
};





/**
 * returns an array of labels for the services 
 * @return array
 */
SpazShortURL.prototype.getServiceLabels = function() {
	var labels = [];
	for(var key in this.services) {
		labels.push(key);
	}
	return labels;
};





SpazShortURL.prototype.getAPIObj = function(service) {
	

	
	return this.services[service];
};


/**
 * shortens a URL by making an ajax call
 * @param {string} longurl
 * @param {object} [opts]   right now opts.event_target (a DOMelement) and opts.apiopts (passed to api's getData() call) are supported
 * @param {DOMElement} [opts.event_target]
 * @param {Object} [opts.apiopts]
 * @param {Function} [opts.onSuccess]
 * @param {Function} [opts.onError]
 */
SpazShortURL.prototype.shorten = function(longurl, opts) {
	
	var shortener = this;
	
	if (!opts) { opts = {}; }

	/*
		set defaults if needed
	*/
	opts.event_target = opts.event_target || document;
	opts.apiopts	  = opts.apiopts	  || null;



	if (_.isString(longurl)) {
		longurl = [longurl];
	}
	
	for (var i=0; i < longurl.length; i++) {

		longurl[i];

		/*
			we call getData now in case it needs to override anything
		*/
		var apidata = this.api.getData(longurl[i], opts.apiopts);
		
		getShortURL(longurl[i], shortener, apidata, opts, this);
		
	}
	
	function getShortURL(longurl, shortener, apidata, opts, self) {
	    
		Zepto.ajax({
			'traditional':true, // so we don't use square brackets on arrays in data. Bit.ly doesn't like it
			'dataType':'text',
			complete:function(xhr, rstr) {
			},
			'error':function(xhr, msg, exc) {
				var errobj = {'url':shortener.api.url, 'xhr':null, 'msg':null};

				if (xhr) {
					errobj.xhr = xhr;
				} else {
					errobj.msg = 'Unknown Error';
				}
				if (opts.onError) {
					opts.onError(errobj);
				}
				
			},
			success:function(data) {
				// var shorturl = trim(data);
				var return_data = {};
				if (shortener.api.processResult) {
					return_data = shortener.api.processResult(data, longurl);
				} else {
					return_data = {
						'shorturl':data,
						'longurl' :longurl
					};
				}
				if (opts.onSuccess) {
					opts.onSuccess(return_data);
				}
			},

			'type':self.api.method || "POST",
			'contentType':self.api.contentType || "application/x-www-form-urlencoded",
			'url' :self.api.url,
			'data':apidata
		});			
	}
	
};
