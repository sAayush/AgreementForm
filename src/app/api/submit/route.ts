import { NextRequest, NextResponse } from 'next/server';
import { generatePDF } from '@/lib/pdf';
import { sendSignedAgreementEmail } from '@/lib/email';
import { appendToSheet } from '@/lib/sheets';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { formData, signatureDataUrl } = body;

    // Validate required fields
    if (!formData || !signatureDataUrl) {
      return NextResponse.json(
        { error: 'Missing form data or signature' },
        { status: 400 }
      );
    }

    if (!formData.fullName || !formData.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // 1. Generate PDF
    const pdfBuffer = await generatePDF(formData, signatureDataUrl);

    // 2. Send emails (non-blocking — we continue even if email fails)
    const adminEmail = process.env.ADMIN_EMAIL || 'aayushffc@gmail.com';

    try {
      await sendSignedAgreementEmail({
        studentEmail: formData.email,
        studentName: formData.fullName,
        adminEmail,
        pdfBuffer,
        course: formData.course || '',
      });
    } catch (emailError) {
      console.error('[Email] Failed to send email:', emailError);
      // Continue — don't fail the whole submission for email issues
    }

    // 3. Append to Google Sheets (non-blocking)
    try {
      await appendToSheet(formData);
    } catch (sheetError) {
      console.error('[Sheets] Failed to append to sheet:', sheetError);
      // Continue — don't fail the whole submission for sheet issues
    }

    // 4. Return PDF as base64 for client download
    const pdfBase64 = pdfBuffer.toString('base64');

    return NextResponse.json({
      success: true,
      pdfBase64,
      message: 'Agreement submitted successfully',
    });
  } catch (error) {
    console.error('[Submit] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
