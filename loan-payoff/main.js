document.addEventListener('DOMContentLoaded', function () {
    var goButton = document.getElementById('go-button');
    goButton.onclick = function (event) {
        event.preventDefault();
        Calculate();
    };
});

function Calculate() {
    var initialPrincipal = +(document.getElementById('initial-principal').value);
    var remainingPrincipal = +(document.getElementById('remaining-principal').value);
    var interestRatePercent = +(document.getElementById('interest-rate').value);
    var additionalPrincipal = +(document.getElementById('additional-principal').value);
    var years = +(document.getElementById('years').value);
    var tbody = document.getElementById('results-tbody');
    var monthlyRate = interestRatePercent / 100 / 12;
    var months = years * 12;
	var baseAmount = (monthlyRate * (initialPrincipal * Math.pow(1 + monthlyRate, months))
                    / (Math.pow(1 + monthlyRate, months) - 1));
                    
    var month = 1;
    var interestPaid = 0;
    var principalPaid = 0;
    var totalPaid = 0;
    var paymentAmount = baseAmount + additionalPrincipal;

    tbody.innerHTML = '';

	while (remainingPrincipal >= 0.01)
	{
        var interestAmount = (remainingPrincipal * monthlyRate);
		var principalAmount = baseAmount - interestAmount + additionalPrincipal;
        remainingPrincipal -= principalAmount;
        
        interestPaid += interestAmount;
        principalPaid += principalAmount;
        totalPaid += interestAmount + principalAmount;

        var row = document.createElement('tr');
        
        row.innerHTML = 
            '<td>' + (month++) + '</td>' +
            '<td>' + formatMoney(paymentAmount) + '</td>' +
            '<td>' + formatMoney(principalAmount) + '</td>' +
            '<td>' + formatMoney(interestAmount) + '</td>' +
            '<td>' + formatMoney(remainingPrincipal) + '</td>' +
            '<td>' + formatMoney(principalPaid) + '</td>' +
            '<td>' + formatMoney(interestPaid) + '</td>' +
            '<td>' + formatMoney(totalPaid) + '</td>';

        tbody.append(row);
	}
}

// https://stackoverflow.com/a/149099/47645
function formatMoney(n, c, d, t) {
    var c = isNaN(c = Math.abs(c)) ? 2 : c,
      d = d == undefined ? "." : d,
      t = t == undefined ? "," : t,
      s = n < 0 ? "-" : "",
      i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
      j = (j = i.length) > 3 ? j % 3 : 0;
  
    return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
  };