var Express = require('express'),
    fs      = require('fs'),
    app     = module.exports.app = Express();
    eps     = require('ejs'),
    morgan  = require('morgan'),
    http    = require('http');

Object.assign=require('object-assign');
app.engine('html', require('ejs').renderFile);
//app.use(morgan('combined'))

app.set('views', __dirname + '/views');

require( './db' );

/* ------------------------------------------------------------ OPENSHIFT CONFIGURATION ------------------------------------------------------------ */

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8000,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || process.env.LOCAL_IP;


/* ------------------------------------------------------------ ERROR HANDLING ------------------------------------------------------------ */

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500).send('Something bad happened!');
});

/* ------------------------------------------------------------ ROUTES ------------------------------------------------------------ */

var routes = require( './routes/' );
app.get('/', routes.index);
app.get('/match/:roomid', routes.match);
app.get('/forge', routes.forge);
app.get('/pagecount', routes.pagecount);

//app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

/* ------------------------------------------------------------ SOCKET ------------------------------------------------------------ */

var server = http.createServer(app);
var io = require('socket.io')(server);

server.listen(port, function () {
    console.log('Server listening at port %d', port);
});

var sockets = require('./game_sockets');

io.sockets.on('connection', function (socket) {
    console.log("user connect");
    var addedUser = false;
    sockets.initGameSockets(io, socket, addedUser);
});

/* ------------------------------------------------------------ ASSETS ------------------------------------------------------------ */

app.use(Express.static(__dirname + '/public'));

app.use('/vendors', Express.static(__dirname + '/node_modules/noty/lib/'));
app.use('/vendors', Express.static(__dirname + '/node_modules/animejs//'));
app.use('/vendors', Express.static(__dirname + '/node_modules/sweetalert/dist/'));
app.use('/vendors', Express.static(__dirname + '/node_modules/rivets/dist/'));
app.use('/vendors', Express.static(__dirname + '/node_modules/owl.carousel/dist/'));
app.use('/vendors', Express.static(__dirname + '/node_modules/mo-js/build/'));

module.exports = app ;
