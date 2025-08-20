import io
from django.http import HttpResponse
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch

def generate_invoice_pdf(invoice):
    """
    Generates a professional PDF for a given invoice object.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=30
    )

    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name="CenterTitle", alignment=1, fontSize=16, leading=20, spaceAfter=12, fontName="Helvetica-Bold"))
    styles.add(ParagraphStyle(name="SubTitle", alignment=1, fontSize=10, spaceAfter=10, fontName="Helvetica-Oblique"))
    styles.add(ParagraphStyle(name="TableHeader", fontSize=10, fontName="Helvetica-Bold"))
    styles.add(ParagraphStyle(name="NormalSmall", fontSize=9, leading=12))

    story = []

    # --- 1. Header: Company Name and Title ---
    story.append(Paragraph("AutoServe360", styles["CenterTitle"]))
    story.append(Paragraph("Two-Wheeler Service Pro", styles["SubTitle"]))
    story.append(Spacer(1, 0.25 * inch))
    story.append(Paragraph("INVOICE", styles["CenterTitle"]))
    story.append(Spacer(1, 0.25 * inch))

    # --- 2. Invoice Info and Customer Details Table ---
    invoice_info_data = [
        [
            Paragraph(f"Invoice #: {invoice.id}", styles["NormalSmall"]),
            Paragraph(f"Customer: {invoice.jobcard.customer.name}", styles["NormalSmall"])
        ],
        [
            Paragraph(f"Date: {invoice.created_at.strftime('%d/%m/%Y')}", styles["NormalSmall"]),
            Paragraph(f"Phone: {invoice.jobcard.customer.phone}", styles["NormalSmall"])
        ],
        [
            '',
            Paragraph(f"Vehicle: {invoice.jobcard.vehicle.make} {invoice.jobcard.vehicle.model}", styles["NormalSmall"])
        ],
        [
            '',
            Paragraph(f"Reg. No: {invoice.jobcard.vehicle.registration_no}", styles["NormalSmall"])
        ],
    ]
    invoice_table = Table(invoice_info_data, colWidths=[2.5 * inch, 4.5 * inch])
    invoice_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))
    story.append(invoice_table)
    story.append(Spacer(1, 0.3 * inch))

    # --- 3. Line Items Table (Parts and Labor) ---
    line_items_data = [
        [
            Paragraph("#", styles["TableHeader"]),
            Paragraph("Item Description", styles["TableHeader"]),
            Paragraph("Qty", styles["TableHeader"]),
            Paragraph("Unit Price", styles["TableHeader"]),
            Paragraph("Total", styles["TableHeader"])
        ]
    ]

    # Add parts used
    parts_used = invoice.jobcard.parts_used.all()
    for i, usage in enumerate(parts_used):
        total_price = usage.quantity_used * usage.price_at_time_of_use
        line_items_data.append([
            str(i + 1),
            usage.part.name,
            str(usage.quantity_used),
            f"{usage.price_at_time_of_use:.2f}",
            f"{total_price:.2f}"
        ])

    # Add labor charge
    line_items_data.append([
        str(len(parts_used) + 1),
        "Standard Labor Charge",
        "1",
        f"{invoice.labor_charge:.2f}",
        f"{invoice.labor_charge:.2f}"
    ])

    line_items_table = Table(line_items_data, colWidths=[0.4*inch, 3.5*inch, 0.7*inch, 1.2*inch, 1.2*inch])
    line_items_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#FACC15')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#111827')),
        ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
        ('ALIGN', (0, 1), (0, -1), 'CENTER'),
        ('ALIGN', (2, 1), (-1, -1), 'CENTER'),
        ('ALIGN', (1, 1), (1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
    ]))
    story.append(line_items_table)
    story.append(Spacer(1, 0.3 * inch))

    # --- 4. Totals Table ---
    totals_data = [
        ['Subtotal:', f"{invoice.parts_total + invoice.labor_charge:.2f}"],
        ['GST (12%):', f"{invoice.tax:.2f}"],
        ['Discount:', f"{invoice.discount:.2f}"],
        [Paragraph("<b>Grand Total:</b>", styles['NormalSmall']), Paragraph(f"<b>{invoice.total_amount:.2f}</b>", styles['NormalSmall'])],
    ]
    totals_table = Table(totals_data, colWidths=[5.5 * inch, 1.5 * inch])
    totals_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (0, -1), (-1, -1), colors.HexColor('#FACC15')),
        ('LINEABOVE', (0, -1), (-1, -1), 1, colors.black),
        ('LINEBELOW', (0, -1), (-1, -1), 1, colors.black),
    ]))
    story.append(totals_table)

    doc.build(story)
    buffer.seek(0)
    return buffer
