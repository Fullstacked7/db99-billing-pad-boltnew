import React from 'react';
import { Page } from '../types';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { FileDown, Phone, Globe } from 'lucide-react';

interface PDFExportProps {
  pages: Page[];
  billName: string;
  billDate: string;
  billTotal: number;
}

const PDFExport: React.FC<PDFExportProps> = ({ pages, billName, billDate, billTotal }) => {
  const generatePDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 10;
    const contentWidth = pageWidth - 2 * margin;
    const contentHeight = pageHeight - 2 * margin;
    const tableWidth = (contentWidth - margin) / 2;
    const tableHeight = (contentHeight - 60) / 2; // Adjusted for header and footer

    // Add header
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('Discount Bazaar 99', margin, margin + 10);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Bill Name: ${billName}`, pageWidth - margin, margin + 5, { align: 'right' });
    doc.text(`Date: ${billDate}`, pageWidth - margin, margin + 10, { align: 'right' });
    doc.text(`Bill Total: ₹${billTotal.toFixed(2)}`, pageWidth - margin, margin + 15, { align: 'right' });

    let currentPage = 1;
    let xOffset = margin;
    let yOffset = margin + 25; // Adjusted for header

    // Create placeholder tables
    const createPlaceholderTable = (x: number, y: number, pageNum: number) => {
      doc.setDrawColor(200);
      doc.rect(x, y, tableWidth, tableHeight);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`Page ${pageNum}`, x + 2, y + 5);
    };

    pages.forEach((page, pageIndex) => {
      if (pageIndex > 0 && pageIndex % 4 === 0) {
        doc.addPage();
        currentPage++;
        xOffset = margin;
        yOffset = margin + 25; // Adjusted for header
      }

      const x = pageIndex % 2 === 0 ? margin : margin + tableWidth + margin / 2;
      const y = pageIndex % 4 < 2 ? yOffset : yOffset + tableHeight + margin / 2;

      createPlaceholderTable(x, y, pageIndex + 1);

      (doc as any).autoTable({
        startY: y + 10,
        head: [['Qty', 'Price', 'Amount']],
        body: page.rows
          .filter(row => row.quantity !== 0 || row.price !== 0)
          .map(row => [row.quantity, row.price, row.amount.toFixed(2)]),
        margin: { left: x },
        tableWidth: tableWidth - 4,
        styles: { fontSize: 8, cellPadding: 1 },
        columnStyles: { 0: { cellWidth: (tableWidth - 4) * 0.3 }, 1: { cellWidth: (tableWidth - 4) * 0.3 }, 2: { cellWidth: (tableWidth - 4) * 0.4 } },
        theme: 'plain'
      });

      doc.setFontSize(8);
      doc.text(`Page Total: ₹${page.total.toFixed(2)}`, x + 2, y + tableHeight - 2);

      if ((pageIndex + 1) % 2 === 0 && (pageIndex + 1) % 4 !== 0) {
        xOffset = margin;
        yOffset = yOffset + tableHeight + margin / 2;
      }
    });

    // Add footer
    const footerY = pageHeight - margin - 5;
    doc.setDrawColor(255, 200, 200);
    doc.setFillColor(255, 200, 200);
    doc.rect(margin, footerY - 10, contentWidth, 15, 'F');
    
    doc.setFontSize(8);
    doc.setTextColor(0);
    doc.setFont('helvetica', 'normal');
    doc.text('📞 8989199099 | 9302651250', margin + 5, footerY);
    doc.textWithLink('🌐 www.discountbazaar99.com', pageWidth - margin - 5, footerY, { align: 'right', url: 'http://www.discountbazaar99.com' });

    // Save the PDF
    const fileName = `${billDate.replace(/\//g, '-')}-${billName.replace(/\s+/g, ' ')}-Bill.pdf`;
    doc.save(fileName);
  };

  return (
    <button
      onClick={generatePDF}
      className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center"
    >
      <FileDown className="mr-2" size={16} />
      Export PDF
    </button>
  );
};

export default PDFExport;