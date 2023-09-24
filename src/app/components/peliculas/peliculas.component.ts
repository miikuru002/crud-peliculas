import { Component } from '@angular/core';
import { PeliculasService } from '../../services/peliculas.service';
import { Pelicula } from 'src/typings';
import { MatDialog } from '@angular/material/dialog';
import { PeliculaDialogComponent } from '../pelicula-dialog/pelicula-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ShareDataService } from 'src/app/services/share-data.service';

@Component({
  selector: 'app-peliculas',
  templateUrl: './peliculas.component.html',
  styleUrls: ['./peliculas.component.scss'],
})
export class PeliculasComponent {
  //columnas de la tabla
  displayedColumns: string[] = [
    'id',
    'name',
    'photo',
    'duracion',
    'genero',
    'actions',
  ];

  //atributos que contiene los datos a listar
  dataSource: Pelicula[] = [];

  //*inyectar las dependencias (servicio)
  constructor(
    private peliculasService: PeliculasService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private sharedService: ShareDataService
  ) {
    //se inicializa una suscripción para el observable peliculaCreated$ (para detectar la creación de películas)
    this.peliculasService.peliculaChanged$.subscribe(() => {
      this.getPeliculas(); //actualiza la lista de películas cuando se crea una nueva película
    });
  }

  /**
   * Abre el dialogo para crear una pelicula
   */
  openDialog(): void {
    const dialogRef = this.dialog.open(PeliculaDialogComponent, {
      width: '350px',
    });
  }

  /**
   * Este método se ejecuta al iniciar el componente
   */
  ngOnInit(): void {
    this.getPeliculas();
  }

  /**
   * Obtiene el listado de peliculas del servicio (READ)
   */
  getPeliculas() {
    this.peliculasService.getList().subscribe({
      //sirve para obtener la respuesta del servidor y para desencadenar acciones
      next: (response) => {
        this.dataSource = response;
        // this.openSnackBar("Datos cargados correctamente");
      },
      //se ejecuta cuando hay un error
      error: (error) => {
        this.openSnackBar(`Error al cargar datos -> ${error.message}`);
      },
    });
  }

  /**
   * Elimina una pelicula
   * @param peliculaId Id de la pelicula a eliminar
   */
  deletePelicula(peliculaId: number) {
    this.peliculasService.deletePelicula(peliculaId).subscribe({
      next: () => {
        this.openSnackBar('Pelicula eliminada correctamente', 'Ok');
      },
      error: (error) => {
        this.openSnackBar(`Error al eliminar pelicula -> ${error.message}`);
      },
    });
  }

  /**
   * Actualiza una pelicula
   * @param peliculaData Datos de la pelicula a actualizar
   */
  editPelicula(peliculaData: Pelicula) {
    //se asigna el objeto a compartir con el otro componente
    this.sharedService.sharedObject = {
      isEditMode: true,
      peliculaDataToEdit: peliculaData,
    }

    this.openDialog();
  }

  /**
   * Abre la alerta de snackbar
   * @param message Mensaje a mostrar
   * @param action Acción
   */
  openSnackBar(message: string, action?: string) {
    this._snackBar.open(message, action, { duration: 5_000 });
  }
}
