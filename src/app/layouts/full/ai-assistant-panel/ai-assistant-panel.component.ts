import { Component, EventEmitter, Output } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/material.module';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-ai-assistant-panel',
  standalone: true,
  imports: [CommonModule, MaterialModule, ReactiveFormsModule],
  template: `
    <div class="assistant-panel">
      <div class="assistant-header">
        <h3>AI Trading Assistant</h3>
        <button mat-icon-button color="warn" (click)="close.emit()">
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <div class="assistant-mode">
        <mat-form-field appearance="outline" class="full-width mode-select">
          <mat-label>Task</mat-label>
          <mat-select [formControl]="taskControl">
            <mat-option value="general">General Q&A</mat-option>
            <mat-option value="summarize">Summarize Market News</mat-option>
            <mat-option value="advise">Investment Advice</mat-option>
            <mat-option value="explain">Explain Financial Terms</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
      <div class="assistant-content">
        <div *ngFor="let msg of messages" class="message" [ngClass]="{'user': msg.user, 'assistant': !msg.user, 'typing': msg.typing}">
          <p>{{msg.text}}</p>
        </div>
      </div>
      <div class="assistant-input-form">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Ask about finance, trading, assets...</mat-label>
          <input matInput [formControl]="queryControl" (keyup.enter)="sendMessage()" type="text">
        </mat-form-field>
        <button mat-flat-button color="primary" (click)="sendMessage()">Send</button>
      </div>
    </div>
  `,
  styleUrls: ['./ai-assistant-panel.component.scss']
})
export class AiAssistantPanelComponent {
  @Output() close = new EventEmitter<void>();
  queryControl = new FormControl('');
  taskControl = new FormControl('general');
  messages: {text: string, user: boolean, typing?: boolean}[] = [
    { text: "Hello! I'm your AI trading assistant. How can I help you today?", user: false }
  ];

  loadingResponse = false;

  constructor(private http: HttpClient) {}

  sendMessage() {
    const query = this.queryControl.value?.trim();
    if (!query) return;

    this.messages.push({text: query, user: true});
    this.queryControl.reset('');
    this.loadingResponse = true;
    this.messages.push({text:"...", user:false, typing:true});

    // Call backend to get AI response
    this.http.post<{response: string}>('http://localhost:8080/api/assistant', { query, task:this.taskControl.value })
      .subscribe(res => {
        this.loadingResponse = false;
        // Remove typing placeholder
        this.messages = this.messages.filter(m => !m.typing);
        this.messages.push({text: res.response, user: false});
      }, err => {
        this.loadingResponse = false;
        this.messages = this.messages.filter(m => !m.typing);
        this.messages.push({text: "Sorry, I couldn't process that. Please try again.", user: false});
      });
  }
}
