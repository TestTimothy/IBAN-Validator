
/**
 * The MIT License (MIT)
 *
 * Copyright (c) 2023 Timothy Green
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
 * of the Software, and to permit persons to whom the Software is furnished to do
 * so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 * INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A
 * PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
 * HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
 * SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

function calculate_iban(el) {
	var val = el.value;
	var note = document.getElementById('iban_valid');
	var country = document.getElementById('iban_country');
	var elementsDisplay = document.getElementById('iban_elements');
	var display_style = document.querySelector('input[name=displaying]:checked').value;
	note.innerHTML = '';
	country.innerHTML = '';
	if (elementsDisplay) {
		elementsDisplay.remove();
	}

	if (val.length > 5) {
		var iban = val.toUpperCase();
		var iban = iban.replace(/\s/g, '');
		if (iban.length > 4) {
			var resp = validateIban(iban);

			var valid = resp[0];
			var code = resp[1];
			var name = resp[2];
			var message = resp[3];

			if (valid === false) {
				el.className = 'invalid';
			}

			if (valid === true) {
				el.className = 'valid';
				var elements = resp[4];

				if (display_style === 'table') {
					elementsDisplay = document.createElement('table');
					elementsDisplay.id = 'iban_elements';
					elements.forEach(function(elm) {
						var s = document.createElement('tr');
						var l = document.createElement('th');
						var v = document.createElement('td');
						s.className = elm.type;
						l.innerHTML = elm.label;
						v.innerHTML = elm.value;
						s.appendChild(l);
						s.appendChild(v);
						elementsDisplay.appendChild(s);
					});
					document.body.appendChild(elementsDisplay);
				} else {
					elementsDisplay = document.createElement('div');
					elementsDisplay.id = 'iban_elements';
					elements.forEach(function(elm) {
						var s = document.createElement('span');
						var l = document.createElement('span');
						var v = document.createElement('span');
						s.style.display = 'block';
						s.className = elm.type;
						l.style.fontWeight = 'bold';
						l.innerHTML = elm.label + ':';
						v.innerHTML = elm.value;
						s.appendChild(l);
						s.appendChild(v);
						elementsDisplay.appendChild(s);
					});
					document.body.appendChild(elementsDisplay);
				}
			}

			if (valid === null) {
				el.className = 'neutral';
			}

			note.innerHTML = message;
			country.innerHTML = name;
		}
	}
}

document.getElementById('iban_input').addEventListener('input', function() {
	calculate_iban(this);
});

var displaying = document.qx.displaying;
displaying.forEach (display_option => {
	display_option.addEventListener('change', function() {
		var iban = document.getElementById('iban_input');
		calculate_iban(iban);
	});
});
