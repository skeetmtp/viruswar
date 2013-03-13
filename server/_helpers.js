
function sendEmail (to, subject, content) {
  var toName, toEmail;

  if(to) {
    toName = userName(to);
    toEmail = to.services.google.email;
  } else {
    toName = 'Team '+defines.name;
    toEmail = 'team@dok.io';
  }

  Email.send({
    from: 'team@dok.io',
    replyTo: 'team@dok.io',
    to: toEmail,
    subject: defines.name+': '+subject,
    text: "Hello "+toName+",\n\n"+content+"\n\nRegards,\n\nAlban & Vianney from "+defines.name+"\n\nYou received this email because you have an acount on "+Meteor.absoluteUrl()+"\n\n"
  });
}
