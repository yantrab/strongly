import { Component, ContentChildren, Input, OnInit, QueryList, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
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
export class TableComponent implements OnInit {
  @Input() dataSource?: any[];
  @Input() options?: { columns: ColumnDef[]; filter?: { placeholder: string } };
  @ContentChildren(CellDefDirective) matCellDefs?: QueryList<CellDefDirective>;
  @ViewChild('filter', { static: false }) filter?: ElementRef;
  _dataSource: MatTableDataSource<any>;

  public columns?: string[] | undefined;
  public _matCellDefs: Dictionary<any> = {};
  constructor() {
    this._dataSource = new TableVirtualScrollDataSource();
  }

  ngOnInit(): void {
    this._dataSource = new TableVirtualScrollDataSource(this.dataSource);
    if (!this.options) {
      this.options = { columns: Object.keys(this.dataSource ? this.dataSource[0] : {}).map(key => ({ key })) };
    }
    this.columns = this.options?.columns.map(c => c.key);
    this._matCellDefs = keyBy(this.matCellDefs, 'key');
  }

  applyFilter($event: KeyboardEvent) {
    this._dataSource.filter = ($event.target as any).value.trim().toLowerCase();
  }
}
