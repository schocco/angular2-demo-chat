import {Component, OnInit} from '@angular/core';
import { ChatService } from './chat.service';
import { Message } from './chat.service';
import {ActivatedRoute, Router, Params} from "@angular/router";
import {WebsocketService} from "./websokcet.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [ChatService, WebsocketService]
})
export class ChatComponent implements OnInit {

  msgs: Message[] = [];
  name: string = 'unknown user';

  constructor(private chatService: ChatService,
              private route: ActivatedRoute,
              private router: Router) { }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.name = params['alias'];
    });
    this.fetchMessages();
  }

  submitMsg(inputElement) {
    this.chatService.send(inputElement.value, this.name);
    inputElement.value = '';
  }

  private scrollDownMsgDiv() {
    let messages = document.getElementById('messages');
    messages.scrollTop = messages.scrollHeight;
    return false;
  }

  onMessageDisplay() {
    this.scrollDownMsgDiv();
  }

  private fetchMessages() {
    this.msgs = [];
    this.chatService.getMessages().subscribe(msg => {
      this.msgs.push(msg);
    });
  }

}
