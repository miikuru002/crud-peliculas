import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PeliculasService } from 'src/app/services/peliculas.service';
import { Pelicula } from 'src/typings';
import { ShareDataService } from 'src/app/services/share-data.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

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
    private sharedService: ShareDataService,
    private formBuilder: FormBuilder
  ) {
    this.peliculaData = {} as Pelicula;
  }

  peliculaData: Pelicula;

  //atributo para indicar que esta en modo edición
  isEditMode: boolean = false;

  //atributo para el formulario
  form!: FormGroup;

  ngOnInit(): void {
    //si el objeto compartido existe
    if (this.sharedService.sharedObject) {
      //destrucutación de objetos
      const { isEditMode, peliculaDataToEdit } = this.sharedService.sharedObject;
      this.peliculaData = peliculaDataToEdit; //asigna los datos de la película a editar
      this.isEditMode = isEditMode; //asigna el modo de edición

      //inicializa el formulario con los datos de la película a editar
      const { name, photo, duracion, genero } = this.peliculaData;

      this.form = this.formBuilder.group({
        name: [name, Validators.required],
        photo: [photo, Validators.required],
        duracion: [
          duracion,
          [Validators.required, Validators.min(60), Validators.max(240)],
        ],
        genero: [genero, Validators.required],
      });

      //termina la ejecución del método
      return;
    }

    //inicializa el formulario
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      photo: ['', Validators.required],
      duracion: [
        '',
        [Validators.required, Validators.min(60), Validators.max(240)],
      ],
      genero: ['', Validators.required],
    });
  }

  /**
   * Crea una nueva película
   */
  createPelicula() {
    this.peliculasService.create({
      id: 0,
      ...this.form.value,
    }).subscribe({
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
    this.peliculasService.updatePelicula({
      id: this.peliculaData.id,
      ...this.form.value,
    }).subscribe({
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

  /**
   * Cierra el dialogo y resetea el formulario
   */
  closeDialog() {
    this.dialogRef.close();
    this.form.reset(); //resetea el formulario
  }
}
