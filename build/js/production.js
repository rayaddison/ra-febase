/* onMediaQuery v1 | Copyright 2012, Springload | www.springload.co.nz | Released under the MIT license. */
var MQ=function(b){b=b||{};b.init=function(a){this.callbacks=[];this.context="";if("undefined"!==typeof a)for(i=0;i<a.length;i++)this.addQuery(a[i]);this.addEvent(window,"resize",b.listenForChange,b);this.listenForChange()};b.listenForChange=function(){var a;window.getComputedStyle&&(a=window.getComputedStyle(document.body,":after").getPropertyValue("content"),null!=a&&(a=a.replace(/['"]/g,""),a!==this.context&&this.triggerCallbacks(a),this.context=a))};b.addQuery=function(a){if(!(null==a||void 0== a))return this.callbacks.push(a),this.callbacks[this.callbacks.length-1]};b.removeQuery=function(a){if(!(null==a||void 0==a))for(var c=-1;-1<(c=this.callbacks.indexOf(a));)this.callbacks.splice(c,1)};b.triggerCallbacks=function(a){var c,b;for(c=0;c<this.callbacks.length;c++)b=this.callbacks[c].callback,this.callbacks[c].context===a&&void 0!==b&&b()};b.addEvent=function(a,b,d,e){null==a||void 0==a||(a.addEventListener?a.addEventListener(b,function(){d.call(e)},!1):a.attachEvent?a.attachEvent("on"+ b,function(){d.call(e)}):a["on"+b]=function(){d.call(e)})};return b}(MQ||{});
/*!
 * Retina.js v1.1.0
 *
 * Copyright 2013 Imulus, LLC
 * Released under the MIT license
 *
 * Retina.js is an open source script that makes it easy to serve
 * high-resolution images to devices with retina displays.
 */
(function() {

    var root = (typeof exports == 'undefined' ? window : exports);

    root.Retina = Retina;

    function Retina() {}

    Retina.init = function(context) {
        if (context == null) context = root;

        var existing_onload = context.onload || new Function;

        context.onload = function() {
            var images = document.getElementsByTagName("img"),
                retinaImages = [],
                i, image;
            for (i = 0; i < images.length; i++) {
                image = images[i];
                if (!!!image.getAttributeNode('data-no-retina')) {
                    if (image.src) {
                        retinaImages.push(new RetinaImage(image));
                    }
                }

            }
            existing_onload();
        }
    };

    Retina.isRetina = function() {
        var mediaQuery = "(-webkit-min-device-pixel-ratio: 1.5),\
                      (min--moz-device-pixel-ratio: 1.5),\
                      (-o-min-device-pixel-ratio: 3/2),\
                      (min-resolution: 1.5dppx)";

        if (root.devicePixelRatio > 1)
            return true;

        if (root.matchMedia && root.matchMedia(mediaQuery).matches)
            return true;

        return false;
    };

    root.RetinaImagePath = RetinaImagePath;

    function RetinaImagePath(path) {
        this.path = path;
        this.at_2x_path = path.replace(/\.\w+$/, function(match) {
            return "@2x" + match;
        });
    }
    RetinaImagePath.confirmed_paths = [];

    RetinaImagePath.prototype.at_2x_path_loads = function(callback) {
        var variant = new Image();
        variant.onload = function() {
            return callback(true);
        }
        variant.onerror = function() {
            return callback(false);
        }
        variant.src = this.at_2x_path;
    }

    RetinaImagePath.prototype.check_2x_variant = function(callback) {
        var that = this;
        if (RetinaImagePath.confirmed_paths.indexOf(this.at_2x_path) != -1) {
            return callback(true);
        } else {
            this.at_2x_path_loads(function(wasLoaded) {
                if (wasLoaded) RetinaImagePath.confirmed_paths.push(that.at_2x_path);
                return callback(wasLoaded);
            });
        }
    }
    function RetinaImage(el) {
        this.el = el;
        this.path = new RetinaImagePath(this.el.getAttribute('src'));
        var that = this;
        this.path.check_2x_variant(function(hasVariant) {
            if (hasVariant) that.swap();
        });
    }
    root.RetinaImage = RetinaImage;

    RetinaImage.prototype.swap = function(path) {
        if (typeof path == 'undefined') path = this.path.at_2x_path;

        var that = this;

        function load() {
            if (!that.el.complete) {
                setTimeout(load, 5);
            } else {
                that.el.setAttribute('width', that.el.offsetWidth);
                that.el.setAttribute('height', that.el.offsetHeight);
                that.el.setAttribute('src', path);
            }
        }
        load();
    }
    if (Retina.isRetina()) {
        Retina.init(root);
    }

})();
/* Respond.js: min/max-width media query polyfill. (c) Scott Jehl. MIT Lic. j.mp/respondjs  */
(function( w ){

	"use strict";

	//exposed namespace
	var respond = {};
	w.respond = respond;

	//define update even in native-mq-supporting browsers, to avoid errors
	respond.update = function(){};

	//define ajax obj
	var requestQueue = [],
		xmlHttp = (function() {
			var xmlhttpmethod = false;
			try {
				xmlhttpmethod = new w.XMLHttpRequest();
			}
			catch( e ){
				xmlhttpmethod = new w.ActiveXObject( "Microsoft.XMLHTTP" );
			}
			return function(){
				return xmlhttpmethod;
			};
		})(),

		//tweaked Ajax functions from Quirksmode
		ajax = function( url, callback ) {
			var req = xmlHttp();
			if (!req){
				return;
			}
			req.open( "GET", url, true );
			req.onreadystatechange = function () {
				if ( req.readyState !== 4 || req.status !== 200 && req.status !== 304 ){
					return;
				}
				callback( req.responseText );
			};
			if ( req.readyState === 4 ){
				return;
			}
			req.send( null );
		},
		isUnsupportedMediaQuery = function( query ) {
			return query.replace( respond.regex.minmaxwh, '' ).match( respond.regex.other );
		};

	//expose for testing
	respond.ajax = ajax;
	respond.queue = requestQueue;
	respond.unsupportedmq = isUnsupportedMediaQuery;
	respond.regex = {
		media: /@media[^\{]+\{([^\{\}]*\{[^\}\{]*\})+/gi,
		keyframes: /@(?:\-(?:o|moz|webkit)\-)?keyframes[^\{]+\{(?:[^\{\}]*\{[^\}\{]*\})+[^\}]*\}/gi,
		comments: /\/\*[^*]*\*+([^/][^*]*\*+)*\//gi,
		urls: /(url\()['"]?([^\/\)'"][^:\)'"]+)['"]?(\))/g,
		findStyles: /@media *([^\{]+)\{([\S\s]+?)$/,
		only: /(only\s+)?([a-zA-Z]+)\s?/,
		minw: /\(\s*min\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/,
		maxw: /\(\s*max\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/,
		minmaxwh: /\(\s*m(in|ax)\-(height|width)\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/gi,
		other: /\([^\)]*\)/g
	};

	//expose media query support flag for external use
	respond.mediaQueriesSupported = w.matchMedia && w.matchMedia( "only all" ) !== null && w.matchMedia( "only all" ).matches;

	//if media queries are supported, exit here
	if( respond.mediaQueriesSupported ){
		return;
	}

	//define vars
	var doc = w.document,
		docElem = doc.documentElement,
		mediastyles = [],
		rules = [],
		appendedEls = [],
		parsedSheets = {},
		resizeThrottle = 30,
		head = doc.getElementsByTagName( "head" )[0] || docElem,
		base = doc.getElementsByTagName( "base" )[0],
		links = head.getElementsByTagName( "link" ),

		lastCall,
		resizeDefer,

		//cached container for 1em value, populated the first time it's needed
		eminpx,

		// returns the value of 1em in pixels
		getEmValue = function() {
			var ret,
				div = doc.createElement('div'),
				body = doc.body,
				originalHTMLFontSize = docElem.style.fontSize,
				originalBodyFontSize = body && body.style.fontSize,
				fakeUsed = false;

			div.style.cssText = "position:absolute;font-size:1em;width:1em";

			if( !body ){
				body = fakeUsed = doc.createElement( "body" );
				body.style.background = "none";
			}

			// 1em in a media query is the value of the default font size of the browser
			// reset docElem and body to ensure the correct value is returned
			docElem.style.fontSize = "100%";
			body.style.fontSize = "100%";

			body.appendChild( div );

			if( fakeUsed ){
				docElem.insertBefore( body, docElem.firstChild );
			}

			ret = div.offsetWidth;

			if( fakeUsed ){
				docElem.removeChild( body );
			}
			else {
				body.removeChild( div );
			}

			// restore the original values
			docElem.style.fontSize = originalHTMLFontSize;
			if( originalBodyFontSize ) {
				body.style.fontSize = originalBodyFontSize;
			}


			//also update eminpx before returning
			ret = eminpx = parseFloat(ret);

			return ret;
		},

		//enable/disable styles
		applyMedia = function( fromResize ){
			var name = "clientWidth",
				docElemProp = docElem[ name ],
				currWidth = doc.compatMode === "CSS1Compat" && docElemProp || doc.body[ name ] || docElemProp,
				styleBlocks	= {},
				lastLink = links[ links.length-1 ],
				now = (new Date()).getTime();

			//throttle resize calls
			if( fromResize && lastCall && now - lastCall < resizeThrottle ){
				w.clearTimeout( resizeDefer );
				resizeDefer = w.setTimeout( applyMedia, resizeThrottle );
				return;
			}
			else {
				lastCall = now;
			}

			for( var i in mediastyles ){
				if( mediastyles.hasOwnProperty( i ) ){
					var thisstyle = mediastyles[ i ],
						min = thisstyle.minw,
						max = thisstyle.maxw,
						minnull = min === null,
						maxnull = max === null,
						em = "em";

					if( !!min ){
						min = parseFloat( min ) * ( min.indexOf( em ) > -1 ? ( eminpx || getEmValue() ) : 1 );
					}
					if( !!max ){
						max = parseFloat( max ) * ( max.indexOf( em ) > -1 ? ( eminpx || getEmValue() ) : 1 );
					}

					// if there's no media query at all (the () part), or min or max is not null, and if either is present, they're true
					if( !thisstyle.hasquery || ( !minnull || !maxnull ) && ( minnull || currWidth >= min ) && ( maxnull || currWidth <= max ) ){
						if( !styleBlocks[ thisstyle.media ] ){
							styleBlocks[ thisstyle.media ] = [];
						}
						styleBlocks[ thisstyle.media ].push( rules[ thisstyle.rules ] );
					}
				}
			}

			//remove any existing respond style element(s)
			for( var j in appendedEls ){
				if( appendedEls.hasOwnProperty( j ) ){
					if( appendedEls[ j ] && appendedEls[ j ].parentNode === head ){
						head.removeChild( appendedEls[ j ] );
					}
				}
			}
			appendedEls.length = 0;

			//inject active styles, grouped by media type
			for( var k in styleBlocks ){
				if( styleBlocks.hasOwnProperty( k ) ){
					var ss = doc.createElement( "style" ),
						css = styleBlocks[ k ].join( "\n" );

					ss.type = "text/css";
					ss.media = k;

					//originally, ss was appended to a documentFragment and sheets were appended in bulk.
					//this caused crashes in IE in a number of circumstances, such as when the HTML element had a bg image set, so appending beforehand seems best. Thanks to @dvelyk for the initial research on this one!
					head.insertBefore( ss, lastLink.nextSibling );

					if ( ss.styleSheet ){
						ss.styleSheet.cssText = css;
					}
					else {
						ss.appendChild( doc.createTextNode( css ) );
					}

					//push to appendedEls to track for later removal
					appendedEls.push( ss );
				}
			}
		},
		//find media blocks in css text, convert to style blocks
		translate = function( styles, href, media ){
			var qs = styles.replace( respond.regex.comments, '' )
					.replace( respond.regex.keyframes, '' )
					.match( respond.regex.media ),
				ql = qs && qs.length || 0;

			//try to get CSS path
			href = href.substring( 0, href.lastIndexOf( "/" ) );

			var repUrls = function( css ){
					return css.replace( respond.regex.urls, "$1" + href + "$2$3" );
				},
				useMedia = !ql && media;

			//if path exists, tack on trailing slash
			if( href.length ){ href += "/"; }

			//if no internal queries exist, but media attr does, use that
			//note: this currently lacks support for situations where a media attr is specified on a link AND
				//its associated stylesheet has internal CSS media queries.
				//In those cases, the media attribute will currently be ignored.
			if( useMedia ){
				ql = 1;
			}

			for( var i = 0; i < ql; i++ ){
				var fullq, thisq, eachq, eql;

				//media attr
				if( useMedia ){
					fullq = media;
					rules.push( repUrls( styles ) );
				}
				//parse for styles
				else{
					fullq = qs[ i ].match( respond.regex.findStyles ) && RegExp.$1;
					rules.push( RegExp.$2 && repUrls( RegExp.$2 ) );
				}

				eachq = fullq.split( "," );
				eql = eachq.length;

				for( var j = 0; j < eql; j++ ){
					thisq = eachq[ j ];

					if( isUnsupportedMediaQuery( thisq ) ) {
						continue;
					}

					mediastyles.push( {
						media : thisq.split( "(" )[ 0 ].match( respond.regex.only ) && RegExp.$2 || "all",
						rules : rules.length - 1,
						hasquery : thisq.indexOf("(") > -1,
						minw : thisq.match( respond.regex.minw ) && parseFloat( RegExp.$1 ) + ( RegExp.$2 || "" ),
						maxw : thisq.match( respond.regex.maxw ) && parseFloat( RegExp.$1 ) + ( RegExp.$2 || "" )
					} );
				}
			}

			applyMedia();
		},

		//recurse through request queue, get css text
		makeRequests = function(){
			if( requestQueue.length ){
				var thisRequest = requestQueue.shift();

				ajax( thisRequest.href, function( styles ){
					translate( styles, thisRequest.href, thisRequest.media );
					parsedSheets[ thisRequest.href ] = true;

					// by wrapping recursive function call in setTimeout
					// we prevent "Stack overflow" error in IE7
					w.setTimeout(function(){ makeRequests(); },0);
				} );
			}
		},

		//loop stylesheets, send text content to translate
		ripCSS = function(){

			for( var i = 0; i < links.length; i++ ){
				var sheet = links[ i ],
				href = sheet.href,
				media = sheet.media,
				isCSS = sheet.rel && sheet.rel.toLowerCase() === "stylesheet";

				//only links plz and prevent re-parsing
				if( !!href && isCSS && !parsedSheets[ href ] ){
					// selectivizr exposes css through the rawCssText expando
					if (sheet.styleSheet && sheet.styleSheet.rawCssText) {
						translate( sheet.styleSheet.rawCssText, href, media );
						parsedSheets[ href ] = true;
					} else {
						if( (!/^([a-zA-Z:]*\/\/)/.test( href ) && !base) ||
							href.replace( RegExp.$1, "" ).split( "/" )[0] === w.location.host ){
							// IE7 doesn't handle urls that start with '//' for ajax request
							// manually add in the protocol
							if ( href.substring(0,2) === "//" ) { href = w.location.protocol + href; }
							requestQueue.push( {
								href: href,
								media: media
							} );
						}
					}
				}
			}
			makeRequests();
		};

	//translate CSS
	ripCSS();

	//expose update for re-running respond later on
	respond.update = ripCSS;

	//expose getEmValue
	respond.getEmValue = getEmValue;

	//adjust on resize
	function callMedia(){
		applyMedia( true );
	}

	if( w.addEventListener ){
		w.addEventListener( "resize", callMedia, false );
	}
	else if( w.attachEvent ){
		w.attachEvent( "onresize", callMedia );
	}
})(this);
"use strict";
var $ = this.jQuery.noConflict(),
raBase;

/////////////////////////////////////////////
/////// Breakpoint Image replacement ////////
/////////////////////////////////////////////

// Set the image variables for the different breakpoints. See markup for the image sets.
var queries = [
    {
        context: 'break__3',
        callback: function() {
            $('img').each(function(index) {
                var break__3 = $(this).attr('src');
                $(this).attr('src', break__3);
            });
        }
    }, {
        context: 'break__0',
        callback: function() {
            $('img').each(function(index) {
                var break__0 = $(this).data('break__0');
                $(this).attr('src', break__0);
            });
        }
    }, {
        context: 'break__1',
        callback: function() {
            $('img').each(function(index) {
                var break__1 = $(this).data('break__1');
                $(this).attr('src', break__1);
            });
        }
    }, {
        context: 'break__2',
        callback: function() {
            $('img').each(function(index) {
                var break__2 = $(this).data('break__2');
                $(this).attr('src', break__2);
            });
        }
    }
];

MQ.init(queries);

if(raBase == undefined) {

    raBase = {
        Page: {
            segments: [],
            init: function() {
                raBase.Page.segments = window.location.href.split("/");

                $(".tableGapAnalysis td").each(function() {
                    if ($(this).text() == "No") $(this).css('background', '#FFA8A8');
                    if ($(this).text() == "Yes") $(this).css('background', '#BFFCBD');
                });

                ///////////////////////////////////////
                ////////// Behaviour resets ///////////
                ///////////////////////////////////////

                // Prevent # anchors jumping page to top

                $('a[href="#"]').click(function(e) {
                        e.preventDefault();
                });

                 // Remove the preload class from the body. This prevents CSS animations and should only apply on page load. */

                $("body").removeClass("preload");

                ///////////////////////////////////////
                ////////  Write JS below here /////////
                ///////////////////////////////////////

            }
        }
    };

}

raBase.Page.init();
window.Modernizr=function(e,t,n){function A(e){f.cssText=e}function O(e,t){return A(p.join(e+";")+(t||""))}function M(e,t){return typeof e===t}function _(e,t){return!!~(""+e).indexOf(t)}function D(e,t){for(var r in e){var i=e[r];if(!_(i,"-")&&f[i]!==n){return t=="pfx"?i:true}}return false}function P(e,t,r){for(var i in e){var s=t[e[i]];if(s!==n){if(r===false)return e[i];if(M(s,"function")){return s.bind(r||t)}return s}}return false}function H(e,t,n){var r=e.charAt(0).toUpperCase()+e.slice(1),i=(e+" "+v.join(r+" ")+r).split(" ");if(M(t,"string")||M(t,"undefined")){return D(i,t)}else{i=(e+" "+m.join(r+" ")+r).split(" ");return P(i,t,n)}}function B(){i["input"]=function(n){for(var r=0,i=n.length;r<i;r++){w[n[r]]=!!(n[r]in l)}if(w.list){w.list=!!(t.createElement("datalist")&&e.HTMLDataListElement)}return w}("autocomplete autofocus list placeholder max min multiple pattern required step".split(" "));i["inputtypes"]=function(e){for(var r=0,i,s,u,a=e.length;r<a;r++){l.setAttribute("type",s=e[r]);i=l.type!=="text";if(i){l.value=c;l.style.cssText="position:absolute;visibility:hidden;";if(/^range$/.test(s)&&l.style.WebkitAppearance!==n){o.appendChild(l);u=t.defaultView;i=u.getComputedStyle&&u.getComputedStyle(l,null).WebkitAppearance!=="textfield"&&l.offsetHeight!==0;o.removeChild(l)}else if(/^(search|tel)$/.test(s)){}else if(/^(url|email)$/.test(s)){i=l.checkValidity&&l.checkValidity()===false}else{i=l.value!=c}}b[e[r]]=!!i}return b}("search tel url email datetime date month week time datetime-local number range color".split(" "))}var r="2.7.1",i={},s=true,o=t.documentElement,u="modernizr",a=t.createElement(u),f=a.style,l=t.createElement("input"),c=":)",h={}.toString,p=" -webkit- -moz- -o- -ms- ".split(" "),d="Webkit Moz O ms",v=d.split(" "),m=d.toLowerCase().split(" "),g={svg:"http://www.w3.org/2000/svg"},y={},b={},w={},E=[],S=E.slice,x,T=function(e,n,r,i){var s,a,f,l,c=t.createElement("div"),h=t.body,p=h||t.createElement("body");if(parseInt(r,10)){while(r--){f=t.createElement("div");f.id=i?i[r]:u+(r+1);c.appendChild(f)}}s=["&#173;",'<style id="s',u,'">',e,"</style>"].join("");c.id=u;(h?c:p).innerHTML+=s;p.appendChild(c);if(!h){p.style.background="";p.style.overflow="hidden";l=o.style.overflow;o.style.overflow="hidden";o.appendChild(p)}a=n(c,e);if(!h){p.parentNode.removeChild(p);o.style.overflow=l}else{c.parentNode.removeChild(c)}return!!a},N=function(t){var n=e.matchMedia||e.msMatchMedia;if(n){return n(t).matches}var r;T("@media "+t+" { #"+u+" { position: absolute; } }",function(t){r=(e.getComputedStyle?getComputedStyle(t,null):t.currentStyle)["position"]=="absolute"});return r},C=function(){function r(r,i){i=i||t.createElement(e[r]||"div");r="on"+r;var s=r in i;if(!s){if(!i.setAttribute){i=t.createElement("div")}if(i.setAttribute&&i.removeAttribute){i.setAttribute(r,"");s=M(i[r],"function");if(!M(i[r],"undefined")){i[r]=n}i.removeAttribute(r)}}i=null;return s}var e={select:"input",change:"input",submit:"form",reset:"form",error:"img",load:"img",abort:"img"};return r}(),k={}.hasOwnProperty,L;if(!M(k,"undefined")&&!M(k.call,"undefined")){L=function(e,t){return k.call(e,t)}}else{L=function(e,t){return t in e&&M(e.constructor.prototype[t],"undefined")}}if(!Function.prototype.bind){Function.prototype.bind=function(t){var n=this;if(typeof n!="function"){throw new TypeError}var r=S.call(arguments,1),i=function(){if(this instanceof i){var e=function(){};e.prototype=n.prototype;var s=new e;var o=n.apply(s,r.concat(S.call(arguments)));if(Object(o)===o){return o}return s}else{return n.apply(t,r.concat(S.call(arguments)))}};return i}}y["flexbox"]=function(){return H("flexWrap")};y["flexboxlegacy"]=function(){return H("boxDirection")};y["canvas"]=function(){var e=t.createElement("canvas");return!!(e.getContext&&e.getContext("2d"))};y["canvastext"]=function(){return!!(i["canvas"]&&M(t.createElement("canvas").getContext("2d").fillText,"function"))};y["webgl"]=function(){return!!e.WebGLRenderingContext};y["touch"]=function(){var n;if("ontouchstart"in e||e.DocumentTouch&&t instanceof DocumentTouch){n=true}else{T(["@media (",p.join("touch-enabled),("),u,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(e){n=e.offsetTop===9})}return n};y["geolocation"]=function(){return"geolocation"in navigator};y["postmessage"]=function(){return!!e.postMessage};y["websqldatabase"]=function(){return!!e.openDatabase};y["indexedDB"]=function(){return!!H("indexedDB",e)};y["hashchange"]=function(){return C("hashchange",e)&&(t.documentMode===n||t.documentMode>7)};y["history"]=function(){return!!(e.history&&history.pushState)};y["draganddrop"]=function(){var e=t.createElement("div");return"draggable"in e||"ondragstart"in e&&"ondrop"in e};y["websockets"]=function(){return"WebSocket"in e||"MozWebSocket"in e};y["rgba"]=function(){A("background-color:rgba(150,255,150,.5)");return _(f.backgroundColor,"rgba")};y["hsla"]=function(){A("background-color:hsla(120,40%,100%,.5)");return _(f.backgroundColor,"rgba")||_(f.backgroundColor,"hsla")};y["multiplebgs"]=function(){A("background:url(https://),url(https://),red url(https://)");return/(url\s*\(.*?){3}/.test(f.background)};y["backgroundsize"]=function(){return H("backgroundSize")};y["borderimage"]=function(){return H("borderImage")};y["borderradius"]=function(){return H("borderRadius")};y["boxshadow"]=function(){return H("boxShadow")};y["textshadow"]=function(){return t.createElement("div").style.textShadow===""};y["opacity"]=function(){O("opacity:.55");return/^0.55$/.test(f.opacity)};y["cssanimations"]=function(){return H("animationName")};y["csscolumns"]=function(){return H("columnCount")};y["cssgradients"]=function(){var e="background-image:",t="gradient(linear,left top,right bottom,from(#9f9),to(white));",n="linear-gradient(left top,#9f9, white);";A((e+"-webkit- ".split(" ").join(t+e)+p.join(n+e)).slice(0,-e.length));return _(f.backgroundImage,"gradient")};y["cssreflections"]=function(){return H("boxReflect")};y["csstransforms"]=function(){return!!H("transform")};y["csstransforms3d"]=function(){var e=!!H("perspective");if(e&&"webkitPerspective"in o.style){T("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",function(t,n){e=t.offsetLeft===9&&t.offsetHeight===3})}return e};y["csstransitions"]=function(){return H("transition")};y["fontface"]=function(){var e;T('@font-face {font-family:"font";src:url("https://")}',function(n,r){var i=t.getElementById("smodernizr"),s=i.sheet||i.styleSheet,o=s?s.cssRules&&s.cssRules[0]?s.cssRules[0].cssText:s.cssText||"":"";e=/src/i.test(o)&&o.indexOf(r.split(" ")[0])===0});return e};y["generatedcontent"]=function(){var e;T(["#",u,"{font:0/0 a}#",u,':after{content:"',c,'";visibility:hidden;font:3px/1 a}'].join(""),function(t){e=t.offsetHeight>=3});return e};y["video"]=function(){var e=t.createElement("video"),n=false;try{if(n=!!e.canPlayType){n=new Boolean(n);n.ogg=e.canPlayType('video/ogg; codecs="theora"').replace(/^no$/,"");n.h264=e.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/,"");n.webm=e.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,"")}}catch(r){}return n};y["audio"]=function(){var e=t.createElement("audio"),n=false;try{if(n=!!e.canPlayType){n=new Boolean(n);n.ogg=e.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,"");n.mp3=e.canPlayType("audio/mpeg;").replace(/^no$/,"");n.wav=e.canPlayType('audio/wav; codecs="1"').replace(/^no$/,"");n.m4a=(e.canPlayType("audio/x-m4a;")||e.canPlayType("audio/aac;")).replace(/^no$/,"")}}catch(r){}return n};y["localstorage"]=function(){try{localStorage.setItem(u,u);localStorage.removeItem(u);return true}catch(e){return false}};y["sessionstorage"]=function(){try{sessionStorage.setItem(u,u);sessionStorage.removeItem(u);return true}catch(e){return false}};y["webworkers"]=function(){return!!e.Worker};y["applicationcache"]=function(){return!!e.applicationCache};y["svg"]=function(){return!!t.createElementNS&&!!t.createElementNS(g.svg,"svg").createSVGRect};y["inlinesvg"]=function(){var e=t.createElement("div");e.innerHTML="<svg/>";return(e.firstChild&&e.firstChild.namespaceURI)==g.svg};y["smil"]=function(){return!!t.createElementNS&&/SVGAnimate/.test(h.call(t.createElementNS(g.svg,"animate")))};y["svgclippaths"]=function(){return!!t.createElementNS&&/SVGClipPath/.test(h.call(t.createElementNS(g.svg,"clipPath")))};for(var j in y){if(L(y,j)){x=j.toLowerCase();i[x]=y[j]();E.push((i[x]?"":"no-")+x)}}i.input||B();i.addTest=function(e,t){if(typeof e=="object"){for(var r in e){if(L(e,r)){i.addTest(r,e[r])}}}else{e=e.toLowerCase();if(i[e]!==n){return i}t=typeof t=="function"?t():t;if(typeof s!=="undefined"&&s){o.className+=" "+(t?"":"no-")+e}i[e]=t}return i};A("");a=l=null;(function(e,t){function c(e,t){var n=e.createElement("p"),r=e.getElementsByTagName("head")[0]||e.documentElement;n.innerHTML="x<style>"+t+"</style>";return r.insertBefore(n.lastChild,r.firstChild)}function h(){var e=y.elements;return typeof e=="string"?e.split(" "):e}function p(e){var t=f[e[u]];if(!t){t={};a++;e[u]=a;f[a]=t}return t}function d(e,n,r){if(!n){n=t}if(l){return n.createElement(e)}if(!r){r=p(n)}var o;if(r.cache[e]){o=r.cache[e].cloneNode()}else if(s.test(e)){o=(r.cache[e]=r.createElem(e)).cloneNode()}else{o=r.createElem(e)}return o.canHaveChildren&&!i.test(e)&&!o.tagUrn?r.frag.appendChild(o):o}function v(e,n){if(!e){e=t}if(l){return e.createDocumentFragment()}n=n||p(e);var r=n.frag.cloneNode(),i=0,s=h(),o=s.length;for(;i<o;i++){r.createElement(s[i])}return r}function m(e,t){if(!t.cache){t.cache={};t.createElem=e.createElement;t.createFrag=e.createDocumentFragment;t.frag=t.createFrag()}e.createElement=function(n){if(!y.shivMethods){return t.createElem(n)}return d(n,e,t)};e.createDocumentFragment=Function("h,f","return function(){"+"var n=f.cloneNode(),c=n.createElement;"+"h.shivMethods&&("+h().join().replace(/[\w\-]+/g,function(e){t.createElem(e);t.frag.createElement(e);return'c("'+e+'")'})+");return n}")(y,t.frag)}function g(e){if(!e){e=t}var n=p(e);if(y.shivCSS&&!o&&!n.hasCSS){n.hasCSS=!!c(e,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}"+"mark{background:#FF0;color:#000}"+"template{display:none}")}if(!l){m(e,n)}return e}var n="3.7.0";var r=e.html5||{};var i=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;var s=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;var o;var u="_html5shiv";var a=0;var f={};var l;(function(){try{var e=t.createElement("a");e.innerHTML="<xyz></xyz>";o="hidden"in e;l=e.childNodes.length==1||function(){t.createElement("a");var e=t.createDocumentFragment();return typeof e.cloneNode=="undefined"||typeof e.createDocumentFragment=="undefined"||typeof e.createElement=="undefined"}()}catch(n){o=true;l=true}})();var y={elements:r.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",version:n,shivCSS:r.shivCSS!==false,supportsUnknownElements:l,shivMethods:r.shivMethods!==false,type:"default",shivDocument:g,createElement:d,createDocumentFragment:v};e.html5=y;g(t)})(this,t);i._version=r;i._prefixes=p;i._domPrefixes=m;i._cssomPrefixes=v;i.mq=N;i.hasEvent=C;i.testProp=function(e){return D([e])};i.testAllProps=H;i.testStyles=T;i.prefixed=function(e,t,n){if(!t){return H(e,"pfx")}else{return H(e,t,n)}};o.className=o.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(s?" js "+E.join(" "):"");return i}(this,this.document)
