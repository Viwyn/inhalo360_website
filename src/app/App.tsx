import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from './components/ui/sonner';
import { LanguageProvider } from './contexts/LanguageContext';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { AnimatedBackground } from './components/AnimatedBackground';
import { FloatingBubbles } from './components/FloatingBubbles';
import { MedicalGrid } from './components/MedicalGrid';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Features } from './pages/Features';
import { Training } from './pages/Training';
import { Contact } from './pages/Contact';

export default function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-white relative overflow-hidden">
          <MedicalGrid />
          <AnimatedBackground />
          <FloatingBubbles />
          <div className="relative z-10">
            <Navigation />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/features" element={<Features />} />
                <Route path="/training" element={<Training />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster position="top-right" />
        </div>
      </Router>
    </LanguageProvider>
  );
}
