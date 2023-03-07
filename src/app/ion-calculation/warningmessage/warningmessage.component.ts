import { Component, OnInit } from '@angular/core';
import { MessageService } from './share/message.service';

@Component({
  selector: 'app-warningmessage',
  templateUrl: './warningmessage.component.html',
  styleUrls: ['./warningmessage.component.css']
})
export class WarningmessageComponent implements OnInit {

  constructor(public messageService: MessageService) { }

  ngOnInit(): void {

  }

}
