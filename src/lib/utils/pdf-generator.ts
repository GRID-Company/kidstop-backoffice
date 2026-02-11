import { jsPDF } from 'jspdf';

import { formatCurrency } from './format-currency';
import { formatDateTime } from './format-date';

export interface PickingListItem {
  cardName: string;
  setName: string;
  setCode: string;
  condition: string;
  quantity: number;
  unitPrice: number;
}

export interface PickingListData {
  code: string;
  customerName: string;
  customerEmail: string;
  tcgType: string;
  createdAt: string;
  notes?: string;
  items: PickingListItem[];
}

const PAGE_MARGIN = 20;
const LINE_HEIGHT = 7;
const FONT_SIZE_TITLE = 18;
const FONT_SIZE_SUBTITLE = 11;
const FONT_SIZE_BODY = 9;
const FONT_SIZE_TABLE_HEADER = 8;
const FONT_SIZE_TABLE_BODY = 8;

const TABLE_COLS = {
  index: { x: PAGE_MARGIN, w: 10 },
  card: { x: PAGE_MARGIN + 10, w: 55 },
  set: { x: PAGE_MARGIN + 65, w: 35 },
  condition: { x: PAGE_MARGIN + 100, w: 25 },
  qty: { x: PAGE_MARGIN + 125, w: 15 },
  price: { x: PAGE_MARGIN + 140, w: 25 },
  subtotal: { x: PAGE_MARGIN + 165, w: 25 },
};

function drawTableHeader(doc: jsPDF, y: number): number {
  doc.setFontSize(FONT_SIZE_TABLE_HEADER);
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(240, 240, 240);
  doc.rect(PAGE_MARGIN, y - 4, 170, LINE_HEIGHT, 'F');

  doc.text('#', TABLE_COLS.index.x + 1, y);
  doc.text('Carta', TABLE_COLS.card.x + 1, y);
  doc.text('Set', TABLE_COLS.set.x + 1, y);
  doc.text('Condición', TABLE_COLS.condition.x + 1, y);
  doc.text('Cant.', TABLE_COLS.qty.x + 1, y);
  doc.text('Precio', TABLE_COLS.price.x + 1, y);
  doc.text('Subtotal', TABLE_COLS.subtotal.x + 1, y);

  doc.setDrawColor(200, 200, 200);
  doc.line(PAGE_MARGIN, y + 2, PAGE_MARGIN + 170, y + 2);

  return y + LINE_HEIGHT;
}

function drawTableRow(
  doc: jsPDF,
  y: number,
  index: number,
  item: PickingListItem
): number {
  const subtotal = item.unitPrice * item.quantity;

  doc.setFontSize(FONT_SIZE_TABLE_BODY);
  doc.setFont('helvetica', 'normal');

  doc.text(String(index), TABLE_COLS.index.x + 1, y);
  doc.text(
    doc.splitTextToSize(item.cardName, TABLE_COLS.card.w - 2)[0],
    TABLE_COLS.card.x + 1,
    y
  );
  doc.text(`${item.setCode}`, TABLE_COLS.set.x + 1, y);
  doc.text(item.condition, TABLE_COLS.condition.x + 1, y);
  doc.text(String(item.quantity), TABLE_COLS.qty.x + 1, y);
  doc.text(formatCurrency(item.unitPrice), TABLE_COLS.price.x + 1, y);
  doc.text(formatCurrency(subtotal), TABLE_COLS.subtotal.x + 1, y);

  doc.setDrawColor(230, 230, 230);
  doc.line(PAGE_MARGIN, y + 2, PAGE_MARGIN + 170, y + 2);

  return y + LINE_HEIGHT;
}

export function generatePickingListPdf(data: PickingListData): void {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  let y = PAGE_MARGIN;

  doc.setFontSize(FONT_SIZE_TITLE);
  doc.setFont('helvetica', 'bold');
  doc.text('Kidstop - Picking List', PAGE_MARGIN, y);
  y += 10;

  doc.setFontSize(FONT_SIZE_SUBTITLE);
  doc.setFont('helvetica', 'bold');
  doc.text(data.code, PAGE_MARGIN, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`TCG: ${data.tcgType}`, PAGE_MARGIN + 80, y);
  y += LINE_HEIGHT;

  doc.setFontSize(FONT_SIZE_BODY);
  doc.text(`Cliente: ${data.customerName}`, PAGE_MARGIN, y);
  y += LINE_HEIGHT - 2;
  doc.text(`Email: ${data.customerEmail}`, PAGE_MARGIN, y);
  y += LINE_HEIGHT - 2;
  doc.text(`Fecha: ${formatDateTime(data.createdAt)}`, PAGE_MARGIN, y);
  y += LINE_HEIGHT - 2;

  if (data.notes) {
    doc.text(`Notas: ${data.notes}`, PAGE_MARGIN, y);
    y += LINE_HEIGHT - 2;
  }

  y += 4;
  doc.setDrawColor(100, 100, 100);
  doc.line(PAGE_MARGIN, y, PAGE_MARGIN + 170, y);
  y += LINE_HEIGHT;

  y = drawTableHeader(doc, y);

  let total = 0;
  data.items.forEach((item, idx) => {
    if (y > 270) {
      doc.addPage();
      y = PAGE_MARGIN;
      y = drawTableHeader(doc, y);
    }
    y = drawTableRow(doc, y, idx + 1, item);
    total += item.unitPrice * item.quantity;
  });

  y += 4;
  doc.setDrawColor(100, 100, 100);
  doc.line(PAGE_MARGIN, y, PAGE_MARGIN + 170, y);
  y += LINE_HEIGHT;

  doc.setFontSize(FONT_SIZE_SUBTITLE);
  doc.setFont('helvetica', 'bold');
  doc.text('Total:', TABLE_COLS.price.x + 1, y);
  doc.text(formatCurrency(total), TABLE_COLS.subtotal.x + 1, y);
  y += LINE_HEIGHT + 4;

  const totalItems = data.items.reduce((sum, i) => sum + i.quantity, 0);
  doc.setFontSize(FONT_SIZE_BODY);
  doc.setFont('helvetica', 'normal');
  doc.text(
    `${totalItems} ${totalItems === 1 ? 'carta' : 'cartas'} en ${data.items.length} ${data.items.length === 1 ? 'línea' : 'líneas'}`,
    PAGE_MARGIN,
    y
  );

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.getWidth() - PAGE_MARGIN,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'right' }
    );
    doc.text(
      `Generado: ${formatDateTime(new Date().toISOString())}`,
      PAGE_MARGIN,
      doc.internal.pageSize.getHeight() - 10
    );
  }

  doc.save(`picking-list-${data.code}.pdf`);
}
