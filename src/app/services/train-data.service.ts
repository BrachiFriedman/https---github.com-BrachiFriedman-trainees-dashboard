import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class TraineeDataService {
    private data = [
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

    setData(data: any[]) {
        this.data = data;
    }

    getData(): any[] {
        return this.data;
    }
}
