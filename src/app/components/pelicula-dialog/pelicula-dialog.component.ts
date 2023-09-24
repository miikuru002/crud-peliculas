import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PeliculasService } from 'src/app/services/peliculas.service';
import { Pelicula } from 'src/typings';
import { ShareDataService } from 'src/app/services/share-data.service';

@Component({
  selector: 'app-pelicula-dialog',
  templateUrl: './pelicula-dialog.component.html',
  styleUrls: ['./pelicula-dialog.component.scss'],
})
export class PeliculaDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<PeliculaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string },
    private peliculasService: PeliculasService,
    private _snackBar: MatSnackBar,
    private sharedService: ShareDataService
  ) {
    this.peliculaData = {} as Pelicula;
  }

  peliculaData: Pelicula;

  //atributo para indicar que esta en modo edición
  isEditMode: boolean = false;

  ngOnInit(): void {
    //si el objeto compartido existe
    if (this.sharedService.sharedObject) {
      //destrucutación de objetos
      const { isEditMode, peliculaDataToEdit } = this.sharedService.sharedObject;
      this.peliculaData = peliculaDataToEdit; //asigna los datos de la película a editar
      this.isEditMode = isEditMode; //asigna el modo de edición
    }
  }

  /**
   * Crea una nueva película
   */
  createPelicula() {
    this.peliculaData.id = 0;
    this.peliculasService.create(this.peliculaData).subscribe({
      //sirve para obtener la respuesta del servidor y para desencadenar acciones
      next: (response) => {
        this.dialogRef.close();
        this.openSnackBar('Película creada', 'Ok');
      },
      //se ejecuta cuando hay un error
      error: (error) => {
        this.openSnackBar('Error al crear película', 'Ok');
      },
    });
  }

  /**
   * Actualiza una película
   */
  updatePelicula() {
     this.peliculasService.updatePelicula(this.peliculaData).subscribe({
      next: () => {
        this.dialogRef.close();
        this.openSnackBar('Pelicula actualizada correctamente', 'Ok');
      },
      error: (error) => {
        this.openSnackBar(`Error al actualizar pelicula -> ${error.message}`);
      },
    });
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
