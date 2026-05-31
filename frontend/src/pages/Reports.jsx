import { FileDown } from 'lucide-react';
import api from '../utils/api';

const Reports = () => {
  const handleDownload = async (format) => {
    try {
      // For file downloads, we can't just use standard axios get without setting responseType
      const response = await api.get(`/reports/export?format=${format}`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Expense_Report.${format}`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (err) {
      console.error('Failed to download', err);
      alert('Failed to download report.');
    }
  };

  return (
    <div className="main-content">
      <div className="topbar">
        <h1 className="page-title">Reports & Exports</h1>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', maxWidth: '600px', marginTop: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>Download Your Data</h2>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Generate a comprehensive report of all your expenses. You can use these files to import into Excel or keep for your personal records.
        </p>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-primary" onClick={() => handleDownload('csv')}>
            <FileDown size={18} /> Export as CSV
          </button>
          <button className="btn-outline" onClick={() => handleDownload('pdf')} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileDown size={18} /> Export as PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
