(function(){
  var cookies = {

    /**
     * Set/Overwrite a cookie value
     *
     * @param name
     * @param value
     * @param days      OPTIONAL Days till this cookie will stay valid. Default is current session
     * @param path      OPTIONAL domain root will be used by default
     */
    set: function(name, value, days, path) {
      if (days) {
          var date = new Date();
          date.setTime(date.getTime()+(days*24*60*60*1000));
          var expires = "; expires="+date.toGMTString();
      } else {
        var expires = "";
      }

      var dir = path || '/';
      document.cookie = name+"="+encodeURIComponent(value)+expires+"; path="+dir;
    },

    /**
     * Retrieve a cookie value
     *
     * @param name
     * @return String|null
     */
    get: function(name) {
      var nameEQ = name + "=";
      var ca = document.cookie.split(';');
      for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return decodeURIComponent(c.substring(nameEQ.length,c.length));
      }
      return null;
    },

    /**
     * Remove a cookie
     *
     * @param name
     */
    delete: function(name) {
      this.set(name,"",-1);
    }
  };
  window.cookies = cookies;
}());
