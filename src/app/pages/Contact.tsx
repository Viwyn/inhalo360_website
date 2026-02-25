import { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Building2, User, FileText } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { toast } from 'sonner';

export function Contact() {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thank you for your message! We will get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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
              {t('contact.title')}
            </h1>
            <p className="text-xl text-gray-600">
              {t('contact.subtitle')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="border-gray-200">
                <CardContent className="p-8">
                  <h2 className="text-2xl mb-6 text-gray-900">
                    {t('contact.form.title')}
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name" className="text-gray-700">
                        {t('contact.form.name')}
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="mt-2 border-gray-300"
                        placeholder="Your name"
                      />
                    </div>

                    <div>
                      <Label htmlFor="email" className="text-gray-700">
                        {t('contact.form.email')}
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="mt-2 border-gray-300"
                        placeholder="your.email@example.com"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message" className="text-gray-700">
                        {t('contact.form.message')}
                      </Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        value={formData.message}
                        onChange={handleChange}
                        rows={6}
                        className="mt-2 border-gray-300"
                        placeholder="Your message..."
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {t('contact.form.submit')}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="space-y-6"
            >
              <Card className="border-gray-200">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <Building2 className="w-8 h-8 text-blue-600 mr-3" />
                    <h3 className="text-2xl text-gray-900">
                      {t('contact.info.institution')}
                    </h3>
                  </div>
                  <p className="text-lg text-gray-700 leading-relaxed">
                    Taylor's University School of Pharmacy
                  </p>
                  <p className="text-gray-600 mt-2 leading-relaxed">
                    No. 1, Jalan Taylors, 47500 Subang Jaya, Selangor, Malaysia
                  </p>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <User className="w-8 h-8 text-blue-600 mr-3" />
                    <h3 className="text-2xl text-gray-900">
                      {t('contact.info.lead')}
                    </h3>
                  </div>
                  <p className="text-lg text-gray-700 mb-2">
                    Olivia Lim
                  </p>
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-5 h-5 mr-2" />
                    <a href="mailto:yunxuanlim3@gmail.com" className="hover:text-blue-600 transition-colors">
                      yunxuanlim3@gmail.com
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-gray-200">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <FileText className="w-8 h-8 text-blue-600 mr-3" />
                    <h3 className="text-2xl text-gray-900">
                      {t('contact.info.support')}
                    </h3>
                  </div>
                  <p className="text-gray-700 mb-4 leading-relaxed">
                    For technical documentation and detailed project information, please refer to our comprehensive project report.
                  </p>
                  <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                    View Project Documentation
                  </Button>
                </CardContent>
              </Card>

              <div className="relative h-64 rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1758202292826-c40e172eed1c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBtZWRpY2FsJTIwdGVjaG5vbG9neXxlbnwxfHx8fDE3NzE4NTM2NTR8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                  alt="Medical Technology"
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
