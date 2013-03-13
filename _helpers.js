function findPos(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}

function now() {
  return new Date().getTime();
}

function defaultDateArray() {
  var defaultDates = [];
  for (var i = 0; i < 10; i++) {
    defaultDates.push(0);
  }
  return defaultDates;
}

function millisecondToDay(milliseconds) {
  if(milliseconds<0)
    milliseconds = 0;
  var secs = milliseconds / 1000;
  var mins = secs / 60;
  var hours = mins / 60;
  var days = hours / 24;
  return days;
}

var getUser = function(u) {
  if(u === undefined || u === null)
    return null;

  if(typeof u === 'object') {
    // by object
    return u;
  } else if(typeof u === 'string') {
    // by id
    return Meteor.users.findOne(u);
  }
  return null;
}

var userName = function (u) {
  var u = getUser(u);
  if(u && u.profile && u.profile.name)
    return u.profile.name; 
  else
    return 'Anonymous';
}

var userFirstName = function (u) {
  var u = getUser(u);
  if(u.services.google.given_name)
    return u.services.google.given_name;
  else if(u.profile.name)
    return u.profile.name.split(' ')[0];
  else
    return 'Anonymous';
}

var userLastName = function (u) {
  var u = getUser(u);
  if(u.services.google.family_name)
    return u.services.google.family_name;
  else if(u.profile.name)
    return u.profile.name.substr(u.profile.name.indexOf(' ') + 1);
  else
    return 'Anonymous';
}



var isValidCell = function (i, j, userId) {
  if (i < 0 || i >= defines.mapTileCountX) return false;
  if (j < 0 || j >= defines.mapTileCountY) return false;

  var user = Meteor.users.findOne(userId);
  if(user.profile.cells <= 0) return false;

  var c = Cells.findOne((i-1)+'+'+j);
  if(c && c.userId === userId) return true;
  var c = Cells.findOne((i+1)+'+'+j);
  if(c && c.userId === userId) return true;
  var c = Cells.findOne(i+'+'+(j+1));
  if(c && c.userId === userId) return true;
  var c = Cells.findOne(i+'+'+(j-1));
  if(c && c.userId === userId) return true;

  return false;
}

