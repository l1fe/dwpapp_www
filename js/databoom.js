function GuidPlaceholder() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

function mystringify(obj) {
  var hash = {};
  return JSON.stringify(obj, function (key, value) {
    if (Array.isArray(value))
      return value;
    if (value && typeof value === 'object') {
      if (!value.id)
        value.id = GuidPlaceholder();
      if (!hash[value.id]) {
        hash[value.id] = true;

      } else {
        return { id: value.id }
      }
    }
    return value;
  })
}

function myparse(str) {
  var hash = {};
  return JSON.parse(str, function (key, value) {
    if (value && value.id) {
      if (!hash[value.id]) {
        hash[value.id] = value;
      } else {
        var ret = hash[value.id];
        for (var k in value) ret[k] = value[k];
        return ret;
      }
    }
    return value;
  })
}

function loadjsfile(filename, filetype) {
  var fileref = document.createElement('script')
  fileref.setAttribute("type", "text/javascript")
  fileref.setAttribute("src", filename)
  if (typeof fileref != "undefined")
    document.getElementsByTagName("head")[0].appendChild(fileref)
}
function loadcssfile(filename, filetype) {
  var fileref = document.createElement("link")
  fileref.setAttribute("rel", "stylesheet")
  fileref.setAttribute("type", "text/css")
  fileref.setAttribute("href", filename)
  if (typeof fileref != "undefined")
    document.getElementsByTagName("head")[0].appendChild(fileref)
}


//function databoomSrv(site, dbname) {
//    var dbfunc = function ($http, $q) {
//        var db = { error: { msg: "" } };
//        db.load = function (col, root, query) {
//            var d = $q.defer();

//            var str = db.url + '/collections/' + col + (query ? '?' + query : "");
//            $http.get(str).success(function (data, status, headers, config) {
//                d.resolve(data.d.results);
//            });
//            return d.promise;
//        }
//        db.site = site;
//        db.name = dbname;
//        db.url = site + '/api1/' + dbname;

//        return db;
//    }
//    return dbfunc;
//}


function databoomSrv(site, dbname) {
  var dbfunc = function ($http, $q) {
    var db = { error: { msg: "" } };
    db.site = site;
    db.name = dbname;
    db.url = site + '/api1/' + dbname;

    db.save = function (col, savedata) {
      var d = $q.defer();

      var jsonstr = mystringify(savedata);

      $http.post(db.url + '/collections/' + col, jsonstr, {
        withCredentials: true,
        headers: { Authorization: "NBBasic " + db.token }
      })
        .success(function (data, status, headers, config) {
          d.resolve(data.d.results);
        })
        .error(function (data, status, headers, config) {
          db.error.msg = "ERROR: can't load data from " + config.url;
          d.reject(data);
        });
      return d.promise;

      //var ret = $.ajax({
      //    type: "POST",
      //    url: db.url + '/collections/' + col,
      //    xhrFields: { withCredentials: true },
      //    processData: false,
      //    contentType: 'application/json',
      //    data: jsonstr
      //});
      //return ret;
    }

    db.del = function (id) {
      return $http.delete(db.url + '/collections/allobjects(' + id + ')', {
        withCredentials: true,
        headers: { Authorization: "NBBasic " + db.token }
      })

      //return $.ajax({
      //    type: "DELETE",
      //    url: db.url + '/collections/allobjects(' + id + ')',
      //    xhrFields: { withCredentials: true }
      //});
    }

    db.load = function (path, options) {
      var d = $q.defer();

      var url = options ? "?" + queryUrl(options) : "";
      var str = db.url + '/collections/' + path + url;

      console.log('str query', str);
      $http.get(str, {
        withCredentials: true
        ,headers: { Authorization: "NBBasic " + db.token }
      })
        .success(function (data, status, headers, config) {
          d.resolve(data.d.results);
        })
        .error(function (data, status, headers, config) {
          db.error.msg = "ERROR: can't load data from " + config.url;
          d.reject(data);
        });
      return d.promise;
    }

    //db.load = function (path, options) {
    //    var d = $.Deferred();
    //    var queryUrl = options ? "?" + queryUrl(options) : "";
    //    $.ajax({
    //        type: "GET",
    //        url: db.url + '/collections/' + path + queryUrl,
    //        xhrFields: { withCredentials: true },
    //        dataType: 'json',
    //        success: function (data) {
    //            d.resolve(data.d.results);
    //        },
    //        error: function (error) {
    //            d.reject(error);
    //        }
    //    });
    //    return d.promise();
    //}

    //db.loadTo = function (path, options, loadTo) {
    //    //path loadTo
    //    //path options loadTo

    //    var options2, loadTo2;
    //    if (!loadTo) {
    //        loadTo = options;
    //        options = null;
    //    }
    //    var d = $.Deferred();
    //    var queryUrl = options ? "?" + queryUrl(options) : "";
    //    $.ajax({
    //        type: "GET",
    //        url: db.url + '/collections/' + path + queryUrl,
    //        xhrFields: { withCredentials: true },
    //        dataType: 'json',
    //        success: function (data) {
    //            if (loadTo) {
    //                loadTo = data.d.results;
    //            }
    //            d.resolve(data.d.results);
    //        },
    //        error: function (error) {
    //            d.reject(error);
    //        }
    //    });
    //    return d.promise();
    //}

    db.login = function (username, password) {
      var d = $q.defer();

      //var jsonstr = mystringify(savedata);

      $http.post(db.url + '/sesslogin', { username: username, password: password }, {withCredentials: true})
        .success(function (data, status, headers, config) {
          db.token = data.token;
          d.resolve(true);
        })
        .error(function (data, status, headers, config) {
          db.error.msg = "ERROR: can't login " + config.url;
          d.reject(data);
        });
      return d.promise;
    }

    db.loadObj = function (id) {
      var d = $q.defer();

      $http.get(db.url + '/collections/allobjects(' + id + ')', {
        withCredentials: true
        ,headers: { Authorization: "NBBasic " + db.token }
      })
        .success(function (data, status, headers, config) {
          d.resolve(data.d.results);
        })
        .error(function (data, status, headers, config) {
          db.error.msg = "ERROR: can't load data from " + config.url;
          d.reject(data);
        });
      return d.promise;
    }

    function queryUrl(obj) {
      var str = [];
      for (var p in obj)
        if (obj.hasOwnProperty(p)) {
          str.push('$' + encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
        }

      return str.join("&");
    }

    db.delfromarray = function (id, arr){
      for (var i in arr) {
        var o = arr[i];
        if (o && o.id && o.id === id) {
          arr.splice(i, 1)
          return
        }
      }
    }


    return db;

  }

  return dbfunc;
}
