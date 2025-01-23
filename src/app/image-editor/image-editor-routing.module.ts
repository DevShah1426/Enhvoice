import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CropImageComponent } from "./crop-image/crop-image.component";

const routes: Routes = [
  {
    path: "",
    component: CropImageComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ImageEditorRoutingModule {}
