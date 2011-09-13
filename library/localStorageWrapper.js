function localStorageWrapper (key, type) {
	this.key = key;
	this.type = type || "string";
}
localStorageWrapper.prototype.get = function () {
	if (localStorage[this.key] === "undefined") {
		this.del();
		return;
	}
	if (!localStorage[this.key]) {
		return;
	}
	return (this.type === "obj" ? JSON.parse(localStorage[this.key]) : localStorage[this.key]);
}
localStorageWrapper.prototype.set = function (value) {
	localStorage[this.key] = this.type === "obj" ? JSON.stringify(value) : value;
},
localStorageWrapper.prototype.del = function () {
	delete localStorage[this.key];
}