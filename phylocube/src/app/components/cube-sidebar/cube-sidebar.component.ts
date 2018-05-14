import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-cube-sidebar',
  templateUrl: './cube-sidebar.component.html',
  styleUrls: ['./cube-sidebar.component.scss']
})
export class CubeSidebarComponent implements OnInit {
  autoTicks = false;
  disabled = false;
  invert = false;
  max = 100;
  min = 0;
  showTicks = false;
  step = 1;
  thumbLabel = false;
  value = 0;
  vertical = false;

  get tickInterval(): number | 'auto' {
    return this.showTicks ? (this.autoTicks ? 'auto' : this._tickInterval) : 0;
  }
  set tickInterval(v) {
    this._tickInterval = Number(v);
  }
  private _tickInterval = 1;

  constructor() { }

  ngOnInit() {
  }

}
