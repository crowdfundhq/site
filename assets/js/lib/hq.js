/* The site tools, used by app.js functions and from HTML templates, available from window.hq
 * Contains utilities for strings, ajax, forms, classes, json, upload, scrolling and social sharing */

(function(){
  if(!window.hq){ window.hq = {}; }

  // Makes all textareas enable tabs
  var tabifyAll = function (){
    var tas = document.getElementsByTagName('textarea');
    var i;
    for(i = 0; i < tas.length; i++){
      tabify(tas[i]);
    }
  }
  window.hq.tabifyAll = tabifyAll;

  // Decodes encoded HTML
  function htmlDecode(text){
    // text.replace(/&amp;/g, '&');
    var entities = [
      ['apos', '\''],
      ['amp', '&'],
      ['lt', '<'],
      ['gt', '>']
    ];
    for (var i = 0, max = entities.length; i < max; ++i){
      text = text.replace(new RegExp('&'+entities[i][0]+';', 'g'), entities[i][1]);
    }
    return text;
  };
  window.hq.htmlDecode = htmlDecode;

  // Check if this is IE
  var isIE = function (){
    return "ActiveXObject" in window;
  };
  window.hq.isIE = isIE;

  // Safe console
  if (typeof console === "undefined"){
    console = {};
    console.log = function(){
      return;
    }
  };
  window.console = console;

  // Adding trim if not supported
  if(typeof String.prototype.trim !== 'function'){
    String.prototype.trim = function(){
      return this.replace(/^\s+|\s+$/g, '');
    }
  };

  // Capitalize string
  String.prototype.capitalize = function(){
    return this.charAt(0).toUpperCase() + this.slice(1);
  };

  // Makes a parameterized string
  String.prototype.toParam = function(){
    return this.toLowerCase().trim().replace(/[^a-z\d ]/g, "").replace(/\s{1,}/g, "-").replace(/-{1,}$/g, "");
  };

  // Create a parser for links
  String.prototype.toURL = function(){
    var a = document.createElement('a');
    a.href = this;
    return a;
  };

  // Adds a parameter to the end of a string
  String.prototype.addParam = function(p){
    return this + ((!/[?&]/.test(this)) ? '?' : '&') + p;
  };

  // Rounds the decimal number to a given precision
  function toFixed(value, precision){
    var power = Math.pow(10, precision || 0);
    return String(Math.round(value * power) / power);
  };
  window.hq.toFixed = toFixed;

  // Parameterize object
  var toParams = function (obj){
    var str = "";
    for (var key in obj){
      if (str != "") str += "&";
      str += key + "=" + obj[key];
    }
    return str;
  };
  window.hq.toParams = toParams;

  // Serialize Form
  var serialize = function(c){if(!c||c.nodeName!=="FORM"){return}var b,a,d=[];for(b=c.elements.length-1;b>=0;b=b-1){if(c.elements[b].name===""){continue}switch(c.elements[b].nodeName){case"INPUT":switch(c.elements[b].type){case"text":case"hidden":case"password":case"button":case"reset":case"submit":d.push(c.elements[b].name+"="+encodeURIComponent(c.elements[b].value));break;case"checkbox":case"radio":if(c.elements[b].checked){d.push(c.elements[b].name+"="+encodeURIComponent(c.elements[b].value))}break;case"file":break}break;case"TEXTAREA":d.push(c.elements[b].name+"="+encodeURIComponent(c.elements[b].value));break;case"SELECT":switch(c.elements[b].type){case"select-one":d.push(c.elements[b].name+"="+encodeURIComponent(c.elements[b].value));break;case"select-multiple":for(a=c.elements[b].options.length-1;a>=0;a=a-1){if(c.elements[b].options[a].selected){d.push(c.elements[b].name+"="+encodeURIComponent(c.elements[b].options[a].value))}}break}break;case"BUTTON":switch(c.elements[b].type){case"reset":case"submit":case"button":d.push(c.elements[b].name+"="+encodeURIComponent(c.elements[b].value));break}break}}return d.join("&")};
  window.hq.serialize = serialize;

  // Enable tabs for textareas. Called with hq.tabify(id)
  HTMLTextAreaElement.prototype.getCaretPosition=function(){return this.selectionStart};HTMLTextAreaElement.prototype.setCaretPosition=function(a){this.selectionStart=a;this.selectionEnd=a;this.focus()};HTMLTextAreaElement.prototype.hasSelection=function(){if(this.selectionStart==this.selectionEnd){return false}else{return true}};HTMLTextAreaElement.prototype.getSelectedText=function(){return this.value.substring(this.selectionStart,this.selectionEnd)};HTMLTextAreaElement.prototype.setSelection=function(b,a){this.selectionStart=b;this.selectionEnd=a;this.focus()};var tabify=function(b){var a=typeof b==="object"?b:document.getElementById(b);a.onkeydown=function(d){if(d.keyCode==9){var c;c=a.getCaretPosition()+"    ".length;a.value=a.value.substring(0,a.getCaretPosition())+"    "+a.value.substring(a.getCaretPosition(),a.value.length);a.setCaretPosition(c);return false}if(d.keyCode==8){if(a.value.substring(a.getCaretPosition()-4,a.getCaretPosition())=="    "){var c;c=a.getCaretPosition()-3;a.value=a.value.substring(0,a.getCaretPosition()-3)+a.value.substring(a.getCaretPosition(),a.value.length);a.setCaretPosition(c)}}if(d.keyCode==37){var c;if(a.value.substring(a.getCaretPosition()-4,a.getCaretPosition())=="    "){c=a.getCaretPosition()-3;a.setCaretPosition(c)}}if(d.keyCode==39){var c;if(a.value.substring(a.getCaretPosition()+4,a.getCaretPosition())=="    "){c=a.getCaretPosition()+3;a.setCaretPosition(c)}}}};window.hq.tabify=tabify;

  // Checks if a dom element has a certain class
  var hasClass = function(ele, cls){
    if(typeof ele === 'string'){ ele = document.getElementById(ele); }
    return ele.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)'));
  };
  window.hq.hasClass = hasClass;

  // Adds a class to a dom element
  var addClass = function(ele, cls){
    if(typeof ele === 'string'){ ele = document.getElementById(ele); }
    if (!this.hasClass(ele,cls)) ele.className += " "+cls;
  };
  window.hq.addClass = addClass;

  // Removes a class from a dom element
  var removeClass = function(ele, cls){
    if(typeof ele === 'string'){ ele = document.getElementById(ele); }
    if (hasClass(ele,cls)){
      var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
      ele.className=ele.className.replace(reg,' ');
    }
  };
  window.hq.removeClass = removeClass;

  // Toggle class
  var toggleClass = function (ele,cls){
    if(typeof ele === 'string'){ ele = document.getElementById(ele); }
    if(hq.hasClass(ele, cls)){
      hq.removeClass(ele, cls);
    } else {
      hq.addClass(ele, cls);
    }
  };
  window.hq.toggleClass = toggleClass;

  // Show
  var show = function(el){
    if(typeof el === 'string'){ el = document.getElementById(el); }
    if(el){ el.style.display = 'block';}
  };
  window.hq.show = show;

  // Hide
  var hide = function(el){
    if(typeof el === 'string'){ el = document.getElementById(el); }
    if(el){ el.style.display = 'none';}
  };
  window.hq.hide = hide;

  // Toggle show/hide
  var toggle = function(el){
    if(typeof el === 'string'){ el = document.getElementById(el); }
    if(el){
      el.style.display = (el.style.display === '' || el.style.display === 'none') ? 'block' : 'none';
    }
  };
  window.hq.toggle = toggle;

  // Does JSON-P calls. Gets JSON from another server and inserts it into a script tag
  var getJSON = function (url, success){
    var ud = 'json' + (Math.random()*100).toString().replace(/\./g,'');
    window[ud] = function(o){
      success && success(o);
    };
    document.body.appendChild((function(){
      var s = document.createElement('script');
      s.async = true;
      s.src = url.replace('callback=?', 'callback=' + ud);
      return s;
    })());
  }
  window.hq.getJSON = getJSON;

  // Does ajax calls to url(string). Options: method(string), data(string), success(fn), error(fn)
  var ajax = function(url, options){
    if(!options) options = {};
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4){
        if(xhr.status == 200 || xhr.status == 204){
          if(options.success) options.success(xhr.responseText);
        } else {
          if(options.error) options.error(xhr);
        }
      }
    }

    // Setting up the method
    if(options.method){
      options.method = options.method.toLowerCase();
    } else {
      options.method = 'get'
    }

    // Pad to prevent caching if get request and using IE
    if(hq.isIE() && options.method === 'get'){
      url = url.addParam('t=' + new Date().getTime());
    }

    if(!options.json){
      options.json = false;
      // Adding faker variable to url to avoid browser caching
      url = url.addParam('_pjax');
    }

    if(!options.async){
      options.async = true;
    }

    xhr.open(options.method, url, options.async);

    if(options.method === 'post' && options.data){
      xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
    }

    // AJAX header
    if(!options.json){
      xhr.setRequestHeader('X-AJAX', 'true');
      xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    }

    xhr.send(options.data);

    return xhr;
  };
  window.hq.ajax = ajax;

  // Uploading a file via ajax. el: the file field, field: the target input field for the result
  var upload = function(el, field, options){

    var xhr = new XMLHttpRequest()
    , form = el.parentNode
    , url = form.getAttribute('data-action')
    , formData = new FormData()
    , file, spinner, error, r, f;

    // Default options
    if(!options){
      options = {};
    }

    // The parameter name passed to the server
    if(!options.param){
      options.param = "datafile";
    }

    // The id of the file field
    if(!options.file){
      options.file = ".upload-form-file";
    }
    file = form.querySelector(options.file);

    if(!options.spinner){
      options.spinner = ".spinner";
    }
    spinner = form.querySelector(options.spinner);

    // Show spinner
    spinner.style.visibility = 'visible';

    // The input field to place the url
    field = document.getElementById(field);

    // The error field
    error = form.querySelector('.field_error');
    error.innerHTML = '';
    hq.hide(error);

    // Find the file
    f = file.files[0];

    // File is empty
    if(!f){
      spinner.style.visibility = 'hidden';
      file.click();
      return false;
    }

    // Validate the image size
    if(f.size >= 10000000){
      if(site && site.campaign_files_max_file_size){
        error.innerHTML = t('campaign_files_max_file_size') + " 10 MB";
      } else {
        error.innerHTML = "Max file size is 10 MB";
      }

      hq.show(error);
      spinner.style.visibility = 'hidden';
      return false;
    }

    // Add the file
    formData.append(options.param, f);

    // Send the file via ajax
    xhr.open("post", url, true);
    xhr.send(formData);

    // Check the response status
    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4 && xhr.status == 200){
        r = JSON.parse(xhr.responseText);
        if(r.url){
          field.value = r.url;
          hq.toggleUploadForm(form);
          hq.updatePreview(field);
        } else if(r.error){
          error.innerHTML = r.error;
          hq.show(error);
        }
        // Hide spinner
        spinner.style.visibility = 'hidden';
      }
    }
  };
  window.hq.upload = upload;

  // Determine whether the url is an image
  var isImage = function (url){
    return url.match(/http[s]?:\/\/.+(\.(jpg|jpeg|png|gif|bmp))$/i);
  };
  window.hq.isImage = isImage;

  // Posts the form and returns with a function
  var postFunction = function (form, fn){
    hq.ajax(form.action, {
      method: 'post',
      data: hq.serialize(form),
      success: function(data){
        fn(data);
      }
    });
  };
  window.hq.postFunction = postFunction;

  // Load Javascript url into script tag
  var loadJs = function (url, callback){
    var script = document.createElement('script');
    script.src = url;
    // then bind the event to the callback function
    if(script.addEventListener){
      script.addEventListener("load", callback, false);
    } else if(script.readyState){
      script.onreadystatechange = callback;
    }
    // add the script tag to the head
    document.head.appendChild(script);
  };
  window.hq.loadJs = loadJs;

  // Load CSS url into link tag
  var loadCss = function (url){
    // Don't load it if it's already there
    if(document.querySelector("link[href='" + url + "']")) return;
    // adding the style tag to the head
    var link = document.createElement('link');
    link.type = 'text/css';
    link.href = url;
    link.rel = 'stylesheet';
    // fire the loading
    document.head.appendChild(link);
  };
  window.hq.loadCss = loadCss;

  // Load Google Web Font
  var loadWebFont = function(name){
    var id = name.replace(':', '_').toLowerCase();
    // Stop if it already exists
    if(document.getElementById(id)) return;

    WebFontConfig = {
      google: { families: [ name ] }
    };
    (function(){
      var wf = document.createElement('script');
      wf.id = id;
      wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
        '://ajax.googleapis.com/ajax/libs/webfont/1.5.0/webfont.js';
      wf.type = 'text/javascript';
      wf.async = 'true';
      var s = document.getElementsByTagName('script')[0];
      s.parentNode.insertBefore(wf, s);
    })();
  }
  window.hq.loadWebFont = loadWebFont;

  // Load a resource into a dom element
  var load = function (url, el){
    hq.ajax(url, {
      success: function(data){
        el.value = data;
      }
    });
  };
  window.hq.load = load;

  // Find the next dom element
  var nextSibling = function nextSibling(n){
    x = n.nextSibling;
    while (x.nodeType!=1){
      x = x.nextSibling;
    }
    return x;
  };
  window.hq.nextSibling = nextSibling;

  // Usage: fade.init('fade', 1, 50) // fade in the "fade" element to 50% transparency
  //        fade.init('fade', 1)     // fade out the "fade" element
  var fade = function(){
    return{
      init:function(el, flag, target){
        this.elem = el;
        clearInterval(this.elem.si);
        this.target = target ? target : flag ? 100 : 0;
        this.flag = flag || -1;
        this.alpha = this.elem.style.opacity ? parseFloat(this.elem.style.opacity) * 100 : 0;
        this.elem.si = setInterval(function(){fade.tween()}, 20);
      },
      tween:function(){
        if(this.alpha == this.target){
          clearInterval(this.elem.si);
        } else {
          var value = Math.round(this.alpha + ((this.target - this.alpha) * .05)) + (1 * this.flag);
          this.elem.style.opacity = value / 100;
          this.elem.style.filter = 'alpha(opacity=' + value + ')';
          this.alpha = value;
        }
      }
    }
  }();
  window.hq.fade = fade;

  // Load the Facebook Script
  var loadFacebook = function (){
    (function(d, s, id){ var js, fjs = d.getElementsByTagName(s)[0];if (d.getElementById(id)) return;js = d.createElement(s);js.id = id;js.src = "//connect.facebook.net/en_US/all.js#xfbml=1&appId="+site.facebook;fjs.parentNode.insertBefore(js, fjs);}(document, 'script', 'facebook-jssdk'));
  };
  window.hq.loadFacebook = loadFacebook;

  // Load the Twitter Script
  var loadTwitter = function (){
    !function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");
  };
  window.hq.loadTwitter = loadTwitter;

  // Load the Pinterest Script
  var loadPinterest = function (){
    (function(d){var f = d.getElementsByTagName('SCRIPT')[0], p = d.createElement('SCRIPT');p.type = 'text/javascript';p.async = true;p.src = 'http://assets.pinterest.com/js/pinit.js';f.parentNode.insertBefore(p, f);}(document));
  }
  window.hq.loadPinterest = loadPinterest;

  // Feature check for browser compatibility
  var browserSupported = function (feature){
    // Check for supported browser
    if(!feature){
      var warning = document.createElement("div");
      warning.className = 'alert browser-warning';
      warning.innerHTML = "Your browser is not supported. Please upgrade to a newer browser that supports HTML5.";
      warning.style.textAlign = 'center';
      document.body.appendChild(warning);
    }
  }

  // Parser for URI
  var parseURI = function(url){
    var a = document.createElement('a'); a.href = url; return a;
  }
  window.hq.parseURI = parseURI;

  // Animated scroll
  var toy = function(id, options){
    // defaults
    if(typeof options === 'undefined') options = {};
    if(!options.ms) options.ms = 7;         // Rate of steps (ms)
    if(!options.px) options.px = 40;        // Pixels per step (px)
    if(!options.min) options.min = 10;      // Minimum step size (px)
    if(!options.top) options.top = 130;     // Where to kick in easing (px)
    if(!options.dec) options.rate = 0.5;    // Rate of easing (0..1)
    if(!options.off) options.off = 35;      // Offset before stop (px)

    var el = document.getElementById(id || 'pricing'), t, r;

    function step(){
      r = el.getBoundingClientRect();
      if(r.top <= options.top){
        options.px = 3;
      }
      if(r.top < options.off){
        clearInterval(t);
      } else {
        scrollTo(0, pageYOffset + options.px);
      }
    };
    t = setInterval(step, options.ms);
  };
  window.hq.toy = toy;

}());
