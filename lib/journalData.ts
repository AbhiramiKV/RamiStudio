export interface JournalArticle {
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  readTime: string;
  date: string;
  author: {
    name: string;
    role: string;
  };
  heroImage: string;
  excerpt: string;
  content: {
    heading: string;
    paragraphs: string[];
    callout?: string;
  }[];
  relatedSareeSlugs: string[];
}

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    slug: "anatomy-of-3-ply-mulberry-silk",
    title: "The Anatomy of 3-Ply Mulberry Silk: Why Gram-Weight Dictates Century Longevity",
    subtitle: "Understanding yarn twisting tension, denier grading, and why heirloom handlooms never wrinkle destructively.",
    category: "Textile Metrology",
    readTime: "7 min read",
    date: "Autumn 2026",
    author: {
      name: "Dr. Arundhati Ramanathan",
      role: "Senior Textile Conservator & Historian",
    },
    heroImage: "/images/products/saree-1.jpg",
    excerpt: "The difference between an ordinary silk saree that disintegrates within two decades and an heirloom passed through four generations lies entirely within ply torsion and raw protein denier.",
    content: [
      {
        heading: "The Physics of Multi-Filament Torsion",
        paragraphs: [
          "Commercial powerloom sarees commonly employ single-ply filament silk—often blended with nylon or viscose to avoid breakage at mechanical high speeds. In contrast, genuine Kanchipuram and Banarasi handlooms demand 3-ply mulberry silk, where three discrete filaments are hand-twisted with a counter-clockwise 'Z' twist followed by a clockwise 'S' finishing twist.",
          "This micro-cable architecture acts as a spring system. When folded, the fibers distribute compressive stress across the helical spiral rather than breaking along a single shear axis.",
        ],
        callout: "A genuine 3-ply warp yarn exhibits a tensile breaking strength exceeding 4.2 grams per denier—substantially stronger than structural carbon steel per unit weight.",
      },
      {
        heading: "Gram-Weight vs. Draping Fluidity",
        paragraphs: [
          "A frequent misconception among contemporary buyers is that heavier sarees are inevitably stiff. Stiffness is not caused by silk density, but by synthetic sizing agents, residual sericin gum, and artificial plasticized lacquers used to fake body in low-count textiles.",
          "Our sarees weigh between 740g and 920g purely from high picks-per-inch (EPI 118 / PPI 110) of degummed silk and genuine metal zari. When warmed by human body heat, the natural sericin-softened protein conforms gracefully to the torso in 45 seconds.",
        ],
      },
      {
        heading: "The 50-Year Preservation Horizon",
        paragraphs: [
          "Because pure 3-ply silk contains zero petroleum polymers, it breathes continuously, dissipating trapped moisture that would otherwise encourage mildew. Stored within unbleached mul-mul cotton cloth inside an acid-free cedarwood chest, a 3-ply weave retains its supple handfeel for over a century.",
        ],
      },
    ],
    relatedSareeSlugs: ["alabaster-monolith", "obsidian-veil-shot-silk"],
  },
  {
    slug: "metallurgy-of-authentic-zari",
    title: "The Metallurgy of Authentic Zari: Discerning Real Silver from Mylar Plastic",
    subtitle: "A chemical and visual guide to electro-lacquered silver thread vs. toxic metallized polyester.",
    category: "Zari Metallurgy",
    readTime: "6 min read",
    date: "Late Summer 2026",
    author: {
      name: "Maheshwar Shastri",
      role: "Master Zari Metallurgist, Varanasi Guild",
    },
    heroImage: "/images/products/saree-3.jpg",
    excerpt: "Over 85% of sarees sold on commercial platforms contain zero precious metal. Here is how to test, inspect, and identify genuine 0.6% silver zari under high-intensity raking light.",
    content: [
      {
        heading: "The Deception of Tested Zari",
        paragraphs: [
          "In modern marketplace parlance, the term 'Tested Zari' is an intentional industry misnomer. It denotes copper wire wrapped in colored polyester film (Mylar) that has been chemically lacquered to mimic gold. Within three to five years, atmospheric moisture causes the copper to oxidize into chalky green verdigris, permanently staining the surrounding silk.",
          "Pure Silver Zari (Asli Zari), by contrast, begins with a pure silk core yarn around which a flattened silver ribbon (tarni) is wound with microscopic precision. The silver ribbon is then electro-plated with 24-karat gold.",
        ],
        callout: "Real silver zari registers a neutral electrical conductivity of < 0.8 ohms across a 10cm test span and yields pure silver residue during certified micro-spectroscopy.",
      },
      {
        heading: "The Moonlit Luster Test",
        paragraphs: [
          "Plastic metallic yarn shines with an aggressive, oily rainbow chromatic reflection under camera flashes. Pure silver zari behaves entirely differently: it emits a subdued, moonlight-sheen that deepens into warm champagne under tungsten candlelight.",
          "This subtle refractive index is impossible to simulate with petro-chemicals, which is why heirloom portraits from the 1920s still exhibit quiet regal glow rather than synthetic glare.",
        ],
      },
    ],
    relatedSareeSlugs: ["alabaster-monolith", "gossamer-sage-mirage"],
  },
  {
    slug: "korvai-interlocking-weft-extinction",
    title: "The Korvai Interlocking Weft: An Ancient Architectural Marvel in Danger of Extinction",
    subtitle: "Why the three-shuttle lock weave requires two master weavers operating in unison, and how we are fighting for its survival.",
    category: "Loom Heritage",
    readTime: "9 min read",
    date: "Monsoon 2026",
    author: {
      name: "K. Sundaramurthy",
      role: "Third-Generation Master Weaver, Kanchipuram",
    },
    heroImage: "/images/products/saree-2.jpg",
    excerpt: "Korvai cannot be mechanized by any computer, robot, or modern shuttleless loom. It requires two pairs of human hands synchronizing on every single pick of the loom.",
    content: [
      {
        heading: "Two Hearts, One Weave",
        paragraphs: [
          "In standard handloom sarees, the border and body are woven with the same continuous weft thread, limiting the designer to similar warp/weft hue relationships. In authentic Korvai, the solid contrasting borders (often deep crimson or temple vermillion) are joined to the body with triangular temple spires (Rekku) using three distinct shuttles.",
          "A master weaver sits on the right side of the pit-loom, while an apprentice or partner sits on the left. On every single throw of the fly shuttle, they interlock the two threads by hand, pressing the joint with a hardwood sword.",
        ],
        callout: "A single 6-yard Korvai saree requires over 36,000 manual interlockings. A single misaligned catch breaks the architectural strength of the selvedge.",
      },
      {
        heading: "Why Fast-Fashion Abandoned It",
        paragraphs: [
          "Because a Korvai saree takes four times longer to weave than a continuous border piece, commercial retailers pressured weavers to adopt fake pseudo-Korvai (where borders are merely woven on a jacquard with running floats).",
          "At Rami Studio, every Kanchipuram piece in our collection is an unapologetic, certified Korvai handloom. We pay double the regional guild rate to ensure young apprentice weavers continue learning this sublime art.",
        ],
      },
    ],
    relatedSareeSlugs: ["obsidian-veil-shot-silk", "sand-architecture-tussar"],
  },
  {
    slug: "generational-preservation-guide",
    title: "Generational Preservation: Acid-Free Storage & The 6-Month Refolding Ritual",
    subtitle: "The definitive conservator protocol for storing pure silk and precious zari across generations.",
    category: "Conservation Protocol",
    readTime: "5 min read",
    date: "Summer 2026",
    author: {
      name: "Atelier Conservation Guild",
      role: "Textile Archives Laboratory",
    },
    heroImage: "/images/products/saree-4.jpg",
    excerpt: "Never use plastic dry-cleaner bags, wire hangers, or chemical mothballs. Here is the museum-grade protocol for keeping your silk vibrant for century wear.",
    content: [
      {
        heading: "The Menace of Plastic Covers",
        paragraphs: [
          "Polyethylene bags emit trapped plasticizer gases as they age, triggering anaerobic acid decay in natural silk proteins. Furthermore, sealed plastic traps moisture during humid monsoon seasons, creating mold blooms along the zari folds.",
          "Instead, wrap each saree in washed, unbleached 100% mul-mul cotton cloth. The open cotton weave allows ambient air exchange while protecting against ambient light and particulate dust.",
        ],
        callout: "Store with dried vetiver (khus) root sachets or neem leaves. Never place chemical naphthalene balls directly against silver zari, as sulphur causes silver to blacken instantly.",
      },
      {
        heading: "The Sacred 6-Month Refold",
        paragraphs: [
          "Zari borders carry structural weight. If kept folded in the exact same creaseline for years, the weight can cause the silk yarn along the crease to fatigue. Every six months, unfold the saree completely, allow it to air out in a shaded breeze for one hour, and refold along fresh alternating lines.",
        ],
      },
    ],
    relatedSareeSlugs: ["sand-architecture-tussar", "alabaster-monolith"],
  },
];
