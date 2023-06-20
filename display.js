
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

var iban = document.getElementById('iban_input');

iban.addEventListener('keyup', function() {
	var val = this.value;
	var note = document.getElementById('iban_valid');
	var elementsDisplay = document.getElementById('iban_elements');
	note.innerHTML = '';
	elementsDisplay.innerHTML = '';

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
				this.style.backgroundColor = '#f99';
			}

			if (valid === true) {
				this.style.backgroundColor = '#0c0';
				var elements = resp[4];
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
			}

			if (valid === null) {
				this.style.backgroundColor = '#fff';
			}

			note.innerHTML = message;
		}
	}
});

