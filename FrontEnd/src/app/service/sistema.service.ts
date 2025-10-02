import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SistemaRequest {
  A: number[][];
  b: number[];
}

export interface SistemaResponse {
  classificacao: string;
  resultado: any;
  escalonado: any;
}

@Injectable({
  providedIn: 'root'
})
export class SistemaService {

  private apiUrl = 'http://127.0.0.1:8000/resolver';

  constructor(private http: HttpClient) {}

  resolverSistema(data: SistemaRequest): Observable<SistemaResponse> {
    return this.http.post<SistemaResponse>(this.apiUrl, data);
  }
}
