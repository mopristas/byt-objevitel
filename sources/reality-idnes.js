'use strict';

var cheerio = require('cheerio');
var request = require('request');

module.exports = {

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

			// var $ = cheerio.load(html);
			// var tables = $('.traffic-table:not([id])');

			// tables.each(function() {

			// 	var table = $(this);
			// 	var rows = table.find('tbody tr');

			// 	rows.each(function() {

			// 		var row = $(this);
			// 		var day = row.find('th:first-child').text();
			// 		console.log(day);
			// 	});
			// });

			cb(null, results);
		});
	}
};
