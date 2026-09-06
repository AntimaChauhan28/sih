import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Languages, 
  HeartHandshake, 
  AlertCircle, 
  PhoneCall, 
  Calendar, 
  CheckCircle2, 
  Info
} from 'lucide-react';
import { RetinalAnalysisResult } from '../types';
import { ICDR_GRADES } from '../data/patientCases';

interface AshaCounselingModalProps {
  caseData: RetinalAnalysisResult;
  onClose: () => void;
}

export default function AshaCounselingModal({ caseData, onClose }: AshaCounselingModalProps) {
  const [activeLang, setActiveLang] = useState<'english' | 'hindi' | 'telugu' | 'tamil'>('english');
  const gradeInfo = ICDR_GRADES[caseData.icdrGrade];

  const scripts = {
    english: {
      urgency: gradeInfo.isReferable 
        ? "URGENT CLINICAL REFERRAL: Patient has signs of vision-threatening diabetic retinopathy. Immediate hospital transfer required."
        : "ROUTINE MONITORING: Early stage or no detectable retinopathy. Annual follow-up recommended.",
      talkingPoints: [
        `"Namaste ${caseData.patient.name} ji. Today's camera check shows your eyes have changes from high blood sugar (${caseData.patient.hba1c}% HbA1c). Early treatment can prevent 90% of blindness."`,
        `"Our tele-ophthalmology doctor has diagnosed Level ${caseData.icdrGrade} (${gradeInfo.name}). You must visit the District Hospital Eye Department within ${gradeInfo.isReferable ? '14 days' : '6 months'}."`,
        `"Do not stop taking your diabetes tablets or insulin. Stopping medication causes retinal blood vessels to burst or leak fluid into the center of vision (macular edema)."`
      ],
      dietAdvice: "Cut down white polished rice and refined sugar. Eat fenugreek (methi), green leafy vegetables, bitter gourd (karela), and whole pulses. Drink plenty of clean water.",
      helpline: "National Health Mission Toll-Free: 104 / Tele-MANAS Ambulance: 108"
    },
    hindi: {
      urgency: gradeInfo.isReferable 
        ? "तत्काल ज़िला अस्पताल रेफरल: मरीज़ की आँखों में डायबिटिक रेटिनोपैथी के गंभीर लक्षण हैं। तुरंत इलाज शुरू कराना ज़रूरी है।"
        : "नियमित वार्षिक जांच: आँख के पर्दे में अभी गंभीर नुकसान नहीं है। अगले साल फिर से जांच कराएं।",
      talkingPoints: [
        `"नमस्ते ${caseData.patient.name} जी। आज के कैमरे की जांच से पता चला है कि खून में शुगर (${caseData.patient.hba1c}% HbA1c) की वजह से आँख के पर्दे (रेटिना) पर असर पड़ रहा है। समय रहते इलाज कराने से 90% अंधापन रोका जा सकता है।"`,
        `"हमारे बड़े नेत्र रोग विशेषज्ञ डॉक्टर ने स्टेज ${caseData.icdrGrade} (${gradeInfo.name}) की पुष्टि की है। आपको ${gradeInfo.isReferable ? '2 हफ्तों के भीतर' : 'साल भर में'} ज़िला अस्पताल की आँख ओपीडी में जाना होगा।"`,
        `"शुगर की दवा या इंसुलिन बिल्कुल बंद न करें। अचानक दवा रोकने से आँखों की नसें कमज़ोर होकर फट सकती हैं।"`,
      ],
      dietAdvice: "सफेद चावल, चीनी और तली चीजें कम करें। मेथी दाना, करेला, हरी पत्तेदार सब्जियां और दालें खाएं। रोज़ाना आधा घंटा टहलें।",
      helpline: "राष्ट्रीय स्वास्थ्य मिशन टोल-फ्री हेल्पलाइन: 104 / एम्बुलेंस: 108"
    },
    telugu: {
      urgency: gradeInfo.isReferable 
        ? "తక్షణ జిల్లా ఆసుపత్రి రిఫరల్: రోగి కంటి రెటీనాలో తీవ్రమైన మార్పులు ఉన్నాయి. చూపు కోల్పోకుండా వెంటనే చికిత్స అవసరం."
        : "సాధారణ వార్షిక పరీక్ష: ప్రస్తుతానికి పెద్ద ప్రమాదం లేదు. వచ్చే ఏడాది మళ్లీ పరీక్ష చేయించుకోండి.",
      talkingPoints: [
        `"నమస్కారం ${caseData.patient.name} గారు. రక్తంలో చక్కెర ఎక్కువగా ఉండటం వల్ల (${caseData.patient.hba1c}% HbA1c) మీ కంటి నరాలపై ప్రభావం పడింది. సరైన సమయంలో చికిత్స చేయించుకుంటే 90% చూపు కోల్పోకుండా కాపాడుకోవచ్చు."`,
        `"కంటి వైద్య నిపుణులు లెవెల్ ${caseData.icdrGrade} (${gradeInfo.name}) గా నిర్ధారించారు. మీరు ${gradeInfo.isReferable ? 'రెండు వారాల్లోపు' : 'సంవత్సరంలోపు'} జిల్లా ఆసుపత్రి కంటి విభాగానికి వెళ్లాలి."`,
        `"షుగర్ మందులు లేదా ఇన్సులిన్ ఎట్టి పరిస్థితుల్లోనూ ఆపవద్దు. మందులు ఆపితే కంటి నరాలు చిట్లిపోయే ప్రమాదం ఉంది."`
      ],
      dietAdvice: "తెల్ల బియ్యం, తీపి పదార్థాలు తగ్గించండి. మెంతులు, ఆకుకూరలు, కాకరకాయ, పప్పు దినుసులు ఆహారంలో భాగం చేసుకోండి.",
      helpline: "ప్రభుత్వ ఆరోగ్య ఉచిత సమాచార కేంద్రం: 104 / 108 అంబులెన్స్"
    },
    tamil: {
      urgency: gradeInfo.isReferable 
        ? "உடனடி மாவட்ட மருத்துவமனை பரிந்துரை: நோயாளியின் விழித்திரையில் ரத்தப்போக்கு அல்லது நீர் கசிவு ஏற்பட்டுள்ளது. பார்வை இழப்பைத் தடுக்க உடனடியாக சிகிச்சை தேவை."
        : "வருடாந்திர தொடர் பரிசோதனை: இப்போது உடனடி ஆபத்து இல்லை. அடுத்த ஆண்டு மீண்டும் பரிசோதிக்கவும்.",
      talkingPoints: [
        `"வணக்கம் ${caseData.patient.name}. ரத்தத்தில் சர்க்கரை அளவு (${caseData.patient.hba1c}%) அதிகமாக இருப்பதால் கண்ணின் விழித்திரை பாதிக்கப்பட்டுள்ளது. ஆரம்பத்திலேயே கவனித்தால் 90% பார்வை இழப்பைத் தடுக்க முடியும்."`,
        `"கண் சிறப்பு மருத்துவர் நிலை ${caseData.icdrGrade} (${gradeInfo.name}) என்று உறுதி செய்துள்ளார். நீங்கள் ${gradeInfo.isReferable ? '14 நாட்களுக்குள்' : 'ஆண்டுக்குள்'} அரசு மாவட்ட மருத்துவமனைக்குச் செல்ல வேண்டும்."`,
        `"மருத்துவர் பரிந்துரைத்த சர்க்கரை மாத்திரைகள் அல்லது இன்சுலினை ஒருபோதும் நிறுத்த வேண்டாம்."`
      ],
      dietAdvice: "வெள்ளை அரிசி, சர்க்கரை மற்றும் எண்ணெய் உணவுகளைக் குறைக்கவும். வெந்தயம், கீரைகள், பாகற்காய், பயறு வகைகளை அதிகம் உட்கொள்ளவும்.",
      helpline: "அரசு மருத்துவ உதவி எண்: 104 / அவசர ஊர்தி: 108"
    }
  };

  const current = scripts[activeLang];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-fadeIn">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <HeartHandshake className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-bold text-base text-slate-100">
                ASHA / Rural Health Worker Counseling Playbook
              </h3>
              <span className="text-[11px] text-slate-400">Community Diabetic Retinopathy Prevention Protocol</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Language Tabs */}
        <div className="bg-slate-950/70 px-6 py-2 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Languages className="w-3.5 h-3.5 text-cyan-400" />
            <span>Select Regional Dialect:</span>
          </div>

          <div className="flex items-center gap-1">
            {(['english', 'hindi', 'telugu', 'tamil'] as const).map(lang => (
              <button
                key={lang}
                onClick={() => setActiveLang(lang)}
                className={`px-2.5 py-1 rounded text-xs font-semibold capitalize transition cursor-pointer ${
                  activeLang === lang
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 text-xs">
          {/* Urgency Alert */}
          <div className={`p-3.5 rounded-xl border flex items-start gap-3 ${
            gradeInfo.isReferable 
              ? 'bg-red-950/60 border-red-800 text-red-200' 
              : 'bg-emerald-950/60 border-emerald-800 text-emerald-200'
          }`}>
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
            <div>
              <span className="font-bold block text-xs uppercase tracking-wide">Community Action Priority</span>
              <p className="mt-1 leading-relaxed">{current.urgency}</p>
            </div>
          </div>

          {/* Talking Points to Tell Patient */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
            <span className="font-bold text-slate-200 flex items-center gap-1.5 text-xs">
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
              <span>What to Tell the Patient ({caseData.patient.name}):</span>
            </span>

            <div className="space-y-2 text-slate-300 leading-relaxed italic">
              {current.talkingPoints.map((tp, idx) => (
                <div key={idx} className="bg-slate-900 p-2.5 rounded border border-slate-800/80">
                  {tp}
                </div>
              ))}
            </div>
          </div>

          {/* Diet & Lifestyle Coaching */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <span className="font-bold text-slate-200 text-xs block">Indian Glycemic Diet Guidance:</span>
            <p className="text-slate-300 leading-relaxed">{current.dietAdvice}</p>
          </div>

          {/* Helpline & Ambulance */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between text-slate-400">
            <div className="flex items-center gap-2">
              <PhoneCall className="w-4 h-4 text-emerald-400" />
              <span className="text-slate-300 font-semibold">{current.helpline}</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">Free Government Health Service</span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
