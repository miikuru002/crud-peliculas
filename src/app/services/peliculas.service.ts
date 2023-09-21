import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError, tap, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Pelicula } from 'src/typings';

@Injectable({
  providedIn: 'root',
})
export class PeliculasService {
  //inyectar la dependencia HttpClient
  constructor(private http: HttpClient) {}

  /**
   * Metodo que se encarga de manejar los errores
   * @param error Error a manejar
   * @returns Un error
   */
  handlerError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.log(`An error ocurred ${error.status}, body was: ${error.error}`);
    } else {
      console.log(
        `Backend returned code ${error.status}, body was: ${error.error}`
      );
    }

    //lanza el error
    return throwError(
      () =>
        new Error('Something happened with request, please try again later.')
    );
  }

  //observable que notificará la creación de películas
  private peliculaCreatedSubject = new Subject<void>();
  //método para emitir una notificación de creación de película
  private onPeliculaCreated() {
    this.peliculaCreatedSubject.next();
  }
  //observable que los componentes pueden suscribir para detectar creación de películas
  peliculaCreated$ = this.peliculaCreatedSubject.asObservable();

  /**
   * Obtiene la lista de peliculas (GET)
   */
  getList() {
    return this.http
      .get<Pelicula[]>(environment.baseUrl)
      .pipe(catchError(this.handlerError));
  }

  /**
   * Crea una pelicula (POST)
   * @param pelicula Datos de la pelicula a crear
   */
  create(pelicula: Pelicula) {
    return this.http.post(environment.baseUrl, pelicula).pipe(
      catchError(this.handlerError),
      tap(() => {
        this.onPeliculaCreated(); // Esto recupera la lista actualizada de películas
      })
    );
  }
}
