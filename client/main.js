var latestPing = 0;

Meteor.subscribe('myUserData');
Meteor.subscribe('allUserData');
Meteor.subscribe('allOnlineUsers');
Meteor.subscribe('cells');

Meteor.startup(function () {

  Meteor.setInterval(function () {
    var before = now();
    Meteor.call('keepAlive', { userId : Meteor.userId(), browserId : Session.get('browserId') }, navigator.userAgent, latestPing, function (error, result) {
      var after = now();
      latestPing = after-before;
      Session.set('network', {ping:latestPing, error: error});
      if(error) console.log("err", error);
      //console.log("keepalive - ping in ", after - before);
    });
  }, 3000);

});


Template.navbar.stats = function() {
  return "Available Cells: "+Meteor.user().profile.cells;
}

Template.users.users = function () {
  return Meteor.users.find({});
}

Template.users.rendered = function () {
  $('.tt').tooltip();
};

Cells.find().observe({
  added: function (cell) {
    console.log('add', cell, this);
    game.cellsView.drawCell(cell);
   },
  changed: function(newCell, oldCell) {
    console.log('change', newCell, this);
    game.cellsView.drawCell(newCell);
  }
});

Cells.find( {userId : Meteor.userId(), home : true} ).observe({
  added: function (cell) {
    console.log('add', cell, this);
   },
  changed: function(newCell, oldCell) {
    console.log('change', newCell, this);
  },
  removed: function(oldCell) {
    console.log('removed', oldCell, this);
    Meteor.call('setHome');
  }
});

var addCell = function (i, j) {
  console.log(Meteor.userId(), i, j);

  if(!isValidCell(i, j, Meteor.userId())) { console.log('cannot put a cell here'); return; }

  var c = Cells.findOne(i+'+'+j);
  if(c) {
    if(c.userId !== Meteor.userId()) {
      console.log('fight!!!', c);
      var c = Cells.update(i+'+'+j, {$set: {userId: Meteor.userId()}}, function(e,id) {
        if(e) game.cellsView.drawCell(c);
      });
    }
  } else {
    var c = Cells.insert({_id: i+'+'+j, i:i, j:j, userId: Meteor.userId()}, function(e,id) {
      //if(e) game.cellsView.emptyCell(i, j);
    });
    console.log('created', c);
  }
}


Meteor.autorun(function() {
  if(Meteor.userId() !== null) {
    console.log("logged in");
    Meteor.call('setHome');
  }
});
