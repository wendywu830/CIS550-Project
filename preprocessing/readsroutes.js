var fs = require('fs');
var readline = require('readline');

//actual file creation

fs.readFile('routes.dat', 'utf8', function(err, data) {
	if (err) throw err;
	else {
		strings = data.split(/\r?\n/);
		var elts = [];
		count = 0;
		strings.forEach(function(thing) {
			var elt = thing.split(',');
			if (elt.length == 9 &&
			 elt[1].length != 0 && elt[1] != 'N' && elt[1] != '\\N' &&
			 elt[3].length != 0 && elt[3] != 'N' && elt[3] != '\\N' &&
			 elt[5].length != 0 && elt[5] != 'N' && elt[5] != '\\N' &&
			 elt[7].length != 0) {//&& elt[7] != 'N' && elt[7] != '\\N') {
			 	var str = 'INSERT INTO Routes (route_id, airline_id, source_id, target_id, stops) VALUES (' 
			 	+ count + ', ' + elt[1] + ', ' + elt[3] + ', ' + elt[5] + ', ' + elt[7] + ');';
				elts.push(str);
				count += 1;
			}
		});
		var fullSend = elts.join('\n');
		fs.writeFile("Output.txt", fullSend, (err) => {
			if (err) throw err;
		});
	}
});