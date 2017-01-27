(function(){
  var initLocation = function (lang) {
    if(!lang || lang.length < 2) lang = 'en';

    var input = document.getElementById('location');
    if(!input) { return; }

    spinner.insert(input);

    var list = document.getElementById('location_list'), data = document.getElementById('location_data'),
    UP = 38, DOWN = 40, ENTER = 13, ESC = 27, block = [13, 16, 17, 18, 19, 20, 27, 33, 34, 35, 36, 37, 38, 39, 40, 45, 224];

    input.addEventListener('keyup', function(event) {
      event = event || window.event;
      var code = event.keyCode || event.which;

      if(block.indexOf(code) < 0) {
        loadLocations();
      }
    });

    input.addEventListener('keydown', function(event) {
      event = event || window.event;
      var code = event.keyCode || event.which;

      if(code == UP || code == DOWN || code == ENTER || code == ESC) {
        event.preventDefault();
        traverseList(code);
      }
    });

    function traverseList (code) {
      if(code == ESC) { list.innerHTML = "";return;}
      var items = list.getElementsByClassName('geo'), index = -1, i = 0;
      if(items && items.length > 0) {
        for(;i < items.length;i++) {
          if(hq.hasClass(items[i], 'active')) {
            index = i;
            break;
          }
        }
        if(index < 0) {
          items[0].className = "geo active";
        } else {
          if(code == UP) {
            items[index == 0 ? items.length-1 : index-1].className = "geo active";
            items[index].className = "geo";
          } else if(code == DOWN) {
            items[index == items.length-1 ? 0 : index+1].className = "geo active";
            items[index].className = "geo";
          } else if(code == ENTER) {
            input.value = items[index].textContent.trim();
            data.value = items[index].getAttribute('data-location');
            list.innerHTML = "";
          }
        }
      }
    }

    function loadLocations () {
      var value = encodeURIComponent(input.value.trim());

      if(value.length > 2) {
        //var domain = window.hqAdmin ? "https://secure.geonames.net" : "http://api.geonames.org";
        var domain = "https://secure.geonames.net";
        var url = domain + "/searchJSON?q=" + value + "&maxRows=10&lang=" + lang + "&username=fugroup&callback=?";

        spinner.show();

        hq.getJSON(url, function(data) {
          spinner.hide();
          names = data.geonames;

          if(names.length > 0) {
            var ul = document.createElement('ul'), li, i = 0, r;

            for(;i < names.length; i++) {
              r = {
                name: names[i].name,
                cname: names[i].countryName,
                code: names[i].countryCode,
                lat: names[i].lat,
                lng: names[i].lng
              };
              if(names[i].adminName1) r.state = names[i].adminName1;
              li = document.createElement('li');
              li.className = 'geo';
              li.textContent = r.name + ', ' + (r.state ? (r.state + ', ') : '') + r.cname;
              li.setAttribute('data-location', JSON.stringify(r));

              if(encodeURIComponent(li.textContent) === value) { return; }

              li.addEventListener('click', function(event) {
                var el = event.target;
                var input = document.getElementById('location');
                var data = document.getElementById('location_data');
                input.value = el.textContent.trim();
                data.value = el.getAttribute('data-location');
                list.innerHTML = "";
              });
              li.addEventListener('mouseover', function(event) {
                var el = event.target;
                var n = el.parentNode.firstChild;
                for (; n; n = n.nextSibling) { n.className = "geo";}
                el.className = "geo active";
              });
              li.addEventListener('mouseout', function(event) {
                event.target.className = "geo";
              });
              ul.appendChild(li);
            }
            list.innerHTML = "";
            list.appendChild(ul);
          }
        });
      } else {
        list.innerHTML = "";
        spinner.hide();
      }
    }
  };
  window.hq.initLocation = initLocation;

  var spinner = {
    insert: function(el) {
      // Insert spinner
      var div = document.createElement('div');
      div.innerHTML = "<img class='spinner' src='/images/spinner.gif' style='margin-left:0.2em;visibility:hidden' alt='*'>";
      var spinner = div.firstChild;
      el.parentNode.insertBefore(spinner, el.nextSibling);
      el.spinner = spinner;
      this.input = el;
    },
    show: function() {
      this.input.spinner.setAttribute('style', 'margin-left:0.2em;visibility:visible');
    },
    hide: function() {
      this.input.spinner.setAttribute('style', 'margin-left:0.2em;visibility:hidden');
    }
  }

}());
