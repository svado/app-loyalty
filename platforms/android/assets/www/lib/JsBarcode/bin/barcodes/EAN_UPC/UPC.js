"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _ean_encoder = require("./ean_encoder.js");

var _ean_encoder2 = _interopRequireDefault(_ean_encoder);

var _Barcode2 = require("../Barcode.js");

var _Barcode3 = _interopRequireDefault(_Barcode2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } // Encoding documentation:
// https://en.wikipedia.org/wiki/Universal_Product_Code#Encoding

var UPC = function (_Barcode) {
	_inherits(UPC, _Barcode);

	function UPC(data, options) {
		_classCallCheck(this, UPC);

		// Add checksum if it does not exist
		if (data.search(/^[0-9]{11}$/) !== -1) {
			data += checksum(data);
		}

		var _this = _possibleConstructorReturn(this, _Barcode.call(this, data, options));

		_this.displayValue = options.displayValue;

		// Make sure the font is not bigger than the space between the guard bars
		if (options.fontSize > options.width * 10) {
			_this.fontSize = options.width * 10;
		} else {
			_this.fontSize = options.fontSize;
		}

		// Make the guard bars go down half the way of the text
		_this.guardHeight = options.height + _this.fontSize / 2 + options.textMargin;
		return _this;
	}

	UPC.prototype.valid = function valid() {
		return this.data.search(/^[0-9]{12}$/) !== -1 && this.data[11] == checksum(this.data);
	};

	UPC.prototype.encode = function encode() {
		if (this.options.flat) {
			return this.flatEncoding();
		} else {
			return this.guardedEncoding();
		}
	};

	UPC.prototype.flatEncoding = function flatEncoding() {
		var encoder = new _ean_encoder2.default();
		var result = "";

		result += "101";
		result += encoder.encode(this.data.substr(0, 6), "LLLLLL");
		result += "01010";
		result += encoder.encode(this.data.substr(6, 6), "RRRRRR");
		result += "101";

		return {
			data: result,
			text: this.text
		};
	};

	UPC.prototype.guardedEncoding = function guardedEncoding() {
		var encoder = new _ean_encoder2.default();
		var result = [];

		// Add the first digigt
		if (this.displayValue) {
			result.push({
				data: "00000000",
				text: this.text.substr(0, 1),
				options: { textAlign: "left", fontSize: this.fontSize }
			});
		}

		// Add the guard bars
		result.push({
			data: "101" + encoder.encode(this.data[0], "L"),
			options: { height: this.guardHeight }
		});

		// Add the left side
		result.push({
			data: encoder.encode(this.data.substr(1, 5), "LLLLL"),
			text: this.text.substr(1, 5),
			options: { fontSize: this.fontSize }
		});

		// Add the middle bits
		result.push({
			data: "01010",
			options: { height: this.guardHeight }
		});

		// Add the right side
		result.push({
			data: encoder.encode(this.data.substr(6, 5), "RRRRR"),
			text: this.text.substr(6, 5),
			options: { fontSize: this.fontSize }
		});

		// Add the end bits
		result.push({
			data: encoder.encode(this.data[11], "R") + "101",
			options: { height: this.guardHeight }
		});

		// Add the last digit
		if (this.displayValue) {
			result.push({
				data: "00000000",
				text: this.text.substr(11, 1),
				options: { textAlign: "right", fontSize: this.fontSize }
			});
		}

		return result;
	};

	return UPC;
}(_Barcode3.default);

// Calulate the checksum digit
// https://en.wikipedia.org/wiki/International_Article_Number_(EAN)#Calculation_of_checksum_digit


function checksum(number) {
	var result = 0;

	var i;
	for (i = 1; i < 11; i += 2) {
		result += parseInt(number[i]);
	}
	for (i = 0; i < 11; i += 2) {
		result += parseInt(number[i]) * 3;
	}

	return (10 - result % 10) % 10;
}

exports.default = UPC;