/* The main Javascript library, available from window.hq */

(function(){
  if(!window.hq){ window.hq = {}; }

  // Determine if this is mobile or not
  var isMobile = function(){
    var windowWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    return windowWidth <= 960 && window.Mob ? true : false;
  };
  window.hq.isMobile = isMobile;

  // Check if dialog is open
  var dialogOpen = function(){
    !!document.getElementById('dialog');
  };
  window.hq.dialogOpen = dialogOpen;

  // Display campaign form upload box
  var toggleUploadForm = function(el){
    var f = typeof el === 'string' ? document.getElementById(el) : el
      , error = f.querySelector('.field_error');

    // Setup
    hq.toggle(f);
    error.innerHTML = '';
    hq.hide(error);

    // Show "form"
    hq.toggleClass(f, 'visible');
  };
  window.hq.toggleUploadForm = toggleUploadForm;

  // Load the image in the text into the preview box, el is the form
  var updatePreview = function(el){
    var preview = el.getAttribute('data-preview');
    if(preview){
      preview = document.getElementById(preview);
    }
    // Just return if preview not found
    if(!preview){ return; }

    var frame = preview.querySelector('.preview_frame');

    if(el.value.trim() !== ''){
      hq.ajax('/campaign/image', {
        method: 'post',
        data: "val="+encodeURIComponent(el.value),
        success: function(data){
          var image = new Image();
          image.src = JSON.parse(data);
          frame.innerHTML = '';
          frame.appendChild(image);
        }
      });
    } else {
      // Clear preview frame if no URL
      frame.innerHTML = '';
    }
  };
  window.hq.updatePreview = updatePreview;

  // Hide the flash message
  var hideFlash = function(){
    var flash = document.getElementById('flash');
    if(flash){ flash.textContent = ''; }
  };
  window.hq.hideFlash = hideFlash;

  // Clear all application cookies
  var clearSession = function(){
    cookies.delete('redirect');
    cookies.delete('rtype');
    cookies.delete('referer');
    cookies.delete('dialog');
  };
  window.hq.clearSession = clearSession;

  // Close the dialog window
  var closeDialog = function(){
    // Close overlay
    var overlay = document.getElementById("overlay"),
    url = window.reloadURL || window.location.href;
    overlay.style.display = "none";
    document.body.style.overflow = "";

    // Clear session
    hq.clearSession();

    // Set up reload
    if(window.reload){
      window.reload = false;
      window.reloadURL = null;
      window.location.href = url;
    } else {
      overlay.querySelector("#center").innerHTML = "";
    }

    if(isMobile()){ Mob.toggleContainerCrop(true); }
    hq.removeClass(document.body, 'show_dialog');
  };
  window.hq.closeDialog = closeDialog;

  // Open dialog overlay
  var initDialog = function(){
    hq.hideFlash();
    var overlay = document.getElementById('overlay');
    overlay.style.display = 'block';
    overlay.scrollTop = 0;
    document.body.style.overflow = 'hidden';
    var center = overlay.querySelector("#center");
    center.innerHTML = '';

    return center;
  };
  window.hq.initDialog = initDialog;

  // Load the HTML dialog
  var loadDialog = function(el){
    var url = el.href;
    cookies.set('referer', window.location.href);

    if(!url){ url = el;}

    hq.addClass(document.body, 'show_dialog');
    hq.fetch(url, hq.initDialog());

    // Do Google analytics tracking
    if(window._gaq){
      _gaq.push(["_trackPageview", hq.parseURI(url).pathname]);
    }

    if(isMobile()){
      Mob.toggleNavigation(true);
      Mob.toggleSearch(true);

      setTimeout(function(){
        Mob.toggleContainerCrop(true);
      }, 50); //need delay because of toggleNavigation and toggleSearch timeout
    }
  };
  window.hq.loadDialog = loadDialog;

  // Post a form from a dialog via ajax
  var postDialog = function(form){
    var params = hq.serialize(form);
    var center = hq.initDialog();
    post(form.action, center, params);
  };
  window.hq.postDialog = postDialog;

  // General post ajax method
  var post = function(url, el, params){
    if(!el) el = document.getElementById('content');
    hq.ajax(url, {
      method:'post',
      data: params,
      success: function(data){

        // Redirect based on the response and where you came from
        var redirect = cookies.get('redirect'), rtype = cookies.get('rtype');

        if(data === ''){
          hq.closeDialog();
          if(!redirect){ window.location.reload(true); return};

          if(!rtype){ window.location.href = redirect; return};

          // Execute script on redirect or redirect to dialog
          if(rtype === 'script'){
            cookies.set('script', redirect);
          } else if(rtype === 'load'){
            cookies.set('dialog', redirect);
          }
          // Reload location
          window.location.reload(true);

        } else if(data[0] === '/'){
          // Redirect to URL
          window.location.replace(data);

        } else {
          // No redirect, just update current page
          if(!dialogOpen){scrollTo(0, 0)};
          el.innerHTML = data;
          loadScripts();
        }
      }
    });
  };
  window.hq.post = post;

  // Post data to URL and insert into 'el'
  var postVal = function(url, el, btn, fn){
    var d = el ? "val="+encodeURIComponent(el.value) : null;
    hq.ajax(url, {
      method: 'post',
      data: d,
      success: function(data){
        if(el) el.value = data;
        if(btn) hq.flash(btn);
        if(fn) fn.call();
      }
    });
  };
  window.hq.postVal = postVal;

  // Run all scripts in script tags with the 'loadscript' class
  // Used when loading or posting dialogs
  var loadScripts = function(){
    // Check for loadscript
    var scripts = document.getElementsByClassName("loadscript");
    var i, s;
    for(var i = 0; i < scripts.length; i++){
      s = scripts[i];
      if(!s.loaded){
        if(!s.getAttribute('data-repeat')){ s.loaded = true; }
        eval(s.textContent);
      }
    }
  };
  window.hq.loadScripts = loadScripts;

  // Fetch content via ajax get 'url' and insert into 'el'
  // Options are 'async' and callback success function
  var fetch = function(url, el, async, fn){
    if(!el) el = document.getElementById('content');
    hq.ajax(url, {
      success: function(data){
        // Redirect based on data
        if(data === ""){
          window.location.reload(true);
        } else if(data[0] === '/'){
          // Redirect to URL
          window.location.replace(data);
        } else {
          if(el) el.innerHTML = data;
          if(fn) fn(data);
          loadScripts();
        }
      },
      async: async
    });
  };
  window.hq.fetch = fetch;

  // Short cut for fetching something synchronized
  var fetchSync = function(url, el){
    hq.fetch(url, el, false);
  };
  window.hq.fetchSync = fetchSync;

  // Used to open a dialog when you need to log in
  // Will set up cookies for fetching the requested dialog
  var transitLoad = function(el){
    var link = document.getElementById('login-link');
    cookies.set('redirect', el.href);

    // Load the dialog
    if(link && !site.authorized){
      cookies.set('rtype', 'load');
      hq.loadDialog(link);
    } else {
      hq.loadDialog(el);
    }
  };
  window.hq.transitLoad = transitLoad;

  // Used when you need to log in before entering a page
  var transit = function(el){
    var link = document.getElementById('login-link');
    cookies.set('redirect', el.href);

    // Load the dialog
    if(link && !site.authorized){
      cookies.delete('rtype');
      hq.loadDialog(link);
    } else {
      window.location.href = el.href;
    }
  };
  window.hq.transit = transit;

  // Set up markdown editor
  var setMarkdown = function(editorId){
    var converter1 = Markdown.getSanitizingConverter();
    var editor1;
    if(editorId !== 'default'){
      editor1 = new Markdown.Editor(converter1, editorId);
    } else {
      editor1 = new Markdown.Editor(converter1);
    }
    editor1.run();
    return editor1;
  };
  window.hq.setMarkdown = setMarkdown;

  // Set title for the current page
  var setTitle = function(title, subtitle, taglineTitle){
    // Set document title
    var docTitle = (title && title.length > 0) ? title : site.title;
    docTitle += " | " + (subtitle && subtitle.length > 0 ? subtitle : site.subtitle);
    document.title = hq.htmlDecode(docTitle.replace(/(<([^>]+)>)/ig,""));

    // Set title
    var tagline = document.getElementById('tagline');
    var h1 = tagline.querySelector('h1');
    if(taglineTitle && taglineTitle.length > 0){
      title = taglineTitle;
    }
    if(!title || title.length === 0) title = '&nbsp;';
    h1.innerHTML = hq.htmlDecode(title);

    // Set subtitle
    var h2 = tagline.querySelector('h2');
    if(!subtitle || subtitle.length === 0) subtitle = '&nbsp;'
    h2.innerHTML = hq.htmlDecode(subtitle);
  };
  window.hq.setTitle = setTitle;

  // Show a ok sign for a few seconds
  var flash = function(el){
    var img = document.createElement('i');
    img.setAttribute('class', 'icon-ok-sign green');
    img.style.position = 'absolute';
    img.style.left = '-12px';
    img.style.top = '-18px';
    img.style.opacity = 8/10;
    img.style.filter = 'alpha(opacity=' + 8*10 + ')';
    el.parentNode.insertBefore(img, el.nextSibling);
    hq.fade.init(img, 1);
    setTimeout(function(){ hq.fade.init(img, 0);}, 2000);
    setTimeout(function(){ img.parentNode.removeChild(img);}, 2200);
  };
  window.hq.flash = flash;

  // Run before page routes
  var pre = function(ctx, next){
    if(window._gaq) _gaq.push(['_trackPageview']);
    hq.hideFlash();
    hq.closeDialog();
    next();
  };
  window.hq.pre = pre;

  // Called from page routes to simplify
  var route = function(ctx, key, cache, load){
    var content = document.getElementById('content');
    if(!content){ content = document.getElementById('container') };
    key = 'ctx.state.' + key;

    var cached = eval(key);
    if(cached){
      content.innerHTML = cached;
      hq.loadScripts();
      if(cache){ cache()};
    } else {
      hq.fetch(ctx.path, null, false, function(data){
        eval(key + ' = data');
        scrollTo(0,0);
        if(load){ load()};
      });
    }
  };
  window.hq.route = route;

  // Updating the contribution box
  var setVal = function(el){
    var input = document.getElementById('contribution_amount')
      , amount = parseInt(el.getAttribute('data-amount'));

    // Avoiding NaN and making sure values are sane
    if(isNaN(amount)) amount = input.amountEntered || input.value;

    // Make sure the amount is correct
    if(input.amountEntered && typeof amount !== 'string' && input.amountEntered > amount){
      input.value = input.amountEntered;
    } else {
      input.value = amount;
    }
  };
  window.hq.setVal = setVal;

  // Contribution new mark as amount changed, account for NaN
  var setAmountEntered = function(el){
    var disabled = true;
    if(disabled) return true;

    // Support decimal amounts.
    var v = parseFloat(el.value.replace(',', '.', 'g'));
    if(isNaN(v)){
      v = '';
    } else {
      v = toFixed(v, 2);
    }
    el.value = v;
    el.amountEntered = v === '' ? undefined : v;
  };
  window.hq.setAmountEntered = setAmountEntered;

  // Fetching the campaign page tabs (About, Updates, Comments...)
  var fetchTab = function(url){
    hq.ajax(url, {
      success: function(data){
        document.getElementById('campaign_data').innerHTML = data;
        items = document.getElementById('campaign_nav').getElementsByTagName('a');
        for (var j = 0; j < items.length; j++){
          items[j].className = '';
        }
        var el = document.getElementById(getTabId(url));
        el.className = 'selected';

        // Update counts
        var id = getTabId(url);
        var el = document.getElementById(id);
        if(id === 'about_view'){
          hq.getDataCount();
        } else {
          var count = el.querySelector("span[class='count']");
          if(count && (id === 'updates_view' || id === 'comments_view')){
            count.textContent = getCount();
          }
        }
        // Reload scripts
        hq.loadScripts();
      }
    });
  };
  window.hq.fetchTab = fetchTab;

  // Post the data for comments and updates on the campaign page
  var postTab = function(form){
    var input = form.querySelector('textarea');
    if(input.value.trim().length > 0){
      var params = hq.serialize(form);
      hq.saveComment(form.action, params);
      hq.closeDialog();
    } else {
      input.focus();
      input.value = '';
    }
  };
  window.hq.postTab = postTab;

  // Same as above, used on thank you page
  var postComment = function(form){
    var input = form.querySelector('textarea');
    if(input.value.trim().length > 0){
      var params = hq.serialize(form);
      hq.ajax(form.action, {
        method:'post',
        data: params,
        success: function(data){
          hideCommentInput(form);
        }
      });
    } else {
      input.focus();
      input.value = '';
    }
  };
  window.hq.postComment = postComment;

  // Used on thank you page for hiding comment input field after commenting
  var hideCommentInput = function(form){
    if (!form) form = document.querySelector('form.thank-you-form');
    var ty = document.querySelector('.thank-you-confirmation');
    ty.style.display = 'block';
    form.style.display = 'none';
    cookies.set('comment', window.contribution.id);
  };
  window.hq.hideCommentInput = hideCommentInput;

  // Saving edits for site campaign comments and updates
  var saveComment = function(url, params){
    hq.ajax(url, {
      method:'post',
      data: params,
      success: function(data){
        var el = document.getElementById('comments_view');
        if(el){ el.click()};
      }
    });
  };
  window.hq.saveComment = saveComment;

  // Helper for comments and updates
  var deleteTab = function(form, id){
    var el;
    hq.ajax(form.action, {
      method: 'post',
      data: hq.serialize(form),
      success: function(data){
        hq.closeDialog();
        el = document.getElementById(id);
        if(el){ el.click()};
      }
    });
  };

  // Deleting comments in site campaigns
  var deleteComment = function(form){
    deleteTab(form, 'comments_view');
  };
  window.hq.deleteComment = deleteComment;

  // Deleting updates in site campaigns
  var deleteUpdate = function(form){
    deleteTab(form, 'updates_view');
  };
  window.hq.deleteUpdate = deleteUpdate;

  // Getting the tab id for site campaigns
  var getTabId = function(url){
    var id = url.split('/');
    return id[id.length-1] + "_view";
  };
  window.hq.getTabId = getTabId;

  // Getting the comment and update count for site campaigns
  var getCount = function(){
    return document.getElementById("total_entries").value;
  };
  window.hq.getCount = getCount;

  // Used to toggle the categories drop down when enabled
  var toggleMenuCategories = function(a){
    var el = a.parentNode.querySelector("#category-dropdown");
    var style = el.style;
    style.display = (style.display === '' || style.display === 'none') ? 'block' : 'none';
    hq.toggleClass(a, 'active');
    return false;
  };
  window.hq.toggleMenuCategories = toggleMenuCategories;

  // Toggle visibility for commitments and rewards
  var toggleVisibility = function(el){
    var value = el.checked ? 'true' : 'false';
    hq.ajax(el.getAttribute('data-url'), {
      method: 'post',
      data: "val=" + value
    });
  };
  window.hq.toggleVisibility = toggleVisibility;

  // Save campaign via ajax from the campaign form
  var saveCampaign = function(btn){
    var data = hq.serialize(btn.form);

    hq.ajax(btn.form.action, {
      method: 'post',
      data: data,
      success: function(data){
        window.reload = true;
        window.reloadURL = data;
        // Update link if title changed
        btn.form.action = data;
        if(btn) hq.flash(btn);
      },
      error: function(){
        alert("Error: Couldn't save. Please try again.");
      }
    });
  };
  hq.saveCampaign = saveCampaign;

  // Getting the facebook count via json-p
  var getFacebookCount = function(el, url){
    var endpoint = "https://graph.facebook.com/" + encodeURIComponent(url) + "?callback=?", count = 0;
    hq.getJSON(endpoint, function(data){
      if(data && data.share && data.share.share_count){ count = data.share.share_count;}
      el.textContent = count;
    });
  };

  // Getting the pinterest count via json-p
  var getPinterestCount = function(el, url){
    var endpoint = "https://api.pinterest.com/v1/urls/count.json?callback=?&url=" + encodeURIComponent(url), count = 0;
    hq.getJSON(endpoint, function(data){
      if(data && data.count){ count = data.count;}
      el.textContent = count;
    });
  };

  // Set up all sharing counts
  var getDataCount = function(){
    var els = document.getElementsByClassName('share-count'), i = 0, type;
    for(;i < els.length;i++){
      type = els[i].getAttribute('data-type');
      if(type === 'facebook'){
        getFacebookCount(els[i], els[i].getAttribute('data-url'));
      } else if(type === 'pinterest'){
        getPinterestCount(els[i], els[i].getAttribute('data-url'));
      }
    }
  };
  window.hq.getDataCount = getDataCount;

  // Load more items (i.e. from contribution tab on campaign page)
  // Supports pagination via data-list, data-count, data-page, data-per-page attributes
  var loadMore = function(el){
    var list = document.getElementById(el.getAttribute('data-list'));
    var count = parseInt(el.getAttribute('data-count'));

    var page = parseInt(el.getAttribute('data-page'));
    if(isNaN(page) || page < 2){ page = 2; }

    var per_page = parseInt(el.getAttribute('data-per-page'));
    if(isNaN(per_page) || per_page < 1){ per_page = 20; }

    // Get and insert the next data
    hq.ajax(el.href + '?page=' + page + '&per_page=' + per_page, {
      success: function(data){
        if(page * per_page >= count){ el.parentNode.remove();}
        if(data.length > 0){
          list.innerHTML += data;
          el.setAttribute('data-page', ++page + '');
        }
      }
    });
  };
  window.hq.loadMore = loadMore;

  // Activate reminder
  var activateReminder = function(){
    var el = hq.reminderLink;
    var onButton = el.querySelector('.reminder-on')
      , offButton = el.querySelector('.reminder-off');

    hq.ajax(el.href, {
      method: 'post',
      success: function(data){
        // Toggle reminder button
        if(data === '0'){
          onButton.style.display = 'none';
          offButton.style.display = '';
        } else {
          if(data === '1'){ hq.loadDialog(el);}
          onButton.style.display = '';
          offButton.style.display = 'none';
        }
      }
    });
  };
  window.hq.activateReminder = activateReminder;

  // Toggle reminder in share bar
  var toggleReminder = function(el){
    var link = document.getElementById('login-link');
    hq.reminderLink = el;

    if(link && !site.authorized){
      cookies.set('rtype', 'script');
      cookies.set('redirect', 'hq.activateReminder()');
      hq.loadDialog(link);
    } else {
      hq.activateReminder();
    }
  };
  window.hq.toggleReminder = toggleReminder;

  // Toggle fields for user decide in campaign form
  var toggleCampaignFields = function(el){
    var lb = document.getElementById("limited_button")
      , nb = document.getElementById("never_ending_button")
      , cf = document.getElementById("campaign_duration_fields")
      , cv = document.querySelector('.campaign-voting-goal')
      , cg = document.querySelector('.campaign-contribution-goal');

    if(nb) nb.style.display = (el.value == 'all_or_nothing' ? 'none' : '');
    if(el.value == 'all_or_nothing'){
      if(lb) lb.click();
      if(cf) cf.style.display = "";
    }

    // Show / hide goal labels
    if(cv) cv.style.display = (el.value == 'voting' ? '' : 'none');
    if(cg) cg.style.display = (el.value == 'voting' ? 'none' : '');
  };
  window.hq.toggleCampaignFields = toggleCampaignFields;

  // Reply to message in inbox
  var replyMessage = function(form){
    var mc = form.querySelector("#message_content");
    hq.hideFlash();
    if(mc.value.trim().length == 0){
      mc.focus();
    } else {
      hq.postFunction(form, hq.insertMessage);
    }
  };
  window.hq.replyMessage = replyMessage;

  // Insert message in inbox
  var insertMessage = function(data){
    document.getElementById("message_content").value = '';
    list = document.getElementById("message-list"),
    listMob = document.querySelector('.messages_dialog #message-list'),
    messageContentMob = document.querySelector('.messages_dialog #message_content'),
    tmp = document.createElement("div"),
    tmpMob = document.createElement("div");
    tmp.innerHTML = tmpMob.innerHTML = data;
    list.insertBefore(tmp.firstChild, list.firstChild);

    // Mobile
    if(listMob){
      listMob.insertBefore(tmpMob.firstChild, listMob.firstChild);
      messageContentMob.value = '';
      if(isMobile()){Mob.createMessageDD(document.querySelectorAll('.messages_dialog li:first-of-type'), '.right')}
    }
  };
  window.hq.insertMessage = insertMessage;

  // Update message in inbox
  var setMessage = function(el){
    var url = el.href,
      li = el,
      content = document.getElementById("conversation_content_parent") || document.getElementById("conversation_content"),
      active;

    content.setAttribute('id','conversation_content_parent');

    hq.hideFlash();

    if(url){
      li = el.parentNode.parentNode;
    } else {
      url = "/conversations/" + el.getAttribute("data-id");
    }

    active = li.parentNode.querySelectorAll("li.active");

    for(var i = 0; i < active.length; i++){
      hq.removeClass(active[i], "active");
    }

    hq.fetch(url, content, true, function(){
      hq.addClass(li, "active");

      if(isMobile()){
        Mob.showMessage(function(){
          var list = document.querySelectorAll('.dialog_content #message-list li');

          Mob.createMessageDD(list, '.right');
        });
      }
    });
  };
  window.hq.setMessage = setMessage;

  // Show the rest of the pledge comment
  var showPledgeComment = function(el){
    var root = el.parentNode.parentNode;

    var html = root.querySelector('.commitment-pledge-text-html');
    el.parentNode.remove();

    html.style.display = 'block';
  };
  window.hq.showPledgeComment = showPledgeComment;

  // Show the rest of the vote comment
  var showVoteComment = function(el){
    var root = el.parentNode.parentNode;

    var html = root.querySelector('.vote-text-html');
    el.parentNode.remove();

    html.style.display = 'block';
  };
  window.hq.showVoteComment = showVoteComment;

  // Tracking sidebar, for use with sticky sidebar option
  var trackSidebar = function(){
    if(window.site.sidebar !== 'sticky') return;
    var tabs = document.getElementById('ctabs');
    if(!tabs) return false;

    var badges = document.getElementById('badges')
      , margin = 20
      , stopOffset = 66
      , badgeHeight = 350
      , stop = tabs.clientHeight + stopOffset;

    // Listen to scroll events
    window.addEventListener('scroll', function(){
      var offset = badges.offsetTop-margin
        , scroll = badges.clientHeight > badgeHeight
        , y = window.pageYOffset
        , height = badges.offsetTop + badges.clientHeight;

      // Do measurements and scroll or stop
      if(scroll && y >= offset){
        if(y+stopOffset > height-tabs.clientHeight){
          tabs.style.position = 'absolute';
          tabs.style.top = (height-stop+margin) + 'px';
        } else {
          tabs.style.position = 'fixed';
          tabs.style.top = margin + 'px';
        }
      } else {
        tabs.style.position = 'relative';
        tabs.style.top = '0px';
      }
    });
  };
  window.hq.trackSidebar = trackSidebar;

  // Init site, this is run on page load
  var initSite = function(dialog){
    if(!dialog || dialog.length == 0){ dialog = cookies.get('dialog'); }

    // Clear session
    hq.clearSession();

    // Load dialog or execute script as set in redirect
    if(dialog && dialog.length > 0){
      hq.loadDialog(dialog);
    }

    // Run script if redirect to script
    var script = cookies.get('script');
    cookies.delete('script');
    if(script && script.length > 0){
      eval(script);
    }
  };
  window.hq.initSite = initSite;

  // Determine if a category is static (default, not custom)
  var isStatic = function(s){
    return s === 'featured' || s === 'ending' || s === 'successful' || s === 'random' || s === 'you';
  };

  // Set the content of the document meta tags
  var setMeta = function(title, image, url){
    document.head.querySelector('meta[property="og:url"]').setAttribute('content', url || ("http://" + window.site.domain));
    document.head.querySelector('meta[property="og:title"]').setAttribute('content', title || '');
    document.head.querySelector('meta[property="og:image"]').setAttribute('content', image || '');
  };
  window.hq.setMeta = setMeta;

  // Toggle the user drop down menu
  var toggleMenu = function(){
    var style = document.getElementById('user').style;
    style.display = (style.display === '' || style.display === 'none') ? 'block' : 'none';
  };
  window.hq.toggleMenu = toggleMenu;

  // Toggle mangopay bank account
  var toggleBankAccount = function(select){
    var banks = document.querySelectorAll('.bank-account');
    for(var i = 0; i < banks.length; i++){
      banks[i].style.display = select.value == banks[i].id ? '' : 'none';

      if(banks[i].id == 'all'){
        banks[i].style.display = select.value == 'IBAN' ? 'none' : '';
      }
    }
  };
  window.hq.toggleBankAccount = toggleBankAccount;

  // Set up create new dialog for all links with the new-campaign class
  var setupEvents = function(){
    // Click the New Campaign button
    var ncs = document.querySelectorAll("a.new-campaign");
    for(var i = 0; i < ncs.length; i++){
      ncs[i].onclick = function(){ hq.transitLoad(this);return false; };
    }
  };
  window.hq.setupEvents = setupEvents;

  // Post and insert an article comment
  var postArticleComment = function(form){
    var input = document.getElementById("new_comment");
    if(input.value.trim().length > 0){
      var dataCounter = form.getAttribute('data-counter');
      var dataList = form.getAttribute('data-list');

      hq.ajax(form.action, {
        method: 'POST',
        data: hq.serialize(form),
        success: function(data){
          input.value = '';
          if (dataCounter){
            var num = document.getElementById(dataCounter)
            num.innerHTML = parseInt(num.innerHTML)+1;
          }

          if (dataList){
            var list = document.querySelector('.' + dataList);
            list.innerHTML = data + list.innerHTML;
          }
        }
      });
    } else {
      input.focus();
      input.value = '';
    }
  };
  window.hq.postArticleComment = postArticleComment;

  // Delete an article comment
  var deleteArticleComment = function(form){
    var dataId = form.getAttribute('data-id');
    var dataCounter = form.getAttribute('data-counter');

    hq.ajax(form.action, {
      method: 'DELETE',
      success: function(data){
        hq.closeDialog();

        if (dataCounter){
          var num = document.getElementById(dataCounter)
          num.innerHTML = parseInt(num.innerHTML)-1;
        }

        if (dataId){
          document.querySelectorAll("[data-container-id='"+ dataId +"']")[0].remove();
        }
      }
    });
  };
  window.hq.deleteArticleComment = deleteArticleComment;

  // Init
  setupEvents();

}());
