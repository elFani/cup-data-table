import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


import { AppComponent } from './app.component';
import { RosterComponent } from './components/roster.component';

import { CdkTableModule } from '@angular/cdk/table';
import { DragDropModule } from '@angular/cdk/drag-drop';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    CdkTableModule,
    FormsModule,
    ReactiveFormsModule,
    DragDropModule
  ],
  declarations: [
    AppComponent,
    RosterComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
