import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PeliculasComponent } from './components/peliculas/peliculas.component';

//se definen las rutas de la aplicacion
const routes: Routes = [
  { path:'home', component: HomeComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path:'business/peliculas', component: PeliculasComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full' }, //?-> cualquier otra ruta que no este definida, me redirige al /home
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
