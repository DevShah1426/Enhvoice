import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ImageEditorRoutingModule } from "./image-editor-routing.module";
import { CropImageComponent } from "./crop-image/crop-image.component";
import { SharedModule } from "../shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";
import { Icons } from "../../icons";
import { SvgIconComponent, provideSvgIcons } from "@ngneat/svg-icon";

@NgModule({
  declarations: [CropImageComponent],
  imports: [CommonModule, ImageEditorRoutingModule, SharedModule, ReactiveFormsModule, SvgIconComponent],
  providers: [provideSvgIcons(Icons)],
})
export class ImageEditorModule {}
