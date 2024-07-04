import React, { useContext, useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import appContext from '../context';
import '../DownloadButton.css'; // Adjust the path to the correct location
import DownloadModal from './DownloadModal'; // Import the modal component

// Import tooltipMap from constants.js
import { tooltipMap } from '../constants'; // Adjust the path to constants.js

const DownloadButton = () => {
  const { value } = useContext(appContext);
  const [showModal, setShowModal] = useState(false);

  const downloadReport = (format) => {
    const data = value.scrapedData;

    if (!data) {
      alert('No data available for download.');
      return;
    }

    const reportData = [
      // On-Page Performance
      { title: 'Meta Title', value: data.onPagePerformance.metatitle || 'Absent' },
      { title: 'Meta Description', value: data.onPagePerformance.metaDescription || 'Absent' },
      { title: 'SEO Friendly Status', value: data.onPagePerformance.seoFriendlyStatus ? 'Yes' : 'No' },
      { title: 'SSL Certificate', value: data.onPagePerformance.SSL ? 'Valid' : 'Invalid' },
      { title: 'Local SEO Schema', value: data.onPagePerformance.localSEOSchemaStatus || 'Absent' },
      { title: 'Google Tag Manager', value: data.onPagePerformance.googleTagManagerStatus || 'Absent' },
      { title: 'Text HTML Ratio', value: data.onPagePerformance.textHtmlRatio || 'Absent' },
      { title: 'Flash Data', value: data.onPagePerformance.flashData || 'Absent' },
      { title: 'Favicon URL', value: data.onPagePerformance.faviconUrl || 'Absent' },
      { title: 'XML Site Map URL', value: data.onPagePerformance.xmlSitemapUrl || 'Absent' },
      { title: 'Images with no Alt tags', value: Array.isArray(data.onPagePerformance.imagesWithNoAltTags) ? `${data.onPagePerformance.imagesWithNoAltTags.length} images` : data.onPagePerformance.imagesWithNoAltTags || 'Absent' },
      { title: 'Internal Links', value: Array.isArray(data.onPagePerformance.internalLinks) ? `${data.onPagePerformance.internalLinks.length} links` : data.onPagePerformance.internalLinks || 'Absent' },
      { title: 'External Links', value: Array.isArray(data.onPagePerformance.externalLinks) ? `${data.onPagePerformance.externalLinks.length} links` : data.onPagePerformance.externalLinks || 'Absent' },
      { title: 'Broken Page Links', value: Array.isArray(data.onPagePerformance.brokenLinks) ? `${data.onPagePerformance.brokenLinks.length} links` : data.onPagePerformance.brokenLinks || 'Absent' },
      { title: 'Tag Data', value: Array.isArray(data.onPagePerformance.tagData) ? `${data.onPagePerformance.tagData.length} tags` : data.onPagePerformance.tagData || 'Absent' },

      // Off-Page Performance
      { title: 'Web Page', value: data.offPagePerformance.WebPage || 'Absent' },
      { title: 'Domain Authority', value: data.offPagePerformance.DomainAuthority || 'Absent' },
      { title: 'Page Authority', value: data.offPagePerformance.PageAuthority || 'Absent' },
      { title: 'Link Propensity', value: data.offPagePerformance.LinkPropensity || 'Absent' },
      { title: 'Spam Score', value: data.offPagePerformance.SpamScore || 'Absent' },
      { title: 'Http Code', value: data.offPagePerformance.HttpCode || 'Absent' },
      { title: 'Pages to Page', value: data.offPagePerformance.PagesToPage || 'Absent' },

      // Mobile Performance
      { title: 'Mobile Performance Score', value: data.mobilePerformance.performanceScore },
      { title: 'Mobile First Contentful Paint', value: data.mobilePerformance.firstContentfulPaint },
      { title: 'Mobile Largest Contentful Paint', value: data.mobilePerformance.largestContentfulPaint },
      { title: 'Mobile Speed Index', value: data.mobilePerformance.speedIndex },
      { title: 'Mobile Time To Interactive', value: data.mobilePerformance.timeToInteractive },
      { title: 'Mobile Total Blocking Time', value: data.mobilePerformance.totalBlockingTime },

      // Desktop Performance
      { title: 'Desktop Performance Score', value: data.desktopPerformance.performanceScore },
      { title: 'Desktop First Contentful Paint', value: data.desktopPerformance.firstContentfulPaint },
      { title: 'Desktop Largest Contentful Paint', value: data.desktopPerformance.largestContentfulPaint },
      { title: 'Desktop Speed Index', value: data.desktopPerformance.speedIndex },
      { title: 'Desktop Time To Interactive', value: data.desktopPerformance.timeToInteractive },
      { title: 'Desktop Total Blocking Time', value: data.desktopPerformance.totalBlockingTime },
    ];

    if (format === 'csv') {
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Title,Value\n";
      reportData.forEach(row => {
        csvContent += `${row.title},${row.value}\n`;
      });

      csvContent += "\nWatermark: Chimpzlab";

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", "seo_report.csv");
      document.body.appendChild(link);

      link.click();
      document.body.removeChild(link);
    } else if (format === 'pdf') {
      const doc = new jsPDF();

      // Add watermark text on each page
      const watermark = (doc) => {
        const totalPages = doc.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          doc.setFontSize(60);
          doc.setTextColor(230); // Light grey color to simulate transparency
          doc.text('Chimpzlab', doc.internal.pageSize.width / 2, doc.internal.pageSize.height / 2, {
            align: 'center',
            angle: 45,
          });
        }
      };

      // Add branding text
      doc.setFontSize(20);
      doc.setTextColor(0);
      doc.text("SEO Performance Report", 20, 40);

      // Add watermark before adding the table
      watermark(doc);

      // Add table
      const tableData = reportData.map(row => [row.title, row.value]);
      doc.autoTable({
        startY: 50,
        head: [['Title', 'Value']],
        body: tableData,
        didDrawPage: (data) => {
          watermark(doc);
        },
      });

      // Add new page for additional info
      doc.addPage();
      doc.setFontSize(20);
      doc.setTextColor(0);
      doc.text("Additional Information", 20, 30);

      // Add additional info table
      const additionalInfo = Object.entries(tooltipMap).map(([key, value]) => ({
        title: key,
        value: value,
      }));

      doc.autoTable({
        startY: 40,
        head: [['Title', 'Description']],
        body: additionalInfo.map(info => [info.title, info.value]),
      });

      // Save the PDF
      doc.save('seo_report.pdf');
    }
  };

  return (
    <>
      <button onClick={() => setShowModal(true)} className="download-button">
        Download Report 
      </button>
      {showModal && (
        <DownloadModal 
          onClose={() => setShowModal(false)} 
          onDownload={(format) => {
            downloadReport(format);
            setShowModal(false);
          }} 
        />
      )}
    </>
  );
};

export default DownloadButton;
