var express = require('express');
var passport     = require('passport');
var bodyParser   = require('body-parser');
var LdapStrategy = require('passport-ldapauth');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(passport.initialize());

var port = 8080;

app.post('/login', function(req, res, next){
var username = req.body.username;
var OPTS = {
  server: {
url: 'ldap://192.168.1.16:389', //url: 'ldap://172.53.52.8:389',
bindDN: 'ezest\\srv-ldap', //'cn=root dc=com',  //ezest\\srv-ldap
bindCredentials: 'En%C0re&9102', //'secret',   //secret
searchBase: 'DC=ezest,DC=local', //'dc=example,dc=com', //searchBase: "ou=people",
searchFilter: 'mail='+username
  }
};

//console.log('OPTS====>', OPTS);
passport.use(new LdapStrategy(OPTS, (user, done) => {
return done(null, user);
}));

passport.authenticate('ldapauth', function (err, user, info) {   //{session: false})
console.log('sssssssssss',  user);
var error = err || info;
if (error) return res.json(401, error);
if (!user) return res.json(404, {message: 'Something went wrong, please try again.'});
res.json(user);
})(req, res, next)
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

exports = module.exports = app;
