﻿import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatRippleModule } from '@angular/material';
import { MatExpansionModule } from '@angular/material/expansion';

import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
    imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatToolbarModule,
        MatCardModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatAutocompleteModule,
        MatChipsModule,
        MatTabsModule,
        MatCheckboxModule,
        MatRippleModule,
        MatMenuModule,
        MatBottomSheetModule,
        MatExpansionModule,
    ],
    exports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatSelectModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatToolbarModule,
        MatCardModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatAutocompleteModule,
        MatChipsModule,
        MatTabsModule,
        MatCheckboxModule,
        MatRippleModule,
        MatMenuModule,
        MatBottomSheetModule,
        MatExpansionModule,
    ],
})
export class MyMaterialClass { }
