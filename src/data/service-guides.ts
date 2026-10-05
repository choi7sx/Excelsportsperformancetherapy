// Service-page copy is separate from the short homepage service summaries.
export interface ServiceGuide {
  heroImage: { src: string; alt: string };
  overview?: string;
  hideFitPrompt?: boolean;
  fit?: string | string[];
  fitEmphasis?: string;
  included?: string;
  includedEmphasis?: string;
  bodySections?: { title: string; items: string[] }[];
  includedItems?: string[];
  includedNote?: string;
}

export const serviceGuides: Record<string, ServiceGuide> = {
  "recovery-care": {
    heroImage: {
      src: "/images/services/recovery-care.webp",
      alt: "Dr. Ethan Coghill providing hands-on neck care to a patient.",
    },
    included: "Your treatment is tailored to your pain, movement limitations, and goals. Care may include:",
    includedItems: [
      "Chiropractic adjustments",
      "Soft tissue therapy",
      "Dry needling",
      "Cupping",
      "Mobility work",
      "Exercise",
    ],
    includedNote: "The combination depends on your assessment and specific needs.",
  },
  "focused-rehab": {
    heroImage: {
      src: "/images/services/recovery-care.webp",
      alt: "Dr. Ethan Coghill providing hands-on neck care to a patient.",
    },
    overview: "Personalized rehab. A full hour with Dr. Ethan.",
    fit: [
      "Full body assessment, manual therapy, chiropractic care, progressive strength exercises, tailored to your diagnosis and personal goals",
      "A full hour, one patient at a time. The same therapist every visit. Care directly from Dr. Ethan, not an assistant or tech. The first visit goes deep on history and goals, a hands-on assessment, and a plan you can keep working on at home",
    ],
    bodySections: [
      {
        title: "Back pain.",
        items: [
          "Disc herniation",
          "Disc bulge",
          "Stiffness in low back",
          "Sciatica",
          "Muscle strains",
          "Rib pain",
        ],
      },
      {
        title: "Head and neck.",
        items: [
          "Neck pain and stiffness",
          "Disc bulges",
          "Pinched nerve",
          "Headaches and migraines",
          "TMJ dysfunction",
          "Vertigo and balance issues",
        ],
      },
      {
        title: "Shoulder, elbow, wrist, and hand.",
        items: [
          "Rotator cuff tears",
          "Labrum injuries",
          "Impingement and bursitis",
          "Golfer's elbow",
          "Tennis elbow",
          "Carpal tunnel",
        ],
      },
      {
        title: "Hip, knee, foot, and ankle.",
        items: [
          "Hip arthritis",
          "Groin pain and strain",
          "Hip impingement",
          "Hamstring strains and tight hamstrings",
          "Meniscus injuries",
          "Knee popping and locking",
          "Knee pain",
          "Shin splints",
          "Ankle sprains",
          "Achilles injuries",
          "Plantar fasciitis",
          "Calf strains",
        ],
      },
    ],
  },
  "performance-training": {
    heroImage: {
      src: "/images/services/performance-training.webp",
      alt: "An athlete preparing to lift a barbell during a strength training session.",
    },
    overview: "This is for you if:",
    hideFitPrompt: true,
    fit: [
      "You don’t like to work out in public",
      "You don’t want to have to think about what to do",
      "You want doctor-led strength training",
      "You’re training around an injury",
      "You’re looking for community",
      "You want training personalized to your goals, exercise experience, and injury history",
      "You’ve recently been discharged from injury rehab and want to keep training under supervision",
      "You’re an adult who hasn’t lifted seriously in a while and wants a careful reintroduction",
    ],
    bodySections: [
      {
        title: "What sessions look like",
        items: [
          "Initial movement assessment to assist injury prevention",
          "One-hour weekly sessions led by Dr. Ethan",
          "A private gym environment",
          "A focus on progressive strength training",
          "Personalized exercise selection around your goals, exercise, and injury history",
          "Proper form guidance and injury aware modifications",
          "Between session programming so you know what to do for the rest of the week",
          "Community and good vibes",
        ],
      },
    ],
  },
};
