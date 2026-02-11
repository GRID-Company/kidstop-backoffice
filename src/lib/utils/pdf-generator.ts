import { jsPDF } from 'jspdf';

import { formatCurrency } from './format-currency';
import { formatDateTime } from './format-date';
import { KIDSTOP_LOGO_BASE64 } from './pdf-assets';

export interface PickingListItem {
  cardName: string;
  cardImageUrl?: string;
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

const PAGE_MARGIN = 12;
const PAGE_WIDTH = 210;
const PAGE_HEIGHT = 297;
const CONTENT_WIDTH = PAGE_WIDTH - PAGE_MARGIN * 2;
const FOOTER_HEIGHT = 16;

const GRID_COLS = 5;
const CARD_GAP = 3;
const CARD_WIDTH = (CONTENT_WIDTH - CARD_GAP * (GRID_COLS - 1)) / GRID_COLS;
const IMAGE_HEIGHT = CARD_WIDTH * 1.3;
const CARD_TEXT_HEIGHT = 20;
const CARD_CELL_HEIGHT = IMAGE_HEIGHT + CARD_TEXT_HEIGHT + CARD_GAP;

const HEADER_BAND_HEIGHT = 18;
const CHECKBOX_SIZE = 3;

type RGB = [number, number, number];

const TCG_COLORS: Record<string, { accent: RGB; accentLight: RGB }> = {
  POKEMON: { accent: [229, 50, 35], accentLight: [254, 236, 235] },
  MAGIC: { accent: [232, 93, 38], accentLight: [254, 240, 233] },
};

function getTcgColors(tcgType: string) {
  return TCG_COLORS[tcgType] ?? TCG_COLORS.POKEMON;
}

async function loadImageAsBase64(url: string): Promise<string | null> {
  try {
    return await new Promise<string | null>((resolve) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) { resolve(null); return; }
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => resolve(null);
      img.src = url;
    });
  } catch {
    return null;
  }
}

function drawHeaderBand(doc: jsPDF, data: PickingListData): number {
  const colors = getTcgColors(data.tcgType);

  doc.setFillColor(...colors.accent);
  doc.rect(0, 0, PAGE_WIDTH, HEADER_BAND_HEIGHT, 'F');

  try {
    doc.addImage(KIDSTOP_LOGO_BASE64, 'PNG', PAGE_MARGIN, 3, 40, 10);
  } catch {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('KIDSTOP', PAGE_MARGIN, 12);
  }

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(255, 255, 255);
  doc.text('Picking List', PAGE_MARGIN + 43, 11);

  const codeW = doc.getTextWidth(data.code) + 8;
  const codeX = PAGE_WIDTH - PAGE_MARGIN - codeW;
  doc.setFillColor(255, 255, 255);
  doc.roundedRect(codeX, 4, codeW, 10, 2, 2, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.accent);
  doc.text(data.code, codeX + codeW / 2, 10.5, { align: 'center' });

  return HEADER_BAND_HEIGHT;
}

function drawInfoSection(doc: jsPDF, data: PickingListData, startY: number): number {
  let y = startY + 8;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(60, 60, 60);

  const leftCol = PAGE_MARGIN;
  const rightCol = PAGE_MARGIN + CONTENT_WIDTH / 2;

  doc.text('Cliente', leftCol, y);
  doc.text('TCG', rightCol, y);
  y += 5;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);
  doc.text(data.customerName, leftCol, y);

  const colors = getTcgColors(data.tcgType);
  const tcgBadgeW = doc.getTextWidth(data.tcgType) + 5;
  doc.setFillColor(...colors.accentLight);
  doc.roundedRect(rightCol, y - 3, tcgBadgeW, 4.5, 1, 1, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.accent);
  doc.text(data.tcgType, rightCol + 2.5, y);
  y += 5;

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  doc.text(data.customerEmail, leftCol, y);
  doc.text(`Fecha: ${formatDateTime(data.createdAt)}`, rightCol, y);
  y += 5;

  if (data.notes) {
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    doc.text(`Notas: ${data.notes}`, leftCol, y);
    y += 5;
  }

  return y;
}

function drawSummaryBar(doc: jsPDF, data: PickingListData, startY: number): number {
  const colors = getTcgColors(data.tcgType);
  const y = startY + 3;
  const barH = 8;

  doc.setFillColor(...colors.accentLight);
  doc.roundedRect(PAGE_MARGIN, y, CONTENT_WIDTH, barH, 1.5, 1.5, 'F');

  const totalItems = data.items.reduce((sum, i) => sum + i.quantity, 0);
  const total = data.items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...colors.accent);

  const textY = y + 5.5;
  doc.text(
    `${totalItems} carta${totalItems !== 1 ? 's' : ''}  ·  ${data.items.length} línea${data.items.length !== 1 ? 's' : ''}`,
    PAGE_MARGIN + 4,
    textY
  );

  doc.setFontSize(8);
  doc.text(
    `Total: ${formatCurrency(total)}`,
    PAGE_WIDTH - PAGE_MARGIN - 4,
    textY,
    { align: 'right' }
  );

  return y + barH + 4;
}

function drawCheckbox(doc: jsPDF, x: number, y: number, accent: RGB): void {
  doc.setDrawColor(...accent);
  doc.setLineWidth(0.3);
  doc.roundedRect(x, y, CHECKBOX_SIZE, CHECKBOX_SIZE, 0.5, 0.5, 'S');
  doc.setLineWidth(0.2);
}

function drawCardCell(
  doc: jsPDF,
  x: number,
  y: number,
  item: PickingListItem,
  imageData: string | null,
  accent: RGB
): void {
  doc.setDrawColor(220, 220, 220);
  doc.setFillColor(252, 252, 252);
  doc.roundedRect(x, y, CARD_WIDTH, IMAGE_HEIGHT + CARD_TEXT_HEIGHT, 1.5, 1.5, 'FD');

  if (imageData) {
    try {
      const imgPad = 2;
      doc.addImage(
        imageData,
        'JPEG',
        x + imgPad,
        y + imgPad,
        CARD_WIDTH - imgPad * 2,
        IMAGE_HEIGHT - imgPad * 2
      );
    } catch {
      drawImagePlaceholder(doc, x, y);
    }
  } else {
    drawImagePlaceholder(doc, x, y);
  }

  const textX = x + 2.5;
  const textW = CARD_WIDTH - 5;
  const textTop = y + IMAGE_HEIGHT + 3.5;
  const textBottom = y + IMAGE_HEIGHT + CARD_TEXT_HEIGHT - 2;

  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 30, 30);
  const nameLines: string[] = doc.splitTextToSize(item.cardName, textW);
  doc.text(nameLines.slice(0, 2).join('\n'), textX, textTop);

  const midY = textTop + (nameLines.length > 1 ? 6 : 4);
  doc.setFontSize(5.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(110, 110, 110);
  doc.text(`${item.setName} (${item.setCode})`, textX, midY);
  doc.text(item.condition, textX, midY + 3);

  drawCheckbox(doc, textX, textBottom - 2.5, accent);

  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...accent);
  doc.text(`×${item.quantity}`, textX + CHECKBOX_SIZE + 1.5, textBottom);
  doc.setTextColor(30, 30, 30);
  doc.text(formatCurrency(item.unitPrice * item.quantity), x + CARD_WIDTH - 2.5, textBottom, {
    align: 'right',
  });
}

function drawImagePlaceholder(doc: jsPDF, x: number, y: number): void {
  doc.setFillColor(240, 240, 240);
  doc.rect(x + 2, y + 2, CARD_WIDTH - 4, IMAGE_HEIGHT - 4, 'F');
  doc.setFontSize(6);
  doc.setTextColor(180, 180, 180);
  doc.text('Sin imagen', x + CARD_WIDTH / 2, y + IMAGE_HEIGHT / 2, { align: 'center' });
}

function drawFooter(doc: jsPDF, accent: RGB): void {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);

    const footerY = PAGE_HEIGHT - FOOTER_HEIGHT;
    doc.setDrawColor(...accent);
    doc.setLineWidth(0.5);
    doc.line(PAGE_MARGIN, footerY, PAGE_WIDTH - PAGE_MARGIN, footerY);
    doc.setLineWidth(0.2);

    const textY = footerY + 5;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...accent);
    doc.text('Kidstop Singles Platform', PAGE_MARGIN, textY);

    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(160, 160, 160);
    doc.text(
      `Generado: ${formatDateTime(new Date().toISOString())}`,
      PAGE_WIDTH / 2,
      textY,
      { align: 'center' }
    );
    doc.text(`Página ${i} de ${pageCount}`, PAGE_WIDTH - PAGE_MARGIN, textY, {
      align: 'right',
    });
  }
}

export async function generatePickingListPdf(data: PickingListData): Promise<void> {
  const imagePromises = data.items.map((item) =>
    item.cardImageUrl ? loadImageAsBase64(item.cardImageUrl) : Promise.resolve(null)
  );
  const images = await Promise.all(imagePromises);

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const colors = getTcgColors(data.tcgType);

  let y = drawHeaderBand(doc, data);
  y = drawInfoSection(doc, data, y);
  y = drawSummaryBar(doc, data, y);

  const maxY = PAGE_HEIGHT - FOOTER_HEIGHT;

  data.items.forEach((item, idx) => {
    const col = idx % GRID_COLS;
    if (col === 0 && idx > 0) {
      y += CARD_CELL_HEIGHT;
    }

    if (y + CARD_CELL_HEIGHT > maxY && col === 0) {
      doc.addPage();
      y = PAGE_MARGIN;
    }

    const x = PAGE_MARGIN + col * (CARD_WIDTH + CARD_GAP);
    drawCardCell(doc, x, y, item, images[idx], colors.accent);
  });

  drawFooter(doc, colors.accent);
  doc.save(`picking-list-${data.code}.pdf`);
}
