import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { TraineeDataService } from '../../../../services/train-data.service';

@Component({
  selector: 'app-monitor-page',
  standalone:true,
  imports: [CommonModule,MatTableModule,MatFormFieldModule,MatSelectModule,MatOptionModule,FormsModule],
  templateUrl: './monitor-page.component.html',
  styleUrl: './monitor-page.component.scss'
})
export class MonitorPageComponent implements OnInit{
  constructor(private traineeService: TraineeDataService) {}

  allIds: string[] = [];
  allNames: string[] = [];

  selectedIds: string[] = [];
  selectedNames: string[] = [];
  selectedStatuses: string[] = [];

  fullData: any[] = [];
  filteredData: any[] = [];

  displayedColumns: string[] = ['id', 'name', 'average', 'status'];

  ngOnInit(): void {
    const rawData = this.traineeService.getData();
    this.fullData = this.calculateAverages(rawData);

    this.allIds = [...new Set(this.fullData.map(t => t.id.toString()))];
    this.allNames = [...new Set(this.fullData.map(t => t.name))];

    this.selectedIds = [...this.allIds];
    this.selectedNames = [...this.allNames];

    this.onFilterChange();
  }

  calculateAverages(data: any[]): any[] {
    const grouped = new Map<string, { id: string, name: string, grades: number[] }>();

    data.forEach(entry => {
      const key = entry.id.toString();
      if (!grouped.has(key)) {
        grouped.set(key, { id: key, name: entry.name, grades: [] });
      }
      grouped.get(key)!.grades.push(entry.grade);
    });

    return Array.from(grouped.values()).map(item => {
      const avg = item.grades.reduce((a, b) => a + b, 0) / item.grades.length;
      const status = avg >= 60 ? 'pass' : 'fail';
      return {
        id: item.id,
        name: item.name,
        average: avg,
        status
      };
    });
  }

  onFilterChange() {
    this.filteredData = this.fullData.filter(item =>
      (this.selectedIds.length === 0 || this.selectedIds.includes(item.id)) &&
      (this.selectedNames.length === 0 || this.selectedNames.includes(item.name)) &&
      (this.selectedStatuses.length === 0 || this.selectedStatuses.includes(item.status))
    );
  }
}
