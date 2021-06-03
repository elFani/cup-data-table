import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { RosterComponent } from './components/roster.component';

import { CdkTableModule } from '@angular/cdk/table';

@NgModule({
  imports: [BrowserModule, FormsModule, HttpClientModule, CdkTableModule],
  declarations: [AppComponent, HelloComponent, RosterComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
