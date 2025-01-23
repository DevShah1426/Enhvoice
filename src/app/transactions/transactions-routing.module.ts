import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { TransactionsComponent } from "./transactions/transactions.component";
import { ResultComponent } from "./result/result.component";

const routes: Routes = [
  {
    path: "",
    component: TransactionsComponent,
  },
  {
    path: "result",
    component: ResultComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TransactionsRoutingModule {}
