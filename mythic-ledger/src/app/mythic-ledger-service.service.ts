import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from './models/user';
import { CustomerRegisterResponse } from './models/customer-register-response';
import { CustomerRegisterRequest } from './models/customer-register-request';

@Injectable({
  providedIn: 'root'
})
export class MythicLedgerService {

  constructor(private httpClient: HttpClient) { }

  private readonly serviceUrl = 'http://localhost:8000';

  registerUser(user: User) {
    return this.httpClient.post<CustomerRegisterResponse>(`${this.serviceUrl}/customer`, {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      phone: user.phone,
      preferred_contact_method: user.preferred_contact_method,
      preferred_time_of_contact: user.preferred_time_of_contact
    } as CustomerRegisterRequest);
  }

  // getCurrentBookings(hostname: string, username: string) {
  //   return this.httpClient.get<Booking[]>(`${this.serviceUrl}/bookings?hostname=${hostname}&username=${username}`);
  // }

  // requestBooking(hostname: string, username: string, bookingId: string) {
  //   return this.httpClient.post<Booking>(`${this.serviceUrl}/bookings/${bookingId}/request`, {
  //     hostname,
  //     username
  //   } as RequestBookingRequest);
  // }

  // getContract(hostname: string, username: string) {
  //   return this.httpClient.get<Contract>(`${this.serviceUrl}/contracts?hostname=${hostname}&username=${username}`);
  // }

  // acceptContract(hostname: string, username: string, contractId: string) {
  //   return this.httpClient.post<Contract>(`${this.serviceUrl}/contracts/${contractId}/accept`, {
  //     hostname,
  //     username
  //   } as AcceptContractRequest);
  // }

  // createContract(hostname: string, username: string, contract: Contract) {
  //   return this.httpClient.post<Contract>(`${this.serviceUrl}/contracts?hostname=${hostname}&username=${username}`, contract);
  // }

}
