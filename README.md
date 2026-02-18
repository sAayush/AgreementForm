# Student Agreement Form

A modern, digital solution for managing student agreements. this Next.js application allows students to fill out their details, review an agreement, digitally sign it, and automatically receive a signed PDF copy via email. Administrators also receive a copy and a log entry in Google Sheets.

![Agreement Form Wizard](https://via.placeholder.com/800x400?text=Student+Agreement+Form+Preview)

## 🚀 Features

- **Multi-step Form Wizard**: Clean, step-by-step interface (Details -> Review -> Sign -> Success).
- **Digital Signature**: Capture signatures directly in the browser using `signature_pad`.
- **PDF Generation**: Automatically generates a professional PDF agreement with the student's details and signature.
- **Automated Emails**: Sends the signed PDF to both the student and the administrator using Gmail SMTP.
- **Google Sheets Integration**: Automatically appends every submission to a Google Sheet for easy tracking.
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop types.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **PDF Generation**: `jspdf`
- **Email**: `nodemailer`
- **Database/Logging**: Google Sheets API (`googleapis`)
- **Signature**: `signature_pad`

## 📋 Prerequisites

Before you begin, ensure you have the following:

- **Node.js**: v18 or higher recommended.
- **Gmail Account**: For sending emails (you'll need an [App Password](https://myaccount.google.com/apppasswords)).
- **Google Cloud Project**: With the Google Sheets API enabled and a Service Account created.

## ⚙️ Installation & Setup

1.  **Clone the repository**

    ```bash
    git clone https://github.com/your-username/student-agreement-form.git
    cd student-agreement-form
    ```

2.  **Install dependencies**

    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Configuration**
    Create a `.env.local` file in the root directory (you can copy `.env.example`):

    ```bash
    cp .env.example .env.local
    ```

    Fill in the following variables in `.env.local`:

    | Variable                       | Description                                             |
    | :----------------------------- | :------------------------------------------------------ |
    | `SMTP_USERNAME`                | Your full Gmail address (e.g., `you@gmail.com`).        |
    | `SMTP_PASSWORD`                | Your Gmail **App Password** (NOT your login password).  |
    | `FROM_EMAIL`                   | The email address shown in the "From" field.            |
    | `ADMIN_EMAIL`                  | The email that will receive copies of all agreements.   |
    | `GOOGLE_SERVICE_ACCOUNT_EMAIL` | The email address of your Google Cloud Service Account. |
    | `GOOGLE_PRIVATE_KEY`           | The private key from your Service Account JSON file.    |
    | `GOOGLE_SHEET_ID`              | The ID of the Google Sheet (found in the URL).          |

4.  **Google Sheets Setup**
    - Create a new Google Sheet.
    - Share the sheet with the `GOOGLE_SERVICE_ACCOUNT_EMAIL` address (give it **Editor** access).
    - The application will automatically create the header row if it doesn't exist.

5.  **Run the development server**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

```
src/
├── app/                  # Next.js App Router pages
│   ├── api/              # API routes (used for form submission)
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main entry point using FormWizard
├── components/           # React components
│   ├── FormWizard.tsx    # Main wizard state manager
│   ├── StudentDetailsForm.tsx
│   ├── AgreementView.tsx
│   ├── SignatureStep.tsx # Signature pad implementation
│   └── SuccessScreen.tsx
├── config/               # Configuration files (form fields, agreement text)
└── lib/                  # Utility functions
    ├── email.ts          # Nodemailer logic
    ├── pdf.ts            # PDF generation logic
    └── sheets.ts         # Google Sheets API logic
```

## 📜 License

This project is licensed under the MIT License.
