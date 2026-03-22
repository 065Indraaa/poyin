import { useState, useCallback, useEffect } from 'react';
import { Analytics } from '@vercel/analytics/react';
import { LanguageProvider } from './context/LanguageContext';
import { PANEL_ORDER } from './data/panelData';
import { useScrollReveal } from './hooks/useScrollReveal';
import { useSecurity } from './hooks/useSecurity';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import MateriIntro from './components/MateriIntro';
import MobileTabs from './components/MobileTabs';
import Sidebar from './components/Sidebar';
import PanelArea from './components/PanelArea';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import './styles/main.css';

export default function App() {
  const [activePanel, setActivePanel] = useState('p0');

  useScrollReveal();
  useSecurity();

  // Listen for navigation events from Chatbot
  const switchPanel = useCallback((id) => {
    setActivePanel(id);

    // Scroll to materi section
    setTimeout(() => {
      const materi = document.getElementById('materi');
      if (materi) {
        window.scrollTo({ top: materi.offsetTop - 64, behavior: 'smooth' });
      }
    }, 50);

    // Trigger reveals in new panel
    setTimeout(() => {
      document.querySelectorAll(`#${id} .reveal:not(.in)`).forEach((el) => {
        el.classList.add('in');
      });
    }, 200);
  }, []);

  useEffect(() => {
    const handleNavigatePanel = (e) => {
      const { panelId } = e.detail;
      if (panelId) {
        switchPanel(panelId);
      }
    };
    window.addEventListener('navigate-panel', handleNavigatePanel);
    return () => window.removeEventListener('navigate-panel', handleNavigatePanel);
  }, [switchPanel]);

  return (
    <LanguageProvider>
      <Navbar />
      <Hero />

      <MobileTabs activePanel={activePanel} onSwitch={switchPanel} />

      <MateriIntro />

      <div className="materi-shell">
        <Sidebar activePanel={activePanel} onSwitch={switchPanel} />
        <PanelArea activePanel={activePanel} onSwitch={switchPanel} />
      </div>

      <Footer />
      <Chatbot />
      <Analytics />
    </LanguageProvider>
  );
}
