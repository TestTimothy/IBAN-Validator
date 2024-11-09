
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

/**
 * IMPORTANT NOTE:
 *
 * Information on BBAN structure is lifted primarily from Wikipedia, as it names
 * the parts of the BBAN, but I have also considered the IBAN Registry (Release 98,
 * July 2024), published by SWIFT. And I've tested on examples from https://www.iban.com/structure
 * too.
 *
 * https://en.wikipedia.org/wiki/International_Bank_Account_Number
 */

/**
 * I'm checking the field types in the BBAN, that letters and digits are where they
 * are expected to be. Many BBANs have far more rules than that, such as conforming
 * to the Luhn algorithm or expecting certain modular arithmetic. Many even have
 * their own check digits, independent of the IBAN check digits. I do plan to add
 * more "checks" functions, but so far I have only two simple ones, so this is very
 * much a work in progress. Still, at least for countries which use the IBAN check
 * digits (denoted check:true), it should be sufficient as it stands to catch almost
 * all typos.
 */

function validateIban(iban) {
	var countries = {
		'AL':{
			'name':'Albania',
			'length':28,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':3,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':7,
					'length':3,
					'name':'Branch code',
					'type':'n',
				},
				{
					'init':11,
					'length':1,
					'name':'National check digit',
					'type':'n',
				},
				{
					'init':12,
					'length':16,
					'name':'Account number',
					'type':'c',
				},
			],
		},
		'AD':{
			'name':'Andorra',
			'length':24,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':4,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':8,
					'length':4,
					'name':'Branch code',
					'type':'n',
				},
				{
					'init':12,
					'length':12,
					'name':'Account number',
					'type':'c',
				},
			],
		},
		'AT':{
			'name':'Austria',
			'length':20,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':5,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':9,
					'length':11,
					'name':'Account number',
					'type':'n',
				},
			],
		},
		'AZ':{
			'name':'Azerbaijan',
			'length':28,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':4,
					'name':'National bank code',
					'type':'a',
				},
				{
					'init':8,
					'length':20,
					'name':'Account number',
					'type':'c',
				},
			],
		},
		'BH':{
			'name':'Bahrain',
			'length':22,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':4,
					'name':'National bank code',
					'type':'a',
				},
				{
					'init':8,
					'length':14,
					'name':'Account number',
					'type':'c',
				},
			],
		},
		'BY':{
			'name':'Belarus',
			'length':28,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':4,
					'name':'National bank or branch code',
					'type':'c',
				},
				{
					'init':8,
					'length':4,
					'name':'Balance account number',
					'type':'n',
				},
				{
					'init':12,
					'length':16,
					'name':'Account number',
					'type':'c',
				},
			],
		},
		'BE':{
			'name':'Belgium',
			'length':16,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':3,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':7,
					'length':7,
					'name':'Account number',
					'type':'n',
				},
				{
					'init':14,
					'length':2,
					'name':'National check digits',
					'type':'n',
				},
			],
		},
		'BA':{
			'name':'Bosnia and Herzegovina',
			'length':20,
			'official':true,
			'check':39,
			'elements':[
				{
					'init':4,
					'length':3,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':7,
					'length':3,
					'name':'Branch code',
					'type':'n',
				},
				{
					'init':10,
					'length':8,
					'name':'Account number',
					'type':'n',
				},
				{
					'init':18,
					'length':2,
					'name':'National check digits',
					'type':'n',
				},
			],
		},
		'BR':{
			'name':'Brazil',
			'length':29,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':8,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':12,
					'length':5,
					'name':'Branch code',
					'type':'n',
				},
				{
					'init':17,
					'length':10,
					'name':'Account number',
					'type':'n',
				},
				{
					'init':27,
					'length':1,
					'name':'Account type',
					'type':'a',
				},
				{
					'init':28,
					'length':1,
					'name':'Owner account number',
					'type':'c',
				},
			],
		},
		'BG':{
			'name':'Bulgaria',
			'length':22,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':4,
					'name':'BIC bank code',
					'type':'a',
				},
				{
					'init':8,
					'length':4,
					'name':'Branch (BAE) number',
					'type':'n',
				},
				{
					'init':12,
					'length':2,
					'name':'Account type',
					'type':'n',
				},
				{
					'init':14,
					'length':8,
					'name':'Account number',
					'type':'c',
				},
			],
		},
		'CR':{
			'name':'Costa Rica',
			'length':22,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':1,
					'name':null,
					'type':'0',
				},
				{
					'init':5,
					'length':3,
					'name':'Bank code',
					'type':'n',
				},
				{
					'init':8,
					'length':14,
					'name':'Account number',
					'type':'n',
				},
			],
		},
		'HR':{
			'name':'Croatia',
			'length':21,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':7,
					'name':'Bank code',
					'type':'n',
				},
				{
					'init':11,
					'length':10,
					'name':'Account number',
					'type':'n',
				},
			],
		},
		'CY':{
			'name':'Cyprus',
			'length':28,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':3,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':7,
					'length':5,
					'name':'Branch code',
					'type':'n',
				},
				{
					'init':12,
					'length':16,
					'name':'Account number',
					'type':'c',
				},
			],
		},
		'CZ':{
			'name':'Czech Republic',
			'length':24,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':4,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':8,
					'length':4,
					'name':'Account number prefix',
					'type':'n',
				},
				{
					'init':12,
					'length':2,
					'name':null, // TODO: Wikipedia doesn't provide a name for this element. Maybe someone else does?
					'type':'n',
				},
				{
					'init':14,
					'length':10,
					'name':'Account number',
					'type':'n',
				},
			],
		},
		'DK':{
			'name':'Denmark',
			'length':18,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':4,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':8,
					'length':9,
					'name':'Account number',
					'type':'n',
				},
				{
					'init':17,
					'length':1,
					'name':'National check digit',
					'type':'n',
				},
			],
		},
		'DO':{
			'name':'Dominican Republic',
			'length':28,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':4,
					'name':'Bank identifier',
					'type':'c',
				},
				{
					'init':8,
					'length':20,
					'name':'Account number',
					'type':'n',
				},
			],
		},
		'TL':{
			'name':'Timor-Leste (East Timor)',
			'length':23,
			'official':true,
			'check':38,
			'elements':[
				{
					'init':4,
					'length':3,
					'name':'Bank identifier',
					'type':'n',
				},
				{
					'init':7,
					'length':14,
					'name':'Account number',
					'type':'n',
				},
				{
					'init':21,
					'length':2,
					'name':'National check digits',
					'type':'n',
				},
			],
		},
		'EG':{
			'name':'Egypt',
			'length':29,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':4,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':8,
					'length':4,
					'name':'Branch code',
					'type':'n',
				},
				{
					'init':12,
					'length':17,
					'name':'Account number',
					'type':'n',
				},
			],
		},
		'SV':{
			'name':'El Salvador',
			'length':28,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':4,
					'name':'National bank code',
					'type':'a',
				},
				{
					'init':8,
					'length':20,
					'name':'Account number',
					'type':'n',
				},
			],
		},
		'EE':{
			'name':'Estonia',
			'length':20,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':2,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':6,
					'length':2,
					'name':'Branch code',
					'type':'n',
				},
				{
					'init':8,
					'length':11,
					'name':'Account number',
					'type':'n',
				},
				{
					'init':19,
					'length':1,
					'name':'National check digit',
					'type':'n',
				},
			],
		},
		'YE':{
			'name':'Yemen',
			'length':30,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':4,
					'name':'Bank code',
					'type':'a',
				},
				{
					'init':8,
					'length':4,
					'name':'Branch code',
					'type':'n',
				},
				{
					'init':12,
					'length':18,
					'name':'Account number',
					'type':'c',
				}
			],
		},
		'FK':{
			'name':'Falkland Islands',
			'length':18,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':2,
					'name':'National bank code',
					'type':'a',
				},
				{
					'init':6,
					'length':12,
					'name':'Account number',
					'type':'n',
				}
			],
		},
		'FO':{
			'name':'Faroe Islands',
			'official':true,
			'copy':'DK',
		},
		'FI':{
			'name':'Finland',
			'length':18,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':6,
					'name':'Bank and branch code',
					'type':'n',
				},
				{
					'init':10,
					'length':7,
					'name':'Account number',
					'type':'n',
				},
				{
					'init':17,
					'length':1,
					'name':'National check digit',
					'type':'n',
				},
			],
		},
		'FR':{
			'name':'France',
			'length':27,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':5,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':9,
					'length':5,
					'name':'Branch code (code guichet)',
					'type':'n',
				},
				{
					'init':14,
					'length':11,
					'name':'Account number',
					'type':'c',
				},
				{
					'init':25,
					'length':2,
					'name':'National check digits (clé RIB)',
					'type':'n',
				},
			],
		},
		'GE':{
			'name':'Georgia',
			'length':22,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':2,
					'name':'National bank code',
					'type':'a',
				},
				{
					'init':6,
					'length':16,
					'name':'Account number',
					'type':'n',
				},
			],
		},
		'DE':{
			'name':'Germany',
			'length':22,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':8,
					'name':'Bank and branch identifier (Bankleitzahl/BLZ)',
					'type':'n',
				},
				{
					'init':12,
					'length':10,
					'name':'Account number',
					'type':'n',
				},
			],
		},
		'GI':{
			'name':'Gibraltar',
			'length':23,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':4,
					'name':'BIC bank code',
					'type':'a',
				},
				{
					'init':8,
					'length':15,
					'name':'Account number',
					'type':'c',
				},
			],
		},
		'GR':{
			'name':'Greece',
			'length':27,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':3,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':7,
					'length':4,
					'name':'Branch code',
					'type':'n',
				},
				{
					'init':11,
					'length':16,
					'name':'Account number',
					'type':'c',
				},
			],
		},
		'GL':{
			'name':'Greenland',
			'official':true,
			'copy':'DK',
		},
		'GT':{
			'name':'Guatemala',
			'length':28,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':4,
					'name':'National bank code',
					'type':'c',
				},
				{
					'init':8,
					'length':2,
					'name':'Currency code',
					'type':'c',
				},
				{
					'init':10,
					'length':2,
					'name':'Account type',
					'type':'c',
				},
				{
					'init':12,
					'length':16,
					'name':'Account number',
					'type':'c',
				},
			],
		},
		'HU':{
			'name':'Hungary',
			'length':28,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':3,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':7,
					'length':4,
					'name':'Branch code',
					'type':'n',
				},
				{
					'init':11,
					'length':1,
					'name':'National check digit 1',
					'type':'n',
				},
				{
					'init':12,
					'length':15,
					'name':'Account number',
					'type':'n',
				},
				{
					'init':27,
					'length':1,
					'name':'National check digit 2',
					'type':'n',
				},
			],
		},
		'IS':{
			'name':'Iceland',
			'length':26,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':2,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':6,
					'length':2,
					'name':'Branch code',
					'type':'n',
				},
				{
					'init':8,
					'length':2,
					'name':'Account type',
					'type':'n',
				},
				{
					'init':10,
					'length':6,
					'name':'Account number',
					'type':'n',
				},
				{
					'init':16,
					'length':10,
					'name':'Account holder’s kennitala (national ID number)',
					'type':'n',
				},
			],
		},
		'IQ':{
			'name':'Iraq',
			'length':23,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':4,
					'name':'National bank code',
					'type':'a',
				},
				{
					'init':8,
					'length':3,
					'name':'Branch code',
					'type':'n',
				},
				{
					'init':11,
					'length':12,
					'name':'Account number',
					'type':'n',
				},
			],
		},
		'IE':{
			'name':'Ireland',
			'official':true,
			'copy':'GB',
		},
		'IL':{
			'name':'Israel',
			'length':23,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':3,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':7,
					'length':3,
					'name':'Branch code',
					'type':'n',
				},
				{
					'init':10,
					'length':13,
					'name':'Account number',
					'type':'n',
				},
			],
		},
		'IT':{
			'name':'Italy',
			'length':27,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':1,
					'name':'Check character (CIN)',
					'type':'a',
				},
				{
					'init':5,
					'length':5,
					'name':'National bank code (Associazione Bancaria Italiana/Codice ABI)',
					'type':'n',
				},
				{
					'init':10,
					'length':5,
					'name':' Branch code (Coordinate bancarie/Codice d’Avviamento Bancario (CAB))',
					'type':'n',
				},
				{
					'init':15,
					'length':12,
					'name':'Account number',
					'type':'c',
				},
			],
		},
		'JO':{
			'name':'Jordan',
			'length':30,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':4,
					'name':'National bank code',
					'type':'a',
				},
				{
					'init':8,
					'length':4,
					'name':'Branch code',
					'type':'n',
				},
				{
					'init':12,
					'length':18,
					'name':'Account number',
					'type':'c',
				},
			],
		},
		'KZ':{
			'name':'Kazakhstan',
			'length':20,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':3,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':7,
					'length':13,
					'name':'Account number',
					'type':'c',
				},
			],
		},
		'XK':{
			'name':'Kosovo',
			'length':20,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':4,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':8,
					'length':12,
					'name':'Account number',
					'type':'n',
				},
			],
		},
		'KW':{
			'name':'Kuwait',
			'length':30,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':4,
					'name':'National bank code',
					'type':'a',
				},
				{
					'init':8,
					'length':22,
					'name':'Account number',
					'type':'c',
				},
			],
		},
		'LV':{
			'name':'Latvia',
			'length':21,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':4,
					'name':'BIC bank code',
					'type':'a',
				},
				{
					'init':8,
					'length':13,
					'name':'Account number',
					'type':'c',
				},
			],
		},
		'LB':{
			'name':'Lebanon',
			'length':28,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':4,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':8,
					'length':20,
					'name':'Account number',
					'type':'c',
				},
			],
		},
		'LY':{
			'name':'Libya',
			'length':25,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':3,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':7,
					'length':3,
					'name':'Branch code',
					'type':'n',
				},
				{
					'init':10,
					'length':15,
					'name':'Account number',
					'type':'n',
				},
			],
		},
		'LI':{
			'name':'Liechtenstein',
			'length':21,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':5,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':9,
					'length':12,
					'name':'Account number',
					'type':'c',
				},
			],
		},
		'LT':{
			'name':'Lithuania',
			'length':20,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':5,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':9,
					'length':12,
					'name':'Account number',
					'type':'c',
				},
			],
		},
		'LU':{
			'name':'Luxembourg',
			'length':20,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':3,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':7,
					'length':13,
					'name':'Account number',
					'type':'c',
				},
			],
		},
		'MN':{
			'name':'Mongolia',
			'length':20,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':4,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':8,
					'length':12,
					'name':'Account number',
					'type':'n',
				},
			],
		},
		'MT':{
			'name':'Malta',
			'length':31,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':4,
					'name':'BIC bank code',
					'type':'a',
				},
				{
					'init':8,
					'length':5,
					'name':'Branch code',
					'type':'n',
				},
				{
					'init':13,
					'length':18,
					'name':'Account number',
					'type':'c',
				},
			],
		},
		'MR':{
			'name':'Mauritania',
			'length':27,
			'official':true,
			'check':13,
			'elements':[
				{
					'init':4,
					'length':5,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':9,
					'length':5,
					'name':'Branch code (code guichet)',
					'type':'n',
				},
				{
					'init':14,
					'length':11,
					'name':'Account number',
					'type':'n',
				},
				{
					'init':25,
					'length':2,
					'name':'National check digits',
					'type':'n',
				},
			],
		},
		'MU':{
			'name':'Mauritius',
			'length':30,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':6,
					'name':'National bank code',
					'type':'c',
				},
				{
					'init':10,
					'length':2,
					'name':'Branch identifier',
					'type':'n',
				},
				{
					'init':12,
					'length':12,
					'name':'Account number',
					'type':'n',
				},
				{
					'init':24,
					'length':3,
					'name':null,
					'type':'0',
				},
				{
					'init':27,
					'length':3,
					'name':'Currency code',
					'type':'a',
				},
			],
			'checks':[
				function(bban) {
					var banka = bban.substring(0, 4);
					var bankn = bban.substring(4, 6);

					var va = /^[A-Z]+$/.test(banka);
					var vn = /^[0-9]+$/.test(bankn);

					return va && vn;
				},
			],
		},
		'MC':{
			'name':'Monaco',
			'official':true,
			'copy':'FR',
		},
		'MD':{
			'name':'Moldova',
			'length':24,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':2,
					'name':'National bank code',
					'type':'c',
				},
				{
					'init':6,
					'length':18,
					'name':'Account code',
					'type':'c',
				},
			],
		},
		'ME':{
			'name':'Montenegro',
			'length':22,
			'official':true,
			'check':25,
			'elements':[
				{
					'init':4,
					'length':3,
					'name':'Bank code',
					'type':'n',
				},
				{
					'init':7,
					'length':13,
					'name':'Account number',
					'type':'n',
				},
				{
					'init':20,
					'length':2,
					'name':'National check digits',
					'type':'n',
				},
			],
		},
		'NL':{
			'name':'The Netherlands',
			'length':18,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':4,
					'name':'BIC bank code',
					'type':'a',
				},
				{
					'init':8,
					'length':10,
					'name':'Account number',
					'type':'n',
				},
			],
		},
		'MK':{
			'name':'North Macedonia',
			'length':19,
			'official':true,
			'check':7,
			'elements':[
				{
					'init':4,
					'length':3,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':7,
					'length':10,
					'name':'Account number',
					'type':'n',
				},
				{
					'init':17,
					'length':2,
					'name':'National check digits',
					'type':'n',
				},
			],
		},
		'NO':{
			'name':'Norway',
			'length':15,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':4,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':8,
					'length':6,
					'name':'Account number',
					'type':'n',
				},
				{
					'init':14,
					'length':1,
					'name':'National check digit',
					'type':'n',
				},
			],
		},
		'PK':{
			'name':'Pakistan',
			'length':24,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':4,
					'name':'National bank code',
					'type':'a',
				},
				{
					'init':8,
					'length':16,
					'name':'Account number',
					'type':'c',
				},
			],
		},
		'PS':{
			'name':'Palestine',
			'length':29,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':4,
					'name':'National bank code',
					'type':'a',
				},
				{
					'init':8,
					'length':21,
					'name':'Account number',
					'type':'c',
				},
			],
		},
		'PL':{
			'name':'Poland',
			'length':28,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':3,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':7,
					'length':4,
					'name':'Branch code',
					'type':'n',
				},
				{
					'init':11,
					'length':1,
					'name':'National check digit',
					'type':'n',
				},
				{
					'init':12,
					'length':16,
					'name':'Account number',
					'type':'n',
				},
			],
		},
		'PT':{
			'name':'Portugal',
			'length':25,
			'official':true,
			'check':50,
			'elements':[
				{
					'init':4,
					'length':4,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':8,
					'length':4,
					'name':'Branch code',
					'type':'n',
				},
				{
					'init':12,
					'length':11,
					'name':'Account number',
					'type':'n',
				},
				{
					'init':23,
					'length':2,
					'name':'National check digits',
					'type':'n',
				},
			],
		},
		'QA':{
			'name':'Qatar',
			'length':29,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':4,
					'name':'National bank code',
					'type':'a',
				},
				{
					'init':8,
					'length':21,
					'name':'Account number',
					'type':'c',
				},
			],
		},
		'RO':{
			'name':'Romania',
			'length':24,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':4,
					'name':'BIC bank code',
					'type':'a',
				},
				{
					'init':8,
					'length':16,
					'name':'Branch code and account number',
					'type':'c',
				},
			],
		},
		'RU':{
			'name':'Russia',
			'length':33,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':9,
					'name':'Bank code',
					'type':'n',
				},
				{
					'init':13,
					'length':5,
					'name':'Branch code',
					'type':'n',
				},
				{
					'init':18,
					'length':16,
					'name':'Account number',
					'type':'c',
				},
			],
		},
		'LC':{
			'name':'Saint Lucia',
			'length':32,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':4,
					'name':'Bank code',
					'type':'a',
				},
				{
					'init':8,
					'length':24,
					'name':'Account number',
					'type':'c',
				},
			],
		},
		'SM':{
			'name':'San Marino',
			'official':true,
			'copy':'IT',
		},
		'ST':{
			'name':'São Tomé and Príncipe',
			'length':25,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':4,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':8,
					'length':4,
					'name':'Branch number',
					'type':'n',
				},
				{
					'init':12,
					'length':13,
					'name':'Account number',
					'type':'n',
				},
			],
		},
		'SA':{
			'name':'Saudi Arabia',
			'length':24,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':2,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':6,
					'length':18,
					'name':'Account number',
					'type':'c',
				},
			],
		},
		'RS':{
			'name':'Serbia',
			'length':22,
			'official':true,
			'check':35,
			'elements':[
				{
					'init':4,
					'length':3,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':7,
					'length':13,
					'name':'Account number',
					'type':'n',
				},
				{
					'init':20,
					'length':2,
					'name':'Account check digits',
					'type':'n',
				},
			],
		},
		'SC':{
			'name':'Seychelles',
			'length':31,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':6,
					'name':'Bank code',
					'type':'c',
				},
				{
					'init':10,
					'length':2,
					'name':'Branch code',
					'type':'n',
				},
				{
					'init':12,
					'length':16,
					'name':'Account number',
					'type':'n',
				},
				{
					'init':28,
					'length':3,
					'name':'Currency code',
					'type':'a',
				},
			],
			'checks':[
				function(bban) {
					var banka = bban.substring(0, 4);
					var bankn = bban.substring(4, 6);

					var va = /^[A-Z]+$/.test(banka);
					var vn = /^[0-9]+$/.test(bankn);

					return va && vn;
				},
			],
		},
		'SK':{
			'name':'Slovakia',
			'length':24,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':4,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':8,
					'length':4,
					'name':'Account number prefix',
					'type':'n',
				},
				{
					'init':12,
					'length':2,
					'name':null, // TODO: Wikipedia doesn't provide a name for this element. Maybe someone else does?
					'type':'n',
				},
				{
					'init':14,
					'length':10,
					'name':'Account number',
					'type':'n',
				},
			],
		},
		'SI':{
			'name':'Slovenia',
			'length':19,
			'official':true,
			'check':56,
			'elements':[
				{
					'init':4,
					'length':2,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':6,
					'length':3,
					'name':'Branch code',
					'type':'n',
				},
				{
					'init':9,
					'length':7,
					'name':'Account number',
					'type':'n',
				},
				{
					'init':17,
					'length':2,
					'name':'National check digits',
					'type':'n',
				},
			],
		},
		'SO':{
			'name':'Somalia',
			'length':23,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':4,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':8,
					'length':3,
					'name':'Branch code',
					'type':'n',
				},
				{
					'init':11,
					'length':12,
					'name':'Account number',
					'type':'n',
				},
			],
		},
		'ES':{
			'name':'Spain',
			'length':24,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':4,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':8,
					'length':4,
					'name':'Branch code',
					'type':'n',
				},
				{
					'init':12,
					'length':2,
					'name':'National check digits',
					'type':'n',
				},
				{
					'init':14,
					'length':10,
					'name':'Account number',
					'type':'n',
				},
			],
		},
		'OM':{
			'name':'Oman',
			'length':23,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':3,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':7,
					'length':16,
					'name':'Account number',
					'type':'c',
				},
			],
		},
		'SD':{
			'name':'Sudan',
			'length':18,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':2,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':6,
					'length':12,
					'name':'Account number',
					'type':'n',
				},
			],
		},
		'SE':{
			'name':'Sweden',
			'length':24,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':3,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':7,
					'length':16,
					'name':'Account number',
					'type':'n',
				},
				{
					'init':23,
					'length':1,
					'name':'Check digit',
					'type':'n',
				},
			],
		},
		'CH':{
			'name':'Switzerland',
			'length':21,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':5,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':9,
					'length':12,
					'name':'Code identifying a bank account',
					'type':'c',
				},
			],
		},
		'TN':{
			'name':'Tunisia',
			'length':24,
			'official':true,
			'check':59,
			'elements':[
				{
					'init':4,
					'length':2,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':6,
					'length':3,
					'name':'Branch code',
					'type':'n',
				},
				{
					'init':9,
					'length':11,
					'name':'Account number',
					'type':'n',
				},
				{
					'init':22,
					'length':2,
					'name':'National check digits',
					'type':'n',
				},
			],
		},
		'TR':{
			'name':'Türkiye (Turkey)',
			'length':26,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':5,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':9,
					'length':1,
					'name':null,
					'type':'0',
				},
				{
					'init':10,
					'length':16,
					'name':'Account number',
					'type':'c',
				},
			],
		},
		'UA':{
			'name':'Ukraine',
			'length':29,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':6,
					'name':'Bank code',
					'type':'n',
				},
				{
					'init':10,
					'length':19,
					'name':'Account number',
					'type':'c',
				},
			],
		},
		'AE':{
			'name':'United Arab Emirates',
			'length':23,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':3,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':7,
					'length':16,
					'name':'Account number',
					'type':'n',
				},
			],
		},
		'GB':{
			'name':'United Kingdom',
			'length':22,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':4,
					'name':'BIC bank code',
					'type':'a',
				},
				{
					'init':8,
					'length':6,
					'name':'Bank and branch code (sort code)',
					'type':'n',
				},
				{
					'init':10,
					'length':8,
					'name':'Account number',
					'type':'n',
				},
			],
		},
		'VA':{
			'name':'Vatican City',
			'length':22,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':3,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':7,
					'length':15,
					'name':'Account number',
					'type':'n',
				},
			],
		},
		'VG':{
			'name':'British Virgin Islands',
			'length':24,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':4,
					'name':'National bank code',
					'type':'a',
				},
				{
					'init':8,
					'length':16,
					'name':'Account number',
					'type':'n',
				},
			],
		},
		'DZ':{
			'name':'Algeria',
			'length':26,
			'official':false,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':22,
					'name':null,
					'type':'n',
				},
			],
		},
		'AO':{
			'name':'Angola',
			'length':25,
			'official':false,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':21,
					'name':null,
					'type':'n',
				},
			],
		},
		'BJ':{
			'name':'Benin',
			'length':28,
			'official':false,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':2,
					'name':null,
					'type':'c',
				},
				{
					'init':6,
					'length':22,
					'name':null,
					'type':'n',
				},
			],
		},
		'BF':{
			'name':'Burkina Faso',
			'official':false,
			'copy':'BJ',
		},
		'BI':{
			'name':'Burundi',
			'length':27,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':5,
					'name':'National bank code',
					'type':'n',
				},
				{
					'init':9,
					'length':5,
					'name':'Branch identifier',
					'type':'n',
				},
				{
					'init':13,
					'length':13,
					'name':'Account number',
					'type':'n',
				},
			],
		},
		'CV':{
			'name':'Cabo Verde',
			'official':false,
			'copy':'AO',
		},
		'CM':{
			'name':'Cameroon',
			'official':false,
			'copy':'BI',
		},
		'CF':{
			'name':'Central African Republic',
			'official':false,
			'copy':'BI',
		},
		'TD':{
			'name':'Chad',
			'official':false,
			'copy':'BI',
		},
		'KM':{
			'name':'Comoros',
			'official':false,
			'copy':'BI',
		},
		'CG':{
			'name':'Republic of the Congo',
			'official':false,
			'copy':'BI',
		},
		'CI':{
			'name':'Côte d’Ivoire',
			'length':28,
			'official':false,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':2,
					'name':null,
					'type':'a',
				},
				{
					'init':6,
					'length':22,
					'name':null,
					'type':'n',
				}
			],
		},
		'DJ':{
			'name':'Djibouti',
			'official':true,
			'copy':'BI',
		},
		'GQ':{
			'name':'Equatorial Guinea',
			'official':false,
			'copy':'BI',
		},
		'GA':{
			'name':'Gabon',
			'official':false,
			'copy':'BI',
		},
		'GW':{
			'name':'Guinea-Bissau',
			'length':25,
			'official':false,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':2,
					'name':null,
					'type':'c',
				},
				{
					'init':6,
					'length':19,
					'name':null,
					'type':'n',
				},
			],
		},
		'HN':{
			'name':'Honduras',
			'length':28,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':4,
					'name':null,
					'type':'a',
				},
				{
					'init':8,
					'length':20,
					'name':null,
					'type':'n',
				},
			],
		},
		'IR':{
			'name':'Iran',
			'official':false,
			'copy':'DZ',
		},
		'MG':{
			'name':'Madagascar',
			'official':false,
			'copy':'BI',
		},
		'ML':{
			'name':'Mali',
			'official':false,
			'copy':'BJ',
		},
		'MA':{
			'name':'Morocco',
			'length':28,
			'official':false,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':24,
					'name':null,
					'type':'n',
				},
			],
		},
		'MZ':{
			'name':'Mozambique',
			'official':false,
			'copy':'AO',
		},
		'NI':{
			'name':'Nicaragua',
			'length':28,
			'official':true,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':4,
					'name':'National bank code',
					'type':'a',
				},
				{
					'init':8,
					'length':20,
					'name':'Account number',
					'type':'n',
				},
			],
		},
		'NE':{
			'name':'Niger',
			'length':28,
			'official':false,
			'check':true,
			'elements':[
				{
					'init':4,
					'length':2,
					'name':null,
					'type':'a',
				},
				{
					'init':6,
					'length':22,
					'name':null,
					'type':'n',
				},
			],
		},
		'SN':{
			'name':'Senegal',
			'official':false,
			'copy':'NE',
		},
		'TG':{
			'name':'Togo',
			'official':false,
			'copy':'NE',
		},
	};

	var country = iban.substring(0, 2);
	var rules = countries[country];
	if (rules === undefined) {
		return [false, country, 'Unknown Country', 'We are unaware of IBANs beginning ' + country];
	}
	if (rules.copy !== undefined) {
		var r = countries[rules.copy];
		r.name = rules.name;
		r.official = rules.official;
		rules = r;
	}
	if (iban.length < rules.length) {
		return [null, country, rules.name, 'IBAN Incomplete'];
	}
	if (iban.length > rules.length) {
		return [false, country, rules.name, country + ' IBAN Too Long'];
	}

	var check = iban.substring(2, 4);
	var bban = iban.substring(4);

	// Check that the check digits are actual digits.
	if (! /^[0-9]+$/.test(check)) {
		return [false, country, rules.name, 'Check digits invalid'];
	}

	// If this country uses hardcoded check digits instead of real ones, check them.
	if (Number.isInteger(rules.check)) {
		if (check != rules.check) {
			return [false, country, rules.name, 'Check digits invalid'];
		}
	}

	// Begin constructing the returned elements.
	// First, the human-readable form of the IBAN with spaces.
	switch (country) {
	case 'BI':
		var parts = [
			iban.substr(0, 4),
			iban.substr(4, 5),
			iban.substr(9, 5),
			iban.substr(14, 11),
			iban.substr(25, 2),
		];
		var print = parts.join(' ');
		break;
	case 'EG':
		var print = iban;
		break;
	case 'LY':
		var parts = [
			iban.substr(0, 4),
			iban.substr(4, 3),
			iban.substr(7, 3),
			iban.substr(10, 15),
		];
		var print = parts.join(' ');
		break;
	case 'SV':
		var parts = [
			iban.substr(0, 2),
			iban.substr(2, 2),
			iban.substr(4, 4),
			iban.substr(8, 20),
		];
		var print = parts.join(' ');
		break;
	default:
		var parts = iban.match(/.{1,4}/g); // simply split every four characters
		var print = parts.join(' ');
		break;
	}

	var ibanElements = [
		{
			'label':'Machine-readable IBAN',
			'value':iban,
			'type':'iban',
		},
		{
			'label':'Human-readable IBAN',
			'value':print,
			'type':'iban',
		},
		{
			'label':'BBAN',
			'value':bban,
			'type':'iban',
		},
		{
			'label':'Country Code',
			'value':country,
			'type':'country',
		},
		{
			'label':'Country',
			'value':rules.name,
			'type':'country',
		},
	];
	if (!rules.official) {
		var ibanElement = {
			'label':'Note',
			'value':rules.name + ' makes unofficial use of the IBAN standard',
			'type':'country',
		};
		ibanElements.push(ibanElement);
	}

	// Check the country's BBAN pattern.
	var pass = rules.elements.every(function(elm) {
		var stop = elm.init + elm.length;
		var text = iban.substring(elm.init, stop);
		// In cases where the BBAN structure is unknown, the entire BBAN is output
		// as an unnamed element. In that case, output it with the appropriate label.
		var ibanElement = {
			'label':elm.name ?? (text === bban ? 'BBAN' : 'Unnamed element'),
			'value':text,
			'type':'element',
		};
		ibanElements.push(ibanElement);

		switch (elm.type) {
			case 'n':
				// number
				return /^[0-9]+$/.test(text);
			case 'c':
				// character
				return /^[A-Z0-9]+$/.test(text);
			case 'a':
				// alphabet
				return /^[A-Z]+$/.test(text);
			case '0':
				// zero
				return /^[0]+$/.test(text);
			default:
				return false;
		}
	});
	if (!pass) {
		return [false, country, rules.name, 'BBAN structure invalid for ' + rules.name + ' IBAN'];
	}

	// Check the BBAN check digits. These may or may not be explicitly marked as
	// check digits. For example, Croatia's BBAN does not contain any check digit
	// fields, but the bank code and account number both must conform to certain
	// rules.
	if (rules.checks !== undefined) {
		// TODO: There are far more checks to add here.
		var bcheck = rules.checks.every(function(check) {
			if (typeof check === 'function') {
				return check(bban);
			} else {
				return true;
			}
		});
		if (!bcheck) {
			return [false, country, rules.name, rules.name + ' BBAN check digits invalid'];
		}
	}

	// Fourth, check the IBAN check digits. This is inspired by (stolen from) iban.js.
	// https://github.com/arhs/iban.js (MIT license).
	if (rules.check === true) {
		var swap = iban.substr(4) + iban.substr(0,4);
		var A = 'A'.charCodeAt(0), Z = 'Z'.charCodeAt(0);

		var digits = swap.split('').map(function(n) {
			var code = n.charCodeAt(0);
			if (code >= A && code <= Z){
				// A = 10, B = 11, ... Z = 35
				return code - A + 10;
			} else {
				return n;
			}
		}).join('');

		var remainder = digits;
		var block;

		while (remainder.length > 2) {
			block = remainder.slice(0, 9);
			remainder = parseInt(block, 10) % 97 + remainder.slice(block.length);
		}

		var ij = parseInt(remainder, 10) % 97;

		if (ij !== 1) {
			return [false, country, rules.name, 'Check digits invalid', ibanElements];
		}
	}

	return [true, country, rules.name, 'Valid IBAN', ibanElements];
}

