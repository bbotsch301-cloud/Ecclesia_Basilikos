import PDFDocument from 'pdfkit';

interface CertificateData {
  fullName: string;
  unitNumber: number;
  issuedAt: Date;
  totalActive: number;
}

export async function generateCertificatePDF(data: CertificateData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'LETTER',
      layout: 'landscape',
      margins: { top: 50, bottom: 50, left: 60, right: 60 },
    });

    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    const width = doc.page.width;
    const centerX = width / 2;
    const gold = '#D4AF37';
    const navy = '#1E3A8A';
    const darkGold = '#B8960C';

    // Border
    doc.rect(30, 30, width - 60, doc.page.height - 60)
       .lineWidth(3)
       .strokeColor(gold)
       .stroke();

    doc.rect(38, 38, width - 76, doc.page.height - 76)
       .lineWidth(1)
       .strokeColor(navy)
       .stroke();

    // Header
    doc.fontSize(14)
       .fillColor(gold)
       .text('ECCLESIA BASILIKOS TRUST', 60, 60, { align: 'center', width: width - 120 });

    doc.moveDown(0.3);
    doc.fontSize(28)
       .fillColor(navy)
       .text('Beneficial Unit Instrument', 60, undefined, { align: 'center', width: width - 120 });

    // Decorative line
    const lineY = doc.y + 10;
    doc.moveTo(centerX - 200, lineY)
       .lineTo(centerX + 200, lineY)
       .lineWidth(2)
       .strokeColor(gold)
       .stroke();

    doc.moveDown(1.5);

    // Certificate body
    doc.fontSize(12)
       .fillColor('#333333')
       .text('This certifies that', 60, undefined, { align: 'center', width: width - 120 });

    doc.moveDown(0.5);
    doc.fontSize(22)
       .fillColor(navy)
       .text(data.fullName, 60, undefined, { align: 'center', width: width - 120 });

    doc.moveDown(0.5);
    doc.fontSize(12)
       .fillColor('#333333')
       .text(`is the holder of Beneficial Unit #${data.unitNumber}`, 60, undefined, { align: 'center', width: width - 120 });

    doc.moveDown(0.3);
    doc.fontSize(11)
       .fillColor('#555555')
       .text(
         'representing one (1) equal and undivided beneficial interest in the Ecclesia Basilikos Trust.',
         60, undefined, { align: 'center', width: width - 120 }
       );

    doc.moveDown(0.8);
    doc.fontSize(10)
       .fillColor('#666666')
       .text(
         'The Trust Corpus comprises all assets of the Trust including but not limited to: educational content, platform resources, community assets, and financial contributions.',
         80, undefined, { align: 'center', width: width - 160 }
       );

    doc.moveDown(0.5);
    doc.fontSize(10)
       .fillColor('#666666')
       .text(
         'This unit entitles the holder to an equal proportional share (1/N) of the beneficial interest, where N equals the total number of active Beneficial Units issued.',
         80, undefined, { align: 'center', width: width - 160 }
       );

    doc.moveDown(1);

    // Current status box
    const percentage = data.totalActive > 0 ? (1 / data.totalActive * 100).toFixed(6) : '0';
    const statusY = doc.y;
    doc.rect(centerX - 180, statusY, 360, 50)
       .fillColor('#F0F4FF')
       .fill();
    doc.rect(centerX - 180, statusY, 360, 50)
       .strokeColor(navy)
       .lineWidth(0.5)
       .stroke();

    const issuedDate = new Date(data.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    doc.fontSize(9)
       .fillColor(navy)
       .text(`Issued: ${issuedDate}  |  Unit #${data.unitNumber}  |  Status: Active`, centerX - 170, statusY + 10, { align: 'center', width: 340 });
    doc.text(`As of ${currentDate}: ${data.totalActive} total units active — your interest: 1/${data.totalActive} (${percentage}%)`, centerX - 170, statusY + 28, { align: 'center', width: 340 });

    doc.moveDown(3);

    // Trustee attestation
    doc.fontSize(10)
       .fillColor('#555555')
       .text('Issued under the authority of the Trustee of the Ecclesia Basilikos Trust', 60, undefined, { align: 'center', width: width - 120 });

    doc.moveDown(2);

    // Signature line
    doc.moveTo(centerX - 100, doc.y)
       .lineTo(centerX + 100, doc.y)
       .lineWidth(1)
       .strokeColor('#999999')
       .stroke();

    doc.moveDown(0.3);
    doc.fontSize(9)
       .fillColor('#888888')
       .text('Trustee, Ecclesia Basilikos Trust', 60, undefined, { align: 'center', width: width - 120 });

    // Footer
    doc.moveDown(1);
    doc.fontSize(8)
       .fillColor(darkGold)
       .text('"But ye are a chosen generation, a royal priesthood, an holy nation, a peculiar people" — 1 Peter 2:9', 60, undefined, { align: 'center', width: width - 120 });

    doc.moveDown(0.5);
    doc.fontSize(7)
       .fillColor('#AAAAAA')
       .text('A Private Membership Association | This instrument is issued pursuant to the PMA Membership Agreement', 60, undefined, { align: 'center', width: width - 120 });

    doc.end();
  });
}
