import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { NgChartsModule } from 'ng2-charts';
import { FormsModule } from '@angular/forms';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { TraineeDataService } from '../../../../services/train-data.service';


@Component({
  selector: 'app-analysis-page',
  standalone:true,
  imports: [CommonModule, MatTableModule, MatInputModule, MatFormFieldModule, MatOptionModule, MatSelectModule, NgChartsModule, FormsModule],
  templateUrl: './analysis-page.component.html',
  styleUrl: './analysis-page.component.scss'
})

export class AnalysisPageComponent implements OnInit {

  constructor(private traineeService: TraineeDataService) {}

  public barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      }
    }
  };

  public barChartType: ChartType = 'bar';

  allIds: string[] = [];
  allSubjects: string[] = [];

  selectedIds: string[] = [];
  selectedSubjects: string[] = [];

  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: []
  };
  
  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return 'ציון: ' + tooltipItem.raw;
          }
        }
      }
    }
  };

  public lineChartType: ChartType = 'line';
  public averageChartData: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };
  private fullData: any[] = [];

  ngOnInit(): void {
    this.fullData = this.traineeService.getData();

    // איחוד של כל האופציות האפשריות לבחירה
    this.allIds = [...new Set(this.fullData.map(t => t.id.toString()))];
    this.allSubjects = [...new Set(this.fullData.map(t => t.subject))];

    // ברירת מחדל – להציג הכל
    this.selectedIds = [...this.allIds];
    this.selectedSubjects = [...this.allSubjects];

    this.updateChart();
    this.updateLineChart();
    this.updateAverageChart();
  }
  onFilterChange(): void {
    this.updateChart(); // לעדכן את הגרף הראשון
    this.updateLineChart(); // לעדכן את הגרף השני
    this.updateAverageChart(); // לעדכן את הגרף השלישי
  }

  updateChart() {
    const data = this.traineeService.getData();
  
    const filtered = data.filter(entry => 
      (this.selectedIds.length === 0 || this.selectedIds.includes(entry.id.toString())) &&
      (this.selectedSubjects.length === 0 || this.selectedSubjects.includes(entry.subject))
    );
  
    const subjects = [...new Set(filtered.map(t => t.subject))];
  
    const groupedById: { [id: string]: number[] } = {};
  
    filtered.forEach(entry => {
      const id = entry.id.toString();
      if (!groupedById[id]) {
        groupedById[id] = Array(subjects.length).fill(0);
      }
      const subjectIndex = subjects.indexOf(entry.subject);
      if (subjectIndex !== -1) {
        groupedById[id][subjectIndex] = entry.grade;
      }
    });
  
    // כאן אנו יוצרים אובייקט חדש לגמרי:
    this.barChartData = {
      labels: subjects,
      datasets: Object.entries(groupedById).map(([id, grades]) => ({
        label: `Trainee ${id}`,
        data: grades
      }))
    };
  }

  updateLineChart() {
    const data = this.traineeService.getData();
  
    // סינון על פי בחירות המשתמש
    const filtered = data.filter(entry => 
      (this.selectedIds.length === 0 || this.selectedIds.includes(entry.id.toString())) &&
      (this.selectedSubjects.length === 0 || this.selectedSubjects.includes(entry.subject))
    );
  
    // קיבוץ הציונים לפי תאריך
    const groupedByDate: { [date: string]: number[] } = {};
    filtered.forEach(entry => {
      const date = entry.date;
      if (!groupedByDate[date]) {
        groupedByDate[date] = [];
      }
      groupedByDate[date].push(entry.grade);
    });
  
    // כאן אנחנו מכניסים את הציונים לתוך datasets
    const labels = Object.keys(groupedByDate); // dates as labels
    const datasets = Object.entries(groupedByDate).map(([date, grades]) => ({
      label: `התקדמות ל-${date}`,
      data: grades,
      fill: false,
      borderColor: 'blue',
      tension: 0.1
    }));
  
    // עדכון נתוני הגרף
    this.lineChartData = { labels, datasets };
  }

  updateAverageChart() {
    const data = this.traineeService.getData();
  
    const filtered = data.filter(entry =>
      (this.selectedIds.length === 0 || this.selectedIds.includes(entry.id.toString())) &&
      (this.selectedSubjects.length === 0 || this.selectedSubjects.includes(entry.subject))
    );
  
    const subjectMap: { [subject: string]: number[] } = {};
  
    filtered.forEach(entry => {
      if (!subjectMap[entry.subject]) {
        subjectMap[entry.subject] = [];
      }
      subjectMap[entry.subject].push(entry.grade);
    });
  
    const labels = Object.keys(subjectMap);
    const averages = labels.map(subject => {
      const grades = subjectMap[subject];
      const avg = grades.reduce((sum, val) => sum + val, 0) / grades.length;
      return parseFloat(avg.toFixed(2));
    });
  
    this.averageChartData = {
      labels,
      datasets: [{
        label: 'ממוצע לפי מקצוע',
        data: averages,
        backgroundColor: '#ffa726'
      }]
    };
  }
  charts = [
    { id: 1, title: 'Chart 1: ציונים לפי מתאמן' },
    { id: 2, title: 'Chart 2: התקדמות לפי זמן' },
    { id: 3, title: 'Chart 3: ממוצע לפי מקצוע' },
  ];

  visibleCharts = [this.charts[0], this.charts[1]];
  hiddenChart = this.charts[2];

  draggedChart: any = null;

  onDragStart() {
    this.draggedChart = this.hiddenChart;
  }

  onDrop(targetIndex: number) {
    const replaced = this.visibleCharts[targetIndex];
    this.visibleCharts[targetIndex] = this.draggedChart!;
    this.hiddenChart = replaced;
    this.draggedChart = null;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }
}



