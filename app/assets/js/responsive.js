/* Adapt site to support responsive layouts */

(function(){
  var desktopHeader, headerNav, userNav, mobNav, mobUserNav
    , logo, mobileLogo, lang, mobileLang, un, userMob, loginLink;

  // Setting up page elements
  desktopHeader = document.querySelector('#top div.inner-width');
  if(desktopHeader){
    headerNav = desktopHeader.querySelector('ul:not(.user)');
    userNav = desktopHeader.querySelector('ul.user');
    logo = desktopHeader.querySelector('#top h1.logo img');
    mobileLogo = desktopHeader.querySelector('.mobile_logo');
  }
  if(userNav){
    un = userNav.cloneNode(true);
  }
  if(un){
    userMob = un.querySelector('#user');
    loginLink = un.querySelector('#login-link');
  }
  mobNav = document.querySelector('.mobile_navigation .navigation.mobile_block');
  mobUserNav = document.querySelector('.mobile_navigation .mobile_user.mobile_block');
  lang = document.getElementById('lang');
  mobileLang = document.querySelector('.mobile_navigation .lang.mobile_block');

  // Avoid id duplication
  function setMobileIDsIn(parent){
    var Elements = parent.querySelectorAll('*');
    var ElementsWithID = [];

    for(var i=0; i<Elements.length; i++){
      if(Elements[i].id) ElementsWithID.push(Elements[i]);
    };

    if(parent.id) ElementsWithID.push(parent);

    ElementsWithID.map(function(Element){
      var MobileID = 'mobile_' + Element.id;
      Element.setAttribute('id', MobileID);
    });
  };

  // Fixing duplicate ids before insert
  if(un){ un.setAttribute('id', 'mob-menu');}
  if(userMob){ userMob.setAttribute('id', 'mob-user');}
  if(loginLink){ loginLink.setAttribute('id', 'mob-login-link');}

  if(headerNav){
    hn = headerNav.cloneNode(true),
    mobNav.appendChild(hn);
  }
  if(un && mobUserNav){ mobUserNav.appendChild(un);}

  /* Use image or insert site title if not found */
  if(mobileLogo){
    if(logo){
      mobileLogo.attributes['src'].value = logo.src;
    } else {
      mobileLogo.parentNode.innerHTML = site.title;
    }
  }

  if(lang && mobileLang){
    mobileLang.appendChild(lang.cloneNode(true));
    mobileLang.querySelector('#lang').setAttribute('id','mobile_lang');
  }

  // The main mobile object
  var Mob = (function(){
    var content = document.getElementById('stick'),
      footer = document.querySelector('footer'),
      body = document.body,
      isContainerCropped = false;

    // Get the viewport height
    function viewportHeight(){
      return Math.max(document.documentElement.clientHeight, window.innerHeight || 0) + 'px';
    }

    // Toggle container crop
    function toggleContainerCrop(crop){
      if(isContainerCropped || !crop){
        var scrollTop = content.scrollTop;

        content.style.height = 'auto';
        body.scrollTop = scrollTop;

        isContainerCropped = false;

      } else {
        var scrollTop = body.scrollTop;

        content.style.height = viewportHeight();
        content.style.overflow = 'hidden';
        content.scrollTop = scrollTop;

        isContainerCropped = true;
      }
      return content;
    };

    // Toggle navigation
    function toggleNavigation(hide){
      if(isContainerCropped || hide){
        hq.removeClass(body, 'show_mob_nav');
        setTimeout(toggleContainerCrop, 50); //minimum duration
      } else {
        toggleContainerCrop(true);
        setTimeout(function(){
          hq.toggleClass(body, 'show_mob_nav');
          scrollTo(0, 0);
        }, 50); //minimum duration
      }
    }

    // Toggle search
    function toggleSearch(hide){
      var searchInput = document.querySelector('.mobile_search input');

      if(isContainerCropped || hide){
        hq.removeClass(body, 'show_mob_search');
        toggleContainerCrop();
      } else {
        hq.toggleClass(body, 'show_mob_search');
        toggleContainerCrop(true);
        setTimeout(function(){
          searchInput.focus();
        }, 50); //minimum duration
      }
    }

    // Create select menu from navigation links
    function createSelectNavigation(arr, fn){
      /*
        create select nav from links;
        arr - is an array of list items, <a> is child
        fn - custom function with option element as a parameter
      */

      var select = document.createElement('select');

      for(var i = 0; i < arr.length; i++){
        var item = arr[i],
          a = item.querySelector('a'),
          url = a.href,
          option = document.createElement('option');

        option.value = url;
        option.text = a.text;

        select.appendChild(option);

        if(fn && typeof(fn) === 'function'){
          fn(a, option);
        }
      }

      return select;
    }

    // Adapt categories for mobile
    function adaptCategories(){
      var categoryTabs = document.querySelector('#ctabs.nav-tabs');

      if(categoryTabs){
        var categoryTabsList = categoryTabs.querySelectorAll('li'),
          categoryParent = categoryTabs.parentNode;
          regExp = new RegExp('selected', 'gi'),
          value = '';

        function fn(a, option){
          if(regExp.test(a.className)){
            option.selected = 'selected';
          }
        }

        function change(){
          if(this.value != value){
            window.location.href = this.value;
          }
        }

        var select = createSelectNavigation(categoryTabsList, fn);

        select.onchange = change;
        select.className = 'mobile_categories';
        categoryParent.insertBefore(select, categoryTabs);
      }
    };

    adaptCategories();

    // Adapt campaign page for mobile
    function adaptCampaignPage(){
      var campaignContent = document.getElementById('campaign_content');

      if(campaignContent){
        var campaignSidebar = document.getElementById('campaign_sidebar');
        var stats = document.getElementById('stats');

        var video = document.getElementById('campaign_video'), videoCopy, videoImage;
        if(video){
          videoCopy = video.cloneNode(true);
          setMobileIDsIn(videoCopy);
          videoImage = videoCopy.querySelector(':first-of-type');
        }

        var share = document.getElementById('campaign_share'), shareCopy;
        if(share){
          shareCopy = share.cloneNode(true);
          setMobileIDsIn(shareCopy);
        }

        var userBio = document.getElementById('campaign_bio'), userBioCopy;
        if(userBio){
          userBioCopy = userBio.cloneNode(true);
          setMobileIDsIn(userBioCopy);
        }

        if(videoCopy){ campaignSidebar.insertBefore(videoCopy, stats); }
        if(shareCopy){ campaignSidebar.insertBefore(shareCopy, stats);}

        if(userBioCopy){ campaignContent.appendChild(userBioCopy); }

        if(video){ hq.addClass(video, 'desktop'); }
        if(share){ hq.addClass(share, 'desktop'); }
        if(userBio){ hq.addClass(userBio, 'desktop'); }

        if(videoCopy){ hq.addClass(videoCopy, 'mobile'); }
        if(shareCopy){ hq.addClass(shareCopy, 'mobile'); }
        if(userBioCopy){ hq.addClass(userBioCopy, 'mobile'); }

        if(videoImage){
          videoImage.style.height = 'auto';
          videoImage.style.width = 'auto';
          videoImage.style.maxWidth = '100%';
        }

        // Insert campaign content before stats
        // document.addEventListener('DOMContentLoaded', function() {
        //   if(hq.isMobile() && campaignSidebar && stats){
        //     campaignSidebar.insertBefore(campaignContent, stats);
        //   }
        // });
      }
    }

    adaptCampaignPage();

    // Adapt campaign tabs for mobile
    function adaptCampaignTabs(){
      var campaignNav = document.querySelector('#campaign_nav.nav-tabs');

      if(campaignNav){
        var tabsList = campaignNav.querySelectorAll('li'),
          campaignContent = document.getElementById('campaign_content'),
          regExp = new RegExp('selected','gi');

        function fn(a, option){
          if(regExp.test(a.className)){
            option.selected = 'selected';
          }
        }

        function change(){
          hq.fetchTab(this.value);
        };

        var select = createSelectNavigation(tabsList, fn);

        select.onchange = change;
        select.className = 'mobile_categories';
        hq.addClass(campaignNav, 'desktop');

        campaignContent.insertBefore(select, campaignNav);
      }
    };

    adaptCampaignTabs();

    // Adapt edit campaign tabs
    function adaptEditCampaignTabs(){
      var campaignDash = document.getElementById('campaign_dash');

      if(campaignDash){
        var tabsList = campaignDash.querySelectorAll('li'),
          content = document.getElementById('content'),
          regExp = new RegExp('active','gi'),
          value = '';

        function fn(a, option){
          if(regExp.test(a.className)){
            option.selected = 'selected';
          }
        }

        function change(){
          if(value != this.value){
            window.location.href = this.value;
          }
        };

        var select = createSelectNavigation(tabsList, fn);

        select.onchange = change;
        select.className = 'mobile_categories';
        hq.addClass(campaignDash, 'desktop');

        content.insertBefore(select, campaignDash);
      }
    };

    adaptEditCampaignTabs();

    // Show inbox message
    function showMessage(callback){

      var conversationContentClone = document.getElementById('conversation_content').cloneNode(true);

      setMobileIDsIn(conversationContentClone);

      hq.addClass(document.body, 'show_messages');

      document.querySelector('.messages_dialog .dialog_header').text = '';
      document.querySelector('.messages_dialog .dialog_content').innerHTML = '';
      document.querySelector('.messages_dialog .dialog_header h4').innerHTML = document.querySelector('#conversation_content h3').innerHTML;
      document.querySelector('.messages_dialog .dialog_content').appendChild(conversationContentClone);

      document.body.scrollTop = 0;

      if(callback && typeof(callback) === 'function'){
        callback();
      }
    }

    // Hide inbox message
    function hideMessage(){
      toggleContainerCrop();
      hq.removeClass(document.body, 'show_messages');
    };

    // Create inbox conversations
    function createMessageDD(list, selector){
      /*
        list - arr of messages <li>
        selector - query selector for the div with action buttons
      */

      for(var i=0; i<list.length; i++){
        var item = list[i],
          buttonsBlock = item.querySelector(selector),
          buttonsBlockMob = document.createElement('div'),
          buttonsBlockClone = buttonsBlock.cloneNode(true),
          label = document.createElement('span');

        setMobileIDsIn(buttonsBlockClone);

        label.innerHTML = '...';

        buttonsBlock.parentElement.insertBefore(buttonsBlockMob, buttonsBlock);

        buttonsBlockMob.appendChild(label);
        buttonsBlockMob.appendChild(buttonsBlockClone);

        var ddList = buttonsBlockMob.querySelector('.right');

        buttonsBlockMob.className = 'dd mobile';
        label.className = '_label';
        hq.addClass(buttonsBlock, 'desktop');
        hq.addClass(ddList, 'dd_list');

        var ddLinks = ddList.querySelectorAll('a');

        for(var it = 0; it < ddLinks.length; it++){
          ddLinks[it].addEventListener('click', function(e){
            e.preventDefault();
            e.stopPropagation();

            var shownDD = item.parentElement.querySelector('.dd_list.show');

            if(shownDD){
              hq.removeClass(shownDD, 'show');
            }
          })
        }

        ddList.style.width = (ddLinks.length * 50) + 'px';

        label.onclick = function(e){
          e.preventDefault();
          e.stopPropagation();

          var shownDD = item.parentElement.querySelector('.dd_list.show'),
            dropDown = this.parentElement.querySelector('.dd_list');

          if(shownDD && (shownDD != dropDown)){
            hq.removeClass(shownDD, 'show');
          }

          hq.toggleClass(this.parentElement.querySelector('.dd_list'), 'show');
        };
      }

      return list;
    };

    // Adapt inbox conversations
    function adaptInbox(){
      var conversationList = document.getElementById('conversation_list');

      if(conversationList){
        var conversationListArr = conversationList.querySelectorAll('li'),
          dialogWrap = document.createElement('div'),
          messageDialog = ''
          + '<div class="messages_dialog"> <div class="dialog_header">'
          + '<a class="close" href="javascript:;" onclick="Mob.hideMessage();return false" title="' + t('close') + '">'
          + '<i class="icon-remove-sign"></i> </a> <h4></h4> </div>'
          + '<div class="dialog_content"></div> </div>';

        createMessageDD(conversationListArr, 'a ~ .right');

        document.body.appendChild(dialogWrap);
        dialogWrap.innerHTML = messageDialog;
      }
    };

    adaptInbox();

    return {
      toggleNavigation: toggleNavigation,
      toggleSearch: toggleSearch,
      toggleContainerCrop: toggleContainerCrop,
      showMessage: showMessage,
      hideMessage: hideMessage,
      createMessageDD: createMessageDD
    };

  }());

  window.Mob = Mob;

  hq.setupEvents();
}());
