import {Component, Input, Output} from "@angular/core/src/metadata/directives";
import {AfterViewInit, EventEmitter} from "@angular/core";

@Component({
  selector: 'chat-msg',
  templateUrl: './chat.message.html',
  styleUrls: ['./chat.message.css']
})
export class ChatMessageComponent implements AfterViewInit {

  @Input() msg;
  @Output() onDisplay = new EventEmitter<boolean>();

  ngAfterViewInit(): void {
    this.onDisplay.emit(true);
  }
}
