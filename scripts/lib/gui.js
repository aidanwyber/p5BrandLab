
class GUIForP5 {
	static verbose = !false;

	callbackList = [];

	constructor(isGuiDivHardcodedInHTML=false) {
		if (GUIForP5.verbose) print('Creating GUI...');

		this.loadLightDarkMode();

		if (isGuiDivHardcodedInHTML) {
			this.div = document.getElementById('gui');
		} else {
			this.div = createDiv();
			this.div.id('gui');
		}

		this.fields = [];
		this.controllers = [];

		this.isTypingText = false;
		this.isOnLeftSide = undefined;

		this.mainElt = document.querySelector('main');
		this.setLeft();


		// this.runCallbackList();
		for (let cb of this.callbackList) cb();

		// let settings = this.getSettingsObj();
		// this.saveSettingsInLocalStorage(settings); //JSON!


		if (GUIForP5.verbose) print('Created GUI.');
	}


	initControllers() {
		for (let controller of this.controllers) {
			controller.init();
		}
	}


	setLeft(mainElt) {
		this.mainElt.prepend(this.div.elt);
		this.isOnLeftSide = true;
	}
	setRight(mainElt) {
		this.mainElt.append(this.div.elt);
		this.isOnLeftSide = false;
	}
	toggleSide() {
		this.isOnLeftSide ? this.setRight() : this.setLeft();
	}


	loadLightDarkMode() {
		const setting = window.localStorage['isDarkMode'];
		switch (setting) {
		case 'true':
			this.setDarkMode();
			break;
		case 'false':
			this.setLightMode();
			break;
		default:
			this.setAutoLightDarkMode();
		}
	}
	setLightMode() {
		document.body.className = '';
		window.localStorage['isDarkMode'] = 'false';
	}
	setDarkMode() {
		document.body.className = 'dark-mode';
		window.localStorage['isDarkMode'] = 'true';
	}
	setAutoLightDarkMode() {
		const isSystemDarkMode = () => window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
		if (isSystemDarkMode()) {
			this.setDarkMode();
		} else {
			this.setLightMode();
		}
		window.localStorage['isDarkMode'] = 'auto';
	}


	addField(field) {
		this.fields.push(field);
		return field;
	}

	addHTMLToNewField(html, className='') {
		let field = this.addField(new Field(this.div, '', className));
		field.div.html(html);
		return field;
	}

	addP5BrandLabLogo() {
		let logo = this.addHTMLToNewField(
			`powered by <a href="https://github.com/aidanwyber/p5BrandLab" target="_blank">` + 
				`<div class="p5brandlab-logo footer-logo"></div>` + 
			`</a>`,
			'powered-by-logo'
		);
		return logo;
	}

	addDivider() {
		let divider = new Divider(this.div);
		this.addField(divider);
		return divider;
	}

	addController(controller) {
		this.addField(controller);
		this.controllers.push(controller);
		return controller;
	}

	addLabel(labelText) {
		let label = new Label(this.div, labelText);
		this.addField(label);
		return label;
	}

	addTitle(hSize, titleText, doAlignCenter=false) {
		let title = new Title(this.div, hSize, titleText, doAlignCenter=doAlignCenter);
		this.addField(title);
		return title;
	}

	addImage(url, altText, doAlignCenter=true) {
		let img = new GUIImage(this.div, url, altText, doAlignCenter=doAlignCenter);
		this.addField(img);
		return img;
	}


	getController(name) {
		return this.controllers.filter(controller =>
			controller.name == name
		)[0];
	}
	getControllers(names) {
		return this.controllers.filter(controller =>
			names.some(name => 
				controller.name == name
				// controller.name.match(name) != null
			)
		);
	}

	// getControllerByLabel(label) {
	// 	return this.controllers.filter(controller =>
	// 		controller.name.match(label) != null
	// 	)[0];
	// }
	// getControllersByLabels(labels) {
	// 	return this.controllers.filter(controller =>
	// 		labels.some(label => 
	// 			controller.name.match(label) != null
	// 		)
	// 	);
	// }


	// getFieldByContent(str) {
	// 	return this.fields.filter(field =>
	// 		field.div.html().match(str) != null
	// 	)[0];
	// }
	// getFieldsByContents(strs) {
	// 	return this.fields.filter(field =>
	// 		strs.some(str => 
	// 			field.div.html().match(str) != null
	// 		)
	// 	);
	// }
}




class Field {
	constructor(parentDiv, id, className) {
		this.div = createDiv();
		this.div.parent(parentDiv);
		if (id !== undefined && id !== null && id != '')
			this.div.id(id);
		this.div.class(className);
	}

	setTooltip(tooltip) {
		this.div.elt.title = tooltip;
	}

	hide() {
		this.div.hide();
	}

	show() {
		// this.div.show();
		this.div.elt.style.display = null;
	}
}


class Label extends Field {
	constructor(controller, text) {
		super(controller.div, null, 'gui-label');
		this.controller = controller;
		text = lang.process(text, true);
		this.setText(text);
	}

	setText(text) {
		this.text = text;
		this.div.elt.innerText = text;
	}
}


class Title extends Field {
	constructor(parentDiv, hSize, text, doAlignCenter=false) {
		super(parentDiv, null, 'gui-title');
		text = lang.process(text, true);
		this.div.html(`<h${hSize}>${text}</h${hSize}>`);
		if (doAlignCenter) {
			this.div.style('text-align', 'center');
		}
	} 
}


class Textfield extends Field {
	constructor(parentDiv, text, className=undefined, doAlignCenter=false) {
		super(parentDiv, null, 'gui-textfield');
		text = lang.process(text, true);
		this.div.html(`<span>${text}</span>`);
		if (className) {
			this.div.addClass(className);
		}
		if (doAlignCenter) {
			this.div.style('text-align', 'center');
		}
	} 
}


class GUIImage extends Field {
	constructor(parentDiv, url, altText, doAlignCenter=true) {
		super(parentDiv, null, 'gui-image');
		altText = lang.process(altText, true);
		this.div.html(`<img src='${url}' alt='${altText}'>`);
		if (doAlignCenter) {
			this.div.style('text-align', 'center');
		}
	}
}


class Divider extends Field {
	constructor(parentDiv) {
		super(parentDiv, null, 'gui-divider');
		this.div.html('<hr>');
	}
}


class Controller extends Field {
	static counter = 0;

	constructor(gui, name, labelStr, initCallback=undefined) {
		super(gui.div, name, 'gui-controller');
		this.gui = gui;
		this.name = name;
		if (labelStr !== undefined) {
			labelStr = lang.process(labelStr, true);
			this.label = new Label(this, labelStr);
		}

		this.controllerElement = null;

		setTimeout(() => {
			// execute after any subclass constructor
			this.init();
		}, 10); 

		this.initCallback = initCallback || ((controller) => {
			if (!GUIForP5.verbose) return;
			print('Empty init() of ' + this.name);
		});
	}

	createConsole() {
		this.console = createDiv();
		this.console.parent(this.div);
		this.console.class('gui-console');
		this.console.hide();
	}

	init() {
		this.createConsole();
		this.initCallback(this);
	}

	disable() {
		if (this.controllerElement instanceof p5.Element)
			this.controllerElement.elt.disabled = true;
		else
			this.controllerElement.disabled = true;
	}

	enable() {
		if (this.controllerElement instanceof p5.Element)
			this.controllerElement.elt.disabled = null;
		else
			this.controllerElement.disabled = null;
	}

	isDisabled() {
		if (this.controllerElement instanceof p5.Element)
			return this.controllerElement.elt.disabled;
		else
			return this.controllerElement.disabled;
	}

	setDisabled(doSetDisabled) {
		doSetDisabled ? this.disable() : this.enable();
	}


	setConsole(text, type) {
		if (text === undefined) {
			this.consoleText = undefined;
			this.console.hide();
			this.console.html('');
			this.console.class('gui-console');
			return;
		}

		if (type === undefined)
			text = '🔺 ' + text; 
		
		this.consoleText = text;
		this.console.class('gui-console');
		this.console.addClass('gui-console-' + type);
		this.console.html(text);
		this.console.show();
	}

	setError(text) {
		this.setConsole('❌ ' + text, 'error');
	}
	setWarning(text) {
		this.setConsole('⚠️ ' + text, 'warning');
	}
}


class ValuedController extends Controller {
	constructor(gui, name, labelStr, initCallback=undefined) {
		super(gui, name, labelStr, initCallback);
		// this.loadFromLocalStorage();
	}

	setValue(v) {
		this.value = v;
		// this.setLocalStorage();
	}

	randomize() {
		console.error('No randomize() method.');
	}

	// loadFromLocalStorage() {
	// 	// const setting = window.localStorage[this.name];
	// 	if (setting !== undefined) {
	// 		this.setValue(setting);
	// 	}
	// }
	// setLocalStorage() {
		// window.localStorage[this.name] = this.value;
	// }
}


class Button extends Controller {
	constructor(gui, name, labelStr, callback, initCallback=undefined) {
		super(gui, name, undefined, initCallback);
		labelStr = lang.process(labelStr, true);
		this.controllerElement = createButton(labelStr);
		this.controllerElement.parent(this.div);
		this.controllerElement.elt.onmousedown = () => callback(this);
	}

	click() {
		this.controllerElement.elt.onmousedown();
	}
}


class ImageLoader extends Button {
	constructor(gui, labelStr, valueCallback, initCallback=undefined) {
		super(gui, 'imageLoader', labelStr, () => {
				this.controllerElement.elt.click();
			},
			initCallback
		);

		this.callback = (value) => {
			valueCallback(this, value);
		};
		
		this.controllerElement = createFileInput((file) => {
			if (file.type === 'image') {
				this.fileName = file.file.name;
			  this.img = createImg(file.data, '');
			  this.img.hide();
			  this.callback(this.img);
			} else {
			  this.img = null;
			}
		});
		this.controllerElement.parent(this.div);
		this.controllerElement.hide();
	}
}


class Toggle extends ValuedController {
	constructor(gui, name, labelStr0, labelStr1, isToggled, callback, initCallback=undefined) {
		super(gui, name, undefined, initCallback);
		this.controllerElement = createButton('');
		this.controllerElement.parent(this.div);
		this.controllerElement.class('toggle');
		this.controllerElement.elt.onmousedown = () => callback(this);

		labelStr0 = lang.process(labelStr0, true);
		labelStr1 = lang.process(labelStr1, true);
		let span0 = createSpan(labelStr0);
		let span1 = createSpan(labelStr1);
		span0.parent(this.controllerElement);
		span1.parent(this.controllerElement);
		// this.controllerElement.elt.appendChild(span0.elt);
		// this.controllerElement.elt.appendChild(span1.elt);

		this.isToggled = isToggled ? true : false;

		this.controllerElement.elt.onmousedown = () => {
			// this.isToggled = !this.isToggled;
			// this.controllerElement.elt.toggleAttribute('toggled');
			// callback(this, this.isToggled);
			this.setValue(!this.isToggled);
		};
		this.callback = callback;
	}

	click() {
		this.controllerElement.elt.onmousedown();
	}

	setValue(value) {
		if (value != this.isToggled)
			this.controllerElement.elt.toggleAttribute('toggled');
		this.isToggled = value;
		this.callback(this, this.isToggled);
	}

	randomize() {
		this.setValue(random(1) < 0.5);
	}
}


class Select extends ValuedController {
	// gui.addController(new Select(
  //   gui, 'Keuze',
  //   OPTIONS, 0,
  //   (controller, value) => {
  //   }
  // ));
	constructor(gui, name, labelStr, options, defaultIndex, valueCallback, initCallback=undefined) {
		super(gui, name, labelStr, initCallback);
		
		this.controllerElement = createSelect(); // (add true for multiple selections)
		this.setOptions(options);

		const callback = (event) => {
			const value = event.srcElement.value;
			this.value = value;
			valueCallback(this, value);
		};
		this.controllerElement.elt.onchange = callback;
		this.valueCallback = valueCallback;
		this.setValue(options[defaultIndex]);
	}

	setOptions(options) {
		this.controllerElement.elt.replaceChildren();
		this.controllerElement.parent(this.div);
		options = options.map(option => this.optionToString(option));
		for (const option of options) 
			this.controllerElement.option(option);
		this.options = options;
		this.afterSetOptions();
	}

	optionToString(optionString) {
		return optionString;
	}

	afterSetOptions() {}

	setValue(v) {
		this.value = v;
		this.controllerElement.selected(v);
		this.valueCallback(this, v);
		// this.setLocalStorage();
	}

	randomize() {
		let r = this.options[floor(random(this.options.length))];
		this.setValue(r);
	}
}


class ColourSelect extends Select {
  // gui.addController(new ColourSelect(
  //   gui, 'Achtergrondkleur',
  //   generator.cols, 0,
  //   (controller, value) => {
  //     let ind = generator.cols.indexOf(value);
  //     generator.bgInd = ind;
  //     generator.setCols();
  //   }
  // ));
	constructor(gui, name, labelStr, colours, defaultIndex, valueCallback, initCallback=undefined) {
		super(gui, name, labelStr, colours, defaultIndex, valueCallback);
		this.controllerElement.elt.classList.add('colour-select');

		this.controllerElement.elt.onclick = (event) => {
	    const sel = this.controllerElement.elt;
	    sel.style.backgroundColor = sel.value;
	    sel.style.color = lum(color(sel.value)) < 0.5 ? 'white' : null;
		};

		this.setDisplayColours();
	}

	optionToString(colour) {
		return colorToHexString(colour).toUpperCase();
	}

	afterSetOptions() {
		this.setDisplayColours();
	}

	setDisplayColours() {
		if (this.controllerElement.elt.onclick)
			this.controllerElement.elt.onclick();

		for (let option of this.controllerElement.elt.children) {
			let colStr = option.value;
			option.style.backgroundColor = colStr;
			option.style.color = lum(color(colStr)) < 0.5 ? 'white' : 'black';
		}
	}

	setValue(v) {
		this.value = v;
		this.controllerElement.selected(v);
		this.valueCallback(this, v);
		this.setDisplayColours();
		// this.setLocalStorage();
	}
}


class ResolutionSelect extends Select { // uses const resolutionOptions (bottom)
  // gui.addController(new ResolutionSelect(
  //   gui, 'Resolutie', 0, (controller, value) => {}
  // ));
	constructor(gui, labelStr, defaultIndex, valueCallback, initCallback=undefined) {
		super(gui, 'resolutionSelect', labelStr, resolutionOptions, defaultIndex, 
			(controller, value) => {
	      if (value.indexOf(' x ') >= 0) {
		      const resStr = value.split(': ')[1];
		      const wh = resStr.split(' x ');
		      const w = parseInt(wh[0]);
		      const h = parseInt(wh[1]);
		      resize(w, h);
	      }
	      valueCallback(controller, value);
			},
			initCallback
		);
	}
}


class Slider extends ValuedController {
  // gui.addController(new Slider(
  //   gui, 'x-Positie',
  //   -1, 1, -1, 0.001,
  //   (controller, value) => {
  //     generator.xScroll = value;
  //   }
  // ));
	constructor(gui, name, labelStr, minVal, maxVal, defaultVal, stepSize, 
		valueCallback, initCallback=undefined) {
		super(gui, name, labelStr, initCallback);
		this.controllerElement = createSlider(minVal, maxVal, defaultVal, stepSize);
		this.controllerElement.parent(this.div);
		this.minVal = minVal;
		this.maxVal = maxVal;
		this.defaultVal = defaultVal;
		this.stepSize = stepSize;

		const callback = (event) => {
			const value = parseFloat(event.srcElement.value);
			valueCallback(this, value);
		};
		this.controllerElement.elt.onchange = callback;
		this.controllerElement.elt.oninput = callback;
		valueCallback(this, defaultVal);
		this.valueCallback = valueCallback;
	}

	setValue(v) {
		// if (abs(v - this.defaultVal) < (this.maxVal - this.minVal) * 0.0167) 
		// 	v = this.defaultVal;
		v = round(v / this.stepSize) * this.stepSize;
		this.valueCallback(this, v);
		this.controllerElement.value(v);
		// this.setLocalStorage();
	}

	randomize() {
		this.setValue(random(this.minVal, this.maxVal));
	}
}


class XYSlider extends ValuedController {
	constructor(gui, name, labelStr, 
		minValX, maxValX, defaultValX, stepSizeX, 
		minValY, maxValY, defaultValY, stepSizeY, 
		valueCallback, initCallback=undefined) {
		super(gui, name, labelStr, initCallback);

		this.valueCallback = valueCallback;

		this.controllerElement = createDiv();
		this.controllerElement.class('xyslider');
		this.controllerElement.parent(this.div);
		let handle = createDiv();
		handle.class('handle');
		handle.parent(this.controllerElement);
		
		this.isDragging = false;
		this.controllerElement.elt.addEventListener('mousedown', (e) => {
		  this.isDragging = true;
		});
		handle.elt.addEventListener('mousedown', (e) => {
		  this.isDragging = true;
		});

		document.addEventListener('mouseup', (e) => {
		  this.isDragging = false;
		});

		document.addEventListener('mousemove', (e) => {
		  if (!this.isDragging) return;

		  const compStyle = window.getComputedStyle(this.controllerElement.elt);
		  const borderW = parseFloat(compStyle.borderWidth);

		  const rect = this.controllerElement.elt.getBoundingClientRect();
		  rect.width -= borderW * 2;
		  rect.height -= borderW * 2;

		  let x = e.clientX - rect.left - handle.elt.offsetWidth / 2;
		  let y = e.clientY - rect.top - handle.elt.offsetHeight / 2;

		  let handleW = handle.elt.offsetWidth;
		  let handleH = handle.elt.offsetHeight;
		  x = constrain(x, -handleW/2, rect.width - handleW/2);
		  y = constrain(y, -handleH/2, rect.height - handleH/2);

		  let normX = map(x, -handleW/2, rect.width - handleW/2, -1, 1);
		  let normY = map(y, -handleH/2, rect.height - handleH/2, -1, 1);

		  if (abs(normX) < 0.033) normX = 0;
		  if (abs(normY) < 0.033) normY = 0;

		  const nStepsX = round((maxValX - minValX) / stepSizeX);
		  let valX = minValX + round((normX * 0.5 + 0.5) * nStepsX) / nStepsX * (maxValX - minValX);
		  const nStepsY = round((maxValY - minValY) / stepSizeY);
		  let valY = minValY + round((normY * 0.5 + 0.5) * nStepsY) / nStepsY * (maxValY - minValY);

		  let feedbackX = map(valX, minValX, maxValX, -handleW/2, rect.width - handleW/2);
		  let feedbackY = map(valY, minValY, maxValY, -handleH/2, rect.height - handleH/2);

		  handle.elt.style.left = `${feedbackX}px`;
		  handle.elt.style.top = `${feedbackY}px`;

			// print(valX, valY);

		  this.setValue({x: valX, y: valY});
		});

		this.handle = handle;
	}

	setValue(vec) {
		this.value = {x: vec.x, y: vec.y};
		this.valueCallback(this, this.value);
		// this.controllerElement.value(v);
		// this.setLocalStorage();
	}
}



class ColourBoxes extends ValuedController {
	constructor(gui, name, labelStr, colours, defaultIndex, 
		valueCallback, initCallback=undefined) {
		super(gui, name, labelStr, initCallback);

		this.setControllerColours(colours);

		this.colours = colours;
		this.valueCallback = valueCallback;

		this.setValue(defaultIndex);
	}

	setControllerColours(colours) {
		if (this.controllerElement) {
			this.controllerElement.remove();
		}

		let radio = createRadio(this.name);
		radio.class('colour-boxes');
		radio.parent(this.div);
		let i = 0;
		for (let col of colours) {
			this.controllerElement
			// let colBox = createRadio(name);
			// colBox.parent(this.controllerElement);
			// colBox.value = 
			// let colBoxElt = document.createElement('input');
			radio.option(i);
			i++;
		}

		radio.elt.querySelectorAll('span').forEach(elt => {
			elt.remove();
		});
		radio.elt.querySelectorAll('input').forEach((elt, i) => {
			const hexCol = colorToHexString(colours[i]).toUpperCase();
			elt.style.backgroundColor = hexCol;
			elt.onmousedown = (evt) => {
				this.setValue(parseInt(elt.value));
			};
			elt.title = hexCol;
		});

		this.controllerElement = radio;
	}

	setValue(index) {
		this.valueIndex = index;
		this.value = this.colours[index];
		this.controllerElement.selected('' + index);
		this.valueCallback(this, this.value);
		// this.setLocalStorage();
	}

	randomize() {
		this.setValue(int(random(this.colours.length)));
	}
}



class Textbox extends ValuedController {
	constructor(gui, name, labelStr, defaultVal, valueCallback, initCallback=undefined) {
		super(gui, name, labelStr, initCallback);
		this.controllerElement = createInput();
		this.controllerElement.parent(this.div);

		this.controllerElement.elt.oninput = (event) => {
			const value = event.srcElement.value;
			valueCallback(this, value);
		};

		this.valueCallback = valueCallback;
		
		this.controllerElement.elt.addEventListener("focusin", (event) => gui.isTypingText = true);
		this.controllerElement.elt.addEventListener("focusout", (event) => gui.isTypingText = false);
	}

	setValue(v) {
		this.valueCallback(this, v);
		this.controllerElement.value(v);
		// this.setLocalStorage();
	}

	randomize() {}
}


class ResolutionTextboxes extends ValuedController {
	constructor(gui, defW, defH, valueCallback, initCallback=undefined) {
		// constructor(gui, name, labelStr, doCreateLabel=true) {
		super(gui, 'resolutionTextboxes', undefined, initCallback);
		this.w = defW;
		this.h = defH;
		this.wBox = new Textbox(gui,
			'resolutionTextBoxes-Width',
			// lang.process('↔️ LANG_WIDTH:', true), 
			lang.process('LANG_WIDTH:', true), 
			defW, 
			(controller, value) => {
				const pxDim = parseInt(value);
				if (isNaN(pxDim)) {
					return;
				}
				this.w = pxDim;
				resize(this.w, this.h);
				valueCallback(this, {w: this.w, h: this.h});
			}
		);
		this.hBox = new Textbox(gui,
			'resolutionTextBoxes-Height',
			// lang.process('↕️ LANG_HEIGHT:', true), 
			lang.process('LANG_HEIGHT:', true), 
			defH, 
			(controller, value) => {
				const pxDim = parseInt(value);
				if (isNaN(pxDim)) {
					return;
				}
				this.h = pxDim;
				resize(this.w, this.h);
				valueCallback(this, {w: this.w, h: this.h});
			}
		);

		for (let tb of [this.wBox, this.hBox]) {
			tb.div.parent(this.div);
		}
		this.div.style('display', 'flex');
		this.div.style('flex-direction', 'row');
		this.div.style('gap', '1em');
	}

	setValue(vec) {
		this.value = vec;
		this.wBox.setValue(vec.w);
		this.hBox.setValue(vec.h);
		// this.setLocalStorage();
	}

	setValueOnlyDisplay(w, h) {
		this.wBox.controllerElement.value(w);
		this.hBox.controllerElement.value(h);		
	}
}


class Textarea extends ValuedController {
	constructor(gui, name, labelStr, defaultVal, valueCallback, initCallback=undefined) {
	super(gui, name, labelStr, initCallback);
	this.controllerElement = createElement('textarea');
	this.controllerElement.parent(this.div);
	this.controllerElement.html(defaultVal);

	this.controllerElement.elt.oninput = (event) => {
			const value = event.srcElement.value;
			valueCallback(this, value);
		};
		this.valueCallback = valueCallback;

	this.controllerElement.elt.addEventListener("focusin", (event) => gui.isTypingText = true);
		this.controllerElement.elt.addEventListener("focusout", (event) => gui.isTypingText = false);
	}

	setValue(v) {
		this.valueCallback(this, v);
		this.controllerElement.value(v);
	}

	randomize() {}
}



const resolutionOptions = [
	'Full-HD (1080p) LANG_PORTRAIT: 1080 x 1920',
	'Full-HD (1080p) LANG_LANDSCAPE: 1920 x 1080',
	'4K-Ultra-HD (2160p): 3840 x 2160',

	'Instagram post LANG_PORTRAIT: 1080 x 1350',
	'(Instagram post LANG_SQUARE): 1080 x 1080',
	'Instagram story: 1080 x 1920',

	'Facebook post LANG_LANDSCAPE: 1200 x 630',
	'Facebook post LANG_PORTRAIT: 630 x 1200',
	'Facebook post LANG_SQUARE: 1200 x 1200',
	'Facebook story: 1080 x 1920',
	'Facebook cover photo: 851 x 315',

	'X post LANG_LANDSCAPE: 1600 x 900',
	'X post LANG_PORTRAIT: 1080 x 1350',
	'X post LANG_SQUARE: 1080 x 1080',
	'X cover photo: 1500 x 500',

	'Linkedin LANG_PROFILEPIC: 400 x 400',
	'Linkedin cover photo: 1584 x 396',
	'Linkedin image post: 1200 x 628',

	'YouTube LANG_PROFILEPIC: 800 x 800',
	'YouTube banner: 2048 x 1152',
	'YouTube thumbnail: 1280 x 720',
	'YouTube shorts/stories: 1080 x 1920',

	'TikTok LANG_PORTRAIT: 1080 x 1920',
	'TikTok LANG_SQUARE: 1080 x 1080',

	'PowerPoint: 1920 x 1080',


	getAPaperResolutionOptionAtDpi(5, 300),
	getAPaperResolutionOptionAtDpi(4, 300),
	getAPaperResolutionOptionAtDpi(3, 300),
	getAPaperResolutionOptionAtDpi(2, 300),
	getAPaperResolutionOptionAtDpi(1, 300),
	getAPaperResolutionOptionAtDpi(0, 300),
	getAPaperResolutionOptionAtDpi(5, 300, false),
	getAPaperResolutionOptionAtDpi(4, 300, false),
	getAPaperResolutionOptionAtDpi(3, 300, false),
	getAPaperResolutionOptionAtDpi(2, 300, false),
	getAPaperResolutionOptionAtDpi(1, 300, false),
	getAPaperResolutionOptionAtDpi(0, 300, false)
].map(s => lang.process(s, true));

function getAPaperResolutionOptionAtDpi(aNumber, dpi, isPortrait=true) {
	// A0 paper size in mm
  const baseWidth = 841;
  const baseHeight = 1189;
  const factor = Math.pow(2, aNumber / 2);
  const wMm = Math.floor(baseWidth / factor);
  const hMm = Math.floor(baseHeight / factor);
  const wPx = Math.round(wMm / 25.4 * dpi);
  const hPx = Math.round(hMm / 25.4 * dpi);
	return `A${aNumber} ${isPortrait ? 'LANG_PORTRAIT' : 'LANG_LANDSCAPE'} @ ${dpi} DPI: ` + 
		`${isPortrait ? wPx : hPx} x ${isPortrait ? hPx : wPx}`;
}

