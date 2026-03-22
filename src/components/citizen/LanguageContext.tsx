"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "EN" | "HI" | "UR";

interface Translations {
    [key: string]: {
        [lang in Language]: string;
    };
}

const translations: Translations = {
    welcome: {
        EN: "Welcome back",
        HI: "नमस्ते, आपका स्वागत है",
        UR: "خوش آمدید",
    },
    home: {
        EN: "Home",
        HI: "होम",
        UR: "ہوم",
    },
    my_area: {
        EN: "My Area",
        HI: "मेरा क्षेत्र",
        UR: "میرا علاقہ",
    },
    grievance: {
        EN: "Grievance",
        HI: "शिकायत",
        UR: "شکایت",
    },
    profile: {
        EN: "Profile",
        HI: "प्रोफ़ाइल",
        UR: "پروفائل",
    },
    citizen_portal: {
        EN: "Citizen Portal",
        HI: "नागरिक पोर्टल",
        UR: "سٹیزن پورٹل",
    },
    booth_intelligence: {
        EN: "Booth Intelligence",
        HI: "बूथ इंटेलिजेंस",
        UR: "بوتھ انٹیلی جنس",
    },
    quick_actions: {
        EN: "Quick Actions",
        HI: "त्वरित कार्रवाई",
        UR: "فوری اقدامات",
    },
    upcoming_events: {
        EN: "Upcoming Events",
        HI: "आगामी कार्यक्रम",
        UR: "آنے والے واقعات",
    },
    your_booth_team: {
        EN: "Your Booth Support Team",
        HI: "आपकी बूथ सहायता टीम",
        UR: "آپ کی بوتھ سپورٹ ٹیم",
    },
    manifesto_tracker: {
        EN: "Manifesto Tracker",
        HI: "घोषणापत्र ट्रैکر",
        UR: "منشور ٹریکر",
    },
    government_schemes: {
        EN: "Government Schemes",
        HI: "सरकारी योजनाएं",
        UR: "سرکاری اسکیمیں",
    },
    identity_verified: {
        EN: "Identity Verified",
        HI: "पहचान सत्यापित",
        UR: "شناخت کی تصدیق ہو گئی۔",
    },
    need_help: {
        EN: "Need Help?",
        HI: "क्या आपको मदद चाहिए?",
        UR: "کیا آپ کو مدد کی ضرورت ہے؟",
    },
    call_booth_worker: {
        EN: "Call Booth Worker",
        HI: "बूथ कार्यकर्ता को बुलाएं",
        UR: "بوتھ ورکر کو کال کریں۔",
    },
    ai_queue_est: {
        EN: "AI Queue Estimator",
        HI: "एआई कतार अनुमानक",
        UR: "اے آئی قطار کا تخمینہ لگانے والا",
    },
    wait_time: {
        EN: "Estimated Wait Time",
        HI: "अनुमानित प्रतीक्षा समय",
        UR: "تخمینہ شدہ انتظار کا وقت",
    },
    mins: {
        EN: "mins",
        HI: "मिनट",
        UR: "منٹ",
    },
    heavy_rush: {
        EN: "Heavy Rush",
        HI: "भारी भीड़",
        UR: "بھاری رش",
    },
    moderate_rush: {
        EN: "Moderate Rush",
        HI: "मध्यम भीड़",
        UR: "معتدل رش",
    },
    low_rush: {
        EN: "Low Rush",
        HI: "कम भीड़",
        UR: "کم رش",
    },
    e_sarthi_title: {
        EN: "E-Sarthi AI Assistant",
        HI: "ई-सारथी एआई सहायक",
        UR: "ای-سارتھی اے آئی اسسٹنٹ",
    },
    e_sarthi_desc: {
        EN: "I can help you navigate voter services.",
        HI: "मैं आपको मतदाता सेवाओं को नेविगेट करने में मदद कर सकता हूँ।",
        UR: "میں آپ کو ووٹر سروسز میں مدد کر سکتا ہوں۔",
    },
    fetch_from_gov: {
        EN: "Fetch from DigiLocker",
        HI: "डिजीलॉकर से प्राप्त करें",
        UR: "ڈیجی لاکر سے حاصل کریں",
    },
    verified_gov: {
        EN: "Verified by ECI",
        HI: "ईसीआई द्वारा सत्यापित",
        UR: "ECI کی طرف سے تصدیق شدہ",
    },
    voter_services: {
        EN: "Voter Services",
        HI: "मतदाता सेवाएं",
        UR: "ووٹر کی خدمات",
    },
    polling_station_navigator: {
        EN: "Polling Station Navigator",
        HI: "मतदान केंद्र नेविगेटर",
        UR: "پولنگ اسٹیشن نیویگیٹر",
    },
    application_tracker: {
        EN: "Application Tracker",
        HI: "आवेदन ट्रैकर",
        UR: "درخواست ٹریکر",
    },
    voter_hub: {
        EN: "Voter Hub",
        HI: "मतदाता हब",
        UR: "ووٹر حب",
    },
    visit_eci_portal: {
        EN: "Visit ECI Portal",
        HI: "ईसीआई पोर्टल पर जाएं",
        UR: "ECI پورٹل پر جائیں",
    },
    navigator_desc: {
        EN: "Find your booth & get live queue updates",
        HI: "अपना बूथ खोजें और लाइव कतार अपडेट प्राप्त करें",
        UR: "اپنا بوتھ تلاش کریں اور لائیو قطار کی اپ ڈیٹس حاصل کریں",
    },
    tracker_desc: {
        EN: "Track your Form 6/7/8 status live",
        HI: "अपने फॉर्म 6/7/8 की स्थिति लाइव ट्रैक करें",
        UR: "اپنے فارم 6/7/8 کی صورتحال کو لائیو ٹریک کریں",
    },
    official_voter_services: {
        EN: "Official Voter Services",
        HI: "आधिकारिक मतदाता सेवाएं",
        UR: "آفیشل ووٹر سروسز",
    },
    voter_services_subtitle: {
        EN: "Access essential forms and guidance for electoral participation.",
        HI: "चुनावी भागीदारी के लिए आवश्यक फॉर्म और मार्गदर्शन प्राप्त करें।",
        UR: "انتخابی شرکت کے لیے ضروری فارم اور رہنمائی حاصل کریں۔",
    },
    view_all: {
        EN: "View All",
        HI: "सब देखें",
        UR: "سب دیکھیں", // Assuming UR translation for "View All"
    },
    apply_now: {
        EN: "Apply Now",
        HI: "अभी आवेदन करें",
        UR: "ابھی درخواست دیں",
    },
    booth_details: {
        EN: "Booth Details",
        HI: "बूथ विवरण",
        UR: "بوتھ کی تفصیلات",
    },
    distance: {
        EN: "Distance",
        HI: "दूरी",
        UR: "فاصلہ",
    },
    time: {
        EN: "Time",
        HI: "समय",
        UR: "وقت",
    },
    booth_officer: {
        EN: "Booth Officer",
        HI: "बूथ अधिकारी",
        UR: "بوتھ آفیسر",
    },
    start_navigation: {
        EN: "Start Navigation",
        HI: "नेविगेशन शुरू करें",
        UR: "نیویگیشن شروع کریں۔",
    },
    show_booth_details: {
        EN: "Show Booth Details",
        HI: "बूथ विवरण दिखाएं",
        UR: "بوتھ کی تفصیلات دکھائیں",
    },
    track_application: {
        EN: "Track Your Application",
        HI: "अपना आवेदन ट्रैक करें",
        UR: "اپنی درخواست ٹریک کریں",
    },
    enter_ref_id: {
        EN: "Enter Reference ID (e.g. VTR...)",
        HI: "संदर्भ आईडी दर्ज करें (जैसे VTR...)",
        UR: "ریفرنس آئی ڈی درج کریں (جیسے VTR...)",
    },
    ref_id_note: {
        EN: "*Reference ID is provided at the time of form submission on ECI Portal.",
        HI: "*संदर्भ आईडी ईसीआई पोर्टल पर फॉर्म जमा करने के समय प्रदान की जाती है।",
        UR: "*ریفرنس آئی ڈی ECI پورٹل پر فارم جمع کروانے کے وقت فراہم کی جاتی ہے۔",
    },
    history: {
        EN: "History",
        HI: "इतिहास",
        UR: "تاریخ",
    },
    need_help_application: {
        EN: "Need Help with your application?",
        HI: "अपने आवेदन में सहायता चाहिए?",
        UR: "کیا آپ کو اپنی درخواست میں مدد کی ضرورت ہے؟",
    },
    contact_blo: {
        EN: "Contact BLO",
        HI: "BLO से संपर्क करें",
        UR: "BLO سے رابطہ کریں",
    },
    voted: {
        EN: "Voted",
        HI: "दान किया",
        UR: "ووٹ دیا",
    },
    missed: {
        EN: "Missed",
        HI: "छूट गया",
        UR: "رہ گیا",
    },
    push_notifications: {
        EN: "Push Notifications",
        HI: "पुश सूचनाएं",
        UR: "پش اطلاعات",
    },
    push_notifications_desc: {
        EN: "Receive alerts for scheme updates and grievance status",
        HI: "योजना अपडेट और शिकायत स्थिति के लिए अलर्ट प्राप्त करें",
        UR: "اسکیم کی اپ ڈیٹس اور شکایت کی صورتحال کے لیے الرٹس حاصل کریں۔",
    },
    sms_alerts: {
        EN: "SMS Alerts",
        HI: "एसएमएस अलर्ट",
        UR: "ایس ایم ایس الرٹس",
    },
    sms_alerts_desc: {
        EN: "Text notifications to your registered mobile number",
        HI: "अपने पंजीकृत मोबाइल नंबर पर टेक्स्ट सूचनाएं",
        UR: "آپ کے رجسٹرڈ موبائل نمبر پر ٹیکسٹ اطلاعات",
    },
    data_sharing: {
        EN: "Data Sharing",
        HI: "डेटा साझाकरण",
        UR: "ڈیٹا شیئرنگ",
    },
    data_sharing_desc: {
        EN: "Allow booth officers to view your participation data",
        HI: "बूथ अधिकारियों को आपकी भागीदारी डेटा देखने की अनुमति दें",
        UR: "بوتھ آفیسرز کو آپ کی شرکت کا ڈیٹا دیکھنے کی اجازت دیں۔",
    },
    hindi_interface: {
        EN: "Hindi Interface",
        HI: "हिंदी इंटरफ़ेस",
        UR: "ہندی انٹرفیس",
    },
    hindi_interface_desc: {
        EN: "Display the interface in Hindi (experimental)",
        HI: "हिंदी में इंटरफ़ेस प्रदर्शित करें (प्रायोगिक)",
        UR: "ہندی میں انٹرفیس ڈسپلے کریں (تجرباتی)",
    },
    // Gender
    male: {
        EN: "Male",
        HI: "पुरुष",
        UR: "مرد",
    },
    female: {
        EN: "Female",
        HI: "महिला",
        UR: "خواتین",
    },
    other: {
        EN: "Other",
        HI: "अन्य",
        UR: "دیگر",
    },
    // Voter Card & Profile Tabs
    verified_voter: {
        EN: "VERIFIED VOTER",
        HI: "सत्यापित मतदाता",
        UR: "تصدیق شدہ ووٹر",
    },
    namaste: {
        EN: "Namaste",
        HI: "नमस्ते",
        UR: "नमस्ते",
    },
    epic_no: {
        EN: "EPIC No",
        HI: "ईपीआईसी संख्या",
        UR: "ایپک نمبر",
    },
    polling_booth_title: {
        EN: "Your Polling Booth",
        HI: "आपका मतदान केंद्र",
        UR: "آپ کا پولنگ بوتھ",
    },
    personal_tab: {
        EN: "Personal",
        HI: "व्यक्तिगत",
        UR: "ذاتی",
    },
    digital_id_tab: {
        EN: "Digital ID",
        HI: "डिजिटल आईडी",
        UR: "ڈیجیٹل آئی ڈی",
    },
    history_tab: {
        EN: "History",
        HI: "इतिहास",
        UR: "تاریخ",
    },
    settings_tab: {
        EN: "Settings",
        HI: "सेटिंग्स",
        UR: "ترتیبات",
    },
    sign_out: {
        EN: "Sign Out",
        HI: "साइन आउट",
        UR: "سائن آؤٹ",
    },
    authorized_view: {
        EN: "Authorized View",
        HI: "अधिकृत दृश्य",
        UR: "مجاز منظر",
    },
    download_pdf: {
        EN: "Download PDF",
        HI: "पीडीएफ डाउनलोड करें",
        UR: "پی ڈی ایف ڈاؤن لوڈ کریں",
    },
    show_qr_code: {
        EN: "Show QR Code",
        HI: "QR कोड दिखाएं",
        UR: "QR کوڈ دکھائیں",
    },
    epic_info_text: {
        EN: "The **e-EPIC** is a secure, non-editable PDF version of the EPIC which can be used as a valid identity proof at polling stations.",
        HI: "**e-EPIC** ईपीआईसी का एक सुरक्षित, गैर-संपादन योग्य पीडीएफ संस्करण है जिसका उपयोग मतदान केंद्रों पर वैध पहचान प्रमाण के रूप में किया जा सकता है।",
        UR: "**e-EPIC** EPIC کا ایک محفوظ، غیر قابل تدوین PDF ورژن ہے جسے پولنگ اسٹیشنوں پر درست شناختی ثبوت کے طور پر استعمال کیا جا سکتا ہے۔",
    },
};

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [language, setLanguage] = useState<Language>("EN");

    useEffect(() => {
        const stored = localStorage.getItem("app_lang") as Language;
        if (stored && ["EN", "HI", "UR"].includes(stored)) {
            setLanguage(stored);
        }
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem("app_lang", lang);
    };

    const t = (key: string) => {
        return translations[key]?.[language] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error("useLanguage must be used within a LanguageProvider");
    }
    return context;
}
