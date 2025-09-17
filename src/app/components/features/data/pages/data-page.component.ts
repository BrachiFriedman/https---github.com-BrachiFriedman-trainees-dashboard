import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { TraineeDataService } from '../../../../services/train-data.service';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatPaginatorModule } from '@angular/material/paginator';

@Component({
  selector: 'app-data-page',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatIconModule,
    MatPaginatorModule
  ],
  templateUrl: './data-page.component.html',
  styleUrls: ['./data-page.component.scss']
})
export class DataPageComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['id', 'name', 'subject', 'date', 'grade', 'edit', 'delete'];

  data: any[] = [
    { id: 1, name: 'נועה כהן', subject: 'מתמטיקה', date: '2025-01-01', grade: 85 },
    { id: 2, name: 'מיכל לוי', subject: 'אנגלית', date: '2025-01-03', grade: 72 },
    { id: 3, name: 'יהודה יהודאי', subject: 'היסטוריה', date: '2025-01-05', grade: 90 },
    { id: 4, name: 'ישראל ישראלי', subject: 'מתמטיקה', date: '2025-01-05', grade: 92 },
    { id: 5, name: 'יהודה יהודאי', subject: 'היסטוריה', date: '2025-01-05', grade: 90 },
    { id: 6, name: 'חיים חימוביץ', subject: 'אנגלית', date: '2025-01-05', grade: 90 },
    { id: 7, name: 'יהודה יהודאי', subject: 'אנגלית', date: '2025-01-05', grade: 60 },
    { id: 8, name: 'מיכל לוי', subject: 'היסטוריה', date: '2025-01-05', grade: 55 },
    { id: 9, name: 'נועה כהן', subject: 'היסטוריה', date: '2025-01-05', grade: 100 },
    { id: 10, name: 'חיים חימוביץ', subject: 'היסטוריה', date: '2025-01-05', grade: 85 },
    { id: 11, name: 'ישראל ישראלי', subject: 'היסטוריה', date: '2025-01-05', grade: 55 },
  ];

  dataSource = new MatTableDataSource<any>(this.data);

  filterValue = '';
  selectedTrainee: any = null;

  constructor(private traineeService: TraineeDataService) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit() {
    this.traineeService.setData(this.data);
  }

  get filteredData() {
    if (!this.filterValue.trim()) return this.data;
    return this.data.filter((item: any) =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(this.filterValue.toLowerCase())
      )
    );
  }

  selectTrainee(row: any) {
    this.selectedTrainee = { ...row };
  }
  
  //הוספת מתאמן
  addTrainee() {
    const newId = this.data.length ? Math.max(...this.data.map(t => t.id)) + 1 : 1;
    const newTrainee = { id: newId, name: '', subject: '', date: '', grade: 0 };
    this.data = [newTrainee, ...this.data];
    this.dataSource.data = this.data;
    this.selectedTrainee = newTrainee;
  }

  //שמירת מתאמן
  saveTrainee() {
    const existingIndex = this.data.findIndex((t: any) => t.id === this.selectedTrainee.id);
    if (existingIndex !== -1) {
      this.data[existingIndex] = { ...this.selectedTrainee };
    } else {
      this.data = [this.selectedTrainee, ...this.data];
    }
    this.dataSource.data = this.data;
    this.selectedTrainee = null;

    this.traineeService.setData(this.data);
  }

  //מחיקת מתאמן
  deleteTrainee(element: any) {
    this.data = this.data.filter((t: any) => t.id !== element.id);
    this.dataSource.data = this.data;
    if (this.selectedTrainee?.id === element.id) {
      this.selectedTrainee = null;
    }
  }
}
