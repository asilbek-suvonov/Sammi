import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { 
  PlayCircle, Globe, Code, 
  ChevronDown, Lock, Search
} from 'lucide-react'
import Navbar from '@/components/Navbar' // Sizdagi umumiy Navbar
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/course/$id')({
  component: CourseDetailComponent,
})

function CourseDetailComponent() {
  const [openModule, setOpenModule] = useState<number | null>(1)
  const [language, setLanguage] = useState(() => localStorage.getItem('sammi_language') ?? 'en')

  const toggleModule = (id: number) => {
    setOpenModule(openModule === id ? null : id)
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      {/* 1. NAVBAR - Loyihangizdagi tayyor Navbar'dan foydalanamiz */}
      <Navbar 
        language={language} 
        setLanguage={setLanguage} 
      />

      {/* 2. ASOSIY CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-8">
          <Link to="/" className="hover:text-blue-600 transition-colors">Kurslar</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium">Foundation</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* CHAP TOMON (8 ustun) */}
          <div className="lg:col-span-8">
            <div className="flex gap-2 mb-6">
              <Badge text="★ Boshlang'ich" color="bg-orange-50 text-orange-600" />
              <Badge text="Front-end" color="bg-blue-50 text-blue-600" />
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Foundation</h1>
            
            <p className="text-lg text-slate-600 leading-relaxed mb-10">
              Foundation to'liq kurs o'zbek tilida. HTML, CSS, JavaScript (BEM), Bootstrap, SASS (SCSS) 
              va amaliy loyihalar barchasi bitta kursda va asosiysi mutlaqo bepul.
            </p>

            {/* Video Player Placeholder */}
            <div className="group relative aspect-video rounded-[30px] md:rounded-[40px] overflow-hidden bg-slate-900 shadow-2xl mb-12 border-[8px] md:border-[12px] border-white">
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-3xl transform group-hover:scale-110 transition-transform cursor-pointer">
                    <PlayCircle size={40} fill="currentColor" fillOpacity={0.2}/>
                  </div>
               </div>
               <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 bg-black/20 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-2xl text-white text-xs md:text-sm flex items-center gap-3">
                 <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                 Bepul tanishuv videosi
               </div>
            </div>

            {/* O'quv dasturi */}
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-slate-900 mb-6">O'quv dasturi</h3>
              
              <ModuleAccordion 
                id={1}
                title="HTML Asoslari" 
                lessonCount={5}
                isOpen={openModule === 1}
                onToggle={() => toggleModule(1)}
                lessons={[
                  { name: "Web dasturlashga kirish", duration: "12:00" },
                  { name: "Semanitk taglar bilan ishlash", duration: "18:45" },
                  { name: "Form va Inputlar", duration: "22:10" }
                ]}
              />

              <ModuleAccordion 
                id={2}
                title="CSS Stil berish" 
                lessonCount={8}
                isOpen={openModule === 2}
                onToggle={() => toggleModule(2)}
                lessons={[
                  { name: "Selectorlar va Box Model", duration: "15:30" },
                  { name: "Flexbox asoslari", duration: "25:00" },
                  { name: "Grid tizimi", duration: "30:15" }
                ]}
              />
            </div>
          </div>

          {/* O'NG TOMON (4 ustun) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[30px] md:rounded-[40px] p-8 md:p-10 shadow-sm border border-slate-100 sticky top-28">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">KURS NARXI</span>
              <div className="flex items-baseline gap-2 mb-10">
                <span className="text-5xl font-black text-slate-900">Bepul</span>
              </div>
              
              <div className="flex flex-col gap-4 mb-10">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white h-16 rounded-2xl font-bold text-lg shadow-lg shadow-blue-100 transition-all active:scale-[0.98]">
                  Kursni boshlash
                </Button>
                <button className="w-full bg-slate-50 hover:bg-slate-100 text-slate-900 h-16 rounded-2xl font-bold transition-all border border-slate-200">
                  Telegram guruhga qo'shilish
                </button>
              </div>

              <div className="space-y-6">
                <FeatureItem icon={<PlayCircle size={20}/>} text="47 ta darsliklar soni" />
                <FeatureItem icon={<Code size={20}/>} text="Barcha manba kodlari" />
                <FeatureItem icon={<Globe size={20}/>} text="Umrbod ruxsat" />
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}


function Badge({ text, color }: { text: string, color: string }) {
  return (
    <span className={`${color} px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider`}>
      {text}
    </span>
  )
}

function FeatureItem({ icon, text }: { icon: any, text: string }) {
  return (
    <div className="flex items-center gap-4 text-slate-600 font-medium">
      <div className="text-blue-600 bg-blue-50 p-2 rounded-lg">{icon}</div>
      <span className="text-sm">{text}</span>
    </div>
  )
}

interface AccordionProps {
  id: number;
  title: string;
  lessonCount: number;
  isOpen: boolean;
  onToggle: () => void;
  lessons: { name: string, duration: string }[];
}

function ModuleAccordion({ title, lessonCount, isOpen, onToggle, lessons }: AccordionProps) {
  return (
    <div className={`border rounded-[25px] transition-all overflow-hidden ${isOpen ? 'border-blue-200 bg-white shadow-md' : 'border-slate-200 bg-transparent'}`}>
      <button 
        onClick={onToggle}
        className="max-w-full flex items-center justify-between p-5 md:p-6 hover:bg-slate-50/50 transition-colors"
      >
        <div className="flex items-center gap-4 text-left">
          <div className={`w-10 h-10 md:w-12 md:h-12 rounded-2xl flex items-center justify-center transition-colors ${isOpen ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
            <PlayCircle size={22} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm md:text-base">{title}</h4>
            <p className="text-[10px] md:text-xs text-slate-400 font-medium">{lessonCount} ta dars</p>
          </div>
        </div>
        <ChevronDown className={`text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        <div className="px-5 md:px-6 pb-6 space-y-1 border-t border-slate-50 pt-4">
          {lessons.map((lesson, i) => (
            <div key={i} className="group flex items-center justify-between p-3 md:p-4 rounded-2xl hover:bg-blue-50 transition-colors cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="text-slate-300 group-hover:text-blue-500 transition-colors">
                  <Lock size={16} />
                </div>
                <span className="text-xs md:text-sm font-medium text-slate-600 group-hover:text-slate-900">{lesson.name}</span>
              </div>
              <span className="text-[10px] md:text-xs font-mono text-slate-400 group-hover:text-blue-600">{lesson.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}