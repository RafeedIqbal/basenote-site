type EditorialLink = { href: string; label: string };
type EditorialImage = { src: string; alt: string; width: number; height: number };

type ArticleSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  checklist?: string[];
  figure?: EditorialImage & { caption: string };
  links?: EditorialLink[];
};

export type JournalArticle = {
  path: `/blogs/${string}` | `/case-studies/${string}`;
  topic: string;
  title: string;
  description: string;
  published: string;
  image: EditorialImage;
  introduction: string;
  sections: ArticleSection[];
  product: EditorialLink;
  enquiry: EditorialLink;
};

export const starterArticle: JournalArticle = {
  path: "/blogs/test-demand-before-launching-a-perfume-brand",
  topic: "Starter Kit",
  title: "How to Test Demand Before Launching a Perfume Brand",
  description: "Test a perfume brand idea with a perfumer’s sample, product mockups and a waitlist. Use buyer feedback to decide when a first production run makes sense.",
  published: "2026-11-18",
  image: { src: "/media/basenote-handoff/editorial-3.png", alt: "An unlabelled perfume bottle beside sample vials and a flowering stem", width: 1672, height: 941 },
  introduction: "Someone can love the look of your bottle before they have any idea whether they want to wear the perfume. A useful first launch gives people two chances to respond. Show them the idea, then put the scent in front of them. The gap between those reactions can tell you what to change before you order stock.",
  sections: [
    {
      id: "write-the-brief", heading: "Give the sample a job",
      paragraphs: [
        "Start with one wearer and one occasion. A creator whose audience follows their evening style might brief a scent to wear out after dark. A founder reaching the same age group through a running club might choose something light to wear after a morning session. Each brief gives the perfumer a different decision to make.",
        "Write down who will try the sample, when they would wear it, and what would make them reach for it again. Share a reference they know and explain which quality matters. “I like the dry, woody finish” gives the perfumer more to work with than a list of favourite brands."
      ]
    },
    {
      id: "test-the-proposition", heading: "Make the waitlist answer one question",
      paragraphs: [
        "Give visitors a product mockup, the intended bottle size and a short description of how the fragrance wears. Give them one clear invitation to hear when it launches. If the price is part of what you are testing, show the intended retail price and record which version of the offer each group saw.",
        "Keep track of where visitors came from. Ten sign-ups after a sampling evening mean something different from ten sign-ups after a social post reached several thousand people. Record visits and sign-ups together. Keep sample requests and paid orders in separate columns so you can tell what each person actually committed to."
      ]
    },
    {
      id: "listen-after-wear", heading: "Follow up after someone has worn it",
      paragraphs: [
        "Give each sample a reference you can trace back to the brief. Ask for a first impression, then follow up after a day’s wear. The most revealing answer is often a detail the wearer volunteers, such as reaching for the sample again the following morning."
      ],
      checklist: [
        "When did you wear it, and what did you notice by the end of the day?",
        "What would you change before buying a full bottle?",
        "At the size and price shown, would you like to hear when the first run opens?"
      ]
    },
    {
      id: "choose-a-first-run", heading: "Choose the next commitment",
      paragraphs: [
        "Basenote’s digital Starter Kit includes a brand website, product mockups, social content for the waitlist and sampling with our perfumer. The second tier adds a UK-made batch of 10–50 units. It suits founders who already know whom they would put those bottles in front of. We quote each tier on enquiry.",
        "Read the responses together before deciding. Strong sign-ups followed by lukewarm wear feedback point back to the scent. Enthusiastic wearers who would hesitate at the proposed price give you a packaging or pricing question. When people like wearing it and want to buy at a price you can deliver, take that evidence into a private label manufacturing brief."
      ],
      links: [{ href: "/private-label", label: "Explore private label perfume manufacturing" }]
    }
  ],
  product: { href: "/starter-kit", label: "Explore the Fragrance Brand Starter Kit" },
  enquiry: { href: "/contact?interest=Starter%20Kit", label: "Enquire about the Starter Kit" }
};

export const privateLabelArticle: JournalArticle = {
  path: "/blogs/compare-private-label-perfume-manufacturing-quotes",
  topic: "Private Label",
  title: "How to Compare Private Label Perfume Manufacturing Quotes",
  description: "Compare perfume manufacturers on the same brief, from the minimum per fragrance and formula rights to packaging, lead time and the cost of a delivered bottle.",
  published: "2026-11-18",
  image: { src: "/media/basenote-handoff/lab.png", alt: "A technician alongside a line of fragrance bottles in production", width: 1672, height: 941 },
  introduction: "Two quotes for 500 bottles can describe remarkably different orders. One may include development samples, a decorated bottle and a printed carton. The other may cover filling alone. Before you compare the unit prices, ask both suppliers to quote the same bottle arriving at the same destination.",
  sections: [
    {
      id: "one-written-brief", heading: "Send every supplier the same brief",
      paragraphs: [
        "Specify the number of fragrances, units per fragrance, fill size, fragrance direction and delivery market. Describe the finish you expect someone to see on the shelf. A clear stock bottle with a paper label is a different job from a coated bottle with foil decoration, even when the glass shape is identical.",
        "Split your choices into essentials and options. If the illustrated rigid box is optional, ask for a folding-carton price as well. A separately priced option tells you what each packaging decision costs."
      ]
    },
    {
      id: "quantity-per-fragrance", heading: "Check what the minimum applies to",
      paragraphs: [
        "Basenote’s typical minimum is 500 units per fragrance. On that basis, two scents in the same bottle would usually mean planning for 1,000 finished units. Ask how the supplier handles a shared component if the bottle or cap has its own order minimum.",
        "Our indicative costs start from around £20 per unit. The fragrance, components, decoration, packaging, volume and level of support affect the quote. Ask which one-off costs and delivery charges sit outside the unit price so you can work out what the first run will actually cost."
      ]
    },
    {
      id: "formula-and-samples", heading: "Agree on the sample and the formula rights",
      paragraphs: [
        "Tell the supplier whether you are bringing an existing fragrance, refining a direction or commissioning a bespoke formula. Ask which samples you will receive and who signs off the scent and finished pack before manufacture.",
        "Formula ownership depends on the development or licensing agreement. Ask who may manufacture a reorder, what happens if you change suppliers, and which artwork and packaging files you receive. Get those answers in writing while you can still compare the offers."
      ]
    },
    {
      id: "compare-delivered-cost", heading: "Put the delivered cost and dates side by side",
      paragraphs: [
        "Use one column per supplier. Divide the full quoted cost for your first run by its finished units, then repeat the calculation for a reorder with any one-off development costs removed. A supplier can be less expensive on one calculation and more expensive on the other.",
        "A typical Basenote project takes around 8–12 weeks. Bespoke scent development, custom components, approvals and transport can extend the schedule. Ask which event starts the quoted lead time and whether the end date means ready at the factory or delivered to you."
      ],
      checklist: [
        "Fragrance, bottle, pump, cap, decoration and outer pack included in each filled unit",
        "Samples, design work, tooling and other one-off charges",
        "Freight, delivery destination and any exclusions",
        "Approval dates, payment milestones and expected delivery window"
      ],
      links: [{ href: "/private-label/guide", label: "Use the Private Label Guide to specify your components" }]
    }
  ],
  product: { href: "/private-label", label: "Explore private label perfume manufacturing" },
  enquiry: { href: "/contact?interest=Private%20Label", label: "Request a private label quote" }
};

export const blendArticle: JournalArticle = {
  path: "/blogs/set-up-an-in-store-perfume-blending-bar",
  topic: "Blend Engine",
  title: "How to Set Up an In-Store Perfume Blending Bar",
  description: "Plan a retail perfume bar from the first scent brief to the finished bottle. See how Blend Engine helps staff compare blends, record feedback and manage a session.",
  published: "2026-11-18",
  image: { src: "/media/basenote-handoff/editorial-2.png", alt: "Hands at a perfumery bench with aromatic materials, small vessels and a clipboard", width: 1672, height: 941 },
  introduction: "Picture a customer saying, “I want something woody, but the last one I bought felt too heavy.” Your perfume bar needs a way to turn that sentence into two or three things they can smell, remember which one they liked, and get the right blend into the bottle. That sequence is a good starting point for designing the counter.",
  sections: [
    {
      id: "set-the-counter", heading: "Give each part of the visit a place",
      paragraphs: [
        "Walk the route as a customer. Leave space for a conversation, somewhere to lay labelled blotters side by side, and a separate surface for staff to prepare the selected bottle. At each handover, one person should know which customer, blend and bottle size they are working on.",
        "Before opening a session, check the oils and accords available to staff and the bottle sizes you can fulfil. Run a practice visit on a busy shift. Watch where the next customer waits and where an interrupted staff member can find the selection again."
      ]
    },
    {
      id: "guide-the-consultation", heading: "Turn preferences into a comparison",
      paragraphs: [
        "In Blend Engine, staff can check in a walk-in visitor, recall a returning customer’s preferences and record what they want on this visit. A regular preference for woody scents and today’s request for something lighter can both guide the session.",
        "Staff can explore three suggested directions, smell them with the customer and record reactions. Label the blotters to match the directions on screen. Ask what the customer likes in the opening, then return to the same strip as it dries. Feedback such as “keep the cedar, soften the spice” gives the next refinement a clear purpose."
      ]
    },
    {
      id: "handover", heading: "Let the selection travel with the bottle",
      paragraphs: [
        "Once the customer has chosen, staff review the blend, size and quantity against material availability. Blend Engine creates a production ticket for each physical bottle. If two friends choose different versions, the person preparing them can see which formula belongs to which ticket.",
        "The production team can mark each bottle ready and record the completed order. During a trial session, ask a second staff member to take over at this point. If they can finish the right bottle from the ticket, the handover works even when the original adviser is helping someone else."
      ]
    },
    {
      id: "scope-the-location", heading: "Scope the licence around the shop",
      paragraphs: [
        "Blend Engine is licensed per location, with ongoing orders of Basenote oils and accords. To discuss a licence, describe your counter space, staffing, appointment or walk-in model and how many sessions you expect on a busy day. Commercial terms are agreed on enquiry.",
        "Bring one realistic scenario to the conversation. A boutique running private bookings for two and a department store running back-to-back walk-ins will have different stock and handover needs. Walking through one visit makes those differences visible before you fit out the bar."
      ]
    }
  ],
  product: { href: "/blend-engine", label: "Explore Blend Engine for retailers" },
  enquiry: { href: "/contact?interest=Blend%20Engine", label: "Enquire about a Blend Engine licence" }
};

export const alchemyArticle: JournalArticle = {
  path: "/blogs/perfume-manufacturing-erp-from-brief-to-batch",
  topic: "Factory ERP",
  title: "How Perfume Manufacturing ERP Tracks a Formula from Brief to Batch",
  description: "Follow a fragrance brief through formula revisions, stock reservations and factory work orders. Explore Factory ERP and limited Alchemy formulation AI pilots.",
  published: "2026-11-18",
  image: { src: "/media/basenote-handoff/product-1.png", alt: "Stainless-steel vessels and pipework in a fragrance production facility", width: 1536, height: 1024 },
  introduction: "A client approves the second version of a perfume. Purchasing has already priced materials for the first, and the factory is waiting for a filling date. The practical question for the operations team is which formula, stock and instructions now belong to this order. Here is how that handover can work in Basenote’s Factory ERP.",
  sections: [
    {
      id: "brief-and-revision", heading: "Start with the revision the client approved",
      paragraphs: [
        "Take a fictional order for a woody eau de parfum. The brief records the client’s direction. The perfumer prepares a trial, then revises it after the client asks for a softer dry-down. Keeping each recipe revision gives the team a record of what changed between those two samples.",
        "Give the chosen revision a clear reference in the production handover. Someone preparing a reorder months later can then find the same version, even if the perfumer has since continued developing the scent."
      ]
    },
    {
      id: "reserve-stock", heading: "Check what is available to this project",
      paragraphs: [
        "Scale the chosen recipe to the required quantity and check the material requirements against stock. Physical stock and available stock can tell different stories. A drum may be on the shelf while part of its contents is already reserved for another project.",
        "Use the stock and reservation records to identify the shortfall before promising a filling date. When sourcing is needed, the purchasing team can follow a request for quotation through to the supplier and goods receipt. The received lot gives the material a reference that can travel with it into production."
      ]
    },
    {
      id: "factory-handover", heading: "Follow the work order and the lot",
      paragraphs: [
        "For a contract fill, the work order identifies the project, factory, units ordered and the dates materials and finished goods are needed. When stock goes to the factory, the team records the source location, lot and quantity. The factory’s receipt and filling updates give operations a way to follow the order.",
        "Try a traceability exercise with one material. Starting from the work order, can a colleague identify which lot was sent, how much left the lab and which project it belonged to? If a delivery is questioned later, these are the records the team will need to reconcile."
      ]
    },
    {
      id: "formulation-pilot", heading: "Give a formulation AI pilot a defined question",
      paragraphs: [
        "A factory can enquire about the ERP for everyday stock, sourcing and production work. For teams that formulate, Basenote also offers limited partner pilots of Alchemy Engine, its AI-assisted fragrance formulation software. A chemist can bring a defined brief and decide how to evaluate a proposed direction.",
        "For an ERP discussion, bring a representative order and the handover that causes your team the most rework. For an AI pilot, bring an evaluation question, such as whether a suggested revision is worth a bench trial. The perfumer still needs to assess the sample and the team needs to review its suitability for the intended product."
      ],
      links: [{ href: "/contact?interest=Alchemy%20Engine", label: "Enquire about a formulation AI pilot" }]
    }
  ],
  product: { href: "/alchemy-engine", label: "Explore Factory ERP and Alchemy Engine" },
  enquiry: { href: "/contact?interest=Factory%20ERP", label: "Discuss Factory ERP" }
};

export const alpacCasePath = "/case-studies/alpac-london-shopify";

export const alpacArticle: JournalArticle = {
  path: alpacCasePath,
  topic: "ALPAC London",
  title: "How We Built ALPAC London’s Shopify Store for Limited Fragrance Drops",
  description: "Inside ALPAC London’s Shopify Hydrogen storefront, from the two fragrances in Drop 001 to the next-release waitlist and bottle authenticity check.",
  published: "2026-11-18",
  image: { src: "/media/private-label/portfolio/alpac.png", alt: "ALPAC London’s green ẸWÀ perfume bottle with a gold cap", width: 1080, height: 1080 },
  introduction: "ALPAC London’s opening release gave shoppers a choice between two fragrances shaped by Lagos. When we built the Shopify store, that pair became the starting point for the design. Someone discovering ALPAC could learn why both scents belonged to the same house, then decide which one they wanted to wear.",
  sections: [
    {
      id: "brand-brief", heading: "Build the store around the first release",
      paragraphs: [
        "Basenote worked with ALPAC on brand strategy, positioning, packaging, the website and the launch approach. The limited-drop model linked those decisions. The founding release needed a place of its own, and the site needed to make sense between releases as well.",
        "We built the storefront with Shopify Hydrogen. That gave the drop page its own editorial layout while Shopify continued to manage product variants, prices, availability and checkout. The brand team could tell the story of Drop 001 without maintaining a second copy of the catalogue."
      ]
    },
    {
      id: "opening-pair", heading: "Give ÀṢẸ and ẸWÀ room to stand apart",
      paragraphs: [
        "Drop 001 introduces ÀṢẸ through spice, leather and dry woods. ẸWÀ opens with citrus and moves towards softer woods. Showing both bottles together with a short scent description lets a visitor compare the pair before opening either product page.",
        "On the product page, the shopper can explore that fragrance and choose an available variant. The collection gives the release its context. The individual page does the work of selling a specific bottle."
      ],
      figure: {
        src: "/media/editorial/alpac-drop-001.webp", alt: "ALPAC London’s Drop 001 storefront showing the ÀṢẸ and ẸWÀ bottles and their links to the product pages",
        width: 1440, height: 1654, caption: "The Drop 001 page on ALPAC London’s Shopify storefront."
      },
      links: [{ href: "https://alpaclondon.com/drops/drop-001", label: "Visit ALPAC London’s founding drop" }]
    },
    {
      id: "between-drops", heading: "Give the next drop its own invitation",
      paragraphs: [
        "A visitor can be interested in the house even when the current pair is not the scent they want. The homepage therefore gives the next drop a separate waitlist. Its invitation names the release and explains what email updates the visitor is agreeing to receive.",
        "That distinction matters for a limited-release brand. A shopper who wants a bottle today can go straight to Drop 001. Someone curious about the next chapter can leave an email without having to guess which product page to revisit."
      ],
      links: [{ href: "https://alpaclondon.com/", label: "See the release and waitlist on ALPAC London" }]
    },
    {
      id: "after-purchase", heading: "Connect the physical bottle back to the store",
      paragraphs: [
        "The website has a role after checkout, too. The public authenticity page lets an owner enter the certificate code that accompanies a bottle. We gave verification its own address and a link in the footer so an owner can go directly there with the bottle in hand.",
        "The finished store serves three distinct visits. A new shopper can distinguish the opening scents, a returning fan can register interest in the next release, and an owner can look up a certificate. Each visit starts with a different question about the same brand."
      ],
      links: [{ href: "https://alpaclondon.com/verify", label: "View the bottle verification page" }]
    }
  ],
  product: { href: "/private-label", label: "Explore Basenote’s fragrance brand and launch work" },
  enquiry: { href: "/contact?interest=Branding", label: "Discuss a fragrance brand website" }
};

export const blogArticles = [starterArticle, privateLabelArticle, blendArticle, alchemyArticle];
export const journalArticles = [...blogArticles, alpacArticle];
