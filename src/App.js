
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ScrapeBar from './components/ScrapeBar'; 
import OnPagePerformance from './components/OnPagePerformance'; 
import OffPagePerformance from './components/OffPagePerformance';
import MobilePerformance from './components/MobilePerformance';
import DesktopPerformance from './components/DesktopPerformance';
import { LayoutComponent } from './Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ScrapeBar />} />
        <Route element={<LayoutComponent />}>
          <Route path="/desktop" element={<DesktopPerformance />} />
          <Route path="/mobile" element={<MobilePerformance />} />
          <Route path="/onpage" element={<OnPagePerformance />} />
          <Route path="/offpage" element={<OffPagePerformance />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

