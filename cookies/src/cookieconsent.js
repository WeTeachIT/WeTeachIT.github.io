
(function(scope){
	'use strict';
	var CookieConsent = function(){
		
		var _cookieconsent = {};
		var _cc_modal_isHidden = true;
		var _cc_modal_isAttached = false;
		var _cc_policy_isHidden = true;
		var _cc_policy_isAttached = false;
		var _cc_modal_dom = null;
		var _cc_policy_dom = null;
		var _general_container_exists = false;
		
		/**
		 * Default cookieConsent config settings
		 */
		var _config = {
			cc_container : "body",  					// supports only "body", and ids like "#example_id"
			cc_current_lang : "en",         			
			cc_default_lang : "en",						// default language (from those in _cc_languages object)
			cc_autorun: false, 							// run as soon as loaded
			cc_delay: 20,								// default milliseconds delay	
			cc_policy_url: null,
			cc_enable_verbose: true,					// if enabled, show on console all events/errors
			cc_auto_language: false,    				// if enabled, overrides default cc_current_lang
			cc_cookie_expires : 30,						// 30 days
			cc_banner_type: "simple",
			cc_cookie_name: "cc_cookie",
			cc_theme_css: "/public/assets/css/cookieconsent.css",
			cc_ids : {
				policy_container_id : "cc__policy__container",
				main_container_id : "cc__modal__container",
				modal_id : "cc__modal",								// do not change (or else modify also css)
				modal_title : "cc__modal__title",					// do not change (or else modify also css)
				modal_text : "cc__modal__text",						// do not change (or else modify also css)
				modal_accept_btn : "cc__modal__accept__btn",		// do not change (or else modify also css)
				modal_more_btn : "cc__modal__more__btn",			// do not change (or else modify also css)
				modal_edit_btn : "cc__modal__edit__btn",			// do not change (or else modify also css)
				policy_close_btn : "cc__policy__close__btn"			// do not change (or else modify also css)
			},
			cc_policy_ids : {
				title : 'cc__policy__title',
				content : 'cc__policy__content',
				save_btn : "cc__policy__save__btn"
			}
		};

		/**
		 * Here you can also add additional languages
		 */
		var _cc_languages = {
			"en" : {
				modal : {
					cc_title :  "I use cookies",
					cc_more_text :  "Learn more", 
					cc_accept_text : "I understand",
					cc_description :  'My website uses essential cookies necessary for its functioning. By continuing browsing, you consent to my use of cookies and other technologies.',
				},
				policy : {
					ccp_title : "Cookie Policy",
					ccp_blocks : [
						{
							ccb_title : "What are cookies",
							ccb_description: 'Cookies are very small text files that are stored on your computer when you visit a website. I use cookies to assure the basic functionalities of the website and to enhance your online experience.'
						},{
							ccb_title : "Strictly necessary cookies",
							ccb_description: 'These cookies are essential for the proper functioning of my website. Without these cookies, the website would not work properly.',
							ccb_switch : {
								value : 'necessary_cookies',
								enabled : true,
								readonly: true
							}
						},{
							ccb_title : "Functionality cookies",
							ccb_description: 'These cookies are used to provide you with a more personalized experience on my website and to remember choices you make when you browse the website. For example, whether or not you enabled dark-mode on this website.',
							ccb_switch : {
								value : 'functionality_cookies',
								enabled : true,
								readonly: false
							}
						},{
							ccb_title : "More information",
							ccb_description: 'For any queries in relation to my policy on cookies and your choices, please contact me.',
						}
					],
					ccp_save_text : "Save preferences"
				}
			}
		};

		/**
		 * Update config settings (if user provided an config object)
		 * @param {Object} conf_params 
		 */
		var _setConfig = function(conf_params, op_mode){
			try{
				if(conf_params != undefined && conf_params != null){

					if(conf_params['cc_enable_verbose'] != undefined && typeof conf_params['cc_enable_verbose'] == "boolean"){
						_config.cc_enable_verbose = conf_params['cc_enable_verbose'];
					}
	
					_printVerbose("CookieConsent [config_notice]: recieved_config_settings ", conf_params);
			
					if(conf_params['cc_auto_language'] != undefined && typeof conf_params['cc_auto_language'] == "boolean"){
						_config.cc_auto_language = conf_params['cc_auto_language'];
					}
	
					if(conf_params['cc_theme_css'] != undefined && typeof conf_params['cc_theme_css'] == "string"){
						_config.cc_theme_css = conf_params['cc_theme_css'];
					}

					if(conf_params['cc_delay'] != undefined && typeof conf_params['cc_delay'] == "number"){
						conf_params['cc_delay'] >=0 ? _config.cc_delay = conf_params['cc_delay'] : false;
					}

					if(conf_params['cc_autorun'] != undefined && typeof conf_params['cc_autorun'] == "boolean"){
						_config.cc_autorun = conf_params['cc_autorun'];
					}

					if(conf_params['cc_policy_url'] != undefined && typeof conf_params['cc_policy_url'] == "string"){
						_config.cc_policy_url = conf_params['cc_policy_url'];
					}

					if(conf_params['cc_languages'] != undefined && conf_params['cc_languages'] != null && conf_params['cc_languages'].length > 0){
						/**
						 * Add each defined custom language
						 */
						for(var i=0; i<conf_params['cc_languages'].length; i++){
							
							var lang_index = conf_params['cc_languages'][i]['lang'];
							var lang_content = conf_params['cc_languages'][i];
							
							/**
							 * Check if index alredy exists
							 * if it exists, override content with new values
							 */
							if(_cc_languages.hasOwnProperty(lang_index)){
								
								_printVerbose("CookieConsent [config_notice]: updating_existing_lang = '"+ lang_index +"'");

								/**
								 * Update cookie-consent modal content
								 */
								if(op_mode && typeof lang_content['modal'] != "undefined"){
									if( typeof lang_content['modal']['cc_title'] == "string")
										_cc_languages[lang_index].modal.cc_title = lang_content['modal']['cc_title'];
									if( typeof lang_content['modal']['cc_more_text'] == "string")
										_cc_languages[lang_index].modal.cc_more_text = lang_content['modal']['cc_more_text'];
									if( typeof lang_content['modal']['cc_accept_text'] == "string")
										_cc_languages[lang_index].modal.cc_accept_text = lang_content['modal']['cc_accept_text'];
									if( typeof lang_content['modal']['cc_description'] == "string")
										_cc_languages[lang_index].modal.cc_description = lang_content['modal']['cc_description'];
								}

								/**
								 * Update cookie-consent-policy
								 */
								if(typeof _config.cc_policy_url != "string"){
									if(typeof lang_content['policy'] != "undefined"){

										if(lang_content['policy'].hasOwnProperty('ccp_title'))
											_cc_languages[lang_index].policy.ccp_title = lang_content['policy']['ccp_title'];
		
										if(lang_content['policy'].hasOwnProperty('ccp_save_text'))
											_cc_languages[lang_index].policy.ccp_save_text = lang_content['policy']['ccp_save_text']
										
										if(lang_content['policy'].hasOwnProperty('ccp_blocks')){

											/**
											 * Delete current ccp_blocks content
											 */
											_cc_languages[lang_index].policy.ccp_blocks = [];

											/**
											 * Get all new blocks to add
											 */
											var all_blocks = lang_content['policy']['ccp_blocks'];
								
											for(var x=0; x<all_blocks.length; x++){
												
												var block_tmp = {};
												
												block_tmp.ccb_title = all_blocks[x]['ccb_title'];
												block_tmp.ccb_description = all_blocks[x]['ccb_description'];

												if(all_blocks[x].hasOwnProperty('ccb_switch')){
													var ccb_switch = {};
													ccb_switch.value = all_blocks[x]['ccb_switch']['value'];
													ccb_switch.enabled = all_blocks[x]['ccb_switch']['enabled'];
													ccb_switch.readonly = all_blocks[x]['ccb_switch']['readonly'];
													block_tmp.ccb_switch = ccb_switch;
												}

												_cc_languages[lang_index].policy.ccp_blocks.push(block_tmp);
											}
										}	
									}
								}
							}else{
								/**
								 * Add new language
								 */
								_printVerbose("CookieConsent [config_notice]: adding_new_lang = '"+ lang_index +"'");
								_cc_languages[lang_index] = {};
								/**
								 * Set modal content
								 */
								_cc_languages[lang_index].modal = {};
								_cc_languages[lang_index].modal.cc_title = lang_content['modal']['cc_title'];
								_cc_languages[lang_index].modal.cc_description = lang_content['modal']['cc_description'];
								_cc_languages[lang_index].modal.cc_accept_text = lang_content['modal']['cc_accept_text'];
								_cc_languages[lang_index].modal.cc_more_text = lang_content['modal']['cc_more_text'];

								/**
								 * Set policy content
								 */

								_cc_languages[lang_index].policy = {};
								_cc_languages[lang_index].policy.ccp_blocks = [];
								_cc_languages[lang_index].policy.ccp_title =  lang_content['policy']['ccp_title'];
								_cc_languages[lang_index].policy.ccp_save_text =  lang_content['policy']['ccp_save_text'];
								
								/**
								 * Set all blocks for policy
								 */
								var all_blocks = lang_content['policy']['ccp_blocks'];
								
								for(var j=0; j<all_blocks.length; j++){
									
									var block_tmp = {};
									
									block_tmp.ccb_title = all_blocks[j]['ccb_title'];
									block_tmp.ccb_description = all_blocks[j]['ccb_description'];

									if(all_blocks[j].hasOwnProperty('ccb_switch')){
										var ccb_switch = {};
										ccb_switch.value = all_blocks[j]['ccb_switch']['value'];
										ccb_switch.enabled = all_blocks[j]['ccb_switch']['enabled'];
										ccb_switch.readonly = all_blocks[j]['ccb_switch']['readonly'];
										block_tmp.ccb_switch = ccb_switch;
									}

									_cc_languages[lang_index].policy.ccp_blocks.push(block_tmp);
								}
							}
						}
					}

					if(_config.cc_auto_language){
						_config.cc_current_lang = _getValidatedLanguage(_getBrowserLang());
					}else{
						if(typeof conf_params['cc_current_lang'] == "string"){
							_config.cc_current_lang = conf_params['cc_current_lang'];
						}
					}
				}else{
	
					_printVerbose("CookieConsent [config_notice]: No initial config object found, using default values!");
	
					if(_config.cc_auto_language){
						_config.cc_current_lang = _getValidatedLanguage(_getBrowserLang())
					}
				}
			}catch(ex){
				_printVerbose("CookieConsent [ERROR] => ", ex, true);
			}
		}

		/**
		 * Returns true if object is empty
		 * @param {Object} obj
		 */
		var _isEmpty = function(obj) {
			for(var prop in obj) {
				if(obj.hasOwnProperty(prop))
					return false;
			}
			return true;
		}

		/**
		 * Add event listener to dom object (cross browser function)
		 * @param {Object} elem 
		 * @param {string} event //event type
		 * @param {Object } fn 
		 * @param {boolean} passive
		 */
		var _addEvent = function(elem, event, fn, passive) {
			var passive = passive || false;
		
			if (elem.addEventListener) {
				passive ? elem.addEventListener(event, fn, { capture: true, passive: true }) : elem.addEventListener(event, fn, false);
			} else {
				/**
				 * For old browser, convert "click" and "focus" event to onclick
				 * since the're not always supported
				 */
				if (event == "click" || event == "focus") {
					event = "onclick";
				}
				elem.attachEvent(event, fn);
			}
		}

		/**
		 * Append class to specified dom element
		 * @param {Object} elem 
		 * @param {string} classname 
		 */
		var _addClass = function (elem, classname){
			elem.classList ? elem.classList.add(classname) : elem.className += ' '+classname;
		}

		/**
		 * Remove specified class from dom element
		 * @param {Object} elem 
		 * @param {string} classname 
		 */
		var _removeClass = function (el, className) {
			el.classList ? el.classList.remove(className) : el.className = el.className.replace(new RegExp('(\\s|^)' + className + '(\\s|$)'), ' ');
		}

		/**
		 * Search for all occurrences in webpage and add an onClick listener : 
		 * when clicked => open cookie policy
		 */
		var _addCookiePolicyButtonListener = function(){
			var all_links = document.querySelectorAll('a[data-cc="cc_policy"], button[data-cc="cc_policy"]');
			for(var x=0; x<all_links.length; x++){
				_addEvent(all_links[x], 'click', function(event){
					event.preventDefault ? event.preventDefault() : event.returnValue = false;
					_cookieconsent.show_policy();
				});
			}
		}

		/**
		 * Check if given lang index exists as a defined property inside _config object
		 * If it exists -> desired language is implemented for cookieconsent
		 * Otherwise switch back to default cc_current_lang
		 * @param {string} lang 
		 */
		var _getValidatedLanguage = function(lang){
			if(_cc_languages.hasOwnProperty(lang)) return lang;
			_printVerbose("CookieConsent [lang_notice]: lang '"+lang+"' is not implemented, using default '"+_config.cc_default_lang+"' lang!");
			return _config.cc_default_lang;
		}

		/**
		 * Helper function which prints info (console.log()) only if verbose mode is enabled
		 * @param {object} print_msg 
		 * @param {object} optional_param 
		 */
		var _printVerbose = function(print_msg, optional_param, error){
			!error ? _config.cc_enable_verbose && console.log(print_msg, optional_param || "") : _config.cc_enable_verbose && console.error(print_msg, optional_param || "");
		}

		/**
		 * Given a description (text), set it as innerText inside dom element with given id
		 * @param {string} id id of dom element
		 * @param {string} cc_description innertext to set inside dom element
		 */
		var _setText = function(id, cc_description){
			document.getElementById(id).innerText = cc_description
		};
		
		/**
		 * Given a description (html), set it as innerHTML inside dom element with given id
		 * @param {string} id 
		 * @param {string} cc_description_html 
		 */
		var _setHtml = function(id, cc_description_html){
			document.getElementById(id).innerHTML = cc_description_html
		}
		
		/**
		 * Get current client - browser language
		 * Used when 'cc_auto_language' config property is set to 'true' (boolean)
		 */
		var _getBrowserLang = function(){
			var browser_lang = navigator.language || navigator.browserLanguage;
			browser_lang.length > 2 && (browser_lang = browser_lang[0]+browser_lang[1]);
			_printVerbose("CookieConsent [browser_lang_notice]: detected_browser_lang = '"+ browser_lang + "'");
			return browser_lang.toLowerCase()
		}

		var _createGeneralContainer = function(){
			/**
			 * Create general container
			 */
			var _cc_general_container = document.createElement("div");
			_cc_general_container.id = _config.cc_ids.main_container_id;

			/**
			 * Check if cc_container prop. is configured
			 * If valid, check if it is and id or body
			 */
			if(_config.cc_container != undefined && _config.cc_container != null && typeof _config.cc_container == "string"){
				if(_config.cc_container[0] != "#"){
					document.body.appendChild(_cc_general_container)
				}else{
					/**
					 * Remove '#' character from string
					 * Append cc_modal object inside the specified dom element with id = _config.cc_container
					 */
					var id_without_hashtag = _config.cc_container.substr(1);
					document.getElementById(id_without_hashtag).appendChild(_cc_general_container);
				}
			}
			_general_container_exists = true;
		}

		/**
		 * Generate cookie consent html based on config settings
		*/
		var _createCookieConsentHTML = function(){
			
			/**
			 * Create all cc_modal elems
			 */
			var cc_modal = document.createElement("div");
			var cc_titolo = document.createElement("h1");
			var cc_text = document.createElement("p");
			var cc_btn_container = document.createElement("div");
			var cc_btn_accept = document.createElement("button");

			/**
			 * If cookie-policy url is specified -> create link <a href="..."></a>
			 * otherwise create a button that opens your own custom cookie policy
			 */
			if(_config.cc_policy_url != null && typeof _config.cc_policy_url == 'string'){
				var cc_btn_more = document.createElement("a");
				cc_btn_more.href = _config.cc_policy_url;
			}else{
				var cc_btn_more = document.createElement("button");
				cc_btn_more.setAttribute('type', 'button');
			}

			/**
			 * Set for each of them, their default configured ids
			 */
			cc_modal.id = _config.cc_ids.modal_id;
			cc_titolo.id = _config.cc_ids.modal_title;
			cc_text.id = _config.cc_ids.modal_text;
			cc_btn_container.id = "cc__modal__btns";
			cc_btn_accept.id = _config.cc_ids.modal_accept_btn;
			cc_btn_more.id = _config.cc_ids.modal_more_btn;
			cc_btn_accept.setAttribute('type', 'button');
			
			_addClass(cc_btn_more, "cc__link");
			cc_modal.style.visibility = "hidden";

			// insert cc_title into cc_modal
			cc_modal.insertAdjacentElement('beforeend', cc_titolo);
		
			// insert cc_description into cc_modal
			cc_modal.insertAdjacentElement('beforeend', cc_text);
		
			// insert buttons into cc_btn_container
			cc_btn_container.insertAdjacentElement('beforeend', cc_btn_accept);
			cc_btn_container.insertAdjacentElement('beforeend', cc_btn_more);
			
			// insert btn_container into cc_modal
			cc_modal.insertAdjacentElement('beforeend', cc_btn_container);

			if(!_general_container_exists)
				_createGeneralContainer();
			
			document.getElementById(_config.cc_ids.main_container_id).appendChild(cc_modal);
			_cc_modal_dom = cc_modal;
			_cc_modal_isAttached = true;
		}

		var _createCookieConsentPolicyHTML = function(){

			/**
			 * Create all cc_modal elems
			 */
			var cc_policy_container = document.createElement("div");
			var cc_v_align = document.createElement("div");
			var cc_policy = document.createElement("div");
			var cc_policy_title = document.createElement("h1");
			var cc_policy_header = document.createElement("div");
			var cc_policy_close_btn = document.createElement("button");
			var cc_policy_content = document.createElement("div");
			cc_policy_close_btn.setAttribute('type', 'button');
			/**
			 * Set for each of them, their default configured ids
			 */
			cc_policy_container.id = _config.cc_ids.policy_container_id;
			cc_v_align.id = "cc__valign";
			cc_policy.id = "cc__policy";
			cc_policy_title.id = _config.cc_policy_ids.title;
			cc_policy_header.id = "cc__policy__header";
			cc_policy_content.id = _config.cc_policy_ids.content;
			cc_policy_close_btn.id = _config.cc_ids.policy_close_btn;
			var close_icon = 'x';
			cc_policy_close_btn.innerHTML = close_icon;

			cc_policy_header.appendChild(cc_policy_title);
			cc_policy_header.appendChild(cc_policy_close_btn);
			cc_policy.appendChild(cc_policy_header);
			cc_policy.appendChild(cc_policy_content);
			cc_v_align.appendChild(cc_policy);
			cc_policy_container.appendChild(cc_v_align);

			if(_cc_modal_isAttached){
				_addEvent(document.getElementById(_config.cc_ids.modal_more_btn), 'click', function(){
					_cookieconsent.show_policy(0);
				});
			}

			_addEvent(cc_policy_close_btn, 'click', function(){
				_cookieconsent.hide_policy();
			});

			cc_policy_container.style.visibility = "hidden";

			if(!_general_container_exists)
				_createGeneralContainer();
			
			// insert cc_title into cc_modal
			document.getElementById(_config.cc_ids.main_container_id).appendChild(cc_policy_container);

			_cc_policy_dom = cc_policy_container;
			_cc_policy_isAttached = true;
		}

		var _setCookieConsentPolicyContent = function(){
			
			var all_blocks = _cc_languages[_config.cc_current_lang].policy.ccp_blocks;

			// Get number of blocks with cc_policy_lang as language
			var n_blocks = all_blocks.length;

			// Get cc_policy_dom
			var cc_content_dom = document.getElementById(_config.cc_policy_ids.content);

			// Set cc policy title
			_setText(_config.cc_policy_ids.title, _cc_languages[_config.cc_current_lang].policy.ccp_title);

			// Create cc policy content
			for(var i=0; i<n_blocks; ++i){
				
				// Create title
				var block_section = document.createElement('div');
				var block_title = document.createElement('h2');
				var block_desc = document.createElement('p');

				_addClass(block_section, 'ccp_section');
				_addClass(block_title, 'section_title');
				_addClass(block_desc, 'section_desc');

				// set title and description for each block
				block_title.innerHTML = all_blocks[i].ccb_title;
				block_desc.innerHTML = all_blocks[i].ccb_description;

				block_section.appendChild(block_title);
				block_section.appendChild(block_desc);

				// ... switch
				if(typeof all_blocks[i].ccb_switch !== 'undefined'){
					var block_switch = document.createElement('input');
					block_switch.setAttribute('type', 'checkbox');
					block_switch.setAttribute('value', all_blocks[i].ccb_switch.value);

					_addClass(block_switch, 'sc_toggle');

					if(all_blocks[i].ccb_switch.enabled){
						block_switch.checked = true;
					}

					if(all_blocks[i].ccb_switch.readonly){
						block_switch.disabled = "disabled"
						block_switch.readOnly = true;
					}
					block_section.appendChild(block_switch);
				}

				// append block inside cc_policy dom
				cc_content_dom.appendChild(block_section);
			}

			// Create save preferences button
			var cp_save_btn = document.createElement('button');
			cp_save_btn.setAttribute('type', 'button');
			cp_save_btn.id = _config.cc_policy_ids.save_btn;
			cp_save_btn.innerText = _cc_languages[_config.cc_current_lang].policy.ccp_save_text;

			// Add save preferences button onClick event 
			// Hide both cookie policy and cookie consent
			_addEvent(cp_save_btn, 'click', function(){
				_printVerbose('CookieConsent [cc_policy_notice]: saved_preferences!');
				_cookieconsent.hide_policy();
				_cookieconsent.hide();
				_saveCookiePreferences();
			});

			// append cc_policy to dom
			cc_content_dom.appendChild(cp_save_btn);
		}

		/**
		 * Save cookie based 
		 */
		var _saveCookiePreferences = function(){
			
			// Get all cookiepreferences values saved in cookieconsent policy
			var accepted_cookies = document.querySelectorAll('#cc__policy__content > .ccp_section input.sc_toggle');
			var cc_cookie_level = 'basic';
			
			if(typeof accepted_cookies.length == "number"){
				/**
				 * Reset cookie value
				 */
				cc_cookie_level = '';
				for(var i=0; i<accepted_cookies.length; i++){
					if(accepted_cookies[i].checked){
						cc_cookie_level+=accepted_cookies[i].value+",";
					}
				}
				cc_cookie_level = cc_cookie_level.slice(0, -1);
			}
			_setCookie(_config.cc_cookie_name, "accepted", _config.cc_cookie_expires, 0, 0);
			_setCookie('cc_level', cc_cookie_level, _config.cc_cookie_expires, 0, 0);
		}

		/**
		 * Load .css file for CookieConsent specified via the parameter
		 * @param {string} css_file_path 
		 */
		var _loadCookieConsentCSS = function(css_file_path, callback){
			var link  = document.createElement('link');
			link.rel  = 'stylesheet';
			link.type = 'text/css';
			link.href = css_file_path;
			document.getElementsByTagName('head')[0].appendChild(link);

			if(link.onload){
				link.onload = callback();
			}else{
				callback();
			}

			_printVerbose("CookieConsent [css_notice]: loading_css = '"+ css_file_path + "'");
		}
		
		
		/**
		 * Check if cookieconsent is alredy attached to dom
		 * If not, create one, configure it and attach it to body
		 */
		_cookieconsent.run = function(conf_params){
			if(!document.getElementById(_config.cc_ids.main_container_id)){
				var cc_cookie_value = _getCookie(_config.cc_cookie_name);
				if(cc_cookie_value == undefined || cc_cookie_value == null || cc_cookie_value == ""){
					/**
					 * _setConfig with true param -> config all parameters
					 */
					_setConfig(conf_params, true);
					_loadCookieConsentCSS(_config.cc_theme_css, function(){
						_createCookieConsentHTML();
						_setCookieConsentContent(_config.cc_current_lang);
						
						if (typeof _config.cc_policy_url != "string"){
							_createCookieConsentPolicyHTML();
							_setCookieConsentPolicyContent();
							_addCookiePolicyButtonListener();
						}

						_acceptCookieConsentListener();
						
						if(_config.cc_autorun){
							_cookieconsent.show(_config.cc_delay);
						}
					});
				}else{
					_setConfig(conf_params, false);
					_loadCookieConsentCSS(_config.cc_theme_css, function(){
						if (typeof _config.cc_policy_url != "string"){
							_createCookieConsentPolicyHTML();
							_setCookieConsentPolicyContent();
							_addCookiePolicyButtonListener();
						}
					});
					_printVerbose("CookieConsent [NOTICE]: cookie consent alredy accepted!");
				}
			}else{
				_printVerbose("CookieConsent [NOTICE]: cookie consent alredy attached to body!");
			}
		}

		_cookieconsent.show_policy = function(cc_delay){
			if(_cc_policy_isAttached){
				setTimeout(function() {
					if(_cc_policy_isHidden){
						/**
						 * Make these dom elems, animate-able
						 */
						_addClass(_cc_policy_dom, "cc__anim");
						_addClass(_cc_policy_dom, "cc__show");
						
						_printVerbose("CookieConsent [cookie_policy]: show_cookie_policy");
						_cc_policy_isHidden = false;
					}else{
						_printVerbose("CookieConsent [cookie_policy]: alredy_shown");
					}
				}, typeof cc_delay == "number" && cc_delay > 20 ? cc_delay : 20);
			}else{
				_printVerbose("CookieConsent [cookie_policy]: cookie policy was not initialized!");
			}
		}

		/**
		 * Show cookie consent modal (with delay parameter)
		 * @param {number} cc_delay 
		 */
		_cookieconsent.show = function(cc_delay){
			if(_cc_modal_isAttached){
				setTimeout(function() {
					if(_cc_modal_isHidden){
						/**
						 * Make these dom elems, animate-able
						 */
						_addClass(_cc_modal_dom, "cc__anim");
						
						/**
						 * Show ccmodal
						 */
						_addClass(_cc_modal_dom, "cc__show");
						
						_printVerbose("CookieConsent [cookie_modal]: show_cookie_consent");
						_cc_modal_isHidden = false;
					}else{
						_printVerbose("CookieConsent [cookie_modal]: alredy_shown");
					}
				}, typeof cc_delay == "number" && cc_delay > 20 ? cc_delay : 20);
				
			}else{
				_printVerbose("CookieConsent [cookie_modal]: cookie modal was not initialized!");
			}
		}

		/**
		 * Hide cookie consent (after it has been attached to dom)
		 */
		_cookieconsent.hide = function(){
			if(_cc_modal_isAttached){
				if(!_cc_modal_isHidden){
					_removeClass(document.getElementById(_config.cc_ids.modal_id), "cc__show");
					_cc_modal_isHidden = true;
					_printVerbose("CookieConsent [cookie_modal]: hide_cookie_consent");
				}else{
					_printVerbose("CookieConsent [cookie_modal]: alredy_hidden");
				}
			}else{
				_printVerbose("CookieConsent [cookie_modal]: nothing to hide!");
			}
		}

		_cookieconsent.hide_policy = function(){
			if(_cc_policy_isAttached){
				if(!_cc_policy_isHidden){
					_removeClass(_cc_policy_dom, "cc__show");
					_cc_policy_isHidden = true;
					_printVerbose("CookieConsent [cookie_policy]: hide_cookie_policy");
				}else{
					_printVerbose("CookieConsent [cookie_policy]: alredy_hidden");
				}
			}else{
				_printVerbose("CookieConsent [cookie_policy]: nothing to hide!");
			}
		}

		/**
		 * TODO
		 */
		_cookieconsent.clearCookies = function(){
			var cookie_val = _getCookie(_config.cc_cookie_name);
			if(cookie_val != undefined && cookie_val != null && cookie_val != ""){
				_eraseCookie(_config.cc_cookie_name);
				_printVerbose("CookieConsent [cookie_notice]: cc_cookies erased!");
			}else{
				_printVerbose("CookieConsent [cookie_notice]: cc_cookies not found, nothing to erase!");
			}
		}

		/**
		 * Accept cookie consent listener
		 * Create cookie with val. 'accepted' and then hide cookie-consent
		 */
		var _acceptCookieConsentListener = function(){
			_addEvent(document.getElementById(_config.cc_ids.modal_accept_btn), "click", function(event){
				_cookieconsent.hide();
				_printVerbose("CookieConsent [cookie_consent]: cookie_consent was accepted!");
				_saveCookiePreferences();
			});
		}

		/**
		 * Set a cookie, specifying name, value and expiration time
		 * @param {string} name 
		 * @param {string} value 
		 * @param {number} days 
		 * @param {number} hours 
		 * @param {number} minutes 
		 */
		var _setCookie = function(name, value, days, hours, minutes) {
			var expires = "";
		
			var date = new Date();
			date.setTime(date.getTime() + (1000 * (days * 24 * 60 * 60 + hours * 60 * 60 + minutes * 60)));
			expires = "; expires=" + date.toUTCString();
		
			document.cookie = name + "=" + (value || "") + expires + "; path=/";
			if(location.protocol == "https")
				document.cookie = "tagname = test;secure";

			_printVerbose("CookieConsent [cookie_consent]: cookie "+ name + "='" + value + "' was set!");
		}

		/**
		 * Get cookie value by name
		 * @param {string} a 
		 */
		var _getCookie = function(a) {
			return (a = document.cookie.match("(^|;)\\s*" + a + "\\s*=\\s*([^;]+)")) ? a.pop() : ""
		}

		/**
		 * Delete cookie by namn
		 * @param {string} name 
		 */
		var _eraseCookie = function(name) {   
			document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
		}

		/**
		 * Given a language, set the cookieconsent text content in the same language
		 * @param {string} selected_lang 
		 */
		var _setCookieConsentContent = function(selected_lang){
			// check if selected language is defined in config object
			var lang = _getValidatedLanguage(selected_lang);
			_printVerbose("CookieConsent [cc_lang_notice]: setting cc_current_lang = '"+ lang + "'");
			_setText(_config.cc_ids.modal_title, _cc_languages[lang].modal.cc_title);
			_setHtml(_config.cc_ids.modal_text, _cc_languages[lang].modal.cc_description);
			_setText(_config.cc_ids.modal_accept_btn, _cc_languages[lang].modal.cc_accept_text);
			_setText(_config.cc_ids.modal_more_btn, _cc_languages[lang].modal.cc_more_text);
			_cc_modal_isAttached = true;
		}

		return _cookieconsent;
	};

	/**
	 * Make CookieConsent object accessible globally
	 */
	if(typeof(scope.initCookieConsent === 'undefined')){

		scope.initCookieConsent = function(){
			var cc = CookieConsent();

			try {
				delete scope.initCookieConsent; 
			}catch(e) { 
				scope.initCookieConsent = undefined; 
			}
	
			return cc;
		};
	}
})(window);