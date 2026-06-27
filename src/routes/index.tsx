import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Megaphone,
  Newspaper,
  Target,
  Handshake,
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
  Menu,
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { EnquireDialog } from "@/components/apex/EnquireDialog";
import heroStadium from "@/assets/hero-stadium.jpg";
import sponsorshipBg from "@/assets/sponsorship-bg.jpg";
import lionsLogo from "@/assets/lions-logo.png";
import wtlLogo from "@/assets/wtl-logo.jpg";
import wplLogo from "@/assets/wpl-logo.jpg";
import sglLogo from "@/assets/sgl-logo.jpg";
import arjunPhoto from "@/assets/arjun-sharma.jpg";
import ritviPhoto from "@/assets/ritvi-ojha.jpg";
import aaryanPhoto from "@/assets/aaryan-saxena.jpg";

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

const process = [
  {
    step: "01",
    title: "Audit & Discovery",
    desc: "We assess your brand, audience, and competitive landscape to identify where the biggest commercial opportunity sits.",
  },
  {
    step: "02",
    title: "Strategy & Partnerships",
    desc: "We build a bespoke go-to-market plan — matching your property with the right sponsors, media partners, and campaigns.",
  },
  {
    step: "03",
    title: "Execute & Report",
    desc: "Our in-house team runs every activation end-to-end, with full performance reporting and optimisation throughout.",
  },
];

const partners = [
  {
    logo: lionsLogo,
    name: "Game Changers Lions",
    badge: "Official Exclusive Sponsor Partner",
    description: (
      <>
        Competing in the World Padel League — India's fastest-growing padel
        franchise, broadcast on Sony Sports & FanCode, with a total sponsorship
        value of <span className="text-gold font-semibold">$15.46M</span>.
      </>
    ),
    tags: ["World Padel League", "Sony Sports", "FanCode", "Mumbai 2026"],
  },
  {
    logo: wtlLogo,
    name: "World Tennis League",
    badge: "League Partner",
    description: (
      <>
        Official league partner — broadcast details and activation scope to be
        confirmed. Replace this copy with the real partnership terms.
      </>
    ),
    tags: ["WTL", "Tennis", "International"],
  },
  {
    logo: wplLogo,
    name: "World Padel League",
    badge: "League Partner",
    description: (
      <>
        Official league partner — broadcast details and activation scope to be
        confirmed. Replace this copy with the real partnership terms.
      </>
    ),
    tags: ["WPL", "Padel", "India"],
  },
  {
    logo: sglLogo,
    name: "Star Golf League",
    badge: "League Partner",
    description: (
      <>
        Official league partner — broadcast details and activation scope to be
        confirmed. Replace this copy with the real partnership terms.
      </>
    ),
    tags: ["SGL", "Golf", "Premium"],
  },
];

const clients = [
  { name: "EaseMyTrip", industry: "Travel & Lifestyle" },
  { name: "Indian Pesticides Limited", industry: "Agrochemicals" },
  { name: "Cressanda Railway Solutions", industry: "Infrastructure" },
  { name: "Toyam Sports Limited", industry: "Sports & Media" },
  { name: "Qorum Watches", industry: "Luxury Watches" },
  { name: "Anjali Gold", industry: "Jewellery" },
  { name: "Booster Water", industry: "FMCG / Beverages" },
  { name: "Panorama Studios", industry: "Film Production" },
  { name: "Soham Rockstar Entertainment", industry: "Entertainment" },
  { name: "Platinum Music", industry: "Music" },
];

const founders = [
  {
    photo: arjunPhoto,
    name: "Arjun Sharma",
    role: "Team & Operations",
    desc: "Builds the team, internal systems, and operational structure while actively contributing to the creative process. Ensures the right people and processes are in place to turn ideas into consistent output.",
  },
  {
    photo: ritviPhoto,
    name: "Ritvi Ojha",
    role: "Brand & Creative",
    desc: "Leads brand direction, design systems, and overall creative output while being deeply involved in execution. Collaborates across all functions to ensure every output reflects a unified vision and standard.",
  },
  {
    photo: aaryanPhoto,
    name: "Aaryan Saxena",
    role: "Sales & Growth",
    desc: "Drives sales, partnerships, and strategic growth while staying actively involved in the creative process. Works closely with the team to align client opportunities with strong execution and brand direction.",
  },
];

const stats = [
  { value: "$15.46M", label: "Sponsorship Value Managed" },
  { value: "5M+", label: "Global Audience Reach" },
  { value: "36", label: "World-Class Athletes" },
  { value: "Sony + FanCode", label: "Broadcast Partners" },
];

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#clients", label: "Clients" },
  { href: "#sponsorship", label: "Sponsorships" },
  { href: "#why", label: "How We Work" },
  { href: "#founders", label: "Founders" },
  { href: "#contact", label: "Contact" },
];

function ApexHome() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPkg, setSelectedPkg] = useState<string | undefined>();
  const [partnerIndex, setPartnerIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setPartnerIndex((i) => (i + 1) % partners.length);
    }, 5000);
    return () => clearInterval(id);
  }, []);

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

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="hover:text-gold transition">
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button variant="hero" size="sm" className="hidden md:inline-flex" asChild>
              <a href="#contact">Get In Touch</a>
            </Button>

            {/* Mobile hamburger */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64 pt-12">
                <nav className="flex flex-col gap-6">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      className="text-base font-medium hover:text-gold transition"
                    >
                      {link.label}
                    </a>
                  ))}
                  <Button variant="hero" asChild className="mt-2">
                    <a href="#contact">Get In Touch</a>
                  </Button>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </header>

      {/* HERO */}
      <section id="top" className="relative min-h-screen flex flex-col justify-center pt-28 pb-12">
        <div className="absolute inset-0 z-0">
          <img
            src={heroStadium}
            alt="Floodlit padel stadium"
            width={1920}
            height={1080}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-hero" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        </div>

        <div className="container mx-auto px-6 relative z-10 flex-1 flex items-center">
          <div className="max-w-4xl animate-fade-up w-full">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 text-xs uppercase tracking-[0.25em] text-gold mb-8">
              Sports Marketing Agency
            </div>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl leading-[0.95] mb-6">
              THE AGENCY <br />
              BEHIND THE <span className="text-gradient-gold">GAME</span>.
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mb-10 leading-relaxed">
              Full-service sports marketing — social, PR, ads, content and
              sponsorship sales — for leagues and teams that want to win off
              the field too.
            </p>

            <div className="space-y-6">
              <div className="flex flex-wrap gap-4">
                <Button variant="hero" size="xl" asChild>
                  <a href="#contact">Work With Us <ArrowRight /></a>
                </Button>
                <Button variant="outlineGold" size="xl" asChild>
                  <a href="#sponsorship">Explore Sponsorships</a>
                </Button>
              </div>

              {/* Audience split */}
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                <span>I am a</span>
                <a
                  href="#sponsorship"
                  className="flex items-center gap-1 text-foreground hover:text-gold transition font-medium border-b border-border hover:border-gold pb-0.5"
                >
                  Brand / Sponsor <ArrowRight size={13} />
                </a>
                <span className="text-border">·</span>
                <a
                  href="#services"
                  className="flex items-center gap-1 text-foreground hover:text-gold transition font-medium border-b border-border hover:border-gold pb-0.5"
                >
                  Team / League <ArrowRight size={13} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Stat strip */}
        <div className="relative z-10 container mx-auto px-6 mt-12">
          <div className="glass-card rounded-2xl px-6 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="font-display text-2xl md:text-3xl text-gradient-gold">{s.value}</div>
                <div className="text-[10px] md:text-xs uppercase tracking-widest text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section id="services" className="py-28 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <div className="text-gold text-xs uppercase tracking-[0.3em] mb-4">What We Do</div>
            <h2 className="font-display text-5xl md:text-6xl leading-none mb-4">
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
                className="glass-card tile-hover rounded-2xl p-8 group"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-gold flex items-center justify-center mb-6">
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
          <div className="mb-16">
            <div className="text-gold text-xs uppercase tracking-[0.3em] mb-4">Our Roster</div>
            <h2 className="font-display text-5xl md:text-6xl leading-none">
              TRUSTED BY LEAGUES <br /> & <span className="text-gradient-gold">TEAMS</span>
            </h2>
          </div>

          <div className="relative">
            <div key={partnerIndex} className="glass-card rounded-3xl p-8 md:p-10 relative overflow-hidden gold-border animate-fade-up">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
              <div className="relative flex flex-col md:flex-row gap-8 items-center">
                <div className="shrink-0 w-40 h-40 rounded-2xl bg-navy-deep/50 flex items-center justify-center p-4">
                  <img
                    src={partners[partnerIndex].logo}
                    alt={partners[partnerIndex].name}
                    width={512}
                    height={512}
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-block px-3 py-1 rounded-full bg-gold/15 text-gold text-[10px] uppercase tracking-widest mb-3">
                    {partners[partnerIndex].badge}
                  </div>
                  <h3 className="font-display text-3xl md:text-4xl mb-3 tracking-wide">
                    {partners[partnerIndex].name.toUpperCase()}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    {partners[partnerIndex].description}
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {partners[partnerIndex].tags.map((t) => (
                      <span key={t} className="text-xs px-3 py-1 rounded-full border border-border text-muted-foreground">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mt-6">
              {partners.map((p, i) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => setPartnerIndex(i)}
                  aria-label={`Show ${p.name}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === partnerIndex ? "w-8 bg-gold" : "w-2 bg-border hover:bg-muted-foreground"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* BRAND PORTFOLIO */}
          <div className="mt-28">
            <div className="mb-12">
              <div className="text-gold text-xs uppercase tracking-[0.3em] mb-4">Client Portfolio</div>
              <h2 className="font-display text-5xl md:text-6xl leading-none">
                BRANDS WE'VE <span className="text-gradient-gold">BUILT WITH</span>.
              </h2>
              <p className="text-muted-foreground mt-5 max-w-2xl leading-relaxed">
                Ten companies across travel, sports, entertainment, luxury, infrastructure, and FMCG — proof that the playbook translates across categories.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {clients.map((client) => (
                <div
                  key={client.name}
                  className="glass-card tile-hover rounded-2xl p-6 group cursor-default"
                >
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <span className="inline-block px-2.5 py-0.5 rounded-full bg-gold/10 text-gold text-[10px] uppercase tracking-widest leading-relaxed">
                      {client.industry}
                    </span>
                    <ArrowRight
                      size={14}
                      className="text-muted-foreground/40 group-hover:text-gold group-hover:translate-x-1 transition-all shrink-0 mt-1"
                    />
                  </div>
                  <div className="font-display text-xl md:text-2xl tracking-wide leading-tight">
                    {client.name.toUpperCase()}
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
          <div className="mb-16">
            <div className="text-gold text-xs uppercase tracking-[0.3em] mb-4">Sponsorship Marketplace</div>
            <h2 className="font-display text-5xl md:text-6xl leading-none mb-4">
              OWN A PIECE <br /> OF THE <span className="text-gradient-gold">GAME</span>.
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              We represent top leagues and teams to connect your brand with
              premium sports audiences.
            </p>
          </div>

          {/* Featured listing */}
          <div className="glass-card rounded-3xl p-8 md:p-10 mb-10 gold-border">
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

          {/* Sponsorship tiers — horizontal rows */}
          <div className="space-y-3">
            {packages.map((p) => (
              <div
                key={p.tier}
                className={`glass-card rounded-2xl px-6 py-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-all duration-200 hover:border-gold/40 ${
                  p.highlight ? "gold-border" : ""
                }`}
              >
                {/* Badge + name */}
                <div className="flex items-center gap-4 sm:w-52 shrink-0">
                  <span className="text-3xl">{p.badge}</span>
                  <div>
                    <div className="font-display text-lg tracking-wide leading-tight">{p.tier.toUpperCase()}</div>
                    {p.note && <div className="text-[10px] text-gold/80 uppercase tracking-widest mt-0.5">{p.note}</div>}
                  </div>
                </div>

                <div className="hidden sm:block w-px self-stretch bg-border shrink-0" />

                {/* Price */}
                <div className="sm:w-32 shrink-0">
                  <div className="text-xl font-bold text-gradient-gold">{p.price}</div>
                </div>

                <div className="hidden sm:block w-px self-stretch bg-border shrink-0" />

                {/* Perks */}
                <div className="flex-1 hidden md:flex flex-wrap gap-x-5 gap-y-1.5">
                  {p.perks.map((perk) => (
                    <span key={perk} className="text-xs text-muted-foreground flex items-center gap-1.5">
                      <CheckCircle2 size={12} className="text-gold shrink-0" />
                      {perk}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <div className="shrink-0">
                  <Button
                    variant={p.highlight ? "hero" : "outlineGold"}
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={() => openEnquire(`${p.tier} (${p.price})`)}
                  >
                    Enquire <ArrowRight size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW WE WORK */}
      <section id="why" className="py-28 relative">
        <div className="container mx-auto px-6">
          <div className="mb-16">
            <div className="text-gold text-xs uppercase tracking-[0.3em] mb-4">How We Work</div>
            <h2 className="font-display text-5xl md:text-6xl leading-none">
              FROM BRIEF TO <span className="text-gradient-gold">RESULTS</span>.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
            {process.map((p, i) => (
              <div key={p.step} className={`py-8 md:py-0 ${i === 0 ? "md:pr-12" : i === 1 ? "md:px-12" : "md:pl-12"}`}>
                <div className="font-display text-7xl text-gold/15 leading-none mb-6 select-none">{p.step}</div>
                <h3 className="font-display text-2xl tracking-wide mb-3">{p.title.toUpperCase()}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOUNDERS */}
      <section id="founders" className="py-28 relative">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <div className="text-gold text-xs uppercase tracking-[0.3em] mb-4">Meet The Founders</div>
            <h2 className="font-display text-5xl md:text-6xl leading-none mb-4">
              THE TEAM BEHIND <span className="text-gradient-gold">APEX</span>.
            </h2>
            <p className="text-muted-foreground text-lg">
              Three operators, one playbook — building, designing and selling
              the brands that move the game forward.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {founders.map((f) => (
              <div
                key={f.name}
                className="glass-card tile-hover rounded-2xl overflow-hidden group flex flex-col"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={f.photo}
                    alt={f.name}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <div className="text-gold text-[10px] uppercase tracking-[0.3em] mb-2">{f.role}</div>
                  <h3 className="font-display text-2xl tracking-wide mb-3">{f.name.toUpperCase()}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-28 relative">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 lg:items-center">
            <div>
              <div className="text-gold text-xs uppercase tracking-[0.3em] mb-4">Contact</div>
              <h2 className="font-display text-5xl md:text-6xl leading-none mb-6">
                LET'S <span className="text-gradient-gold">TALK</span>.
              </h2>
              <p className="text-muted-foreground text-lg mb-10 max-w-md">
                Whether you run a league, captain a team or build a brand —
                Apex is your unfair advantage.
              </p>

              <div className="space-y-4">
                <a href="mailto:connect@apex-marcom.com" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl glass-card gold-border flex items-center justify-center group-hover:bg-gold group-hover:text-gold-foreground transition">
                    <Mail size={20} />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Email</div>
                    <div className="font-medium">connect@apex-marcom.com</div>
                  </div>
                </a>
                <a href="tel:+919810190305" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl glass-card gold-border flex items-center justify-center group-hover:bg-gold group-hover:text-gold-foreground transition">
                    <Phone size={20} />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-widest text-muted-foreground">Phone</div>
                    <div className="font-medium">+91-9810190305</div>
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
  const [submitting, setSubmitting] = useState(false);

  return (
    <form
      className="space-y-4"
      onSubmit={async (e) => {
        e.preventDefault();
        if (submitting) return;
        const form = e.currentTarget;
        const data = new FormData(form);
        const payload = {
          name: String(data.get("name") || ""),
          company: String(data.get("company") || ""),
          email: String(data.get("email") || ""),
          phone: String(data.get("phone") || ""),
          interest,
          message: String(data.get("message") || ""),
          website: String(data.get("website") || ""),
        };

        setSubmitting(true);
        try {
          const res = await fetch("/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error("Send failed");
          toast.success("Message sent. We'll be in touch shortly.");
          form.reset();
        } catch {
          toast.error("Couldn't send right now. Email connect@apex-marcom.com directly.");
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
      />

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="c-name">Name</Label>
          <Input id="c-name" name="name" required className="bg-background/50" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="c-company">Company</Label>
          <Input id="c-company" name="company" required className="bg-background/50" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label htmlFor="c-email">Email</Label>
          <Input id="c-email" name="email" type="email" required className="bg-background/50" />
        </div>
        <div className="space-y-1">
          <Label htmlFor="c-phone">Phone</Label>
          <Input id="c-phone" name="phone" className="bg-background/50" />
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
        <Textarea id="c-msg" name="message" rows={4} className="bg-background/50" />
      </div>
      <Button type="submit" variant="hero" size="lg" className="w-full" disabled={submitting}>
        {submitting ? "Sending…" : "Send Message"}
      </Button>
    </form>
  );
}
