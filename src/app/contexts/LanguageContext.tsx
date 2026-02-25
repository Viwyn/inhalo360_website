import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'bm' | 'zh' | 'ta';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.features': 'System & Features',
    'nav.training': 'Training & Demo',
    'nav.contact': 'Contact',
    'nav.language': 'Language',
    
    // Home Page
    'home.hero.title': 'Inhalo 360°',
    'home.hero.subtitle': 'Immersive Inhaler Technique Learning Platform',
    'home.hero.description': 'Your MDI (Metered-Dose Inhaler) Education Revolutionary. Integrating VR, AR, and AI for unparalleled training efficacy.',
    'home.hero.value': 'Demonstrated a 40% reduction in inhaler technique errors during user evaluation.',
    'home.hero.cta.primary': 'Start AR Guided Practice',
    'home.hero.cta.secondary': 'Enter VR Training Room',
    
    'home.highlights.title': 'Move Beyond Passive Learning',
    'home.highlights.feedback.title': 'Real-Time Corrective Feedback',
    'home.highlights.feedback.desc': 'Powered by AI-driven error detection',
    'home.highlights.practice.title': 'Practice Anytime, Anywhere',
    'home.highlights.practice.desc': 'WebXR-based architecture eliminates app store dependencies',
    'home.highlights.blend.title': 'From Virtual to Reality',
    'home.highlights.blend.desc': 'Perfect blend of VR simulation and AR real-device guidance',
    
    // About Page
    'about.title': 'About the Project',
    'about.problem.title': 'Inhaler Technique Errors: A Global Challenge',
    'about.problem.desc': 'Studies show that 70%-90% of respiratory patients commit at least one critical error using MDIs. These errors can reduce medication efficacy by up to 50%, leading to preventable hospitalizations. Traditional methods lack real-time feedback and continuous reinforcement.',
    'about.solution.title': 'Our Solution',
    'about.solution.subtitle': 'Inhalo 360°: The Next-Generation Learning Platform',
    'about.solution.gap': 'Bridging the Gap: Combining the immersive benefits of AR/VR with the personalized feedback of AI.',
    'about.solution.patient': 'Patient-Centric: Solving the limitation of existing AR/VR systems which mainly target professionals.',
    'about.solution.access': 'Accessibility First: Web-first architecture ensures cross-device accessibility on commonly available consumer devices.',
    'about.team.title': 'Project Team',
    'about.team.lead': 'Project Lead: Olivia Lim',
    'about.team.institution': 'Taylor\'s University School of Pharmacy',
    
    // Features Page
    'features.title': 'System & Features',
    'features.subtitle': 'Four Core Modules Delivering Comprehensive Training',
    'features.module1.title': 'Immersive VR Learning Environment',
    'features.module1.desc': 'Users engage in structured, repeatable MDI practice in a risk-free virtual space. Develop procedural memory in a safe, controlled setting.',
    'features.module2.title': 'AI-Powered Virtual Pharmacist',
    'features.module2.desc': 'A 24/7 intelligent chatbot available to answer general questions about MDI use, medication, or disease management with multilingual support.',
    'features.module3.title': 'Dual-Mode AR Training System',
    'features.module3.desc': 'Utilizes WebXR technology to overlay digital guidance onto a real inhaler device. The camera captures user actions, and AI detects errors in real-time.',
    'features.module4.title': 'Performance Assessment & Progress Dashboard',
    'features.module4.desc': 'Users and educators can log in to view historical training data, objective scores, and track learning progress across multiple sessions.',
    
    // Training Page
    'training.title': 'Training & Demo',
    'training.ar.title': 'AR Live Guidance',
    'training.ar.subtitle': 'Start AR Practice on Your Real Inhaler',
    'training.ar.desc': 'Use your mobile/tablet browser to activate AR mode. The system will request camera access. Simply place your inhaler in view to receive real-time step-by-step guidance and error correction.',
    'training.ar.button': 'Launch AR Live Mode',
    'training.ar.status.ready': 'Camera Ready - Position your inhaler in the frame',
    'training.ar.status.detecting': 'Detecting inhaler position...',
    'training.ar.status.active': 'AR Guidance Active',
    'training.ar.guide.title': 'AR Guidance Steps',
    'training.ar.step1': 'Step 1: Shake the inhaler vigorously',
    'training.ar.step2': 'Step 2: Breathe out completely',
    'training.ar.step3': 'Step 3: Place mouthpiece between lips',
    'training.ar.step4': 'Step 4: Press and breathe in slowly',
    'training.ar.step5': 'Step 5: Hold breath for 10 seconds',
    'training.ar.step6': 'Step 6: Breathe out slowly',
    'training.ar.error.coordination': 'Error: Improve coordination between pressing and breathing',
    'training.ar.error.breathhold': 'Error: Hold breath longer (aim for 10 seconds)',
    'training.ar.error.shake': 'Error: Shake inhaler more vigorously',
    
    'training.vr.title': 'VR Immersive Experience',
    'training.vr.subtitle': 'Explore the VR Training Room',
    'training.vr.desc': 'Master the basic MDI steps in a fully virtual environment. Ideal for first-time learners or those seeking repeated, distraction-free practice.',
    'training.vr.button': 'Enter VR Training Room',
    
    'training.guide.title': 'Quick Start Guide',
    'training.guide.step1': '1. Have your MDI device ready',
    'training.guide.step2': '2. Grant camera access when prompted',
    'training.guide.step3': '3. Follow the on-screen AR cues to practice',
    
    // Contact Page
    'contact.title': 'Contact Us',
    'contact.subtitle': 'Get in Touch',
    'contact.form.title': 'Send Us a Message',
    'contact.form.name': 'Name',
    'contact.form.email': 'Email',
    'contact.form.message': 'Message',
    'contact.form.submit': 'Send Message',
    'contact.info.title': 'Project Information',
    'contact.info.institution': 'Supervising Institution',
    'contact.info.lead': 'Project Lead',
    'contact.info.support': 'Technical Support',
    
    // Footer
    'footer.copyright': '© 2026 Inhalo 360°. All rights reserved.',
    'footer.institution': 'Taylor\'s University School of Pharmacy',
  },
  
  bm: {
    // Navigation
    'nav.home': 'Laman Utama',
    'nav.about': 'Tentang',
    'nav.features': 'Sistem & Ciri',
    'nav.training': 'Latihan & Demo',
    'nav.contact': 'Hubungi',
    'nav.language': 'Bahasa',
    
    // Home Page
    'home.hero.title': 'Inhalo 360°',
    'home.hero.subtitle': 'Platform Pembelajaran Teknik Penyedut Imersif',
    'home.hero.description': 'Revolusi Pendidikan MDI (Penyedut Dos Terukur) Anda. Mengintegrasikan VR, AR, dan AI untuk keberkesanan latihan yang tiada tandingan.',
    'home.hero.value': 'Menunjukkan pengurangan 40% dalam kesilapan teknik penyedut semasa penilaian pengguna.',
    'home.hero.cta.primary': 'Mulakan Latihan AR Berpandu',
    'home.hero.cta.secondary': 'Masuki Bilik Latihan VR',
    
    'home.highlights.title': 'Melampaui Pembelajaran Pasif',
    'home.highlights.feedback.title': 'Maklum Balas Pembetulan Masa Nyata',
    'home.highlights.feedback.desc': 'Dikuasakan oleh pengesanan kesilapan berteraskan AI',
    'home.highlights.practice.title': 'Berlatih Bila-bila Masa, Di Mana Sahaja',
    'home.highlights.practice.desc': 'Seni bina berasaskan WebXR menghapuskan pergantungan kedai aplikasi',
    'home.highlights.blend.title': 'Dari Maya ke Realiti',
    'home.highlights.blend.desc': 'Gabungan sempurna simulasi VR dan panduan peranti sebenar AR',
    
    // About Page
    'about.title': 'Tentang Projek',
    'about.problem.title': 'Kesilapan Teknik Penyedut: Cabaran Global',
    'about.problem.desc': 'Kajian menunjukkan bahawa 70%-90% pesakit pernafasan melakukan sekurang-kurangnya satu kesilapan kritikal menggunakan MDI. Kesilapan ini boleh mengurangkan keberkesanan ubat sehingga 50%, membawa kepada hospitalisasi yang boleh dicegah.',
    'about.solution.title': 'Penyelesaian Kami',
    'about.solution.subtitle': 'Inhalo 360°: Platform Pembelajaran Generasi Seterusnya',
    'about.solution.gap': 'Merapatkan Jurang: Menggabungkan faedah imersif AR/VR dengan maklum balas peribadi AI.',
    'about.solution.patient': 'Berpusatkan Pesakit: Menyelesaikan had sistem AR/VR sedia ada yang terutamanya menyasarkan profesional.',
    'about.solution.access': 'Akses Keutamaan: Seni bina web-first memastikan akses merentas peranti pada peranti pengguna yang tersedia.',
    'about.team.title': 'Pasukan Projek',
    'about.team.lead': 'Ketua Projek: Olivia Lim',
    'about.team.institution': 'Sekolah Farmasi Universiti Taylor',
    
    // Features Page
    'features.title': 'Sistem & Ciri',
    'features.subtitle': 'Empat Modul Teras Menyampaikan Latihan Komprehensif',
    'features.module1.title': 'Persekitaran Pembelajaran VR Imersif',
    'features.module1.desc': 'Pengguna terlibat dalam latihan MDI berulang dan berstruktur dalam ruang maya tanpa risiko.',
    'features.module2.title': 'Ahli Farmasi Maya Berkuasa AI',
    'features.module2.desc': 'Chatbot pintar 24/7 tersedia untuk menjawab soalan am tentang penggunaan MDI, ubat, atau pengurusan penyakit.',
    'features.module3.title': 'Sistem Latihan AR Dwi-Mod',
    'features.module3.desc': 'Menggunakan teknologi WebXR untuk melapisi panduan digital pada peranti penyedut sebenar.',
    'features.module4.title': 'Penilaian Prestasi & Papan Pemuka Kemajuan',
    'features.module4.desc': 'Pengguna dan pendidik boleh log masuk untuk melihat data latihan sejarah dan skor objektif.',
    
    // Training Page
    'training.title': 'Latihan & Demo',
    'training.ar.title': 'Panduan Langsung AR',
    'training.ar.subtitle': 'Mulakan Latihan AR pada Penyedut Sebenar Anda',
    'training.ar.desc': 'Gunakan pelayar mudah alih/tablet anda untuk mengaktifkan mod AR. Sistem akan meminta akses kamera.',
    'training.ar.button': 'Lancarkan Mod Langsung AR',
    'training.ar.status.ready': 'Kamera Sedia - Letakkan penyedut anda dalam bingkai',
    'training.ar.status.detecting': 'Mengesan kedudukan penyedut...',
    'training.ar.status.active': 'Panduan AR Aktif',
    'training.ar.guide.title': 'Langkah Panduan AR',
    'training.ar.step1': 'Langkah 1: Goncang penyedut dengan kuat',
    'training.ar.step2': 'Langkah 2: Hembus nafas sepenuhnya',
    'training.ar.step3': 'Langkah 3: Letakkan corong di antara bibir',
    'training.ar.step4': 'Langkah 4: Tekan dan sedut perlahan',
    'training.ar.step5': 'Langkah 5: Tahan nafas selama 10 saat',
    'training.ar.step6': 'Langkah 6: Hembus nafas perlahan',
    'training.ar.error.coordination': 'Ralat: Tingkatkan koordinasi antara menekan dan bernafas',
    'training.ar.error.breathhold': 'Ralat: Tahan nafas lebih lama (sasaran 10 saat)',
    'training.ar.error.shake': 'Ralat: Goncang penyedut dengan lebih kuat',
    
    'training.vr.title': 'Pengalaman Imersif VR',
    'training.vr.subtitle': 'Teroka Bilik Latihan VR',
    'training.vr.desc': 'Kuasai langkah asas MDI dalam persekitaran maya sepenuhnya.',
    'training.vr.button': 'Masuki Bilik Latihan VR',
    
    'training.guide.title': 'Panduan Pantas',
    'training.guide.step1': '1. Sediakan peranti MDI anda',
    'training.guide.step2': '2. Benarkan akses kamera apabila diminta',
    'training.guide.step3': '3. Ikut petunjuk AR pada skrin untuk berlatih',
    
    // Contact Page
    'contact.title': 'Hubungi Kami',
    'contact.subtitle': 'Berhubung',
    'contact.form.title': 'Hantar Mesej',
    'contact.form.name': 'Nama',
    'contact.form.email': 'E-mel',
    'contact.form.message': 'Mesej',
    'contact.form.submit': 'Hantar Mesej',
    'contact.info.title': 'Maklumat Projek',
    'contact.info.institution': 'Institusi Penyelia',
    'contact.info.lead': 'Ketua Projek',
    'contact.info.support': 'Sokongan Teknikal',
    
    // Footer
    'footer.copyright': '© 2026 Inhalo 360°. Hak cipta terpelihara.',
    'footer.institution': 'Sekolah Farmasi Universiti Taylor',
  },
  
  zh: {
    // Navigation
    'nav.home': '首页',
    'nav.about': '关于',
    'nav.features': '系统与功能',
    'nav.training': '培训与演示',
    'nav.contact': '联系我们',
    'nav.language': '语言',
    
    // Home Page
    'home.hero.title': 'Inhalo 360°',
    'home.hero.subtitle': '沉浸式吸入器技术学习平台',
    'home.hero.description': '您的MDI（定量吸入器）教育革命。整合VR、AR和AI，实现无与伦比的培训效果。',
    'home.hero.value': '用户评估显示吸入器技术错误减少了40%。',
    'home.hero.cta.primary': '开始AR引导练习',
    'home.hero.cta.secondary': '进入VR培训室',
    
    'home.highlights.title': '超越被动学习',
    'home.highlights.feedback.title': '实时纠正反馈',
    'home.highlights.feedback.desc': '由AI驱动的错误检测提供支持',
    'home.highlights.practice.title': '随时随地练习',
    'home.highlights.practice.desc': '基于WebXR的架构消除了应用商店依赖',
    'home.highlights.blend.title': '从虚拟到现实',
    'home.highlights.blend.desc': 'VR模拟和AR真实设备指导的完美结合',
    
    // About Page
    'about.title': '关于项目',
    'about.problem.title': '吸入器技术错误：全球性挑战',
    'about.problem.desc': '研究表明，70%-90%的呼吸道患者在使用MDI时至少犯一个关键错误。这些错误可使药物疗效降低50%，导致可预防的住院治疗。传统方法缺乏实时反馈和持续强化。',
    'about.solution.title': '我们的解决方案',
    'about.solution.subtitle': 'Inhalo 360°：下一代学习平台',
    'about.solution.gap': '弥合差距：将AR/VR的沉浸式优势与AI的个性化反馈相结合。',
    'about.solution.patient': '以患者为中心：解决现有AR/VR系统主要针对专业人员的局限性。',
    'about.solution.access': '可访问性优先：Web优先架构确保在常用消费设备上的跨设备可访问性。',
    'about.team.title': '项目团队',
    'about.team.lead': '项目负责人：Olivia Lim',
    'about.team.institution': '泰莱大学药学院',
    
    // Features Page
    'features.title': '系统与功能',
    'features.subtitle': '四大核心模块提供全面培训',
    'features.module1.title': '沉浸式VR学习环境',
    'features.module1.desc': '用户在无风险的虚拟空间中进行结构化、可重复的MDI练习。在安全、受控的环境中培养程序记忆。',
    'features.module2.title': 'AI驱动的虚拟药剂师',
    'features.module2.desc': '24/7智能聊天机器人，可回答有关MDI使用、药物或疾病管理的一般问题，支持多语言。',
    'features.module3.title': '双模式AR培训系统',
    'features.module3.desc': '利用WebXR技术将数字指导叠加到真实吸入器设备上。摄像头捕捉用户动作，AI实时检测错误。',
    'features.module4.title': '性能评估与进度仪表板',
    'features.module4.desc': '用户和教育工作者可以登录查看历史培训数据、客观分数，并跟踪多个会话的学习进度。',
    
    // Training Page
    'training.title': '培训与演示',
    'training.ar.title': 'AR实时指导',
    'training.ar.subtitle': '在真实吸入器上开始AR练习',
    'training.ar.desc': '使用您的手机/平板浏览器激活AR模式。系统将请求摄像头访问权限。只需将吸入器放入视野即可获得实时分步指导和错误纠正。',
    'training.ar.button': '启动AR实时模式',
    'training.ar.status.ready': '摄像头就绪 - 将吸入器放置在框架中',
    'training.ar.status.detecting': '正在检测吸入器位置...',
    'training.ar.status.active': 'AR指导已激活',
    'training.ar.guide.title': 'AR指导步骤',
    'training.ar.step1': '步骤1：用力摇晃吸入器',
    'training.ar.step2': '步骤2：完全呼气',
    'training.ar.step3': '步骤3：将吸嘴放在嘴唇之间',
    'training.ar.step4': '步骤4：按压并缓慢吸气',
    'training.ar.step5': '步骤5：屏住呼吸10秒',
    'training.ar.step6': '步骤6：缓慢呼气',
    'training.ar.error.coordination': '错误：改善按压和呼吸之间的协调',
    'training.ar.error.breathhold': '错误：屏气时间更长（目标10秒）',
    'training.ar.error.shake': '错误：更用力地摇晃吸入器',
    
    'training.vr.title': 'VR沉浸式体验',
    'training.vr.subtitle': '探索VR培训室',
    'training.vr.desc': '在完全虚拟的环境中掌握基本的MDI步骤。非常适合初学者或寻求重复、无干扰练习的人。',
    'training.vr.button': '进入VR培训室',
    
    'training.guide.title': '快速入门指南',
    'training.guide.step1': '1. 准备好您的MDI设备',
    'training.guide.step2': '2. 提示时授予摄像头访问权限',
    'training.guide.step3': '3. 按照屏幕上的AR提示进行练习',
    
    // Contact Page
    'contact.title': '联系我们',
    'contact.subtitle': '保持联系',
    'contact.form.title': '发送消息',
    'contact.form.name': '姓名',
    'contact.form.email': '电子邮件',
    'contact.form.message': '消息',
    'contact.form.submit': '发送消息',
    'contact.info.title': '项目信息',
    'contact.info.institution': '监督机构',
    'contact.info.lead': '项目负责人',
    'contact.info.support': '技术支持',
    
    // Footer
    'footer.copyright': '© 2026 Inhalo 360°。版权所有。',
    'footer.institution': '泰莱大学药学院',
  },
  
  ta: {
    // Navigation
    'nav.home': 'முகப்பு',
    'nav.about': 'பற்றி',
    'nav.features': 'அமைப்பு & அம்சங்கள்',
    'nav.training': 'பயிற்சி & டெமோ',
    'nav.contact': 'தொடர்பு',
    'nav.language': 'மொழி',
    
    // Home Page
    'home.hero.title': 'Inhalo 360°',
    'home.hero.subtitle': 'இம்மெர்சிவ் இன்ஹேலர் டெக்னிக் கற்றல் தளம்',
    'home.hero.description': 'உங்கள் MDI (மீட்டர்-டோஸ் இன்ஹேலர்) கல்வி புரட்சி. VR, AR மற்றும் AI ஐ ஒருங்கிணைத்து ஒப்பற்ற பயிற்சி திறனை வழங்குகிறது.',
    'home.hero.value': 'பயனர் மதிப்பீட்டின்போது இன்ஹேலர் தொழில்நுட்ப பிழைகளில் 40% குறைப்பு நிரூபிக்கப்பட்டது.',
    'home.hero.cta.primary': 'AR வழிகாட்டப்பட்ட பயிற்சியைத் தொடங்கவும்',
    'home.hero.cta.secondary': 'VR பயிற்சி அறைக்குள் நுழையவும்',
    
    'home.highlights.title': 'செயலற்ற கற்றலை கடந்து செல்லுங்கள்',
    'home.highlights.feedback.title': 'நேரடி திருத்த பின்னூட்டம்',
    'home.highlights.feedback.desc': 'AI-உந்துதல் பிழை கண்டறிதலால் இயக்கப்படுகிறது',
    'home.highlights.practice.title': 'எப்போது வேண்டுமானாலும், எங்கு வேண்டுமானாலும் பயிற்சி',
    'home.highlights.practice.desc': 'WebXR-அடிப்படையிலான கட்டமைப்பு ஆப் ஸ்டோர் சார்புகளை நீக்குகிறது',
    'home.highlights.blend.title': 'மெய்நிகர்விலிருந்து உண்மைக்கு',
    'home.highlights.blend.desc': 'VR உருவகப்படுத்துதல் மற்றும் AR உண்மையான சாதன வழிகாட்டுதலின் சரியான கலவை',
    
    // About Page
    'about.title': 'திட்டத்தைப் பற்றி',
    'about.problem.title': 'இன்ஹேலர் தொழில்நுட்ப பிழைகள்: உலகளாவிய சவால்',
    'about.problem.desc': 'ஆய்வுகள் 70%-90% சுவாச நோயாளிகள் MDI களைப் பயன்படுத்தும்போது குறைந்தபட்சம் ஒரு முக்கியமான பிழையைச் செய்கின்றனர் என்று காட்டுகின்றன. இந்த பிழைகள் மருந்து திறனை 50% வரை குறைக்கலாம், தடுக்கக்கூடிய மருத்துவமனை அனுமதிக்கு வழிவகுக்கும்.',
    'about.solution.title': 'எங்கள் தீர்வு',
    'about.solution.subtitle': 'Inhalo 360°: அடுத்த தலைமுறை கற்றல் தளம்',
    'about.solution.gap': 'இடைவெளியைக் குறைத்தல்: AR/VR இன் இம்மெர்சிவ் நன்மைகளை AI இன் தனிப்பயனாக்கப்பட்ட பின்னூட்டத்துடன் இணைத்தல்.',
    'about.solution.patient': 'நோயாளி-மையம்: முக்கியமாக தொழில் வல்லுநர்களை இலக்காகக் கொண்ட தற்போதுள்ள AR/VR அமைப்புகளின் வரம்பைத் தீர்த்தல்.',
    'about.solution.access': 'அணுகல் முதலில்: வலை-முதல் கட்டமைப்பு பொதுவாக கிடைக்கும் நுகர்வோர் சாதனங்களில் குறுக்கு-சாதன அணுகலை உறுதி செய்கிறது.',
    'about.team.title': 'திட்டக் குழு',
    'about.team.lead': 'திட்ட தலைவர்: Olivia Lim',
    'about.team.institution': 'டெய்லர்ஸ் பல்கலைக்கழக மருந்தியல் பள்ளி',
    
    // Features Page
    'features.title': 'அமைப்பு & அம்சங்கள்',
    'features.subtitle': 'விரிவான பயிற்சியை வழங்கும் நான்கு முக்கிய தொகுதிகள்',
    'features.module1.title': 'இம்மெர்சிவ் VR கற்றல் சூழல்',
    'features.module1.desc': 'பயனர்கள் ஆபத்து இல்லாத மெய்நிகர் இடத்தில் கட்டமைக்கப்பட்ட, மீண்டும் மீண்டும் செய்யக்கூடிய MDI பயிற்சியில் ஈடுபடுகிறார்கள்.',
    'features.module2.title': 'AI-இயக்கப்படும் மெய்நிகர் மருந்தாளர்',
    'features.module2.desc': 'MDI பயன்பாடு, மருந்து அல்லது நோய் மேலாண்மை பற்றிய பொதுவான கேள்விகளுக்கு பதிலளிக்க 24/7 அறிவார்ந்த சாட்போட் கிடைக்கிறது.',
    'features.module3.title': 'இரட்டை-பயன்முறை AR பயிற்சி அமைப்பு',
    'features.module3.desc': 'உண்மையான இன்ஹேலர் சாதனத்தில் டிஜிட்டல் வழிகாட்டுதலை மேலெழுத WebXR தொழில்நுட்பத்தைப் பயன்படுத்துகிறது.',
    'features.module4.title': 'செயல்திறன் மதிப்பீடு & முன்னேற்ற டாஷ்போர்டு',
    'features.module4.desc': 'பயனர்கள் மற்றும் கல்வியாளர்கள் வரலாற்று பயிற்சி தரவு மற்றும் புறநிலை மதிப்பெண்களைக் காண உள்நுழையலாம்.',
    
    // Training Page
    'training.title': 'பயிற்சி & டெமோ',
    'training.ar.title': 'AR நேரடி வழிகாட்டுதல்',
    'training.ar.subtitle': 'உங்கள் உண்மையான இன்ஹேலரில் AR பயிற்சியைத் தொடங்கவும்',
    'training.ar.desc': 'AR பயன்முறையை செயல்படுத்த உங்கள் மொபைல்/டேப்லெட் உலாவியைப் பயன்படுத்தவும். அமைப்பு கேமரா அணுகலைக் கோரும்.',
    'training.ar.button': 'AR நேரடி பயன்முறையைத் தொடங்கவும்',
    'training.ar.status.ready': 'கேமரா தயார் - உங்கள் இன்ஹேலரை ஃப்ரேமில் வைக்கவும்',
    'training.ar.status.detecting': 'இன்ஹேலர் நிலையைக் கண்டறிகிறது...',
    'training.ar.status.active': 'AR வழிகாட்டுதல் செயலில் உள்ளது',
    'training.ar.guide.title': 'AR வழிகாட்டுதல் படிகள்',
    'training.ar.step1': 'படி 1: இன்ஹேலரை வலுவாக அசைக்கவும்',
    'training.ar.step2': 'படி 2: முழுமையாக மூச்சை வெளியேற்றவும்',
    'training.ar.step3': 'படி 3: உதடுகளுக்கு இடையில் மௌத்பீஸை வைக்கவும்',
    'training.ar.step4': 'படி 4: அழுத்தி மெதுவாக உள்ளிழுக்கவும்',
    'training.ar.step5': 'படி 5: 10 விநாடிகள் மூச்சைப் பிடிக்கவும்',
    'training.ar.step6': 'படி 6: மெதுவாக மூச்சை வெளியேற்றவும்',
    'training.ar.error.coordination': 'பிழை: அழுத்துதல் மற்றும் சுவாசத்தின் ஒருங்கிணைப்பை மேம்படுத்தவும்',
    'training.ar.error.breathhold': 'பிழை: நீண்ட நேரம் மூச்சைப் பிடிக்கவும் (இலக்கு 10 விநாடிகள்)',
    'training.ar.error.shake': 'பிழை: இன்ஹேலரை மிகவும் வலுவாக அசைக்கவும்',
    
    'training.vr.title': 'VR இம்மெர்சிவ் அனுபவம்',
    'training.vr.subtitle': 'VR பயிற்சி அறையை ஆராயுங்கள்',
    'training.vr.desc': 'முழுமையாக மெய்நிகர் சூழலில் அடிப்படை MDI படிகளை எஞ்சமாஸ்டர் செய்யுங்கள்.',
    'training.vr.button': 'VR பயிற்சி அறைக்குள் நுழையவும்',
    
    'training.guide.title': 'விரைவு தொடக்க வழிகாட்டி',
    'training.guide.step1': '1. உங்கள் MDI சாதனத்தைத் தயார் செய்யவும்',
    'training.guide.step2': '2. கேட்கப்படும்போது கேமரா அணுகலை வழங்கவும்',
    'training.guide.step3': '3. பயிற்சி செய்ய திரையில் உள்ள AR குறிப்புகளைப் பின்பற்றவும்',
    
    // Contact Page
    'contact.title': 'எங்களை தொடர்பு கொள்ளுங்கள்',
    'contact.subtitle': 'தொடர்பில் இருங்கள்',
    'contact.form.title': 'செய்தி அனுப்பவும்',
    'contact.form.name': 'பெயர்',
    'contact.form.email': 'மின்னஞ்சல்',
    'contact.form.message': 'செய்தி',
    'contact.form.submit': 'செய்தியை அனுப்பவும்',
    'contact.info.title': 'திட்ட தகவல்',
    'contact.info.institution': 'மேற்பார்வை நிறுவனம்',
    'contact.info.lead': 'திட்ட தலைவர்',
    'contact.info.support': 'தொழில்நுட்ப ஆதரவு',
    
    // Footer
    'footer.copyright': '© 2026 Inhalo 360°. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டவை.',
    'footer.institution': 'டெய்லர்ஸ் பல்கலைக்கழக மருந்தியல் பள்ளி',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
