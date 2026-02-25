import { motion } from 'motion/react';
import { Headset, MessageSquare, Camera, BarChart3 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent } from '../components/ui/card';

export function Features() {
  const { t } = useLanguage();

  const modules = [
    {
      id: 'module1',
      icon: <Headset className="w-16 h-16 text-blue-600" />,
      title: t('features.module1.title'),
      description: t('features.module1.desc'),
      image: 'https://images.unsplash.com/photo-1764314359427-6e685ce5b719?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2aXJ0dWFsJTIwcmVhbGl0eSUyMGhlYWx0aGNhcmV8ZW58MXx8fHwxNzcxOTE4MDk4fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      features: ['Repeated Practice Capability', 'Risk-Free Environment', 'Procedural Memory Development'],
    },
    {
      id: 'module2',
      icon: <MessageSquare className="w-16 h-16 text-blue-600" />,
      title: t('features.module2.title'),
      description: t('features.module2.desc'),
      image: 'https://images.unsplash.com/photo-1758202292826-c40e172eed1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhcnRpZmljaWFsJTIwaW50ZWxsaWdlbmNlJTIwaGVhbHRoY2FyZXxlbnwxfHx8fDE3NzE4NTcyNDd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      features: ['24/7 Availability', 'Multilingual Support', 'Personalized Consultation'],
    },
    {
      id: 'module3',
      icon: <Camera className="w-16 h-16 text-blue-600" />,
      title: t('features.module3.title'),
      description: t('features.module3.desc'),
      image: 'https://images.unsplash.com/photo-1545579833-0e15a2cdb26b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhdWdtZW50ZWQlMjByZWFsaXR5JTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzE4NDQxMTd8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      features: ['Real-Time Error Detection', 'WebXR Technology', 'Immediate Corrective Feedback'],
    },
    {
      id: 'module4',
      icon: <BarChart3 className="w-16 h-16 text-blue-600" />,
      title: t('features.module4.title'),
      description: t('features.module4.desc'),
      image: 'https://images.unsplash.com/photo-1767449441925-737379bc2c4d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBoZWFsdGglMjBhcHBsaWNhdGlvbnxlbnwxfHx8fDE3NzE5MTgxMDB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      features: ['Objective Scoring', 'Progress Tracking', 'Historical Data Access'],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white/20 to-gray-50/30">
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl mb-6 text-gray-900">
              {t('features.title')}
            </h1>
            <p className="text-2xl text-gray-600">
              {t('features.subtitle')}
            </p>
          </motion.div>

          <div className="space-y-20">
            {modules.map((module, index) => (
              <motion.div
                key={module.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden border-gray-200 hover:shadow-xl transition-shadow">
                  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-0 ${index % 2 === 1 ? 'lg:grid-flow-dense' : ''}`}>
                    <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                      <img
                        src={module.image}
                        alt={module.title}
                        className="w-full h-80 lg:h-full object-cover"
                      />
                    </div>
                    
                    <CardContent className="p-12 flex flex-col justify-center">
                      <div className="mb-6">{module.icon}</div>
                      <div className="inline-block bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm mb-4">
                        Module {index + 1}
                      </div>
                      <h2 className="text-3xl mb-4 text-gray-900">
                        {module.title}
                      </h2>
                      <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                        {module.description}
                      </p>
                      <div className="space-y-2">
                        {module.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center text-gray-600">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                            <span>{feature}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg p-12 text-center text-white"
          >
            <h2 className="text-4xl mb-6">
              Experience the Complete System
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              All four modules work together seamlessly to provide a comprehensive, effective, and engaging learning experience that addresses every aspect of MDI technique mastery.
            </p>
            <a
              href="/training"
              className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 transition-colors text-lg"
            >
              Start Your Training Journey
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
