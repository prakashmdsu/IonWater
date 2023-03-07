import { Injectable } from '@angular/core';
import { ErrorMessage } from '../../../CommonServices/error-warning/messageinterface';

@Injectable({ providedIn: 'root' })
export class MessageService {
  messages: ErrorMessage[] = [];

  add(warningMessages: ErrorMessage) {
    this.messages.push(warningMessages);
  }

  removeMessageById(id: number) {
    this.messages = this.messages.filter(data => data.errorcode != id);
  }
  clearMessageByPage(page: string) {
    this.messages = this.messages.filter(data => data.page != page);
  }
  clear() {
    this.messages = [];
  }
}
