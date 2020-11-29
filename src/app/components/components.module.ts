import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TimeAgoPipe } from 'time-ago-pipe';
import { DetailComponent } from './detail/detail.component';
import { SlidesComponent } from './slides/slides.component';
import { StartButtonComponent } from './start-button/start-button.component';
import { SubscriberUpdateComponent } from './subscriber-update/subscriber-update.component';
import { TimeagoComponent } from './timeago/timeago.component';
@NgModule({
  declarations: [
    DetailComponent,
    SubscriberUpdateComponent,
    SlidesComponent,
    StartButtonComponent,
    TimeagoComponent,
    TimeAgoPipe
  ],
  exports: [
    DetailComponent,
    SubscriberUpdateComponent,
    SlidesComponent,
    StartButtonComponent,
    TimeagoComponent
  ],
  entryComponents: [DetailComponent, SubscriberUpdateComponent],
  imports: [CommonModule, FormsModule, IonicModule]
})
export class ComponentsModule {}
