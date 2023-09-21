import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PeliculasService } from 'src/app/services/peliculas.service';
import { Pelicula } from 'src/typings';

@Component({
  selector: 'app-pelicula-dialog',
  templateUrl: './pelicula-dialog.component.html',
  styleUrls: ['./pelicula-dialog.component.scss'],
})
export class PeliculaDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<PeliculaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string },
    private peliculasService: PeliculasService
  ) {
    this.peliculaData = {} as Pelicula;
  }

  peliculaData: Pelicula;

  onSubmit(): void {
    this.createPelicula();
    this.dialogRef.close();
  }

  createPelicula() {
    this.peliculaData.id = 0;
    this.peliculasService.create(this.peliculaData).subscribe((response) => {});
  }
}
