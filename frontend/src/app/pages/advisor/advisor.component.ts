import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Message {
  role: 'user' | 'ai';
  text: string;
  loading?: boolean;
}

@Component({
  selector: 'app-advisor',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
    <div class="advisor-page">
      <div class="advisor-header">
        <div class="icon">🎬</div>
        <div>
          <h1>AI Movie Advisor</h1>
          <p>Describe your mood — get a recommendation</p>
        </div>
      </div>

      <div class="chips">
        @for (chip of chips; track chip.label) {
          <button class="chip" [class.active]="userInput === chip.text"
            (click)="selectChip(chip.text)">{{ chip.label }}</button>
        }
      </div>

      <div class="input-row">
        <input [(ngModel)]="userInput" (keydown.enter)="send()"
          placeholder="E.g. something sad but beautiful..." />
        <button (click)="send()" [disabled]="loading">
          {{ loading ? 'Thinking...' : 'Ask' }}
        </button>
      </div>

      <div class="messages">
        @for (msg of messages; track $index) {
          <div class="msg" [class.user]="msg.role === 'user'"
            [class.ai]="msg.role === 'ai'" [class.loading]="msg.loading">
            {{ msg.text }}
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .advisor-page { max-width: 700px; margin: 0 auto; padding: 2rem 1.5rem; }
    .advisor-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem; }
    .icon { width: 48px; height: 48px; border-radius: 50%; background: #e50914;
      display: flex; align-items: center; justify-content: center; font-size: 22px; flex-shrink: 0; }
    h1 { font-size: 1.4rem; font-weight: 700; color: #fff; margin: 0; }
    p { color: #888; margin: 4px 0 0; font-size: 0.9rem; }
    .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 1rem; }
    .chip { padding: 6px 16px; border-radius: 20px; border: 1px solid #333;
      background: transparent; color: #aaa; cursor: pointer; font-size: 0.85rem; transition: all 0.2s; }
    .chip:hover, .chip.active { background: #e50914; border-color: #e50914; color: #fff; }
    .input-row { display: flex; gap: 8px; margin-bottom: 1.5rem; }
    input { flex: 1; padding: 10px 14px; background: #1e1e1e; border: 1px solid #333;
      border-radius: 8px; color: #fff; font-size: 0.95rem; outline: none; }
    input:focus { border-color: #e50914; }
    button { padding: 10px 20px; background: #e50914; border: none;
      border-radius: 8px; color: #fff; font-weight: 600; cursor: pointer; }
    button:disabled { opacity: 0.5; cursor: not-allowed; }
    .messages { display: flex; flex-direction: column; gap: 12px; }
    .msg { padding: 14px 16px; border-radius: 12px; font-size: 0.9rem; line-height: 1.7; white-space: pre-wrap; }
    .msg.user { background: #1e1e1e; align-self: flex-end; max-width: 80%;
      border-radius: 12px 12px 2px 12px; color: #fff; }
    .msg.ai { background: #141414; border: 1px solid #2a2a2a; color: #ddd; }
    .msg.loading { color: #666; font-style: italic; }
  `]
})
export class AdvisorComponent {
  userInput = '';
  loading = false;
  messages: Message[] = [
    { role: 'ai', text: 'Hi! Tell me your mood or what you want to watch — I\'ll recommend a film 🎥' }
  ];

  chips = [
    { label: 'Horror', text: 'I want something scary for the evening' },
    { label: 'Comedy', text: 'I want to laugh, comedy' },
    { label: 'Drama', text: 'Something smart and deep, drama' },
    { label: 'Action', text: 'Action with a gripping plot' },
    { label: 'Romance', text: 'A romantic film for two' },
    { label: 'Sci-Fi', text: 'Science fiction, the future' },
  ];

  selectChip(text: string) {
    this.userInput = text;
  }

  async send() {
    if (!this.userInput.trim() || this.loading) return;
    const text = this.userInput.trim();
    this.userInput = '';
    this.loading = true;

    this.messages.push({ role: 'user', text });
    const loadMsg: Message = { role: 'ai', text: 'Finding a film for you...', loading: true };
    this.messages.push(loadMsg);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8000/api/ai-advisor/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({ message: text })
      });
      const data = await res.json();
      loadMsg.text = data.reply || 'Response error.';
      loadMsg.loading = false;
    } catch {
      loadMsg.text = 'Connection error.';
      loadMsg.loading = false;
    }
    this.loading = false;
  }
}