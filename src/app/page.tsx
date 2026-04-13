import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ArrowRight, Layout, Zap, Palette } from "lucide-react";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-background overflow-hidden relative selection:bg-primary selection:text-primary-foreground">
      {/* Ambient Background Gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-[600px] bg-primary/10 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Header Navigation */}
      <header className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-[1.02] active:scale-95">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary font-heading text-2xl font-black text-primary-foreground shadow-lg">
              F
            </div>
            <span className="font-heading text-2xl font-extrabold tracking-tight">FuryX</span>
          </Link>
          <div className="flex items-center gap-4">
            {session ? (
              <Link href="/dashboard" className="btn-ripple flex items-center justify-center rounded-xl bg-primary px-5 py-2 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:scale-105 hover:bg-primary/90 hover:shadow-md active:scale-95 duration-200">
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden sm:flex items-center justify-center rounded-xl bg-transparent px-5 py-2 text-sm font-bold text-foreground transition-all hover:bg-muted active:scale-95 duration-200">
                  Sign In
                </Link>
                <Link href="/register" className="btn-ripple flex items-center justify-center rounded-xl bg-primary px-5 py-2 text-sm font-bold text-primary-foreground shadow-sm transition-all hover:scale-105 hover:bg-primary/90 hover:shadow-md active:scale-95 duration-200">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-24 md:pt-40 md:pb-32 lg:pt-48 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        {/* Left Content */}
        <div className="flex-1 space-y-8 text-center lg:text-left z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary animate-slide-up">
            <Zap className="h-4 w-4" />
            <span>Fluid at 60fps</span>
          </div>
          
          <h1 className="font-heading text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1] animate-slide-up" style={{ animationDelay: '100ms' }}>
            Work moves faster when it's <span className="text-primary">fun.</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 animate-slide-up" style={{ animationDelay: '150ms' }}>
            FuryX is the high-energy Kanban workspace for teams that want to get things done without the enterprise bloat. Real-time, beautifully designed, and effortlessly intuitive.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
            {session ? (
              <Link href="/dashboard" className="btn-ripple flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:bg-primary/90 active:scale-95 duration-200">
                Open Workspace <ArrowRight className="h-5 w-5" />
              </Link>
            ) : (
              <>
                <Link href="/register" className="btn-ripple flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:bg-primary/90 active:scale-95 duration-200">
                  Start for Free <ArrowRight className="h-5 w-5" />
                </Link>
                <Link href="#features" className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-2xl bg-secondary px-8 py-4 text-base font-bold text-secondary-foreground shadow-sm transition-all hover:scale-105 hover:bg-secondary/80 active:scale-95 duration-200">
                  See Features
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Right Graphic (Abstract Kanban) */}
        <div className="flex-1 w-full max-w-lg lg:max-w-none relative aspect-square animate-scale-in" style={{ animationDelay: '300ms' }}>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none rounded-full" />
          
          {/* Decorative Background Columns */}
          <div className="absolute inset-0 grid grid-cols-3 gap-4 p-8 transform rotate-12 scale-110 opacity-60">
            <div className="rounded-3xl bg-kanban-column border border-border/50 shadow-inner" />
            <div className="rounded-3xl bg-kanban-column border border-border/50 shadow-inner" />
            <div className="rounded-3xl bg-kanban-column border border-border/50 shadow-inner" />
          </div>

          {/* Floating Task Cards */}
          <div className="absolute top-[15%] left-[10%] w-[60%] rounded-2xl bg-card border border-white/20 p-5 shadow-2xl shadow-black/5 backdrop-blur-md transform -rotate-6 animate-board-card" style={{ animationDelay: '400ms' }}>
            <div className="flex gap-2 mb-3">
              <div className="h-2 w-12 bg-[#ec4899] rounded-full" />
              <div className="h-2 w-8 bg-[#8b5cf6] rounded-full" />
            </div>
            <div className="h-4 w-3/4 bg-foreground/90 rounded-md mb-2" />
            <div className="h-4 w-1/2 bg-foreground/60 rounded-md mb-4" />
            <div className="flex justify-between items-center">
              <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-primary" />
              </div>
              <div className="h-6 w-6 rounded-full bg-[#f59e0b] border-2 border-card" />
            </div>
          </div>

          <div className="absolute top-[45%] right-[5%] w-[65%] rounded-2xl bg-card border border-white/20 p-5 shadow-2xl shadow-black/5 backdrop-blur-md transform rotate-3 animate-board-card" style={{ animationDelay: '500ms' }}>
            <div className="flex gap-2 mb-3">
              <div className="h-2 w-16 bg-[#10b981] rounded-full" />
            </div>
            <div className="h-4 w-5/6 bg-foreground/90 rounded-md mb-2" />
            <div className="flex justify-between items-center mt-6">
              <div className="h-6 w-6 rounded-full bg-destructive/20 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-destructive" />
              </div>
              <div className="h-6 w-6 rounded-full bg-[#3b82f6] border-2 border-card" />
            </div>
          </div>

          <div className="absolute bottom-[10%] left-[20%] w-[55%] rounded-2xl bg-primary text-primary-foreground border border-white/20 p-5 shadow-2xl shadow-primary/30 backdrop-blur-md transform -rotate-3 animate-board-card" style={{ animationDelay: '600ms' }}>
            <div className="flex gap-2 mb-3">
              <div className="h-2 w-10 bg-white/40 rounded-full" />
            </div>
            <div className="h-4 w-full bg-white/90 rounded-md mb-2" />
            <div className="h-4 w-2/3 bg-white/60 rounded-md" />
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section id="features" className="bg-muted/30 border-y border-border/50 py-24 px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-4">Everything you need. Nothing you don't.</h2>
            <p className="text-muted-foreground text-lg">We stripped away the confusing charts and endless dropdowns to give you exactly what matters: extreme visibility.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Layout className="h-6 w-6 text-[#8b5cf6]" />,
                color: "bg-[#8b5cf6]/10",
                title: "Visual Boards",
                desc: "Instantly see what's in progress, what's blocked, and who is doing what. Your brain processes visual information 60,000x faster than text."
              },
              {
                icon: <Zap className="h-6 w-6 text-[#f59e0b]" />,
                color: "bg-[#f59e0b]/10",
                title: "Real-Time Sync",
                desc: "When someone moves a card, everyone sees it instantly via WebSockets. No page refreshes. No stepping on each other's toes. Just flow."
              },
              {
                icon: <Palette className="h-6 w-6 text-[#10b981]" />,
                color: "bg-[#10b981]/10",
                title: "Expressive Themes",
                desc: "Make your workspace your own. Switch seamlessly between light and dark modes, and pick vibrant accent colors that match your team's energy."
              }
            ].map((feature, i) => (
              <div key={i} className="bg-card rounded-3xl p-8 border border-border/50 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-slide-up group" style={{ animationDelay: `${(i + 3) * 100}ms` }}>
                <div className={`h-14 w-14 rounded-2xl ${feature.color} flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  {feature.icon}
                </div>
                <h3 className="font-heading text-xl font-bold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <footer className="py-24 px-6 text-center relative z-10 bg-background overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[100px] rounded-full pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="font-heading text-4xl sm:text-5xl font-extrabold mb-6">Ready to find your focus?</h2>
          <p className="text-xl text-muted-foreground mb-10">Join teams that are shipping faster and stressing less.</p>
          
          {session ? (
            <Link href="/dashboard" className="btn-ripple inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-10 py-5 text-lg font-bold text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:scale-105 hover:bg-primary/90 active:scale-95 duration-200">
              Go to Dashboard <ArrowRight className="h-6 w-6" />
            </Link>
          ) : (
            <Link href="/register" className="btn-ripple inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-10 py-5 text-lg font-bold text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:scale-105 hover:bg-primary/90 active:scale-95 duration-200">
              Create Free Workspace <ArrowRight className="h-6 w-6" />
            </Link>
          )}
        </div>
      </footer>
    </div>
  );
}
