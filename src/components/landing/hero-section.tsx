import { PlayCircle, ArrowRight, Star, Users, Code, Laptop,  CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background pt-12 pb-16 md:pt-20 md:pb-28">
      {/* Background Glow - Rejimga qarab moslashadi */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] " />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center mb-16 max-w-6xl mx-auto">
          
          {/* CHAP TOMON: MATN QISMI */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-muted/50 backdrop-blur-md mb-6 animate-in fade-in slide-in-from-bottom-3">
              <Badge className="rounded-md border border-white/20 bg-black/40 px-2 py-0.5 text-white text-[10px] h-5">LIVE</Badge>
              <span className="text-[12px] font-medium text-muted-foreground flex items-center gap-1">
                Yangi Mentorlik dasturi boshlandi <ArrowRight size={12} />
              </span>
            </div>

            <h1 className="text-3xl lg:text-3xl font-black tracking-tight mb-6 leading-[1.1] text-foreground">
              KOD YOZISHNI <br />
              <span className="text-neutral-300 dark:text-neutral-400 italic">SAN'AT</span> DARAJASIGA CHIQARING.
            </h1>

            <p className="text-[15px] md:text-[16px] text-muted-foreground mb-8 max-w-xl leading-relaxed">
              Biz shunchaki dars bermaymiz. Biz sizga zamonaviy ekotizimda haqiqiy loyihalar qurishni, 
              toza kod yozishni va professional jamoada ishlashni o'rgatamiz.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto h-12 px-8 rounded-xl bg-neutral-400 hover:bg-neutral-300 text-white font-bold text-sm shadow-xl shadow-neutral-600/20">
                Kurslarni boshlash
              </Button>
              <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 rounded-xl border-border font-bold text-sm bg-background/50 backdrop-blur-sm">
                <PlayCircle className="mr-2 size-4 text-blue-600 " /> Demo dars
              </Button>
            </div>
          </div>

          {/* O'NG TOMON: CODE EDITOR (Qiziqarli kod bilan) */}
          <div className="lg:col-span-6 flex items-center justify-center order-1 lg:order-2">
            <Card className="relative w-full max-w-2xl border border-border bg-card/80 dark:bg-neutral-950/50 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden group h-98 border-t-blue-500/20">
              
              {/* Window Header */}
              <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border">
                <div className="flex gap-2">
                  <div className="size-3 rounded-full bg-[#FF5F56]"></div>
                  <div className="size-3 rounded-full bg-[#FFBD2E]"></div>
                  <div className="size-3 rounded-full bg-[#27C93F]"></div>
                </div>
                <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                  <Laptop size={12} />
                  <span>useFetchUser.ts — Sammi</span>
                </div>
                <div className="size-3"></div> {/* Spacing */}
              </div>
              
              {/* Code Area */}
              <div className="p-5 md:p-7 font-mono text-[12px] md:text-[13px] leading-relaxed overflow-x-auto">
                <div className="flex gap-4">
                  <div className="text-muted-foreground/40 text-right select-none hidden sm:block">
                    {Array.from({length: 9}).map((_, i) => <div key={i}>{i+1}</div>)}
                  </div>
                  <div className="flex-1">
                    <span className="text-purple-500 dark:text-purple-400 italic">const</span> <span className="text-blue-600 dark:text-blue-400">useSammiData</span> = <span className="text-orange-500">(</span><span className="text-foreground">id</span><span className="text-orange-500">)</span> =&gt; &#123; <br />
                    &nbsp;&nbsp;<span className="text-purple-500">const</span> [user, setUser] = <span className="text-blue-600">useState</span>(<span className="text-foreground">null</span>); <br />
                    <br />
                    &nbsp;&nbsp;<span className="text-blue-600">useEffect</span>(<span className="text-orange-500">()</span> =&gt; &#123; <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-500">async</span> <span className="text-purple-500">function</span> <span className="text-blue-600">load</span>() &#123; <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-purple-500">const</span> res = <span className="text-purple-500">await</span> <span className="text-blue-600">fetch</span>(<span className="text-green-600">'/api/user/' + id</span>); <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-600">setUser</span>(<span className="text-purple-500">await</span> res.<span className="text-blue-600">json</span>()); <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&#125; <br />
                    &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-blue-600">load</span>(); <br />
                    &nbsp;&nbsp;&#125;, [<span className="text-foreground">id</span>]); <br />
                    <br />
                    &nbsp;&nbsp;<span className="text-purple-500">return</span> &#123; <span className="text-foreground">user, status:</span> <span className="text-green-600">'Success'</span> &#125;; <br />
                    &#125;;
                  </div>
                </div>
              </div>

              {/* Floating Success Badge */}
              <div className="absolute bottom-4 right-4 animate-bounce">
                <div className="bg-neutral-500/10 backdrop-blur-md border border-neutral-500/20 px-3 py-1.5 rounded-lg flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-neutral-500" />
                  <span className="text-[11px] font-bold text-neutral-600 dark:text-neutral-400">Code Compiled!</span>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* STATISTICS SECTION: RESPONSIVE CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
          <StatCard 
            icon={<Users className="size-4" />} 
            label="O'quvchilar" 
            value="15,000+" 
            desc="Faol bilim oluvchilar" 
          />
          <StatCard 
            icon={<Code className="size-4" />} 
            label="Darsliklar" 
            value="450+" 
            desc="Video darslar soni" 
          />
          <StatCard 
            icon={<Star className="size-4" />} 
            label="Loyihalar" 
            value="20+" 
            desc="Real-world loyihalar" 
          />
        </div>
      </div>
    </section>
  )
}

function StatCard({ icon, label, value, desc }: { icon: any, label: string, value: string, desc: string }) {
  return (
    <Card className="p-4 border border-border bg-card/40 backdrop-blur-sm rounded-2xl hover:border-neutral-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5 group">
      <div className="flex items-center gap-4">
        <div className="size-10 rounded-xl bg-neutral-500 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest leading-none mb-1">{label}</p>
          <h4 className="text-xl font-black text-foreground">{value}</h4>
          <p className="text-[11px] text-muted-foreground mt-0.5">{desc}</p>
        </div>
      </div>
    </Card>
  )
}