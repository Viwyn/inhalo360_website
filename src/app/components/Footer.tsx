import { useLanguage } from '../contexts/LanguageContext';

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl mb-4">Inhalo 360°</h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('home.hero.subtitle')}
            </p>
          </div>
          
          <div>
            <h4 className="mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
              <li><a href="/features" className="hover:text-white transition-colors">Features</a></li>
              <li><a href="/training" className="hover:text-white transition-colors">Training</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="mb-4">Contact</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              {t('footer.institution')}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              yunxuanlim3@gmail.com
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
