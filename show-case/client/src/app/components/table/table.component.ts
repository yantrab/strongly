import { AfterViewInit, ChangeDetectionStrategy, Component, ContentChildren, ElementRef, Input, QueryList, ViewChild } from '@angular/core';
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

export declare type TableOptions<T> = {
  columns: ColumnDef<T>[];
  filter?: { placeholder: string };
  filterable?: boolean;
  rowActions?: { icon: string; action: ($event: MouseEvent, row: any) => any }[];
};

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TableComponent implements AfterViewInit {
  @Input() set dataSource(data: any[]) {
    this._dataSource = new TableVirtualScrollDataSource(data);
  }
  @Input() options?: TableOptions<any>;
  @ContentChildren(CellDefDirective) set matCellDefs(cells: QueryList<CellDefDirective>) {
    this._matCellDefs = keyBy(cells || {}, 'key');
  }
  @ViewChild('filter', { static: false }) filter?: ElementRef;
  _dataSource?: MatTableDataSource<any>;

  public columns?: string[];
  public _matCellDefs: Dictionary<any> = {};

  applyFilter($event: KeyboardEvent) {
    if (this._dataSource) this._dataSource.filter = ($event.target as any).value.trim().toLowerCase();
  }
  ngAfterViewInit() {
    if (!this.options) {
      this.options = { columns: Object.keys(this._dataSource?.data[0] || {}).map(key => ({ key })) };
    }
    this.columns = this.options.rowActions ? ['actions'] : [];
    this.columns?.push(...this.options?.columns.map(c => c.key));
  }
}
