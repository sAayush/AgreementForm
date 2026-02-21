import { jsPDF } from "jspdf"
import { agreementConfig } from "@/config/agreement"
import type { AdminData } from "@/lib/storage"

interface PdfFormData {
  [key: string]: string
}

/**
 * Generates a signed PDF agreement document.
 * Accepts optional admin data/signature to append an approval section.
 * Returns the PDF as a Buffer.
 */
export async function generatePDF(
  formData: PdfFormData,
  signatureDataUrl: string,
  adminData?: AdminData,
  adminSignatureDataUrl?: string,
): Promise<Buffer> {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  const contentWidth = pageWidth - margin * 2
  let y = margin

  // === Header ===
  doc.setFillColor(88, 56, 163) // Purple header bar
  doc.rect(0, 0, pageWidth, 35, "F")

  doc.setTextColor(255, 255, 255)
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.text(agreementConfig.title, pageWidth / 2, 16, { align: "center" })

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`Last Updated: ${agreementConfig.lastUpdated}`, pageWidth / 2, 26, {
    align: "center",
  })

  y = 45

  // === Student Information Box ===
  doc.setDrawColor(200, 200, 200)
  doc.setFillColor(248, 248, 252)
  doc.roundedRect(margin, y, contentWidth, 45, 3, 3, "FD")

  doc.setTextColor(88, 56, 163)
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("Student Information", margin + 6, y + 10)

  doc.setTextColor(60, 60, 60)
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")

  const infoLines: [string, string][] = []
  if (formData.fullName) infoLines.push(["Full Name:", formData.fullName])
  if (formData.email) infoLines.push(["Email:", formData.email])
  if (formData.phone) infoLines.push(["Phone:", formData.phone])
  if (formData.course) infoLines.push(["Course:", formData.course])
  if (formData.studentId) infoLines.push(["Student ID:", formData.studentId])
  if (formData.date) infoLines.push(["Date:", formData.date])

  // Render in two columns
  const colWidth = contentWidth / 2
  const leftCol = infoLines.filter((_, i) => i % 2 === 0)
  const rightCol = infoLines.filter((_, i) => i % 2 === 1)

  leftCol.forEach(([label, value], i) => {
    const lineY = y + 18 + i * 8
    doc.setFont("helvetica", "bold")
    doc.text(label, margin + 6, lineY)
    doc.setFont("helvetica", "normal")
    doc.text(value, margin + 35, lineY)
  })

  rightCol.forEach(([label, value], i) => {
    const lineY = y + 18 + i * 8
    doc.setFont("helvetica", "bold")
    doc.text(label, margin + colWidth + 6, lineY)
    doc.setFont("helvetica", "normal")
    doc.text(value, margin + colWidth + 35, lineY)
  })

  y += 55

  // === Agreement Sections ===
  doc.setTextColor(88, 56, 163)
  doc.setFontSize(13)
  doc.setFont("helvetica", "bold")
  doc.text("Agreement Terms", margin, y)
  y += 3

  // Thin divider
  doc.setDrawColor(88, 56, 163)
  doc.setLineWidth(0.5)
  doc.line(margin, y, margin + 40, y)
  y += 8

  doc.setTextColor(50, 50, 50)

  for (const section of agreementConfig.sections) {
    // Check if we need a new page
    if (y > pageHeight - 50) {
      doc.addPage()
      y = margin
    }

    // Section heading
    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(88, 56, 163)
    doc.text(section.heading, margin, y)
    y += 6

    // Section content
    doc.setFont("helvetica", "normal")
    doc.setTextColor(70, 70, 70)
    doc.setFontSize(9)

    const lines = doc.splitTextToSize(section.content, contentWidth)
    for (const line of lines) {
      if (y > pageHeight - 30) {
        doc.addPage()
        y = margin
      }
      doc.text(line, margin, y)
      y += 5
    }

    y += 4
  }

  // === Student Signature Section ===
  if (y > pageHeight - 80) {
    doc.addPage()
    y = margin
  }

  // Divider
  doc.setDrawColor(200, 200, 200)
  doc.setLineWidth(0.3)
  doc.line(margin, y, pageWidth - margin, y)
  y += 10

  doc.setTextColor(88, 56, 163)
  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.text("Student Digital Signature", margin, y)
  y += 10

  // Signature image
  try {
    doc.addImage(signatureDataUrl, "PNG", margin, y, 80, 30)
  } catch {
    doc.setTextColor(150, 150, 150)
    doc.setFontSize(10)
    doc.text("[Signature image could not be rendered]", margin, y + 15)
  }
  y += 35

  // Signature line
  doc.setDrawColor(100, 100, 100)
  doc.setLineWidth(0.3)
  doc.line(margin, y, margin + 80, y)
  y += 6

  doc.setTextColor(70, 70, 70)
  doc.setFontSize(9)
  doc.setFont("helvetica", "normal")
  doc.text(`Signed by: ${formData.fullName || "N/A"}`, margin, y)
  y += 5
  doc.text(
    `Date: ${new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })}`,
    margin,
    y,
  )

  // === Admin Approval Section (if provided) ===
  if (adminData && adminSignatureDataUrl) {
    y += 15

    if (y > pageHeight - 100) {
      doc.addPage()
      y = margin
    }

    // Admin approval box
    doc.setDrawColor(88, 56, 163)
    doc.setFillColor(240, 238, 252)
    doc.roundedRect(margin, y, contentWidth, 10, 2, 2, "FD")
    doc.setTextColor(88, 56, 163)
    doc.setFontSize(11)
    doc.setFont("helvetica", "bold")
    doc.text("Admin Approval", margin + 6, y + 7)
    y += 18

    // Admin info
    doc.setTextColor(60, 60, 60)
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.text(`Approved by: ${adminData.adminName}`, margin, y)
    y += 6

    if (adminData.notes) {
      const noteLines = doc.splitTextToSize(`Notes: ${adminData.notes}`, contentWidth)
      noteLines.forEach((line: string) => {
        doc.text(line, margin, y)
        y += 5
      })
    }

    y += 6

    doc.setTextColor(88, 56, 163)
    doc.setFontSize(10)
    doc.setFont("helvetica", "bold")
    doc.text("Admin Signature", margin, y)
    y += 8

    try {
      doc.addImage(adminSignatureDataUrl, "PNG", margin, y, 80, 30)
    } catch {
      doc.setTextColor(150, 150, 150)
      doc.setFontSize(9)
      doc.text("[Admin signature could not be rendered]", margin, y + 15)
    }
    y += 35

    doc.setDrawColor(100, 100, 100)
    doc.setLineWidth(0.3)
    doc.line(margin, y, margin + 80, y)
    y += 6

    doc.setTextColor(70, 70, 70)
    doc.setFontSize(9)
    doc.setFont("helvetica", "normal")
    doc.text(`Admin: ${adminData.adminName}`, margin, y)
    y += 5
    doc.text(
      `Approval Date: ${new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })}`,
      margin,
      y,
    )
  }

  // Footer
  const footerY = pageHeight - 10
  doc.setTextColor(150, 150, 150)
  doc.setFontSize(8)
  doc.text(
    "This is a digitally signed document. Generated automatically.",
    pageWidth / 2,
    footerY,
    { align: "center" },
  )

  // Convert to Buffer
  const arrayBuffer = doc.output("arraybuffer")
  return Buffer.from(arrayBuffer)
}
