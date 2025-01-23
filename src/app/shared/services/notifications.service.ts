import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private httpClient: HttpClient) { }

  getAllNotifications() {
    return this.httpClient.get(environment.serverUrl + "/api/notification/getAll");
  }

}
