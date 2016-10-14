import {Injectable} from '@angular/core';
import {Observable, Observer, Scheduler, Subject} from "rxjs";
import {Message} from "./chat.service";
const SockJS = require('sockjs-client');

export enum State {
  NOT_SENT, SENT, RECEIVED, FAILED
}

@Injectable()
export class WebsocketService {

  private sock;
  private onOpen: Observable<any>;
  private onClose: Observable<any>;
  private onMsg: Observable<any>;
  private msgSubject: Subject<any> = new Subject();
  private isConnected: boolean = false;

  constructor() {
    this.init();
    this.onClose.subscribe(() => {
      this.isConnected = false;
      console.log("websocket connection lost.");
      Observable.interval(4000).takeWhile(() => !this.isConnected).subscribe(x => {
        console.log("reconnect attempt #" + x);
        // connection object can't be reused. need to re-initialize everything when connection is lost.
        // XXX: we should not expose observables to callers that can be replaced
        this.init();
      })
    });
  }

  private init() {
    this.sock = new SockJS('/echo');
    this.onOpen = Observable.fromEvent(this.sock, 'open');
    this.onClose = Observable.fromEvent(this.sock, 'close');
    this.onMsg = Observable.fromEvent(this.sock, 'message').map((event: {data: string}) => JSON.parse(event.data));
    this.onOpen.subscribe(() => this.isConnected = true);

    // feed stream of new observable into subject that is exposed to callers
    this.getMsgObserver().subscribe(this.msgSubject);
  }

  /**
   *
   * @returns {Observable<Message>} an observable that only emits chat messages (no ACKs)
   */
  private getMsgObserver() : Observable<Message> {
    return this.onMsg
      .filter(response => response.type !== "ack")
      .map(obj => new Message(obj.msg, obj.sender, obj.ts));
  }

  getMsgSubject() : Subject<Message> {
    return this.msgSubject;
  }

  /**
   * Sends the message to the server and watches for message state changes.
   * @param msg message to be sent to the server
   * @returns {Observable<State>}  an observable that emits msg state changes and completes either when sending has
   *  failed or when the message has been received by the recipient.
   */
  sendMessage(msg: Message): Observable<State> {
    return Observable.create((observer: Observer<State>) => {
      observer.next(State.NOT_SENT);
      if (this.isConnected) {
        this.sock.send(JSON.stringify(msg));
        this.onMsg
          .filter(response => response.type == "ack" && response.id == msg.id)
          .first() // complete on first occurence of ack message
          .subscribe(ack => {
            observer.next(State.RECEIVED);
            observer.complete();
          });
        observer.next(State.SENT);
      } else {
        observer.next(State.FAILED);
        observer.complete();
      }
    });
  }

}
