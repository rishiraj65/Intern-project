import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import SubmitPage from './pages/SubmitPage';
import ProcessingPage from './pages/ProcessingPage';
import SuccessPage from './pages/SuccessPage';

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/submit" element={<SubmitPage />} />
          <Route path="/processing/:leadId" element={<ProcessingPage />} />
          <Route path="/success/:leadId" element={<SuccessPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
