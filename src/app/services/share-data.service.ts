import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShareDataService {
  //propiedad para almacenar el objeto compartido
  sharedObject: any; 
}
