import FormWizard from '@/components/FormWizard';

export default function Home() {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="header-icon">📝</div>
        <h1>Student Agreement Form</h1>
        <p>Please complete all steps to digitally sign the agreement</p>
      </header>
      <FormWizard />
    </div>
  );
}
