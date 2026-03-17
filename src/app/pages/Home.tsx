import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Brain, Smartphone, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';

export function Home() {
  const { t } = useLanguage();

  const highlights = [
    {
      icon: <Zap className="w-12 h-12 text-blue-600" />,
      title: t('home.highlights.feedback.title'),
      description: t('home.highlights.feedback.desc'),
    },
    {
      icon: <Smartphone className="w-12 h-12 text-blue-600" />,
      title: t('home.highlights.practice.title'),
      description: t('home.highlights.practice.desc'),
    },
    {
      icon: <Brain className="w-12 h-12 text-blue-600" />,
      title: t('home.highlights.blend.title'),
      description: t('home.highlights.blend.desc'),
    },
  ];

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-blue-50/30 via-white/10 to-indigo-50/30 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-5xl md:text-6xl mb-6 text-gray-900">
                {t('home.hero.title')}
              </h1>
              <p className="text-2xl mb-4 text-gray-700">
                {t('home.hero.subtitle')}
              </p>
              <p className="text-lg mb-6 text-gray-600 leading-relaxed">
                {t('home.hero.description')}
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-4 mb-8">
                <p className="text-gray-700">
                  {t('home.hero.value')}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/training">
                  <Button size="lg" className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white">
                    {t('home.hero.cta.primary')}
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-blue-600 text-blue-600 hover:bg-blue-50">
                  {t('home.hero.cta.secondary')}
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1764314359427-6e685ce5b719?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXJ0dWFsJTIwcmVhbGl0eSUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzcxOTE4MDk4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="VR Healthcare"
                className="rounded-lg shadow-2xl"
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-b from-transparent to-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl mb-4 text-gray-900">
              {t('home.highlights.title')}
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((highlight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-gray-200/50 bg-white/80 backdrop-blur-sm hover:bg-white/90 hover:scale-105">
                  <CardContent className="p-8">
                    <div className="mb-4">{highlight.icon}</div>
                    <h3 className="text-xl mb-3 text-gray-900">
                      {highlight.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {highlight.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <img
                src="https://images.unsplash.com/photo-1615486510940-4e96763c7f6d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtZWRpY2FsJTIwaW5oYWxlciUyMGRldmljZXxlbnwxfHx8fDE3NzE5MTgwOTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt="Medical Inhaler"
                className="rounded-lg shadow-2xl"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-white"
            >
              <h2 className="text-4xl mb-6">
                Ready to Transform Your Inhaler Technique?
              </h2>
              <p className="text-xl mb-8 text-blue-100 leading-relaxed">
                Join thousands of patients and healthcare professionals who are already improving their MDI technique with Inhalo360°.
              </p>
              <Link to="/training">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                  Get Started Now
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
