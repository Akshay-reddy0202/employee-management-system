import { Component, input, output } from '@angular/core';
import { DesignationInterface } from '../../interfaces/designation.model';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-designation-table',
  imports: [MatIconModule],
  templateUrl: './designation-table.html',
  styleUrl: './designation-table.css',
})
export class DesignationTable {
  readonly designations = input.required<DesignationInterface[]>();
  readonly edit = output<DesignationInterface>();

  protected onEdit(designation: DesignationInterface): void {
    this.edit.emit(designation);
  }

}
