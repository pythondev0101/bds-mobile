import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TimeAgoPipe } from 'time-ago-pipe';
import { DetailComponent } from './detail/detail.component';
import { FeedCardComponent } from './feed-card/feed-card.component';
import { FeedUpdateComponent } from './feed-update/feed-update.component';
import { SlidesComponent } from './slides/slides.component';
import { StartButtonComponent } from './start-button/start-button.component';
import { TimeagoComponent } from './timeago/timeago.component';
@NgModule({
  declarations: [
    DetailComponent,
    SlidesComponent,
    StartButtonComponent,
    FeedCardComponent,
    FeedUpdateComponent,
    TimeagoComponent,
    TimeAgoPipe
  ],
  exports: [
    DetailComponent,
    SlidesComponent,
    StartButtonComponent,
    FeedCardComponent,
    FeedUpdateComponent,
    TimeagoComponent
  ],
  entryComponents: [DetailComponent],
  imports: [CommonModule, FormsModule, IonicModule]
})
export class ComponentsModule {}
