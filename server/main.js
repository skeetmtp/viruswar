
Meteor.publish("cells", function (workspace) {
  return Cells.find();
});

Meteor.publish("myUserData", function () {
  if(this.userId)
    return Meteor.users.find(this.userId, {fields: {profile: 1, 'services.google': 1}});
});

Meteor.publish("allUserData", function () {
  return Meteor.users.find({'profile.online': true}, {fields: {profile: 1, 'services.google.picture': 1}});
});

Meteor.publish("allOnlineUsers", function () {
  if(this.userId)
    return OnlineUsers.find({});
});

// Users cannot change their information
Meteor.users.deny({update: function () { return true; }});

Cells.allow({
  insert: function (userId, cell) {
    // the user must be logged in, and the document must be owned by the user
    console.log(userId, cell);
    if(userId !== cell.userId) return false;
    if(!isValidCell(cell.i, cell.j, userId)) return false;
    Meteor.users.update(userId, {$inc: { 'profile.cells': -1} });
    return true;
  },
  update: function (userId, cells, fields, modifier) {
    console.log('fight!', userId, cells, fields, modifier);
    if(fields.length > 1 && fields['userId'] === undefined) return false;
    if(!isValidCell(cells[0].i, cells[0].j, userId)) return false;
    if(userId !== modifier['$set'].userId) return false;

    if(cells[0].home) {
      // attack home
      Cells.update({userId: cells[0].userId}, {$set:{userId: userId, home:false}}, {multi: true});
    }

    return true;
  },
  remove: function (userId, docs) {
    return true;
  }
});

Meteor.methods({
  keepAlive: function (uniqUserId, userAgent, ping) {
    var now = (new Date()).getTime();
    //console.log("keepAlive", uniqUserId.userId, now);
    var onlineUser = OnlineUsers.findOne({uniqUserId : uniqUserId});
    if(onlineUser) {
      OnlineUsers.update(onlineUser._id, {$set: {lastActivity: now, userAgent: userAgent, ping: ping} } );
    } else {
      OnlineUsers.insert( {uniqUserId : uniqUserId, lastActivity: now, userAgent: userAgent, ping: ping} );
      Meteor.users.update(uniqUserId.userId,{$set: {'profile.online': true}});
    }
    return true;
  },

  mailTeam: function(msg) {
    var fromemail = Meteor.user().services.google.email
    var fromname = Meteor.user().profile.name;
    Email.send({
      from: fromemail,
      replyTo: fromemail,
      to: 'team@dok.io',
      subject: defines.name+': Message de '+fromname+' ('+fromemail+')',
      text: fromname + ' (' + fromemail + ') nous envoie ce message de '+defines.name+':\n\n'+msg
    });
  },

  setHome: function() {
    var c = Cells.findOne({$and: [ { userId: this.userId }, { home: true } ] });
    if(!c) {
      do {
        var i = Math.floor(Random.fraction()*defines.mapTileCountX);
        var j = Math.floor(Random.fraction()*defines.mapTileCountY);
        var c = Cells.findOne(i+'+'+j);
        if(!c) {
          Cells.insert({_id: i+'+'+j, i:i, j:j, userId: Meteor.userId(), home: true});
          Meteor.users.update( this.userId, {$set : { 'profile.cells' : defines.maxAvailableCells} } );
          return true;
        }
      } while(true);
    }
  }

});

var oneHourMs = 1000 * 60 * 60;

Meteor.startup(function () {

  Meteor.setInterval( function () {
    Meteor.users.update({ $and: [ {'profile.online': true}, {'profile.cells': { $lt: defines.maxAvailableCells } } ] }, {$inc: { 'profile.cells': 1} }, { multi: true });
  }, defines.onlineCellIncDelay);

  Meteor.setInterval( function () {
    var now = (new Date()).getTime();
    var before = (now - 10000);
    OnlineUsers.find({lastActivity: {$lt: before}}).forEach(function (onelineUser) {
      OnlineUsers.remove( onelineUser._id );

      var onlineUser = OnlineUsers.findOne({'uniqUserId.userId' : onelineUser.uniqUserId.userId});
      if(!onlineUser) {
        Meteor.users.update(onelineUser.uniqUserId.userId,{$set: {'profile.online': false}});
      }
    });
  }, 3000);

  // Keep track of new users to send admin email.
  Meteor.users.find({newUser: true}).observe({
    added: function (user) {
      //console.log('added', user);
      var email = user.services.google.email;
      sendEmail(null, user.profile.name+" registered to "+defines.name+"!", user.profile.name+" ("+email+") registered to "+defines.name+"!");
      Meteor.users.update(user._id, { $unset: { newUser: '' } });
    }
  });
});

Accounts.onCreateUser(function(options, user) {
  user.newUser = true;

  // We still want the default hook's 'profile' behavior.
  if (options.profile) {
    user.profile = options.profile;
  }
  user.profile.cells = 0;
  return user;
});
