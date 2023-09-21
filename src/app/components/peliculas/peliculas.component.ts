import { Component } from '@angular/core';
import { PeliculasService } from '../../services/peliculas.service';
import { Pelicula } from 'src/typings';
import { MatDialog } from '@angular/material/dialog';
import { PeliculaDialogComponent } from '../pelicula-dialog/pelicula-dialog.component';
import { Subscription } from 'rxjs';

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
    public dialog: MatDialog
  ) {
    //se inicializa una suscripción para el observable peliculaCreated$ (para detectar la creación de películas)
    this.peliculasService.peliculaCreated$.subscribe(() => {
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
    this.peliculasService.getList().subscribe((response) => {
      this.dataSource = response;
    });
  }
}
