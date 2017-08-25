var $ = require('jquery');
var toastr = require('toastr');

var api = {

	post: function(url, data, success) {
		$.post(url, data, function(res, status, jqxhr) {
			var status = jqxhr.status;
			if (res.success) {
				if (success) success(res);
				if (res.message) toastr.success(res.message);
			} else {
				if (res.message) toastr.error(res.message);
			}
		}, 'json').fail(function(jqxhr) {
			var status = jqxhr.status;
		});
	},

	get: function(url, data, success) {
		$.getJSON(url, data, function(res, _status, jqxhr) {
			var status = jqxhr.status;
			if (res.success) {
				if (success) success(res);
				if (res.message) toastr.success(res.message);
			} else {
				if (res.message) toastr.error(res.message);
			}
		}).fail(function(jqxhr) {
			var status = jqxhr.status;
		});
	}

}

export default api;