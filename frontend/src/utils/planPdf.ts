import {jsPDF} from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { TravelPlan } from '../models/travel';
import { formatCurrency, formatDate } from './format';

const MARGIN_X = 14;
const PAGE_BOTTOM = 270;
const HEADER_COLOR: [number, number, number] = [56, 189, 248];

function lastTableBottom(doc: jsPDF): number {
    const withTable = doc as jsPDF & { lastAutoTable?: {finalY: number}};
    return withTable.lastAutoTable?.finalY ?? 20;
}

function sectionTitle(doc: jsPDF, title: string, y: number): number {
    let cursor = y;

    if (cursor > PAGE_BOTTOM) {
        doc.addPage();
        cursor = 20;
    }

    doc.setFontSize(13);
    doc.setTextColor(3, 105, 161);
    doc.text(title, MARGIN_X, cursor);

    return cursor + 3;
}

export function exportPlanToPdf(plan: TravelPlan): void {
    const doc = new jsPDF();
    let y = 20;

    doc.setFontSize(20);
    doc.setTextColor(3, 105, 161);
    doc.text(plan.name, MARGIN_X, y);
    y += 8;

    doc.setFontSize(11);
    doc.setTextColor(90);
    doc.text(
        `${formatDate(plan.startDate)} - ${formatDate(plan.endDate)}`,
        MARGIN_X,
        y,
    );
    y += 6;

    if (plan.description) {
        const lines = doc.splitTextToSize(plan.description, 180) as string[];
        doc.text(lines, MARGIN_X, y);
        y += lines.length * 5;
    }

    y += 4;

    autoTable(doc, {
        startY: y,
        theme: 'grid',
        headStyles: {fillColor: HEADER_COLOR},
        head: [['Budget', 'Spent', 'Remaining']],
        body: [
            [
                formatCurrency(plan.budget),
                formatCurrency(plan.totalExpenses),
                formatCurrency(plan.remainingBudget),
            ],
        ],
    });

    y = lastTableBottom(doc) + 12;

    if (plan.destinations.length > 0) {
        y = sectionTitle(doc, 'Destinations', y);

        autoTable(doc, {
            startY: y,
            theme: 'striped',
            headStyles: {fillColor: HEADER_COLOR},
            head: [['Name', 'Location', 'Arrival', 'Departure']],
            body: plan.destinations.map((destination) => [
                destination.name,
                destination.location,
                formatDate(destination.arrivalDate),
                formatDate(destination.departureDate),
            ]),
        });

        y = lastTableBottom(doc) + 12;
    }

    if (plan.activities.length > 0) {
    y = sectionTitle(doc, 'Activities', y);

    autoTable(doc, {
      startY: y,
      theme: 'striped',
      headStyles: { fillColor: HEADER_COLOR },
      head: [['Date', 'Time', 'Activity', 'Location', 'Status', 'Est. cost']],
      body: plan.activities.map((activity) => [
        formatDate(activity.date),
        activity.time ?? '-',
        activity.name,
        activity.location ?? '-',
        activity.status,
        activity.estimatedCost !== null
          ? formatCurrency(activity.estimatedCost)
          : '-',
      ]),
    });

    y = lastTableBottom(doc) + 12;
  }

  if (plan.expenses.length > 0) {
    y = sectionTitle(doc, 'Expenses', y);

    autoTable(doc, {
      startY: y,
      theme: 'striped',
      headStyles: { fillColor: HEADER_COLOR },
      head: [['Date', 'Expense', 'Category', 'Amount']],
      body: plan.expenses.map((expense) => [
        formatDate(expense.date),
        expense.name,
        expense.category,
        formatCurrency(expense.amount),
      ]),
      foot: [['', '', 'Total', formatCurrency(plan.totalExpenses)]],
      footStyles: { fillColor: [226, 232, 240], textColor: 20 },
    });

    y = lastTableBottom(doc) + 12;
  }

  if (plan.checklistItems.length > 0) {
    y = sectionTitle(doc, 'Checklist', y);

    autoTable(doc, {
      startY: y,
      theme: 'striped',
      headStyles: { fillColor: HEADER_COLOR },
      head: [['Done', 'Item']],
      body: plan.checklistItems.map((item) => [
        item.isCompleted ? 'X' : '',
        item.name,
      ]),
      columnStyles: { 0: { cellWidth: 16, halign: 'center' } },
    });

    y = lastTableBottom(doc) + 12;
  }

  if (plan.notes) {
    y = sectionTitle(doc, 'Notes', y) + 4;

    doc.setFontSize(10);
    doc.setTextColor(60);
    doc.text(doc.splitTextToSize(plan.notes, 180) as string[], MARGIN_X, y);
  }

  const fileName = `${plan.name.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}.pdf`;
  doc.save(fileName);
}
