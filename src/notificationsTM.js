/**
 *
 * notificationTM.js v1.0.0
 * https://github.com/abFx
 * inspired by http://www.codrops.com notificationsFx
 * 
 */

 ( function( window ){

 	'use strict';

 	var currentDoc = window.document.documentElement,
 		support = { animations : Modernizr.cssanimations };

 	/**
	 * extend obj function
	 */	
	function extend( a, b ){
		for( var key in b ){
			if( b.hasOwnProperty( key ) ){
				a[ key ] = b[ key ];
			}
		}
		return a;
	}

	/**
	 * find element by class name
	 */	
	function findByClass( el, classTitle ){
		var elems = document.getElementsByTagName(el), i, currentElement;
	    for ( i in elems ) {
	        if((' ' + elems[i].className + ' ').indexOf(' ' + classTitle + ' ') > -1) {
	            currentElement = elems[i];
	        }
	    }
		return currentElement;
	}

	/**
	 * Notification function
	 */
	function Notification( options ){
		this.options = extend( {}, this.options );
		extend( this.options, options );
		this.init();
	}

	/**
	 * Notification options
	 */
	Notification.prototype.options = {
		// element to attach current notification element, defaults to body
		container : document.body,
		// current notification message
		message : "It's a trap!",
		// layouts type for notification, only bar for now
		layout: "bar",
		// effects for specified layouts:
		// for now only slide-top, slide-bottom slide support
		// defaults slide-top
		effect: "slide-top",
		// type of notification: notice, warning, error
		// adds a class nmsg-notice, nmsg-waning, nmsg-error
		type: "notice",
		// close button icon class, defaults to have gumbyframework icons
		// defaults to i tag element
		closeIcon : "fi-x",
		// message icon class, defaults to have gumbyframework
		messageIcon : "fi-like",
		// if user doesn't close notification it will hide automatically by 
		// the following time
		closeTimeOut : 5000,
		// callbacks
		onClose : function(){ return false; },
		onOpen : function(){ return false; }

	}

	/**
	 * Initialize function
	 * Create current container and vars
	 */
	Notification.prototype.init = function(){
		//create notification html structure
		this.nmsg = document.createElement( 'div' );
		this.nmsg.className = 'nmsg-box nmsg-' + this.options.layout + ' nmsg-effect-' + this.options.effect + ' nmsg-type-'+ this.options.type;
		var msgContainer = '<div class="nmsg-box-shadow"></div>';
		msgContainer += '<div class="nmsg-box-container">';
		msgContainer += '<span class="icon"><i class="' + this.options.messageIcon +'"></i></span>';
		msgContainer += this.options.message;
		msgContainer += '</div>';
		msgContainer += '<a class="nmsg-close"><i class="' + this.options.closeIcon +'"></i></a>';
		msgContainer += '</div>';
		this.nmsg.innerHTML = msgContainer;

		//append to container element
		this.options.container.insertBefore( this.nmsg, this.options.container.firstChild );

		//hide notification after timeout if nothing happens
		var self = this;
		//save timeout interval
		this.autoHide = setTimeout( function() {
			//verify notification is on display, has shown
			if( self.active ){
				self.hide();
			}
		}, this.options.closeTimeOut );

		//add listeners or events
		this._addListeners();

		//start effect setup
		this.effects[this.options.effect].init(this.nmsg);
		
	}

	/**
	 * add listeners
	 */
	Notification.prototype._addListeners = function() {
		var self = this;
		//find first notification and add close listener
		this.nmsg.querySelector( '.nmsg-close' ).addEventListener( 'click', function() {
			self.hide();
		} );
	};

	/**
	 * show notification
	 */
	Notification.prototype.show = function() {
		var self = this;
		//set current notification as active
		this.active = true;
		classie.remove( this.nmsg, 'nmsg-hide' );
		classie.add( this.nmsg, 'nmsg-show' );
		//show current notification by effect
		this.effects[this.options.effect].show(this.nmsg);
	}

	/**
	 * hide notification
	 */
	Notification.prototype.hide = function() {
		var self = this;
		//set current notification as inactive
		this.active = false;
		clearTimeout( this.autoHide );
		classie.remove( this.nmsg, 'nmsg-show' );
		//hide current notification by effect
		this.effects[this.options.effect].hide(this.nmsg, self);
	}

	/**
	 * Notifications effects notification
	 */
	Notification.prototype.effects = {
		'slide-top' : {
			init: function( el ){
				//start at hidden position
				TweenMax.to( el, 0, {
					x : 0,
					y : '-100%',
				    z : 0,
				} );
				//scale down icon
				TweenMax.to( findByClass('span', 'icon'), 0, { scale: 0, opacity: 0 });
			},
			show : function( el ){
				TweenMax.to( el, 1, {
					x : 0,
					y : '0%',
				    z : 0,
				    ease : "Quint.easeInOut",
				} );

				setTimeout(function(){
					TweenMax.to( findByClass('span', 'icon'), 0.25, { 
						scale: 1.25, 
						opacity: 1,
						ease : "Expo.easeOut",
					});
				}, 700);
			},
			hide : function( el , parent){
				setTimeout( function() {
					classie.add( el, 'nmsg-hide' );
					//start animation
					TweenMax.to( el, 0.5, {
						x : 0,
						y : '-100%',
					    z : 0,
					    ease : "Power.easeIn",
					    onComplete: notificationIsHidden
					} );
				}, 25);
				// after animation remove element from dom
				var notificationIsHidden = function(){
					parent.options.container.removeChild( el );
					parent.options.onClose();
				}
			}
		}
	}
	/**
	 * add to global namespace
	 */
	window.Notification = Notification;

 } )( window );
