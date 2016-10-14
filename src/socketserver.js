const http = require('http');
const sockjs = require('sockjs');
const echoServer = sockjs.createServer({ sockjs_url: 'http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js' });
const Rx = require('rxjs');

const welcome = {id: 0, sender: 'alice', ts: new Date(), msg: 'Hi, I am alice. I just repeat whatever you write.'};

echoServer.on('connection', function(conn) {

    console.log("client connected " + conn);
    conn.write(JSON.stringify(welcome));

    let dataObservable = Rx.Observable.fromEvent(conn, 'data').map(msg => JSON.parse(msg));
    let closeObservable = Rx.Observable.fromEvent(conn, 'close');

    dataObservable.filter(msg => {
        // only sends ACK msgs when msg text does not contain the word timeout
        // as a simple way for clients to test timeout handling
        return msg.msg.indexOf("timeout") == -1;
    }).delay(500).subscribe(msg => {
        console.log("sending ack with id " + msg.id);
        let ack = {type: 'ack', id: msg.id};
        conn.write(JSON.stringify(ack));
    });

    let replyObservable = dataObservable.delay(1000).map(msg => {
        let reply = msg;
        reply.type = 'reply';
        reply.sender = "alice";
        reply.ts = new Date();
        return reply;
    });

    let questions = replyObservable.filter(msg => msg.msg.indexOf('?') > -1).map(reply => {
        reply.msg = 'good question, I dont have an answer.';
        return reply;
    });

    // observables can be joined with merge
    replyObservable.filter(msg => msg.msg.indexOf('?') == -1).merge(questions).subscribe(reply => {
        conn.write(JSON.stringify(reply));
    });

});

let server = http.createServer();
echoServer.installHandlers(server, {prefix:'/echo'});
server.listen(9999, '0.0.0.0');

module.exports = server;