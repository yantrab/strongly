import { Component, ContentChildren, Input, QueryList, ViewChild, ElementRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Dictionary, keyBy } from 'lodash';
import { TableVirtualScrollDataSource } from 'ng-table-virtual-scroll';
import { CellDefDirective } from './cell-def.directive';

export interface ColumnDef<T = any> {
  key: keyof T & string;
  title?: string;
  isSortable?: boolean;
  isFilterable?: boolean;
  width?: string;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent {
  @Input() set dataSource(data: any[]) {
    this._dataSource = new TableVirtualScrollDataSource(data);
    if (!this.options) {
      this.options = { columns: Object.keys(data[0] || {}).map(key => ({ key })) };
    }
    this.columns = this.options?.columns.map(c => c.key);
    this._matCellDefs = keyBy(this.matCellDefs, 'key');
  }
  @Input() options?: { columns: ColumnDef[]; filter?: { placeholder: string } };
  @ContentChildren(CellDefDirective) matCellDefs?: QueryList<CellDefDirective>;
  @ViewChild('filter', { static: false }) filter?: ElementRef;
  _dataSource?: MatTableDataSource<any>;

  public columns?: string[];
  public _matCellDefs: Dictionary<any> = {};

  applyFilter($event: KeyboardEvent) {
    if (this._dataSource) this._dataSource.filter = ($event.target as any).value.trim().toLowerCase();
  }
}
