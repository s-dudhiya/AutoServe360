import io
from django.http import HttpResponse
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.lib import colors
from reportlab.lib.units import inch

def generate_invoice_pdf(invoice):
    """
    Generates a PDF for a given invoice object.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=30, leftMargin=30, topMargin=30, bottomMargin=18)
    
    styles = getSampleStyleSheet()
    story = []

    # --- 1. Header: Company Name and Title ---
    story.append(Paragraph("<b>AutoServe360</b>", styles['h1']))
    story.append(Paragraph("<i>Two-Wheeler Service Pro</i>", styles['Normal']))
    story.append(Spacer(1, 0.25 * inch))
    story.append(Paragraph("<b>INVOICE</b>", styles['h2']))
    story.append(Spacer(1, 0.25 * inch))

    # --- 2. Invoice Info and Customer Details Table ---
    invoice_info_data = [
        [Paragraph(f"<b>Invoice #:</b> {invoice.id}", styles['Normal']), Paragraph(f"<b>Customer:</b> {invoice.jobcard.customer.name}", styles['Normal'])],
        [Paragraph(f"<b>Date:</b> {invoice.created_at.strftime('%d/%m/%Y')}", styles['Normal']), Paragraph(f"<b>Phone:</b> {invoice.jobcard.customer.phone}", styles['Normal'])],
        ['', Paragraph(f"<b>Vehicle:</b> {invoice.jobcard.vehicle.make} {invoice.jobcard.vehicle.model}", styles['Normal'])],
        ['', Paragraph(f"<b>Reg. No:</b> {invoice.jobcard.vehicle.registration_no}", styles['Normal'])],
    ]
    invoice_table = Table(invoice_info_data, colWidths=[2.5 * inch, 4.5 * inch])
    invoice_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('ALIGN', (0, 0), (0, -1), 'LEFT'),
        ('ALIGN', (1, 0), (1, -1), 'LEFT'),
    ]))
    story.append(invoice_table)
    story.append(Spacer(1, 0.3 * inch))

    # --- 3. Line Items Table (Parts and Labor) ---
    line_items_data = [
        [Paragraph("<b>#</b>", styles['Normal']), Paragraph("<b>Item Description</b>", styles['Normal']), Paragraph("<b>Qty</b>", styles['Normal']), Paragraph("<b>Unit Price</b>", styles['Normal']), Paragraph("<b>Total</b>", styles['Normal'])]
    ]
    
    # Add parts used
    parts_used = invoice.jobcard.parts_used.all()
    for i, usage in enumerate(parts_used):
        total_price = usage.quantity_used * usage.price_at_time_of_use
        line_items_data.append([
            str(i + 1),
            usage.part.name,
            str(usage.quantity_used),
            f"₹{usage.price_at_time_of_use:.2f}",
            f"₹{total_price:.2f}"
        ])
    
    # Add labor charge
    line_items_data.append([
        str(len(parts_used) + 1),
        "Standard Labor Charge",
        "1",
        f"₹{invoice.labor_charge:.2f}",
        f"₹{invoice.labor_charge:.2f}"
    ])

    line_items_table = Table(line_items_data, colWidths=[0.3*inch, 3.7*inch, 0.5*inch, 1*inch, 1*inch])
    line_items_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#FACC15')), # Yellow header
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#111827')), # Dark text
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('ALIGN', (1, 1), (1, -1), 'LEFT'), # Align description to the left
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.HexColor('#4B5563')), # Dark background for rows
        ('TEXTCOLOR', (0, 1), (-1, -1), colors.white),
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#374151'))
    ]))
    story.append(line_items_table)
    story.append(Spacer(1, 0.3 * inch))

    # --- 4. Totals Table ---
    totals_data = [
        ['Subtotal:', f"₹{invoice.parts_total + invoice.labor_charge:.2f}"],
        ['GST (12%):', f"₹{invoice.tax:.2f}"],
        ['Discount:', f"- ₹{invoice.discount:.2f}"],
        [Paragraph("<b>Grand Total:</b>", styles['Normal']), Paragraph(f"<b>₹{invoice.total_amount:.2f}</b>", styles['Normal'])],
    ]
    totals_table = Table(totals_data, colWidths=[5.5 * inch, 1.5 * inch])
    totals_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'RIGHT'),
        ('FONTNAME', (-1, -1), (-1, -1), 'Helvetica-Bold'),
        ('TEXTCOLOR', (0, 3), (1, 3), colors.HexColor('#FACC15')), # Yellow for Grand Total
    ]))
    story.append(totals_table)

    doc.build(story)
    buffer.seek(0)
    return buffer
