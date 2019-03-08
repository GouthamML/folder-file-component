/* globals define */
define(['knockout', 'jquery','text!./template.html'], function (ko, $,componentTemplate) {
	'use strict';
	// ----------------------------------------------
	// Define a Knockout Template for your component
	// ----------------------------------------------
	var sampleComponentTemplate = '<!-- ko if: initialized -->' +
		componentTemplate +
		'<!-- /ko -->';
		console.log("hello from folder component\n");


	// ----------------------------------------------
	// Define a Knockout ViewModel for your template
	// ----------------------------------------------
	var SampleComponentViewModel = function (args) {
		var self = this,
		SitesSDK = args.SitesSDK;

		// store the args
		self.mode = args.viewMode;
		self.id = args.id;

		// create the observables
		self.rootFolderid = ko.observable();
		self.currentFolderId = ko.observable();
		var data = [];
    self.items = ko.observableArray(data);

		self.layoutClass = ko.pureComputed(function() {
				var layoutClass =  "item " + self.selectedLayout() + " plain";
				return layoutClass;
    }, self);

		// handle initialization
		self.customSettingsDataInitialized = ko.observable(false);
		self.initialized = ko.computed(function () {
			return self.customSettingsDataInitialized();
		}, self);

		//
		// Handle property changes
		//

		//Registerring triggers

		self.raiseTrigger = function (triggerName, folderid) {
			SitesSDK.publish(SitesSDK.MESSAGE_TYPES.TRIGGER_ACTIONS, {
				'triggerName': triggerName,
				'triggerPayload':{
					'currentFolderId': folderid
				}
			});
		};

		//

		//
		// Calling the triggers

		self.folderClicked = function (data, event, test){
			self.raiseTrigger("folderClicked", data);
			console.log(data);
			console.log(event);
			console.log(test);
		}


		//

		self.updateCustomSettingsData = $.proxy(function (customData) {
			self.rootFolderid(customData && customData.rootFolderid);
			console.log("root folder id\n");
			console.log(self.rootFolderid());
			if(customData && customData.rootFolderid){
				$.ajaxSetup({
				  headers : {
				    'Authorization' : 'Basic d2lsZnJlZC5zaGVsbHlAb3JhY2xlLmNvbTpXaWxzT3JhY2xlQDIwMTk=',
						'Accept' : 'application/json'
				  }
				});
				$.getJSON("https://cecs-auto-orasenatdctocloudcorp01.cec.ocp.oraclecloud.com/documents/api/1.2/folders/" + self.rootFolderid() + "/items",function(data) {
					// console.log("result from api\n")
					// console.log(data);
					var tempArray = [];
				//pushing only folders to observables array
				for(let i in data.items){
					// console.log(i);
					if (data.items[i].type == "folder"){
						// console.log(data.items[i].type);	
						tempArray.push(data.items[i]);
				}
			}
			self.items(tempArray);
						// console.log(JSON.stringify(self.items()));
					}
				);
			}
			self.customSettingsDataInitialized(true);
		}, self);
		self.updateSettings = function (settings) {
			if (settings.property === 'customSettingsData') {
				self.updateCustomSettingsData(settings.value);
			}
		};

		// listen for the EXECUTE ACTION request to handle custom actions
		SitesSDK.subscribe(SitesSDK.MESSAGE_TYPES.EXECUTE_ACTION, $.proxy(self.executeActionsListener, self));
		// listen for settings update
		SitesSDK.subscribe(SitesSDK.MESSAGE_TYPES.SETTINGS_UPDATED, $.proxy(self.updateSettings, self));

		//
		// Initialize customSettingsData values
		//
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
		this.contentId = args.id + '_content_' + args.mode;
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
