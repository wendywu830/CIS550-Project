var fs = require('fs');
var readline = require('readline');

//actual file creation

fs.readFile('airlines.dat', 'utf8', function(err, data) {
	if (err) throw err;
	else {
		strings = data.split(/\r?\n/);
		var elts = [];
		strings.forEach(function(thing) {
			var elt = thing.split(',');
			if (elt.length == 8 &&
			 parseInt(elt[0]) && elt[0].length != 0 && elt[0] != 'N' && elt[0] != '\\N' &&
			 elt[1].length > 2 && elt[1] != 'N' && elt[1] != '\\N' && 
			 elt[1].charAt(0) == '"' && elt[1].charAt(elt[1].length - 1) == '"' &&
			 elt[6].length > 2 && elt[6] != 'N' && elt[6] != '\\N' &&
			 elt[6].charAt(0) == '"' && elt[6].charAt(elt[6].length - 1) == '"') {
			 	var str = 'INSERT INTO Airlines (airline_id, name, country) VALUES (' + elt[0] + ', ' + elt[1].replace(/'/g,"''").replace(/"/g,"'").replace(/&/g, 'and') + ', ' + elt[6].replace(/'/g,"''").replace(/"/g,"'").replace(/&/g, 'and')  + ');';
				elts.push(str);
			}
		});
		var fullSend = elts.join('\n');
		fs.writeFile("Output.txt", fullSend, (err) => {
			if (err) throw err;
		});
	}
});