angular.module('principal')
.filter('somarPelaChave', function() {
	return function(data, key) {
		if (typeof(data) === 'undefined' || typeof(key) === 'undefined') {
			return 0;
    }
 
    var sum = 0;
    for (var i = data.length - 1; i >= 0; i--) {
      var novoValor = data[i][key].replace(',', '.');
      sum += parseFloat(novoValor);
    }
    return sum;
	};
});
angular.module('principal').filter('titleCase', function() {
  return function(input) {
    input = input || '';
    return input.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
  };
});