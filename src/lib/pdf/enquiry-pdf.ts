import { jsPDF } from 'jspdf';
import { Enquiry } from '../supabase/types';

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 44;
const CONTENT_W = PAGE_W - MARGIN * 2;

const GREEN: [number, number, number] = [31, 51, 43];
const GOLD: [number, number, number] = [200, 139, 86];

// Resolves a remote/public URL (or passthrough for data URLs) to a JPEG data URL.
async function toJpegDataUrl(source: string): Promise<string | null> {
  try {
    let dataUrl = source;
    if (!source.startsWith('data:')) {
      const res = await fetch(source);
      if (!res.ok) return null;
      const blob = await res.blob();
      dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
        reader.onerror = () => resolve('');
        reader.readAsDataURL(blob);
      });
      if (!dataUrl) return null;
    }

    if (dataUrl.startsWith('data:image/jpeg')) return dataUrl;

    const img = new Image();
    img.src = dataUrl;
    await img.decode();
    const scale = Math.min(1, 1280 / Math.max(img.naturalWidth, img.naturalHeight, 1));
    const w = Math.max(1, Math.round(img.naturalWidth * scale));
    const h = Math.max(1, Math.round(img.naturalHeight * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, w, h);
    return canvas.toDataURL('image/jpeg', 0.85);
  } catch {
    return null;
  }
}

async function imageSize(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => resolve({ width: 0, height: 0 });
    img.src = dataUrl;
  });
}

export async function generateEnquiryPdf(enquiry: Enquiry): Promise<void> {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  let y = MARGIN;

  const ensureSpace = (needed: number) => {
    if (y + needed > PAGE_H - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  };

  // Header band
  doc.setFillColor(...GREEN);
  doc.rect(0, 0, PAGE_W, 92, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(17);
  doc.text('VIRSAA GIFTS', MARGIN, 40);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(228, 181, 138);
  doc.text('Enquiry Report', MARGIN, 58);
  doc.setFontSize(9);
  doc.setTextColor(215, 215, 215);
  doc.text(`ID: ${enquiry.id}`, PAGE_W - MARGIN, 38, { align: 'right' });
  doc.text(
    new Date(enquiry.created_at).toLocaleString('en-IN') + '  •  Status: ' + enquiry.status,
    PAGE_W - MARGIN,
    52,
    { align: 'right' }
  );

  y = 120;

  const sectionTitle = (label: string) => {
    y += 10;
    ensureSpace(40);
    doc.setFillColor(...GOLD);
    doc.rect(MARGIN, y, 3, 15, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...GREEN);
    doc.text(label.toUpperCase(), MARGIN + 11, y + 12);
    y += 24;
  };

  const labelValue = (label: string, value: string) => {
    const lines = doc.splitTextToSize(value || '—', CONTENT_W - 160);
    const block = Math.max(18, lines.length * 13);
    ensureSpace(block);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(130, 130, 130);
    doc.text(label, MARGIN, y);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(30, 30, 30);
    doc.text(lines, MARGIN + 160, y);
    y += block;
  };

  const paragraph = (label: string, text: string) => {
    const lines = doc.splitTextToSize(text || '—', CONTENT_W);
    const block = 20 + lines.length * 13;
    ensureSpace(block);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...GOLD);
    doc.text(label.toUpperCase(), MARGIN, y);
    y += 14;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(30, 30, 30);
    doc.text(lines, MARGIN, y);
    y += lines.length * 13 + 10;
  };

  // Customer
  sectionTitle('Customer Details');
  labelValue('Name', enquiry.name);
  labelValue('Email', enquiry.email);
  labelValue('Phone', enquiry.phone || '—');
  labelValue('Company / Organization', enquiry.company_name || 'Individual');

  // Product & requirements
  sectionTitle('Product & Requirements');
  labelValue('Product', enquiry.product_name || 'Bespoke Custom Gifting Curation');
  labelValue('SKU', enquiry.product_sku || 'BESPOKE-CURATION');
  labelValue('Estimated Quantity', `${enquiry.quantity} units`);

  const customLines = doc.splitTextToSize(
    enquiry.customization_requirements || 'Standard packaging / Open to recommendation',
    CONTENT_W - 160
  );
  const customBlock = Math.max(18, customLines.length * 13);
  ensureSpace(customBlock);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(130, 130, 130);
  doc.text('Customization', MARGIN, y);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 30, 30);
  doc.text(customLines, MARGIN + 160, y);
  y += customBlock + 6;

  if (enquiry.personalization_text && enquiry.personalization_text.trim()) {
    paragraph('Text / Message to be Written on the Product', enquiry.personalization_text);
  }

  paragraph('Occasion / Timeline & Specific Requirements', enquiry.message || 'Interested in ordering customized units for corporate gifting.');

  if (enquiry.admin_notes && enquiry.admin_notes.trim()) {
    paragraph('Admin Notes', enquiry.admin_notes);
  }

  // Conversation thread
  if (enquiry.messages && enquiry.messages.length > 0) {
    sectionTitle('Conversation');
    for (const msg of enquiry.messages) {
      const sender = msg.sender_name || (msg.sender_type === 'admin' ? 'Virsaa Admin' : 'Customer');
      const time = new Date(msg.created_at).toLocaleString('en-IN');
      const lines = doc.splitTextToSize(msg.message || '', CONTENT_W);
      const block = 20 + lines.length * 13;
      ensureSpace(block);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(...GOLD);
      doc.text(`${sender}  •  ${time}`.toUpperCase(), MARGIN, y);
      y += 13;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(40, 40, 40);
      doc.text(lines, MARGIN, y);
      y += lines.length * 13 + 10;
    }
  }

  // Product image
  if (enquiry.product_image) {
    const dataUrl = await toJpegDataUrl(enquiry.product_image);
    if (dataUrl) {
      const dim = await imageSize(dataUrl);
      if (dim.width > 0) {
        sectionTitle('Product Reference');
        const maxW = 210;
        const maxH = 170;
        const scale = Math.min(maxW / dim.width, maxH / dim.height, 1);
        const w = dim.width * scale;
        const h = dim.height * scale;
        ensureSpace(h + 20);
        doc.addImage(dataUrl, 'JPEG', MARGIN, y, w, h);
        y += h + 22;
      }
    }
  }

  // Customer reference attachments
  if (enquiry.attachments && enquiry.attachments.length > 0) {
    sectionTitle('Customer Reference Images');
    const thumb = 96;
    for (const url of enquiry.attachments) {
      const dataUrl = await toJpegDataUrl(url);
      if (!dataUrl) continue;
      const dim = await imageSize(dataUrl);
      if (dim.width <= 0) continue;
      const scale = Math.min(thumb / dim.width, thumb / dim.height, 1);
      const w = Math.max(1, dim.width * scale);
      const h = Math.max(1, dim.height * scale);
      ensureSpace(thumb + 20);
      doc.addImage(dataUrl, 'JPEG', MARGIN, y, w, h);
      y += thumb + 18;
    }
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('Virsaa Gifts — Sustainable Corporate Gifting', MARGIN, PAGE_H - 22);
    doc.text(`Page ${i} of ${pageCount}`, PAGE_W - MARGIN, PAGE_H - 22, { align: 'right' });
  }

  doc.save(`Virsaa-Enquiry-${enquiry.id}.pdf`);
}