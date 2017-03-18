function Child(text) {
	this.text = text;

	return {
		getText: function () {
			return this.text;
		}.bind(this),

		getNumChildren: function () {
			return 0;
		},

		getChild: function () {
			return {};
		},

		getType: function () {
			return this.text;  // just return the basic, if it's a horizontal rule it'll be <hr>
		}
	};
}

function Paragraph(paragraph) {
	this._paragraph = paragraph;
	this._heading = '';

	return {
		paragraph: this._paragraph,

		text: function () {
			return this._paragraph;
		}.bind(this),
		
		setHeading: function (heading) {
			this._heading = heading;
			return this;
		}.bind(this),
	}
}

function Body() {
	this._body = [];

	return {
		body: this._body,

		getText: function () {
			var arr = [];
			this._body.forEach(function (item) {
				arr.push(item.text());
			});
			return arr.join('');
		}.bind(this),

		insertParagraph: function (childIndex, paragraphOrText) {
			this._body.splice(childIndex, 0, new Paragraph(paragraphOrText));
			return this._body[childIndex];
		}.bind(this),

		insertHorizontalRule: function (childIndex) {
			return this.insertParagraph(childIndex, '<hr>');
		}/* no bind(this) */,

		getNumChildren: function () {
			return this._body.length;
		}.bind(this),

		/*
			Return an object that acts as an element
		*/
		getChild: function (childIndex) {
			return Child(this._body[childIndex].paragraph);
		}.bind(this),
	}
}

function Document() {
	this.documentBody = new Body();

	return {
		body: this.documentBody,

		getBody: function () {
			return this.documentBody;
		}.bind(this),
	}
}

module.exports = Document;