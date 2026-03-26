import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { TestingComponent } from './testing.component';

@NgModule({
  declarations: [
    TestingComponent
  ],
  imports: [
    SharedModule
  ]
})
export class TestingModule { }
