var baseUrl = "https://pds.jit.su/";

pdsRequest = function(url, method, input, callback) {
	var client = Ti.Network.createHTTPClient({
		// function called when the response data is available
		onload : function(e) {
			json = JSON.parse(this.responseText);
			return callback(json);
		},
		// function called when an error occurs, including a timeout
		onerror : function(e) {
			Ti.API.info('** call pd_server ERROR: ');
			Ti.API.info( JSON.stringify(e) );
			return callback(e);
		},
		timeout : 10000 // in milliseconds
	});

	// Prepare the connection.
	var call = baseUrl + url;
	Ti.API.log('** call pd_server: ' + call);
	client.open(method, call);

	// Send the request.
	client.send();
}

exports.shwUser = function(input, callback) {	
	Ti.API.log('** Entrando updUser ');
	pdsRequest('users/show/' + input.user_id , 'GET', null, function(data) {
		return callback(data);
	});
};

exports.vote = function(input, callback) {
	pdsRequest('duels/vote/' + input.duel_id + '/' + input.option + '/' + input.user_id , 'POST', null, function(data) {
		return callback(data);
	});
};

exports.updUser = function(input, callback) {	
	Ti.API.log('** Entrando updUser ');
	Ti.API.log( JSON.stringify(input) );
	pdsRequest('users/update/' + input.user_id + '/' + input.name + '/' + input.email + '/' + input.access_token , 'POST', null, function(data) {
		return callback(data);
	});
};
