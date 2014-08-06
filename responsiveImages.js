var responsiveImages = (function(w,d,c,$,undef){
	// variable/state declarations: 
	var state, settings = { delay: 75 }; 
	state = { 
		currWidth: 0, 
		delayTimer: false, 
		elems: [ ], 
		imageSizes: [ ], 
		cachedSizes: [ ]
	}; 
	// function declarations: 
	var init, domCollection, getSize, swapImages, getAttr, hasAttr, delay;
	init = function() { 
		domCollection(); 
		getSize(); 
		window.onresize = function() { 
			delay(settings.delay,getSize);
 		}; 
	};  
	getSize = function() { 
		var oldWidth; 
		oldWidth = state.currWidth; 
		state.currWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
		if(!oldWidth || oldWidth != state.currWidth) { 
			// trigger resize functionality
			swapImages(); 
		}
	}; 
	domCollection = function() { 
		// function comments
		state.elems = $('.responsive-bg').toArray(); 
		for(var i=0; i < state.elems.length; ++i) { 
			var sizes, 
			sizes = getAttr(state.elems[i],'data-imagesizes'); 
			if(sizes) { 
				sizes = sizes.split(','); 
				sizes = _.map(sizes,function(str){
					str = str.replace(/^\s+|\s+$/g,''); 
					str = str.split(' '); 
					str = _.map(str,function(str){
						return str.replace(/^\s+|\s+$/g,''); 
					}); 
					if(str.length == 2 && !isNaN(str[1])) { 
						str = { size: parseInt(str[1]), src: str[0] }; 
					} else { 
						str = false; 
					}
					return str; 
				}); 
				sizes = _.filter(sizes,function(obj){ return obj; });
				sizes = _.sortBy(sizes,function(obj){ return obj.size; }); 
			} 
			state.imageSizes.push(sizes); 
		}
	};  
	swapImages = function() { 
		for(var i=0; i < state.elems.length; ++i) { 
			if(!state.imageSizes[i]) continue;  
			var url = "url(" + state.imageSizes[i][0].src + ")"; 
			if(state.imageSizes[i][0].size < state.currWidth) { 
				for(var j = state.imageSizes[i].length-1; j >= 0; --j) { 
					if(state.currWidth > state.imageSizes[i][j].size) { 
						url = "url(" + state.imageSizes[i][j].src + ")"; 
						break; 
					}
				}
			}
			if(state.elems[i].style.backgroundImage != url) { 
				state.elems[i].style.backgroundImage = url; 
			} 
		}
	};  
	getAttr = function(elem,attrName) { 
		if(hasAttr(elem,attrName)) { 
			return elem.getAttribute(attrName); 
		} 
		return false; 
	}; 
	hasAttr = function(elem,attrName) { 
		return elem.hasAttribute ? elem.hasAttribute(attrName) : elem[attrName] !== undef; 
	}; 
	delay = function(ms,cb) {
		window.clearTimeout(state.delayTimer); 
		state.delayTimer = window.setTimeout(cb,ms); 
	}; 
	// GO:  
	$(d).ready(init); 
})(window,document,console,jQuery); 