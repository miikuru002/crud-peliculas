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

  //observable que notificará cuando se crea/actualiza/elimina una película
  private peliculaChangedSubject = new Subject<void>();
  //método para emitir una notificación de película
  private onPeliculaChanged() {
    this.peliculaChangedSubject.next();
  }
  //observable que los componentes pueden suscribir para detectar la notificación
  peliculaChanged$ = this.peliculaChangedSubject.asObservable();

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
   * @param peliculaData Datos de la pelicula a crear
   */
  create(peliculaData: Pelicula) {
    return this.http.post(environment.baseUrl, peliculaData).pipe(
      catchError(this.handlerError),
      tap(() => {
        this.onPeliculaChanged(); // Esto recupera la lista actualizada de películas
      })
    );
  }

  /**
   * Elimina una pelicula (DELETE)
   * @param peliculaId Id de la pelicula a eliminar
   */
  deletePelicula(peliculaId: number) {
    return this.http.delete(`${environment.baseUrl}/${peliculaId}`).pipe(
      catchError(this.handlerError),
      tap(() => {
        this.onPeliculaChanged(); // Esto recupera la lista actualizada de películas
      })
    );
  }

  /**
   * Actualiza una pelicula (PUT)
   * @param peliculaData Datos de la pelicula a actualizar
   */
  updatePelicula(peliculaData: Pelicula) {
    return this.http
      .put(`${environment.baseUrl}/${peliculaData.id}`, peliculaData)
      .pipe(
        catchError(this.handlerError),
        tap(() => {
          this.onPeliculaChanged(); // Esto recupera la lista actualizada de películas
        })
      );
  }
}
