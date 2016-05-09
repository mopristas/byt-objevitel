'use strict';

var cheerio = require('cheerio');
var request = require('request');

var Source = module.exports = {

	getData: function(options) {

		options || (options = {});

		var emitter = new EventEmitter();

		// !! TODO !!
		// Should get the number of pages from the first page, then get the results for ALL pages.
		this.getResults(1/* page */, function(error, results) {

			if (error) {
				emitter.emit('error', error);
			} else {
				emitter.emit('data', results);
			}

			emitter.emit('end');
		});

		return emitter;
	},

	getResults: function(page, cb) {

		// ?st=3&f_typ_nabidky[]=2&isa[]=1&loc_more=&cena_od=&cena_do=

		request({
			method: 'GET',
			url: 'http://reality.idnes.cz/s/'
		}, function(error, response, html) {

			if (error) {
				return cb(error);
			}

			var status = response.statusCode;

			if (status >= 300) {
				// Some HTTP error occurred.
				var error = new Error(response.statusMessage);
				error.code = 'HTTP_' + status;
				return cb(error);
			}

			var results = [];

			 var $ = cheerio.load(html);
			 var items = $('.item');

			 items.each(function() {

			 	var item = $(this);
			 	var href = item.find("h2 a").attr('href');

                                results.push(href);
			 });

			cb(null, results);
		});
	}
};

Source.getResults(1,function(error, results){
    console.log(error);
    console.log(results);
});