import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import {HomeComponent} from "./home/home.component";
import { PageNotFoundComponent } from './404.component.ts';
import {ChatMessageComponent} from "./chat/chat.message.component";

import { routing,  appRoutingProviders }  from './app.routing';



@NgModule({
  declarations: [
    AppComponent,
    ChatComponent,
    ChatMessageComponent,
    HomeComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing
  ],
  providers: [appRoutingProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
