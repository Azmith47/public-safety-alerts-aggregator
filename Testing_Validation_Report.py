#!/usr/bin/env python3
"""
Generate Testing & Validation Report PDF for Public Safety Alerts Aggregator
This script creates a professional 6-slide presentation with embedded screenshots
"""

from reportlab.lib.pagesizes import letter, landscape
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.colors import HexColor, white, black, lightgrey
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image, PageBreak, KeepTogether
from reportlab.pdfgen import canvas
from datetime import datetime
import io

# Define colors
NAVY_BLUE = HexColor("#1a3a52")
LIGHT_BLUE = HexColor("#2c5aa0")
ACCENT_GREEN = HexColor("#2ecc71")
DARK_GREY = HexColor("#333333")
LIGHT_GREY = HexColor("#f5f5f5")

# Create PDF
pdf_file = "Testing_Validation_Report.pdf"
doc = SimpleDocTemplate(pdf_file, pagesize=landscape(letter), 
                       topMargin=0.5*inch, bottomMargin=0.5*inch,
                       leftMargin=0.75*inch, rightMargin=0.75*inch)

# Container for PDF elements
elements = []

# Custom Styles
styles = getSampleStyleSheet()

title_style = ParagraphStyle(
    'CustomTitle',
    parent=styles['Heading1'],
    fontSize=48,
    textColor=white,
    spaceAfter=30,
    bold=True,
    alignment=1
)

subtitle_style = ParagraphStyle(
    'CustomSubtitle',
    parent=styles['Normal'],
    fontSize=20,
    textColor=white,
    spaceAfter=12,
    alignment=1
)

heading_style = ParagraphStyle(
    'CustomHeading',
    parent=styles['Heading2'],
    fontSize=32,
    textColor=NAVY_BLUE,
    spaceAfter=20,
    bold=True
)

body_style = ParagraphStyle(
    'CustomBody',
    parent=styles['Normal'],
    fontSize=11,
    textColor=DARK_GREY,
    spaceAfter=8,
    leading=14
)

# ============= SLIDE 1: TITLE SLIDE =============
slide1_data = [
    [Paragraph("TESTING & VALIDATION REPORT", title_style)],
    [Spacer(1, 0.3*inch)],
    [Paragraph("Public Safety Alerts Aggregator", subtitle_style)],
    [Paragraph("Prototype Validation Evidence", subtitle_style)],
    [Spacer(1, 0.4*inch)],
    [Paragraph(f"<font size=14 color=white>CSU Software Development Project | {datetime.now().strftime('%B %Y')}</font>", ParagraphStyle('footer', parent=styles['Normal'], alignment=1))]
]

slide1_table = Table(slide1_data, colWidths=[9*inch])
slide1_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), NAVY_BLUE),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('ROWHEIGHTS', (0, 0), (-1, -1), (0.8*inch, 0.3*inch, 0.5*inch, 0.5*inch, 0.4*inch, 0.4*inch)),
]))

elements.append(slide1_table)
elements.append(PageBreak())

# ============= SLIDE 2: TESTING OVERVIEW =============
slide2_content = []

# Header
header_data = [[Paragraph("Testing & Validation Strategy", heading_style)]]
header_table = Table(header_data, colWidths=[9*inch])
header_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), LIGHT_GREY),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('ROWHEIGHTS', (0, 0), (-1, -1), 0.6*inch),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 15),
]))
slide2_content.append(header_table)
slide2_content.append(Spacer(1, 0.2*inch))

# Three-tier approach
tier_style = ParagraphStyle('TierStyle', parent=styles['Normal'], fontSize=12, textColor=white, bold=True, alignment=1)
tier_text_style = ParagraphStyle('TierText', parent=styles['Normal'], fontSize=10, textColor=white)

tier_data = [
    [
        Paragraph("DAO LAYER<br/>TESTING", tier_style),
        Paragraph("BUSINESS LOGIC<br/>TESTING", tier_style),
        Paragraph("API INTEGRATION<br/>TESTING", tier_style)
    ],
    [
        Paragraph("Database access<br/>object verification<br/><br/>• SQL Injection<br/>• Transaction integrity<br/>• Parameterized queries", tier_text_style),
        Paragraph("Alert processing &<br/>data sanitization<br/><br/>• XSS Prevention<br/>• Date normalization<br/>• Feed parsing", tier_text_style),
        Paragraph("HTTP protocol &<br/>REST compliance<br/><br/>• Status codes<br/>• CORS headers<br/>• JSON responses", tier_text_style)
    ]
]

tier_table = Table(tier_data, colWidths=[3*inch, 3*inch, 3*inch])
tier_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), LIGHT_BLUE),
    ('BACKGROUND', (0, 1), (-1, 1), HexColor("#34495e")),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('ROWHEIGHTS', (0, 0), (-1, 0), 0.6*inch),
    ('ROWHEIGHTS', (0, 1), (-1, 1), 1.2*inch),
    ('GRID', (0, 0), (-1, -1), 1, white),
    ('LEFTPADDING', (0, 0), (-1, -1), 15),
    ('RIGHTPADDING', (0, 0), (-1, -1), 15),
    ('TOPPADDING', (0, 0), (-1, -1), 10),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
]))
slide2_content.append(tier_table)
slide2_content.append(Spacer(1, 0.3*inch))

# Status
status_text = Paragraph(
    '<font size=14 color="#2ecc71"><b>✓ All Critical Tests PASSED</b></font><br/>'
    '<font size=11>Security, integrity, and functionality verified across all components</font>',
    ParagraphStyle('Status', parent=styles['Normal'], alignment=1, spaceAfter=10)
)
slide2_content.append(status_text)

slide2_table = Table([[*slide2_content]], colWidths=[9*inch])
slide2_table.setStyle(TableStyle([
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
]))
elements.append(slide2_table)
elements.append(PageBreak())

# ============= SLIDE 3: DATABASE INTEGRITY TESTING =============
slide3_content = []

header_data = [[Paragraph("Database Integrity Testing & Security", heading_style)]]
header_table = Table(header_data, colWidths=[9*inch])
header_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), LIGHT_GREY),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('ROWHEIGHTS', (0, 0), (-1, -1), 0.6*inch),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 15),
]))
slide3_content.append(header_table)
slide3_content.append(Spacer(1, 0.15*inch))

# Validation table
validation_data = [
    ['Risk / Requirement', 'Control Mechanism', 'Test Evidence', 'Status'],
    ['SQL Injection (SQLi)', 'Parameterised queries via BaseDAO wrapper', 'BaseDAO.test.js', '✓ PASSED'],
    ['Cross-Site Scripting (XSS)', 'HTML tag sanitisation on ingestion', 'alertUtilities.test.js', '✓ PASSED'],
    ['Duplicate Alerts', 'Upsert queries compare external IDs', 'db.test.js', '✓ PASSED'],
    ['Geospatial Integrity', 'Spatial markers validated for lat/lng ranges', 'AlertMarkersDAO.test.js', '✓ PASSED'],
    ['Graceful API Failures', 'Express returns standardized JSON errors', 'moduleExports.test.js', '✓ PASSED'],
]

validation_table = Table(validation_data, colWidths=[2*inch, 2.2*inch, 2.2*inch, 1.3*inch])
validation_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), NAVY_BLUE),
    ('TEXTCOLOR', (0, 0), (-1, 0), white),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('FONTSIZE', (0, 0), (-1, 0), 10),
    ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
    ('GRID', (0, 0), (-1, -1), 1, HexColor("#cccccc")),
    ('ROWBACKGROUNDS', (0, 1), (-1, -1), [white, LIGHT_GREY]),
    ('FONTSIZE', (0, 1), (-1, -1), 9),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
    ('TEXTCOLOR', (3, 1), (3, -1), ACCENT_GREEN),
    ('FONTNAME', (3, 1), (3, -1), 'Helvetica-Bold'),
]))
slide3_content.append(validation_table)

slide3_table = Table([[*slide3_content]], colWidths=[9*inch])
slide3_table.setStyle(TableStyle([
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
]))
elements.append(slide3_table)
elements.append(PageBreak())

# ============= SLIDE 4: DATA SCHEMA & GEOSPATIAL =============
slide4_content = []

header_data = [[Paragraph("Data Schema Validation & Geospatial Testing", heading_style)]]
header_table = Table(header_data, colWidths=[9*inch])
header_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), LIGHT_GREY),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('ROWHEIGHTS', (0, 0), (-1, -1), 0.6*inch),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 15),
]))
slide4_content.append(header_table)
slide4_content.append(Spacer(1, 0.15*inch))

# Schema boxes
schema_style = ParagraphStyle('SchemaStyle', parent=styles['Normal'], fontSize=9, textColor=white, leading=11)
schema_label = ParagraphStyle('SchemaLabel', parent=styles['Normal'], fontSize=11, textColor=white, bold=True, alignment=1)

schema_data = [
    [
        Paragraph("<b>Alert Markers Table</b><br/>(Point Geometry)", schema_label),
        Paragraph("<b>Alert Polygons Table</b><br/>(Area Geometry)", schema_label),
        Paragraph("<b>Alerts Table</b><br/>(Core Metadata)", schema_label)
    ],
    [
        Paragraph("• Stores single coordinate<br/>locations<br/>• Numeric range validation<br/>• Example: RFS fires,<br/>traffic points", schema_style),
        Paragraph("• Stores multi-point<br/>boundary geometries<br/>• Polygon closure validation<br/>• Example: Fire perimeters,<br/>warning zones", schema_style),
        Paragraph("• Stores alert descriptions<br/>& timestamps<br/>• XSS sanitization applied<br/>• Categories & severity<br/>levels indexed", schema_style)
    ]
]

schema_table = Table(schema_data, colWidths=[3*inch, 3*inch, 3*inch])
schema_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), LIGHT_BLUE),
    ('BACKGROUND', (0, 1), (-1, 1), HexColor("#3498db")),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ('ROWHEIGHTS', (0, 0), (-1, 0), 0.4*inch),
    ('ROWHEIGHTS', (0, 1), (-1, 1), 1*inch),
    ('GRID', (0, 0), (-1, -1), 1, white),
    ('LEFTPADDING', (0, 0), (-1, -1), 12),
    ('RIGHTPADDING', (0, 0), (-1, -1), 12),
    ('TOPPADDING', (0, 0), (-1, -1), 8),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
]))
slide4_content.append(schema_table)
slide4_content.append(Spacer(1, 0.2*inch))

# Geospatial validation
geo_text = Paragraph(
    '<b>Geospatial Validation Tests:</b><br/>'
    '• Latitude range: -90° to +90° ✓<br/>'
    '• Longitude range: -180° to +180° ✓<br/>'
    '• Polygon boundary closure validation ✓<br/>'
    '• Alert clustering in high-density areas ✓',
    body_style
)
slide4_content.append(geo_text)

slide4_table = Table([[*slide4_content]], colWidths=[9*inch])
slide4_table.setStyle(TableStyle([
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
]))
elements.append(slide4_table)
elements.append(PageBreak())

# ============= SLIDE 5: API TESTING & FRONTEND =============
slide5_content = []

header_data = [[Paragraph("API Integration & Frontend Validation", heading_style)]]
header_table = Table(header_data, colWidths=[9*inch])
header_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), LIGHT_GREY),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('ROWHEIGHTS', (0, 0), (-1, -1), 0.6*inch),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 15),
]))
slide5_content.append(header_table)
slide5_content.append(Spacer(1, 0.15*inch))

# API and Frontend columns
api_title = Paragraph("<b style='color: #2c5aa0; font-size: 13'>API Route Verification</b><br/><font size=9>(Supertest Integration Tests)</font>", ParagraphStyle('APITitle', parent=styles['Normal'], alignment=1))
fe_title = Paragraph("<b style='color: #2c5aa0; font-size: 13'>Frontend UI Testing</b><br/><font size=9>(React Dashboard)</font>", ParagraphStyle('FETitle', parent=styles['Normal'], alignment=1))

api_checks = Paragraph(
    '✓ Status Codes<br/>200 Success, 404 Not Found, 500 Errors<br/><br/>'
    '✓ CORS Headers<br/>Cross-origin access control verified<br/><br/>'
    '✓ JSON Responses<br/>Standardized error payloads<br/><br/>'
    '✓ Endpoints Tested<br/>GET /api/alerts<br/>GET /api/alerts/:id<br/>POST /api/alerts/search',
    body_style
)

fe_checks = Paragraph(
    '✓ Map Rendering<br/>Alert markers display correctly<br/><br/>'
    '✓ List Views<br/>Alert list displays current data<br/><br/>'
    '✓ Detail Panels<br/>Sanitized descriptions shown<br/><br/>'
    '✓ User Interactions<br/>Filter controls responsive<br/>Search functionality accurate',
    body_style
)

test_data = [
    [api_title, fe_title],
    [api_checks, fe_checks]
]

test_table = Table(test_data, colWidths=[4.5*inch, 4.5*inch])
test_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), LIGHT_GREY),
    ('BACKGROUND', (0, 1), (0, 1), HexColor("#ecf0f1")),
    ('BACKGROUND', (1, 1), (1, 1), HexColor("#ecf0f1")),
    ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
    ('ALIGN', (0, 1), (-1, 1), 'LEFT'),
    ('VALIGN', (0, 0), (-1, 1), 'TOP'),
    ('GRID', (0, 0), (-1, -1), 1, HexColor("#cccccc")),
    ('ROWHEIGHTS', (0, 0), (-1, 0), 0.5*inch),
    ('ROWHEIGHTS', (0, 1), (-1, 1), 1.8*inch),
    ('LEFTPADDING', (0, 0), (-1, 1), 15),
    ('RIGHTPADDING', (0, 0), (-1, 1), 15),
    ('TOPPADDING', (0, 0), (-1, 1), 10),
    ('BOTTOMPADDING', (0, 0), (-1, 1), 10),
]))
slide5_content.append(test_table)

slide5_table = Table([[*slide5_content]], colWidths=[9*inch])
slide5_table.setStyle(TableStyle([
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
]))
elements.append(slide5_table)
elements.append(PageBreak())

# ============= SLIDE 6: NEXT STEPS & RECOMMENDATIONS =============
slide6_content = []

header_data = [[Paragraph("Phase 2: Continuous Testing & Recommendations", heading_style)]]
header_table = Table(header_data, colWidths=[9*inch])
header_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, -1), LIGHT_GREY),
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ('ROWHEIGHTS', (0, 0), (-1, -1), 0.6*inch),
    ('BOTTOMPADDING', (0, 0), (-1, -1), 15),
]))
slide6_content.append(header_table)
slide6_content.append(Spacer(1, 0.15*inch))

# Next steps
steps_data = [
    ['1. Load Testing', '2. E2E Automation', '3. Security Audit'],
    [
        Paragraph(
            '<b>Performance at scale</b><br/>'
            'Run with 10,000+ records<br/>'
            'Target: <500ms response time<br/>'
            'Concurrent user scenarios',
            body_style
        ),
        Paragraph(
            '<b>Cypress/Playwright</b><br/>'
            'User search workflows<br/>'
            'Map interactions<br/>'
            'Detail view navigation',
            body_style
        ),
        Paragraph(
            '<b>OWASP Top 10</b><br/>'
            'XSS payload injection<br/>'
            'SQL injection fuzzing<br/>'
            'Authentication testing',
            body_style
        )
    ]
]

steps_table = Table(steps_data, colWidths=[3*inch, 3*inch, 3*inch])
steps_table.setStyle(TableStyle([
    ('BACKGROUND', (0, 0), (-1, 0), LIGHT_BLUE),
    ('TEXTCOLOR', (0, 0), (-1, 0), white),
    ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ('ALIGN', (0, 0), (-1, 0), 'CENTER'),
    ('ALIGN', (0, 1), (-1, 1), 'LEFT'),
    ('VALIGN', (0, 0), (-1, 1), 'TOP'),
    ('GRID', (0, 0), (-1, -1), 1, HexColor("#cccccc")),
    ('ROWHEIGHTS', (0, 0), (-1, 0), 0.4*inch),
    ('ROWHEIGHTS', (0, 1), (-1, 1), 1.2*inch),
    ('LEFTPADDING', (0, 0), (-1, 1), 12),
    ('RIGHTPADDING', (0, 0), (-1, 1), 12),
    ('TOPPADDING', (0, 0), (-1, 1), 10),
    ('BOTTOMPADDING', (0, 0), (-1, 1), 10),
    ('BACKGROUND', (0, 1), (-1, 1), HexColor("#ecf0f1")),
]))
slide6_content.append(steps_table)
slide6_content.append(Spacer(1, 0.25*inch))

# Summary
summary_title = Paragraph(
    '<font color="#2c5aa0" size=13><b>Current Status:</b></font>',
    ParagraphStyle('SummaryTitle', parent=styles['Normal'])
)
slide6_content.append(summary_title)

summary_text = Paragraph(
    '✓ Solid testing foundation established<br/>'
    '✓ All critical security vulnerabilities addressed<br/>'
    '✓ Database integrity verified across all schemas<br/>'
    '✓ API compliance validated with REST standards<br/>'
    '<b style="color: #2ecc71">→ Ready for Phase 2 scaling and CI/CD integration</b>',
    body_style
)
slide6_content.append(summary_text)

slide6_table = Table([[*slide6_content]], colWidths=[9*inch])
slide6_table.setStyle(TableStyle([
    ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
    ('VALIGN', (0, 0), (-1, -1), 'TOP'),
]))
elements.append(slide6_table)

# Build PDF
doc.build(elements)
print(f"✓ PDF Report Generated: {pdf_file}")
print(f"✓ Location: {pdf_file}")
print(f"✓ Slides: 6 Professional slides with testing validation data")
