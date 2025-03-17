
const language = 'nl';

const dictionary = {
	'LANG_BUTTON': {
		'en': 'button', 
		'nl': 'knop'
	},
	'LANG_CONTACT_MSG': {
		'en': 'Contact for support & feedback',
		'nl': 'Contact voor ondersteuning & feedback'
	},
	'LANG_PORTRAIT': {
		'en': 'portrait',
		'nl': 'staand'
	},
	'LANG_LANDSCAPE': {
		'en': 'landscape',
		'nl': 'liggend'
	},
	'LANG_PROFILEPIC': {
		'en': 'profile picture',
		'nl': 'profielfoto'
	},
	'LANG_SQUARE': {
		'en': 'square',
		'nl': 'vierkant'
	},
	'LANG_WIDTH': {
		'en': 'width',
		'nl': 'breedte'
	},
	'LANG_HEIGHT': {
		'en': 'height',
		'nl': 'hoogte'
	},
	'LANG_HIDE': {
		'en': 'hide',
		'nl': 'verberg'
	},
	'LANG_SHOW': {
		'en': 'show',
		'nl': 'toon'
	},
	'LANG_IMAGE_POSITION': {
		'en': 'image position',
		'nl': 'positie afbeelding'
	},
	'LANG_IMAGE': {
		'en': 'image',
		'nl': 'afbeelding'
	},
	'LANG_SCALE': {
		'en': 'scale',
		'nl': 'schaal'
	},
	'LANG_EXPORT': {
		'en': 'export',
		'nl': 'exporteren'
	},
	'LANG_SPEED': {
		'en': 'speed',
		'nl': 'snelheid'
	},
	'LANG_TEXT': {
		'en': 'text',
		'nl': 'tekst'
	},
	'LANG_BODY_TEXT': {
		'en': 'body text',
		'nl': 'bodytekst'
	},
	'LANG_TITLE_TEXT': {
		'en': 'title text',
		'nl': 'titeltekst'
	},
	'LANG_FORMAT': {
		'en': 'format',
		'nl': 'formaat'
	},
	'LANG_VID_DURATION': {
		'en': 'video duration',
		'nl': 'duur video'
	},
	'LANG_VID_CAPTURE': {
		'en': 'video capture',
		'nl': 'video-opname'
	},
	'LANG_SELECT': {
		'en': 'select', 
		'nl': 'selecteer'
	},
	'LANG_APPEARANCE': {
		'en': 'appearance', 
		'nl': 'verschijning'
	},
	'LANG_BGCOL': {
		'en': 'background colour', 
		'nl': 'achtergrondkleur'
	},
	'LANG_FGCOL': {
		'en': 'foreground colour', 
		'nl': 'voorgrondkleur'
	},
	'LANG_RANDOMIZE': {
		'en': 'randomize', 
		'nl': 'doe maar wat'
	},


	//////////////////////////
	
	'LANG_BUTTON': {
		'en': 'button', 
		'nl': 'knop'
	},
	'LANG_BUTTON': {
		'en': 'button', 
		'nl': 'knop'
	},
	'LANG_BUTTON': {
		'en': 'button', 
		'nl': 'knop'
	},
};

const availableLangKeys = Object.keys(dictionary[Object.keys(dictionary)[0]]);


class Lang {
	static verbose = false;

	static getURLLangKey() {
	  // form: "?lang=nl"
	  const urlParams = new URLSearchParams(window.location.search);
	  let urlLangKey = urlParams.get('lang');
	  if (urlLangKey == null) {
	    console.log('No lang key set in URL.');
	    return;
	  }
	  urlLangKey = urlLangKey.toLowerCase();
	  if (!availableLangKeys.some(key => key == urlLangKey)) {
	    console.error('Lang key set in URL but is invalid: ' + urlLangKey);
	    return;
	  }
	  console.log('Lang key set: ' + urlLangKey);
	  return urlLangKey;
	}


	constructor(langKey) {
		this.langKey = Lang.getURLLangKey() || langKey;
	}

	process(str, doCapitalizeFirstLetter=false) {
		let replaced = str;
		for (let hotString in dictionary) {
			const translation = dictionary[hotString][this.langKey];
			if (Lang.verbose && str.match(hotString) != null)
				console.log(hotString, translation);
			replaced = replaced.replaceAll(hotString, translation);
		}
		if (doCapitalizeFirstLetter) {
			return this.capFirst(replaced);
		}
		return replaced;
	}

	capFirst(str) {
		const ind = this.indexOfFirstAlphabetic(str);
		if (ind == -1) return str;
		return str.slice(0, ind) + str.charAt(ind).toUpperCase() + str.slice(ind + 1);
	}

	indexOfFirstAlphabetic(str) {
		return str.search(/[a-zA-Z]/);
	}
}

const lang = new Lang(language);


