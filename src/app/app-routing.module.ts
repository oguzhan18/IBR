import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { contactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { ImageuploadComponent } from './imageupload/imageupload.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'privacypolicy', component: PrivacypolicyComponent },
  { path: 'contact', component: contactComponent },
  { path: 'imageupload', component: ImageuploadComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
