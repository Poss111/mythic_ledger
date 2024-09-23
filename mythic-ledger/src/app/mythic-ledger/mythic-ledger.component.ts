import { Component } from '@angular/core';
import { MythicLedgerService } from '../mythic-ledger-service.service';
import { setup, createActor } from 'xstate';
import { CommonModule } from '@angular/common';
import { machineSetup, stateSetup } from './state';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Input } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { PdfViewerModule } from 'ng2-pdf-viewer';
@Component({
  selector: 'app-mythic-ledger',
  standalone: true,
  template: `
  <script src="https://accounts.google.com/gsi/client" async></script>
  <style>
  @import url('https://fonts.googleapis.com/css2?family=Roboto+Slab:wght@100..900&display=swap');
  </style>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0" />
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="header">
          <h1>Mythic Ledger</h1>
          @if (data !== 'LoggedOut' && data !== null && data !== undefined) {
          <div>
            <span (click)="sendEvent('logout')" class="material-symbols-outlined clickable">
            logout
            </span>
          </div>
          }
        </div>
        <div class="content-container">
          @if (data === 'LoggedOut' || data === null || data === undefined) {
            <h2>What do we offer?</h2>
            <p>We offer a platform for booking appointments and managing contracts.</p>
            <p>Please login to continue.</p>
            <div class="button-container">
              <button (click)="sendEvent('login')">Login</button>
              <div id="g_id_onload"
                  data-client_id="YOUR_GOOGLE_CLIENT_ID"
                  data-login_uri="https://your.domain/your_login_endpoint"
                  data-auto_prompt="false">
              </div>
              <div class="g_id_signin"
                  data-type="standard"
                  data-size="large"
                  data-theme="outline"
                  data-text="sign_in_with"
                  data-shape="rectangular"
                  data-logo_alignment="left">
              </div>
            </div>
          }
          @if (data === 'LoggedIn') {
            <p>You are logged in</p>
            <div class="button-container">
            <button (click)="sendEvent('loadUserDetails')">Load User Details</button>
            </div>
          }
          @if (data === 'ShowCurrentAvailableBookings') {
            <p>You are showing current available bookings</p>
            <table class="booking-table">
              <tr>
                <th>Booking</th>
                <th>Date</th>
                <th>Time</th>
                <th>Place</th>
              </tr>
              <tr>
                <td>Booking 1</td>
                <td>2024-01-01</td>
                <td>10:00</td>
                <td>Place 1</td>
              </tr>
              <tr>
                <td>Booking 2</td>
                <td>2024-01-02</td>
                <td>11:00</td>
                <td>Place 2</td>
              </tr>
              <tr>
                <td>Booking 3</td>
                <td>2024-01-03</td>
                <td>12:00</td>
                <td>Place 3</td>
              </tr>
            </table>
            <div class="button-container">
              <button (click)="sendEvent('requestABooking')">Request a Booking</button>
            </div>
          }
          @if (data === 'BookAnAppointment') {
            <p>Choose a booking and the available date, time, and place</p>
            <div class="booking-container">
              <select class="booking-selector" name="booking" id="bookings">
                <option value="booking1">Booking 1</option>
                <option value="booking2">Booking 2</option>
                <option value="booking3">Booking 3</option>
              </select>
              <div class="date-picker-container">
                <input type="date" />
              </div>
              <div class="time-picker-container">
                <input type="time" />
              </div>
              <div class="place-picker-container">
                <input type="text" placeholder="Place" />
              </div>
              <button (click)="sendEvent('book')">Book</button>
            </div>
          }
          @if (data === 'ShowContract') {
            <div class="contract-container">
              <p>Please review the terms and conditions</p>
              <div class="inner-contract-container">
                <pdf-viewer src="http://localhost:8000/contract" [render-text]="true" [original-size]="false" class="contract-viewer"></pdf-viewer>
              </div>
              <div class="button-container">
                <button (click)="sendEvent('decline')" class="error-button">Decline</button>
                <button (click)="sendEvent('accept')" class="primary-button">Accept</button>
              </div>
            </div> 
          } 
          @if (data === 'ShowNewAppointment') {
            <p>You are showing a new appointment</p>
            <div class="button-container">
              <button (click)="sendEvent('acknowledge')">Acknowledge</button>
            </div>
          }
          @if (data === 'FailedToLogin') {
            <p>You failed to login</p>
            <div class="button-container">
              <button (click)="sendEvent('accept')">Accept</button>
            </div>
          }
        </div>
        <div class="footer">
          <p>Version: 0.0.1</p>
          <p>Powered by <a href="https://xstate.js.org/">XState</a></p>
          <p>Made by <a href="https://github.com/poss111">poss111</a></p>
        </div>
      </div>
    </div>
  </div>
  `,
  styles: [
    `
    .col-12 {
      transition: 0.3s ease;
    }

    .container {
      display: flex;
      flex-direction: column;
      border: 1px solid black;
      width: 350px;
      background: hsla(223, 100%, 93%, 1);
      background: linear-gradient(135deg, hsla(223, 100%, 93%, 1) 71%, hsla(237, 64%, 56%, 1) 100%);
      background: -moz-linear-gradient(135deg, hsla(223, 100%, 93%, 1) 71%, hsla(237, 64%, 56%, 1) 100%);
      background: -webkit-linear-gradient(135deg, hsla(223, 100%, 93%, 1) 71%, hsla(237, 64%, 56%, 1) 100%);
      border-radius: 40px;
      box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
      padding: 10px;
      transition: max-height 0.3s ease;
      font-family: "Roboto Slab", serif;
      font-optical-sizing: auto;
      font-style: normal;

      width: 400px;
      max-height: 650px;
    }

    .content-container {
      transition: all 2s ease;
    }

    .contract-viewer {
      width: 350px;
      height: 400px;
      padding-bottom: 1em;
    }

    .input-container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: 0.3s ease;
    }

    .booking-container {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      transition: 0.3s ease;
      height: 225px;
    }

    .date-picker-container {
      align-self: center;
    }

    .booking-selector {
      align-self: center;
    }

    .time-picker-container {
      align-self: center;
    }

    .place-picker-container {
      align-self: center;
    }

    input {
      border: none;
      appearance: none;
      background: #f2f2f2;
      padding: 12px;
      border-radius: 3px;
      width: 250px;
    }

    input:hover {
      background: #e0e0e0;
    }

    input:focus::placeholder {
      color: transparent;
    }

    input::placeholder {
      color: #222;
      transition: color 0.3s ease;
    }

    select {
      border: none;
      appearance: none;
      background: #f2f2f2;
      padding: 12px;
      border-radius: 3px;
      width: 250px;
    }

    select:hover {
      background: #e0e0e0;
    }

    .dropdown-container {
      padding-top: 1em;
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }

    .date-picker-container {
      padding-top: 1em;
    }

    .button-container {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: end;
      padding-top: 1em;
    }

    button {
      border: none;
      padding: 5px 15px;
      border-radius: 5px;
      cursor: pointer;
      transition: background-color 0.3s ease;
    }

    .primary-button {
      background-color: #00bb3b;
      color: #fff;
    }

    .error-button {
      background-color: red;
      color: #fff;
    }

    button:hover {
      background-color: #333;
      color: #fff;
    }

    .inner-contract-container {
      display: flex;
      justify-content: center;
    }

    .loading-container {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
      padding-top: 1em;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: conic-gradient(from 0deg, #000, #000);
      animation: spin 1s linear infinite;
    }

    .spinner-container {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .spinner-inner {
      width: 85%;
      height: 85%;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      background: #fff;
    }
    
    .spinner-segment {
      width: 100%;
      height: 100%;
      background: #000;
      border-radius: 50%;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    .booking-table {
      width: 100%;
      border-collapse: collapse;
    }

    .booking-table th, .booking-table td {
      border: 1px solid #ddd;
      padding: 8px;
      text-align: left;
    }

    .booking-table th {
      background-color: #f2f2f2;
    }

    .header {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }

    .footer {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding-top: 1em;
    }

    .footer p {
      font-size: 0.8em;
      color: gray;
    }

    .clickable {
      cursor: pointer;
    }
    `
  ],
  imports: [CommonModule, HttpClientModule, PdfViewerModule],
  providers: [MythicLedgerService]
})
export class MythicLedgerComponent {

  blockingCallInProgress = false;

  actor$: any;

  data: any;

  constructor(private mythicLedgerService: MythicLedgerService) {



    const machine = setup(machineSetup)
      .createMachine(stateSetup(this.mythicLedgerService) as any);
    this.actor$ = createActor(machine, {
      input: {
        type: 'login',
      },
    });
    this.actor$.start();

    this.actor$.subscribe((data: any) => this.data = data.value);
    
    console.log("Data is ", this.data);
    console.dir(this.data);
  }

  sendEvent(event: "book" | "login" | "accept" | "acknowledge" | "loadUserDetails" | "requestABooking" | "logout" | "decline" ) {
    this.actor$.send({ type: event });
  }

}
