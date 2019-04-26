/* globals define */
define(['ojs/ojcore','knockout', 'jquery', 'css!./styles/design.css','text!./template.html','ojs/ojselectcombobox','ojs/ojcheckboxset'], function (oj,ko, $, css,sampleComponentTemplate) {
	'use strict';
	// ----------------------------------------------
	// Define a Knockout Template for your component
	// ----------------------------------------------



	// ----------------------------------------------
	// Define a Knockout ViewModel for your template
	// ----------------------------------------------
	var SampleComponentViewModel = function (args) {
		var self = this,
			SitesSDK = args.SitesSDK;

		// store the args
		self.mode = args.viewMode;
		self.id = args.id;
		self.val = ko.observable("");
		self.selectedval = ko.observable("");
		// create the observables
		self.imageWidth = ko.observable('200px');
		self.localisationName = ko.observable('name');
		self.alignImage = ko.observable();
		self.layout = ko.observable();
		self.showTopLayout = ko.observable();
		self.curLanguage = ko.observableArray();
		self.curLanguage1 = ko.observableArray(["fr-FR"]);
		self.showStoryLayout = ko.observable();
		self.currentColor = ko.observableArray(["red"]);
		self.agreement = ko.observableArray();
		self.languages = ko.observableArray();

		console.log(self.languages);
		
		self.getCurLanguage = function(){
			
			let splitPath = window.location.pathname.split('/');
			if (splitPath[2] == "preview"){
				self.curLanguage.push(splitPath[4])
			}
			else{
				self.curLanguage.push(splitPath[3])
			}
			console.log(""+self.curLanguage());
		}
		
		self.getCurLanguage();
		
		
		
		
		
		
		// handle initialization 
		self.componentLayoutInitialized = ko.observable(false);
		self.customSettingsDataInitialized = ko.observable(false);
		self.initialized = ko.computed(function () {
			return self.componentLayoutInitialized() && self.customSettingsDataInitialized();
		}, self);

		// Style on left- or right-aligned image
		self.imageStyle = ko.pureComputed(function () {
			var style;
			if (self.showTopLayout()) {
				style = '';
			} else {
				style = 'flex-shrink:0;width:' + self.imageWidth() + ';';
			}
			return style;
		});

		// Style around paragraph component
		self.paragraphStyle = ko.pureComputed(function () {
			var style;
			if (self.showTopLayout()) {
				style = '';
			} else {
				style = 'flex-grow:1;';
			}
			return style;
		});

		//
		// Raise the given trigger.
		//

		self.raiseTrigger = function (triggerName) {
			SitesSDK.publish(SitesSDK.MESSAGE_TYPES.TRIGGER_ACTIONS, {
				'triggerName': triggerName,
				'triggerPayload': {
					'payloadData': 'some data here'
				}
			});
		};

		// click binding
		self.imageClicked = function (data, event) {
			self.raiseTrigger("imageClicked"); // matches appinfo.json
		};


		// execute action handler
		self.executeActionsListener = function (args) {
			// get action and payload
			var payload = args.payload,
				action = args.action;

			// handle 'setImageWidth' actions
			if (action && action.actionName === 'setImageWidth') {
				$.each(payload, function (index, data) {
					if (data.name === 'imageWidth') {
						self.imageWidth(data.value);
					}
				});
			}
		};
		
		
		
		self.convert = function(value) {
			console.log("value from function");
			console.log(value);
		}
		
		var getLangauges = function (item, index,listResponse) {

			// minified languages json
			var languageList = {"languageCodes":{"af":{"language":"Afrikaans"},"sq":{"language":"Albanian"},"am":{"language":"Amharic"},"ar":{"language":"Arabic"},"ar-DZ":{"language":"Arabic","territory":"Algeria"},"ar-BH":{"language":"Arabic","territory":"Bahrain"},"ar-EG":{"language":"Arabic","territory":"Egypt"},"ar-IQ":{"language":"Arabic","territory":"Iraq"},"ar-JO":{"language":"Arabic","territory":"Jordan"},"ar-KW":{"language":"Arabic","territory":"Kuwait"},"ar-LB":{"language":"Arabic","territory":"Lebanon"},"ar-LY":{"language":"Arabic","territory":"Libya"},"ar-MA":{"language":"Arabic","territory":"Morocco"},"ar-OM":{"language":"Arabic","territory":"Oman"},"ar-QA":{"language":"Arabic","territory":"Qatar"},"ar-SA":{"language":"Arabic","territory":"Saudi Arabia"},"ar-SY":{"language":"Arabic","territory":"Syria"},"ar-TN":{"language":"Arabic","territory":"Tunisia"},"ar-AE":{"language":"Arabic","territory":"United Arab Emirates"},"ar-YE":{"language":"Arabic","territory":"Yemen"},"hy":{"language":"Armenian"},"as":{"language":"Assamese"},"az":{"language":"Azerbaijani"},"az-AZ":{"language":"Azerbaijani","territory":"Azerbaijan"},"az-Cyrl-AZ":{"language":"Azerbaijani","script":"Cyrillic","territory":"Azerbaijan"},"az-Latn-AZ":{"language":"Azerbaijani","script":"Latin","territory":"Azerbaijan"},"eu":{"language":"Basque"},"be":{"language":"Belarusian"},"bn":{"language":"Bengali"},"bs":{"language":"Bosnian"},"bg":{"language":"Bulgarian"},"my":{"language":"Burmese"},"ca":{"language":"Catalan"},"zh":{"language":"Chinese"},"zh-CN":{"language":"Chinese","territory":"China"},"zh-HK":{"language":"Chinese","territory":"Hong Kong"},"zh-MO":{"language":"Chinese","territory":"Macao"},"zh-SG":{"language":"Chinese","territory":"Singapore"},"zh-TW":{"language":"Chinese","territory":"Taiwan"},"hr":{"language":"Croatian"},"cs":{"language":"Czech"},"da":{"language":"Danish"},"dv":{"language":"Divehi"},"nl":{"language":"Dutch"},"nl-BE":{"language":"Dutch","territory":"Belgium"},"nl-NL":{"language":"Dutch","territory":"Netherlands"},"en":{"language":"English"},"en-CB":{"language":"English"},"en-AU":{"language":"English","territory":"Australia"},"en-BZ":{"language":"English","territory":"Belize"},"en-CA":{"language":"English","territory":"Canada"},"en-IN":{"language":"English","territory":"India"},"en-IE":{"language":"English","territory":"Ireland"},"en-JM":{"language":"English","territory":"Jamaica"},"en-NZ":{"language":"English","territory":"New Zealand"},"en-PH":{"language":"English","territory":"Philippines"},"en-ZA":{"language":"English","territory":"South Africa"},"en-TT":{"language":"English","territory":"Trinidad and Tobago"},"en-GB":{"language":"English","territory":"United Kingdom"},"en-US":{"language":"English","territory":"United States"},"et":{"language":"Estonian"},"fo":{"language":"Faroese"},"fi":{"language":"Finnish"},"fr":{"language":"French"},"fr-BE":{"language":"French","territory":"Belgium"},"fr-CA":{"language":"French","territory":"Canada"},"fr-FR":{"language":"French","territory":"France"},"fr-LU":{"language":"French","territory":"Luxembourg"},"fr-CH":{"language":"French","territory":"Switzerland"},"gl":{"language":"Gallegan"},"ka":{"language":"Georgian"},"de":{"language":"German"},"de-AT":{"language":"German","territory":"Austria"},"de-DE":{"language":"German","territory":"Germany"},"de-LI":{"language":"German","territory":"Liechtenstein"},"de-LU":{"language":"German","territory":"Luxembourg"},"de-CH":{"language":"German","territory":"Switzerland"},"el":{"language":"Greek"},"gn":{"language":"Guarani"},"gu":{"language":"Gujarati"},"he":{"language":"Hebrew"},"hi":{"language":"Hindi"},"hu":{"language":"Hungarian"},"is":{"language":"Icelandic"},"id":{"language":"Indonesian"},"it":{"language":"Italian"},"it-IT":{"language":"Italian","territory":"Italy"},"it-CH":{"language":"Italian","territory":"Switzerland"},"ja":{"language":"Japanese"},"kn":{"language":"Kannada"},"ks":{"language":"Kashmiri"},"kk":{"language":"Kazakh"},"km":{"language":"Khmer"},"ko":{"language":"Korean"},"lo":{"language":"Lao"},"la":{"language":"Latin"},"lv":{"language":"Latvian"},"lt":{"language":"Lithuanian"},"mk":{"language":"Macedonian"},"ms":{"language":"Malay"},"ms-BN":{"language":"Malay","territory":"Brunei"},"ms-MY":{"language":"Malay","territory":"Malaysia"},"ml":{"language":"Malayalam"},"mt":{"language":"Maltese"},"mi":{"language":"Maori"},"mr":{"language":"Marathi"},"mn":{"language":"Mongolian"},"ne":{"language":"Nepali"},"zxx":{"language":"No linguistic content"},"no":{"language":"Norwegian"},"no-NO":{"language":"Norwegian","territory":"Norway"},"nb":{"language":"Norwegian Bokmål"},"nn":{"language":"Norwegian Nynorsk"},"or":{"language":"Oriya"},"pa":{"language":"Panjabi"},"fa":{"language":"Persian"},"pl":{"language":"Polish"},"pt":{"language":"Portuguese"},"pt-BR":{"language":"Portuguese","territory":"Brazil"},"pt-PT":{"language":"Portuguese","territory":"Portugal"},"rm":{"language":"Raeto-Romance"},"ro":{"language":"Romanian"},"ro-MO":{"language":"Romanian","territory":"Macao"},"ru":{"language":"Russian"},"ru-MO":{"language":"Russian","territory":"Macao"},"sa":{"language":"Sanskrit"},"gd":{"language":"Scottish Gaelic"},"gd-IE":{"language":"Scottish Gaelic","territory":"Ireland"},"sr":{"language":"Serbian"},"sr-SP":{"language":"Serbian"},"sr-RS":{"language":"Serbian","territory":"Serbia"},"sr-Cyrl-RS":{"language":"Serbian","script":"Cyrillic","territory":"Serbia"},"sr-Latn-RS":{"language":"Serbian","script":"Latin","territory":"Serbia"},"sd":{"language":"Sindhi"},"si":{"language":"Sinhalese"},"sk":{"language":"Slovak"},"sl":{"language":"Slovenian"},"so":{"language":"Somali"},"es":{"language":"Spanish"},"es-AR":{"language":"Spanish","territory":"Argentina"},"es-BO":{"language":"Spanish","territory":"Bolivia"},"es-CL":{"language":"Spanish","territory":"Chile"},"es-CO":{"language":"Spanish","territory":"Colombia"},"es-CR":{"language":"Spanish","territory":"Costa Rica"},"es-DO":{"language":"Spanish","territory":"Dominican Republic"},"es-EC":{"language":"Spanish","territory":"Ecuador"},"es-SV":{"language":"Spanish","territory":"El Salvador"},"es-GT":{"language":"Spanish","territory":"Guatemala"},"es-HN":{"language":"Spanish","territory":"Honduras"},"es-MX":{"language":"Spanish","territory":"Mexico"},"es-NI":{"language":"Spanish","territory":"Nicaragua"},"es-PA":{"language":"Spanish","territory":"Panama"},"es-PY":{"language":"Spanish","territory":"Paraguay"},"es-PE":{"language":"Spanish","territory":"Peru"},"es-PR":{"language":"Spanish","territory":"Puerto Rico"},"es-ES":{"language":"Spanish","territory":"Spain"},"es-UY":{"language":"Spanish","territory":"Uruguay"},"es-VE":{"language":"Spanish","territory":"Venezuela"},"sw":{"language":"Swahili"},"sv":{"language":"Swedish"},"sv-FI":{"language":"Swedish","territory":"Finland"},"sv-SE":{"language":"Swedish","territory":"Sweden"},"tg":{"language":"Tajik"},"ta":{"language":"Tamil"},"tt":{"language":"Tatar"},"te":{"language":"Telugu"},"th":{"language":"Thai"},"bo":{"language":"Tibetan"},"ts":{"language":"Tsonga"},"tn":{"language":"Tswana"},"tr":{"language":"Turkish"},"tk":{"language":"Turkmen"},"uk":{"language":"Ukrainian"},"und":{"language":"Undetermined"},"ur":{"language":"Urdu"},"uz":{"language":"Uzbek"},"uz-UZ":{"language":"Uzbek","territory":"Uzbekistan"},"uz-Cyrl-UZ":{"language":"Uzbek","script":"Cyrillic","territory":"Uzbekistan"},"uz-Latn-UZ":{"language":"Uzbek","script":"Latin","territory":"Uzbekistan"},"vi":{"language":"Vietnamese"},"cy":{"language":"Welsh"},"xh":{"language":"Xhosa"},"yi":{"language":"Yiddish"},"zu":{"language":"Zulu"}},"links":[{"href":"https://cecs-auto-orasenatdctocloudcorp01.cec.ocp.oraclecloud.com/content/management/api/v1.1/languageCodes","rel":"self","method":"GET","mediaType":"application/json"},{"href":"https://cecs-auto-orasenatdctocloudcorp01.cec.ocp.oraclecloud.com/content/management/api/v1.1/languageCodes","rel":"canonical","method":"GET","mediaType":"application/json"},{"href":"https://cecs-auto-orasenatdctocloudcorp01.cec.ocp.oraclecloud.com/content/management/api/v1.1/metadata-catalog/languageCodes","rel":"describedby","method":"GET","mediaType":"application/schema+json"}]}
			
			var tempArray = [];
			var tempJson = []
			if (listResponse.items[index].name == self.localisationName()){
				tempArray = [...foo.items[index].requiredValues,...foo.items[index].optionalValues]
		
				for(i in tempArray){
					tempJson.push({
						value: i,
						label: languageList.languageCodes[tempArray[i]].language
					})
				}
				self.languages([tempJson]);
				return;
			}
		}
		
		
		
		
		
		
		// self.langChange = function (lang) {
		// 	console.log("printing lang");
		// 	console.log(lang);
		// 	var search_term = lang;
		// 	let languageData = [{
		// 			value: 'en-IN',
		// 			label: 'English In'
		// 		},
		// 		{
		// 			value: 'en-US',
		// 			label: 'English Us'
		// 		},
		// 		{
		// 			value: 'sp-SP',
		// 			label: 'Spanish'
		// 		},
		// 		{
		// 			value: 'fr-FR',
		// 			label: 'French'
		// 		}
		// 	];
		// 	for (var i = 0; i < languageData.length; i++) {
		// 		if (languageData[i].value == search_term) {
		// 			languageData.splice(i, 1);
		// 			break;
		// 		}
		// 	}
		// 	self.languages = ko.observableArray(languageData);
		// 	console.log(languageData);
		// 	console.log(self.languages);

		// };
		console.log("self.val()"+navigator.language);
		
		self.langApi = function () {
			console.log("converting lang"+self.curLanguage());
			
			self.selectedval(self.val());
			var pathname = window.location.pathname;
			var pathSplit = pathname.split('/');
			if(pathSplit[2]=="preview"){
				if(pathSplit.length==5){
					pathSplit.splice(4,0,self.curLanguage())
				}
				else{
					pathSplit[4] = self.curLanguage();
				}
				
			}
			else{
				if(pathSplit.length==4){
					pathSplit.splice(3,0,self.curLanguage());
				}
				else{
					pathSplit[3]=self.curLanguage();
				}
			}
			console.log(pathSplit.join('/'));
			var finalUrl = window.location.origin + pathSplit.join('/');
			console.log(finalUrl);

			window.location.replace(finalUrl);
			//location.reload();

		};


		self.foobar = function (e,val) {
			e.preventDefault();
			e.stopImmediatePropagation();
			e.stopPropagation()
			console.log("hey from foo bar")
		}
		
		
		
		
		
		
		
		//
		// Seed nested component data
		//
		self.imageData = {};
		self.titleData = {};
		self.paragraphData = {};

		// 
		// Handle property changes
		//
		self.updateComponentLayout = $.proxy(function (componentLayout) {
			var layout = componentLayout ? componentLayout : 'default';
			self.layout(layout);
			self.alignImage(layout === 'right' ? 'right' : 'left');
			self.showTopLayout(layout === 'top');
			self.showStoryLayout(layout === 'default' || layout === 'right');

			self.componentLayoutInitialized(true);
		}, self);
		
		self.updateCustomSettingsData = $.proxy(function (customData) {
			// self.imageWidth(customData && customData.width);
			self.localisationName(customData && customData.localisationName);
			console.log("localisation name from the log");
			console.log(self.localisationName());

			// fetching langauge details from api
			
			if(customData && customData.localisationName){
				var foo;
				$.ajax
				({
					type:'GET',
					url: '/content/management/api/v1.1/localizationPolicies',
					dataType: "json",
					headers: {
						"Authorization": "Basic " + btoa('wilfred.shelly@oracle.com' + ':' + 'WilsOracle@2019')
					},
					success: function (listResponse){
						console.log(JSON.stringify(listResponse));
						listResponse.items.foreach(getLangauges(listResponse));
						
					}
				});
			}
			
			// fetching langauge details from api

			self.customSettingsDataInitialized(true);
		}, self);
		
		self.updateSettings = function (settings) {
			if (settings.property === 'componentLayout') {
				self.updateComponentLayout(settings.value);
			} else if (settings.property === 'customSettingsData') {
				self.updateCustomSettingsData(settings.value);
			}
		};

		// listen for the EXECUTE ACTION request to handle custom actions
		SitesSDK.subscribe(SitesSDK.MESSAGE_TYPES.EXECUTE_ACTION, $.proxy(self.executeActionsListener, self));
		// listen for settings update
		SitesSDK.subscribe(SitesSDK.MESSAGE_TYPES.SETTINGS_UPDATED, $.proxy(self.updateSettings, self));


		// Handle Copy Style (save customSettingsData to the clipboard)
		self.copyComponentCustomData = function () {
			return {
				width: this.imageWidth()
			};
		};

		// Handle Paste Style (apply customSettingsData from the clipboard)
		self.pasteComponentCustomData = function (data) {
			this.imageWidth(data.width);

			// save data in page
			SitesSDK.setProperty('customSettingsData', {
				width: this.imageWidth()
			});
		};

		// listen for COPY_CUSTOM_DATA request
		SitesSDK.subscribe(SitesSDK.MESSAGE_TYPES.COPY_CUSTOM_DATA, $.proxy(self.copyComponentCustomData, self));

		// listen for PASTE_CUSTOM_DATA request
		SitesSDK.subscribe(SitesSDK.MESSAGE_TYPES.PASTE_CUSTOM_DATA, $.proxy(self.pasteComponentCustomData, self));

		//
		// Initialize the componentLayout & customSettingsData values
		//
		SitesSDK.getProperty('componentLayout', self.updateComponentLayout);
		SitesSDK.getProperty('customSettingsData', self.updateCustomSettingsData);
	};


	// ----------------------------------------------
	// Create a knockout based component implemention
	// ----------------------------------------------
	var SampleComponentImpl = function (args) {
		// Initialze the custom component
		this.init(args);
	};
	// initialize all the values within the component from the given argument values
	SampleComponentImpl.prototype.init = function (args) {
		this.createViewModel(args);
		this.createTemplate(args);
		this.setupCallbacks();
	};
	// create the viewModel from the initial values
	SampleComponentImpl.prototype.createViewModel = function (args) {
		// create the viewModel
		this.viewModel = new SampleComponentViewModel(args);
	};
	// create the template based on the initial values
	SampleComponentImpl.prototype.createTemplate = function (args) {
		// create a unique ID for the div to add, this will be passed to the callback
		this.contentId = args.id + '_content_' + args.viewMode;
		// create a hidden custom component template that can be added to the DOM
		this.template = '<div id="' + this.contentId + '">' +
			sampleComponentTemplate +
			'</div>';
	};
	//
	// SDK Callbacks
	// setup the callbacks expected by the SDK API
	//
	SampleComponentImpl.prototype.setupCallbacks = function () {
		//
		// callback - render: add the component into the page
		//
		this.render = $.proxy(function (container) {
			var $container = $(container);
			// add the custom component template to the DOM
			$container.append(this.template);
			// apply the bindings
			ko.applyBindings(this.viewModel, $('#' + this.contentId)[0]);
		}, this);
		//
		// callback - update: handle property change event
		//
		this.update = $.proxy(function (args) {
			var self = this;
			// deal with each property changed
			$.each(args.properties, function (index, property) {
				if (property) {
					if (property.name === 'customSettingsData') {
						self.viewModel.updateComponentData(property.value);
					} else if (property.name === 'componentLayout') {
						self.viewModel.updateLayout(property.value);
					}
				}
			});
		}, this);
		//
		// callback - dispose: cleanup after component when it is removed from the page
		//
		this.dispose = $.proxy(function () {
			// nothing required for this sample since knockout disposal will automatically clean up the node
		}, this);
	};
	// ----------------------------------------------
	// Create the factory object for your component
	// ----------------------------------------------
	var sampleComponentFactory = {
		createComponent: function (args, callback) {
			// return a new instance of the component
			return callback(new SampleComponentImpl(args));
		}
	};
	return sampleComponentFactory;
});