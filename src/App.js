import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ScrapeBar from './components/ScrapeBar'; 
import OnPagePerformance from './components/OnPagePerformance'; 
import OffPagePerformance from './components/OffPagePerformance';
import MobilePerformance from './components/MobilePerformance';
import DesktopPerformance from './components/DesktopPerformance';
import { LayoutComponent } from './Layout';
import DownloadButton from './components/DownloadButton'; // Import the DownloadButton
import ContextProvider from './ContextProvider'; // Import the ContextProvider

function App() {
  return (
    <ContextProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ScrapeBar />} />
          <Route element={<LayoutComponent />}>
            <Route path="/desktop" element={<DesktopPerformanceWithButton />} />
            <Route path="/mobile" element={<MobilePerformanceWithButton />} />
            <Route path="/onpage" element={<OnPagePerformanceWithButton />} />
            <Route path="/offpage" element={<OffPagePerformanceWithButton />} />
          </Route>
        </Routes>
      </Router>
    </ContextProvider>
  );
}

const DesktopPerformanceWithButton = () => (
  <>
    <DesktopPerformance />
    <DownloadButton />
  </>
);

const MobilePerformanceWithButton = () => (
  <>
    <MobilePerformance />
    <DownloadButton />
  </>
);

const OnPagePerformanceWithButton = () => (
  <>
    <OnPagePerformance />
    <DownloadButton />
  </>
);

const OffPagePerformanceWithButton = () => (
  <>
    <OffPagePerformance />
    <DownloadButton />
  </>
);

export default App;
