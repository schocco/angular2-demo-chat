import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {WebsocketService, State} from './websokcet.service';

export class Message {

  state = State.NOT_SENT;
  id: string;

  constructor(public msg: string, public sender: string, public ts: Date) {
    this.id = Math.random().toString();
  }

  public json() {
    return JSON.stringify({id: this.id, msg: this.msg, sender: this.sender, ts: this.ts});
  }
}

@Injectable()
export class ChatService {

  private allMessages: Subject<Message> = new Subject<Message>();

  constructor(private socketService: WebsocketService) {
    this.socketService.getMsgSubject().subscribe(this.allMessages);
  }

  getMessages(): Observable<Message> {
    return this.allMessages;
  }


  send(msg: string, name: string) {
    let msgObj = new Message(msg, name, new Date());
    this.socketService.sendMessage(msgObj).subscribe((state: State) => {
      msgObj.state = state;
    });
    this.allMessages.next(msgObj);
  }
}
