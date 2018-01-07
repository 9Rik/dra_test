define(["d3pure"], function (d3)
{
	function last(){ return this[this.length - 1];}
	function apply(func, struct){
		for (key in struct){
			this[func](key, struct[key]);
		}
		return this;
	}
	function applyAll(struct){
		for (func in struct){
			this.apply(func, struct[func])
		}
		return this;
	}
	function get(func, array){
		var obj = {};
		for (var i = 0; i < array.length; i++){
			obj[array[i]] = this[func](array[i])
		}
		return obj;
	}
	function getAll(struct){
		var obj = {};
		for (func in struct){
			obj[func] = this.get(func, struct[func])
		}
		return obj;
	}
	var d3SelectAll = d3.selection.prototype.selectAll;
	function selectAll(selector){
		var selection = d3SelectAll.call(this, selector);
		selection.selector = selector;
		return selection;
	}
	var d3Classed = d3.selection.prototype.classed;
	function classed(className, flag){
		var selection = this;
		var isArray = className instanceof Array;
		if (!isArray)
			className = [className];
		className.forEach(function(item){
			d3Classed.call(selection, item, flag);
		});
	}
	function join(data, struct){
		var selection = this;
		var splitExp = new RegExp('\.\[A-z0-9_-]+', 'g');
		var elemExp = new RegExp('^[A-z0-9_-]+', 'g');
		var words = selection.selector.match(splitExp);
		var elem, id, classes = [];
		words.forEach(function(word){
			if (elemExp.test(word))
				elem = word;
			else {
				var firstPart = word.substr(0, 1);
				var lastPart = word.substr(1, word.length - 1);
				if (firstPart == "#") id = lastPart;
				else if (firstPart == ".") classes.push(lastPart);
			}
		});
		var update = selection.data(data);
		update.exit().remove();
		var newNodes = update.enter().append(elem);
		if (id) newNodes.attr("id", id);
		newNodes.classed(classes, true);
		var allNodes = newNodes.merge(selection);
		allNodes.entered = entered;
		allNodes.merged = merged;
		newNodes.entered = entered;
		newNodes.merged = merged;
		if (struct){
			newNodes.applyAll(struct.enter);
			allNodes.applyAll(struct.merge);
		}
		function entered(){return newNodes}
		function merged(){return allNodes}
		return allNodes;
	}
	function hash() {
		var str = this.toString();
		var hash = 0, i, chr;
		if (str.length === 0) return hash;
		for (i = 0; i < str.length; i++) {
			chr   = str.charCodeAt(i);
			hash  = ((hash << 5) - hash) + chr;
			hash |= 0;
		}
		return hash;
	};
	var d3Transition = d3.selection.prototype.transition;
	function transition(name){
		var t = d3Transition.call(this, name);
		if (this.entered){
			t.entered = this.entered;
		}
		if (this.merged){
			t.merged = this.merged;
		}
		return t;
	}
	var d3Sort = d3.selection.prototype.sort;
	function sort(compare){
		var t = d3Sort.call(this, compare);
		if (this.entered){
			t.entered = this.entered;
		}
		if (this.merged){
			t.merged = this.merged;
		}
		return t;
	}
	String.prototype.hash = hash;
	Array.prototype.last = last;
	d3.selection.prototype.apply = apply;
	d3.selection.prototype.applyAll = applyAll;
	d3.selection.prototype.get = get;
	d3.selection.prototype.getAll = getAll;
	d3.selection.prototype.selectAll = selectAll;
	d3.selection.prototype.classed = classed;
	d3.selection.prototype.sort = sort;
	d3.selection.prototype.join = join;
	d3.selection.prototype.transition = transition;
	d3.transition.prototype.apply = apply;
	d3.transition.prototype.datum = d3.selection.prototype.datum;
	d3.transition.prototype.applyAll = applyAll;
	return d3;
});