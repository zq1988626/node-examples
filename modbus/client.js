var modbus = require("modbus-tcp");
var client = new modbus.Client();
var server = new modbus.Server();
 
// link client and server streams together
client.writer().pipe(server.reader());
server.writer().pipe(client.reader());
// if you have a socket (stream) you can just
// call client.pipe(socket) or server.pipe(socket)
 
server.on("read-coils", function (from, to, reply) {
    return reply(null, [ 1, 0, 1, 1 ]);
});
 
// read coils from unit id = 0, from address 10 to 13
client.readCoils(0, 10, 13, function (err, coils) {
    console.log(coils);
    // coils = [ 1, 0, 1, 1 ]
});