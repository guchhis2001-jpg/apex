import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Megaphone,
  Newspaper,
  Target,
  Handshake,
  Trophy,
  Users,
  BarChart3,
  Globe2,
  Tv,
  MapPin,
  Calendar,
  ArrowRight,
  Mail,
  Phone,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { EnquireDialog } from "@/components/apex/EnquireDialog";
import heroStadium from "@/assets/hero-stadium.jpg";
import sponsorshipBg from "@/assets/sponsorship-bg.jpg";
import lionsLogo from "@/assets/lions-logo.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Apex — The Agency Behind the Game" },
      {
        name: "description",
        content:
          "Apex is a premium sports marketing agency: social, PR, paid ads, content & sponsorship sales for leagues and teams.",
      },
      { property: "og:title", content: "Apex — Sports Marketing Agency" },
      {
        property: "og:description",
        content:
          "Full-service sports marketing and sponsorship sales for championship teams and leagues.",
      },
    ],
  }),
  component: ApexHome,
});

const services = [
  {
    icon: Megaphone,
    title: "Social Media",
    desc: "Content calendars, reels, match-day posts and 24/7 fan engagement that turns followers into superfans.",
  },
  {
    icon: Newspaper,
    title: "PR & Media",
    desc: "Press coverage, broadcast partnerships and interview placements with top-tier sports media.",
  },
  {
    icon: Target,
    title: "Paid Advertising",
    desc: "Meta, Google and programmatic campaigns engineered to drive ticket sales, merch and brand growth.",
  },
  {
    icon: Handshake,
    title: "Sponsorship Sales",
    desc: "We identify, pitch and close brand partners on behalf of the leagues and teams we represent.",
  },
];

const packages = [
  {
    badge: "🥇",
    tier: "Title Sponsor",
    price: "₹1 Crore",
    highlight: true,
    perks: [
      "Team naming rights",
      "Front jersey branding",
      "8% LED + big screen",
      "Bench branding",
      "4 premium tickets / match",
    ],
  },
  {
    badge: "🥈",
    tier: "Powered By",
    price: "₹70 Lakh",
    perks: [
      "Back jersey branding",
      "5% LED + big screen",
      "4 premium tickets",
      "Meet & greet access",
    ],
  },
  {
    badge: "🥉",
    tier: "Associate Sponsor",
    price: "₹50 Lakh",
    perks: [
      "Lower back jersey",
      "3% LED + big screen",
      "2 premium tickets",
    ],
  },
  {
    badge: "🏅",
    tier: "Co-Associate",
    price: "₹30 Lakh",
    note: "Only 2 spots",
    perks: [
      "1 jersey spot",
      "2% LED + big screen",
      "2 premium tickets",
    ],
  },
];

const whyApex = [
  { icon: Users, title: "Premium Sports Audiences", desc: "Direct access to engaged, high-spending fans across India and beyond." },
  { icon: Trophy, title: "End-to-End Execution", desc: "From strategy and creative to media buying and reporting — one team." },
  { icon: Handshake, title: "Exclusive Partnerships", desc: "We hold rights with leagues and franchises others can't reach." },
  { icon: BarChart3, title: "Measurable ROI", desc: "Every campaign is tracked, optimised and reported with full transparency." },
];

const stats = [
  { value: "$15.46M", label: "Sponsorship Value Managed" },
  { value: "5M+", label: "Global Audience Reach" },
  { value: "36", label: "World-Class Athletes" },
  { value: "Sony + FanCode", label: "Broadcast Partners" },
];

function ApexHome() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<string | undefined>();

  const openEnquire = (pkg?: string) => {
    setSelectedPkg(pkg);
    setDialogOpen(true);
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <Toaster theme="dark" position="top-center" richColors />

      {/* NAV */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/60 border-b border-border">
        <nav className="container mx-auto flex items-center justify-between h-16 px-6">
          <a href="#top" className="font-display text-2xl tracking-widest">
            <span className="text-gradient-gold">APEX</span>
          </a>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#services" className="hover:text-gold transition">Services</a>
            <a href="#clients" className="hover:text-gold transition">Clients</a>
            <a href="#sponsorship" className="hover:text-gold transition">Sponsorships</a>
            <a href="#why" className="hover:text-gold transition">Why Apex</a>
            <a href="#contact" className="hover:text-gold transition">Contact</a>
          </div>
          <Button variant="hero" size="sm" asChild>
            <a href="#contact">Get In Touch</a>
          </Button>
        </nav>
      </header>

      {/* HERO */}
      <section id="top" className="relative min-h-screen flex items-center pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src={heroStadium}
            alt="Floodlit padel stadium"
            width={1920}
            height={1080}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl animate-fade-up">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-card text-xs uppercase tracking-[0.25em] text-gold mb-8">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              Sports Marketing Agency
            </div>
            <h1 className="font-display text-6xl md:text-8xl lg:text-9xl leading-[0.9] mb-6">
              THE AGENCY <br />
              BEHIND THE <span className="text-gradient-gold">GAME</span>.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
              Full-service sports marketing — social, PR, ads, content and
              sponsorship sales — for leagues and teams that want to win off
              the field too.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="xl" asChild>
                <a href="#contact">Work With Us <ArrowRight /></a>
              </Button>
              <Button variant="outlineGold" size="xl" asChild>
                <a href="#sponsorship">Explore Sponsorships</a>
              </Button>
            </div>
          </div>
        </div>

        {/* floating stat strip */}
        <div className="absolute bottom-6 left-0 right-0 z-10">
          <div className="container mx-auto px-6">
            <div className="glass-card rounded-2xl px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="font-display text-2xl md:text-3xl text-gradient-gold">{s.value}</div>
                  <div className="text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-28 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <div className="text-gold text-xs uppercase tracking-[0.3em] mb-4">What We Do</div>
            <h2 className="font-display text-5xl md:text-7xl leading-none mb-4">
              MARKETING THAT <span className="text-gradient-gold">SCORES</span>.
            </h2>
            <p className="text-muted-foreground text-lg">
              Four disciplines, one championship-grade team. We build brands
              that fans rally behind and sponsors fight to back.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((s, i) => (
              <div
                key={s.title}
                className="glass-card rounded-2xl p-8 group hover:-translate-y-1 transition-all duration-300 hover:shadow-gold"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center mb-6 group-hover:rotate-6 transition-transform">
                  <s.icon className="text-gold-foreground" size={26} />
                </div>
                <h3 className="font-display text-2xl tracking-wide mb-3">{s.title.toUpperCase()}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENTS */}
      <section id="clients" className="py-28 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-gold text-xs uppercase tracking-[0.3em] mb-4">Our Roster</div>
            <h2 className="font-display text-5xl md:text-7xl leading-none">
              TRUSTED BY LEAGUES <br /> & <span className="text-gradient-gold">TEAMS</span>
            </h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Flagship */}
            <div className="lg:col-span-2 glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden gold-border">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
              <div className="relative flex flex-col md:flex-row gap-8 items-center">
                <div className="shrink-0 w-40 h-40 rounded-2xl bg-navy-deep/50 flex items-center justify-center p-4 animate-float">
                  <img src={lionsLogo} alt="Game Changers Lions" width={512} height={512} className="w-full h-full object-contain" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-block px-3 py-1 rounded-full bg-gold/15 text-gold text-[10px] uppercase tracking-widest mb-3">
                    Official Exclusive Sponsor Partner
                  </div>
                  <h3 className="font-display text-3xl md:text-4xl mb-3 tracking-wide">
                    GAME CHANGERS LIONS
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Competing in the World Padel League — India's fastest-growing
                    padel franchise, broadcast on Sony Sports & FanCode, with a
                    total sponsorship value of <span className="text-gold font-semibold">$15.46M</span>.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["World Padel League", "Sony Sports", "FanCode", "Mumbai 2026"].map((t) => (
                      <span key={t} className="text-xs px-3 py-1 rounded-full border border-border text-muted-foreground">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Coming soon cards — wrapped so both stay in the third column */}
            <div className="flex flex-col gap-6">
              {["Cricket Franchise", "Football Club"].map((label) => (
                <div key={label} className="glass-card rounded-3xl p-8 flex flex-col items-center justify-center text-center flex-1 relative overflow-hidden" style={{ minHeight: "calc(50% - 12px)" }}>
                  <div className="absolute inset-0 shimmer opacity-30" />
                  <div className="relative">
                    <div className="w-16 h-16 mx-auto rounded-full border-2 border-dashed border-gold/40 flex items-center justify-center mb-4">
                      <Trophy className="text-gold/60" />
                    </div>
                    <div className="font-display text-2xl tracking-wide">{label.toUpperCase()}</div>
                    <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground mt-2">
                      Coming Soon
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SPONSORSHIP MARKETPLACE */}
      <section id="sponsorship" className="py-28 relative">
        <div className="absolute inset-0 z-0">
          <img src={sponsorshipBg} alt="" width={1920} height={1080} loading="lazy" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="text-gold text-xs uppercase tracking-[0.3em] mb-4">Sponsorship Marketplace</div>
            <h2 className="font-display text-5xl md:text-7xl leading-none mb-6">
              OWN A PIECE <br /> OF THE <span className="text-gradient-gold">GAME</span>.
            </h2>
            <p className="text-muted-foreground text-lg">
              We represent top leagues and teams to connect your brand with
              premium sports audiences.
            </p>
          </div>

          {/* Featured listing */}
          <div className="glass-card rounded-3xl p-8 md:p-12 mb-10 gold-border">
            <div className="flex flex-col lg:flex-row gap-8 items-start">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold text-gold-foreground text-[10px] uppercase tracking-widest font-bold mb-4">
                  Featured Opportunity
                </div>
                <h3 className="font-display text-4xl md:text-5xl tracking-wide mb-3">
                  GAME CHANGERS LIONS · WPL 2026
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl">
                  India's marquee padel franchise returns for the World Padel League
                  2026 season. Position your brand at the heart of the action.
                </p>

                <div className="grid sm:grid-cols-2 gap-3 text-sm">
                  <Detail icon={Calendar} label="Event" value="WPL 2026 · Aug 12–16" />
                  <Detail icon={MapPin} label="Location" value="Mumbai, India" />
                  <Detail icon={Tv} label="Broadcast" value="Sony Sports 1 HD + FanCode" />
                  <Detail icon={Globe2} label="Global" value="YouTube worldwide stream" />
                  <Detail icon={Users} label="Audience" value="Urban, 25–45, metro, HSEC" />
                  <Detail icon={BarChart3} label="Total Value" value="$15.46M sponsorship pool" />
                </div>
              </div>
            </div>
          </div>

          {/* Tier cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {packages.map((p) => (
              <div
                key={p.tier}
                className={`glass-card rounded-2xl p-6 flex flex-col relative transition-all duration-300 hover:-translate-y-2 ${
                  p.highlight ? "gold-border shadow-gold ring-1 ring-gold/40" : ""
                }`}
              >
                {p.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-gold text-gold-foreground text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
                    Most Premium
                  </div>
                )}
                <div className="text-4xl mb-3">{p.badge}</div>
                <div className="font-display text-2xl tracking-wide mb-1">{p.tier.toUpperCase()}</div>
                <div className="text-3xl font-bold text-gradient-gold mb-1">{p.price}</div>
                {p.note && <div className="text-xs text-gold/80 uppercase tracking-widest mb-3">{p.note}</div>}
                <ul className="space-y-2 my-5 flex-1">
                  {p.perks.map((perk) => (
                    <li key={perk} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 size={16} className="text-gold mt-0.5 shrink-0" />
                      <span>{perk}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  variant={p.highlight ? "hero" : "outlineGold"}
                  className="w-full"
                  onClick={() => openEnquire(`${p.tier} (${p.price})`)}
                >
                  Enquire Now
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY APEX */}
      <section id="why" className="py-28 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <div className="text-gold text-xs uppercase tracking-[0.3em] mb-4">The Apex Edge</div>
            <h2 className="font-display text-5xl md:text-7xl leading-none">
              WHY BRANDS & TEAMS <br /> CHOOSE <span className="text-gradient-gold">APEX</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyApex.map((w) => (
              <div key={w.title} className="text-center p-6">
                <div className="w-16 h-16 mx-auto rounded-2xl glass-card gold-border flex items-center justify-center mb-5">
                  <w.icon className="text-gold" size={28} />
                </div>
                <h3 className="font-display text-xl tracking-wide mb-2">{w.title.toUpperCase()}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="glass-card rounded-3xl gold-border py-12 px-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="font-display text-4xl md:text-6xl text-gradient-gold mb-2">{s.value}</div>
                  <div className="text-xs uppercase tracking-[0.25em] text-muted-foreground">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-28 relative">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:items-center">
            <div>
              <div className="text-gold text-xs uppercase tracking-[0.3em] mb-4">Contact</div>
              <h2 className="font-display text-5xl md:text-7xl leading-none mb-6">
                LET'S <span className="text-gradient-gold">TALK</span>.
              </h2>
              <p className="text-muted-foreground text-lg mb-10 max-w-md">
                Whether you run a league, captain a team or build a brand —
                Apex is your unfair advantage.
              </p>

              <div className="space-y-4">
                <a href="mailto:Info@gamechangersfzco.com" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl glass-card gold-border flex items-center justify-center group-hover:bg-gold group-hover:text-gold-foreground transition">
                    <Mail size={20} />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Email</div>
                    <div className="font-medium">Info@gamechangersfzco.com</div>
                  </div>
                </a>
                <a href="tel:+971504174551" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl glass-card gold-border flex items-center justify-center group-hover:bg-gold group-hover:text-gold-foreground transition">
                    <Phone size={20} />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Phone</div>
                    <div className="font-medium">+971 50 417 4551</div>
                  </div>
                </a>
              </div>
            </div>

            <div className="glass-card rounded-3xl p-8 gold-border">
              <Tabs defaultValue="brands">
                <TabsList className="grid grid-cols-2 w-full bg-background/50 mb-6">
                  <TabsTrigger value="brands">For Brands & Sponsors</TabsTrigger>
                  <TabsTrigger value="teams">For Teams & Leagues</TabsTrigger>
                </TabsList>
                <TabsContent value="brands">
                  <ContactForm defaultInterest="Sponsorship" />
                </TabsContent>
                <TabsContent value="teams">
                  <ContactForm defaultInterest="Marketing Services" />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-10">
        <div className="container mx-auto px-6 flex flex-col md:flex-row gap-4 items-center justify-between text-sm text-muted-foreground">
          <div className="font-display text-xl tracking-widest text-gradient-gold">APEX</div>
          <div>© {new Date().getFullYear()} Apex Sports Marketing. All rights reserved.</div>
          <div>Game Changers FZ-CO · Dubai, UAE</div>
        </div>
      </footer>

      <EnquireDialog open={dialogOpen} onOpenChange={setDialogOpen} packageName={selectedPkg} />
    </div>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-lg bg-background/40 border border-border">
      <Icon className="text-gold shrink-0 mt-0.5" size={18} />
      <div>
        <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="font-medium text-sm">{value}</div>
      </div>
    </div>
  );
}

function ContactForm({ defaultInterest }: { defaultInterest: string }) {
  const [interest, setInterest] = useState(defaultInterest);
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault();
        toast.success("Message sent. We'll be in touch shortly.");
        (e.target as HTMLFormElement).reset();
      }}
    >
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="c-name">Name</Label>
          <Input id="c-name" required className="bg-background/50" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="c-company">Company</Label>
          <Input id="c-company" required className="bg-background/50" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="c-email">Email</Label>
          <Input id="c-email" type="email" required className="bg-background/50" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="c-phone">Phone</Label>
          <Input id="c-phone" className="bg-background/50" />
        </div>
      </div>
      <div className="space-y-1">
        <Label>I'm interested in</Label>
        <Select value={interest} onValueChange={setInterest}>
          <SelectTrigger className="bg-background/50">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Sponsorship">Sponsorship</SelectItem>
            <SelectItem value="Marketing Services">Marketing Services</SelectItem>
            <SelectItem value="Both">Both</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label htmlFor="c-msg">Message</Label>
        <Textarea id="c-msg" rows={4} className="bg-background/50" />
      </div>
      <Button type="submit" variant="hero" size="lg" className="w-full">
        Send Message
      </Button>
    </form>
  );
}
