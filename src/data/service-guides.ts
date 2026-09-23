// Service-page copy is separate from the short homepage service summaries.
export interface ServiceGuide {
  heroImage: { src: string; alt: string };
  overview: string;
  fit: string;
  fitEmphasis?: string;
  included: string;
  includedEmphasis?: string;
  progression?: { from: string; to: string };
  includedItems?: string[];
  includedNote?: string;
  nextStep: string;
}

export const serviceGuides: Record<string, ServiceGuide> = {
  "recovery-care": {
    heroImage: {
      src: "/images/services/recovery-care.webp",
      alt: "Dr. Ethan Coghill providing hands-on neck care to a patient.",
    },
    overview: "Move with more comfort and confidence.",
    fit: "If pain, an injury, or limited movement is getting in the way of your day, chiropractic care offers one-on-one support built around you. Your first step is a full-body movement assessment with Dr. Ethan to understand how you move, identify areas that may be contributing to your symptoms, and talk through what you want to get back to.",
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
    nextStep: "Make room for more comfortable movement.",
  },
  "golf-performance": {
    heroImage: {
      src: "/images/services/recovery-care.webp",
      alt: "Dr. Ethan Coghill providing hands-on neck care to a patient.",
    },
    overview: "Build your body for better days on the course.",
    fitEmphasis: "Titleist Performance Institute (TPI) assessment",
    fit: "Whether you want to hit it farther, move more freely through your swing, or keep discomfort from cutting a round short, golf performance connects therapy and training to your game. Start with a Titleist Performance Institute (TPI) assessment to identify mobility, stability, strength, and movement limitations that may be affecting your swing.",
    included: "Your assessment helps guide the work, with a focus on mobility, strength, power, speed, and injury prevention. Choose from:",
    includedItems: [
      "Individual golf performance therapy",
      "One-on-one golf performance training",
      "Small-group golf performance training",
    ],
    includedNote: "Each option is built around helping you move better and stay on the course.",
    nextStep: "Take the next step toward better days on the course.",
  },
  "focused-rehab": {
    heroImage: {
      src: "/images/services/recovery-care.webp",
      alt: "Dr. Ethan Coghill providing hands-on neck care to a patient.",
    },
    overview: "Get back to the activities you miss.",
    fit: "When an injury keeps you from training, playing your sport, or moving comfortably through the day, it helps to have a clear path forward. Injury rehab gives you a customized plan that starts with where you are now and works toward what you want to do again. The goal is to ease pain and rebuild your ability to do those things.",
    included: "Your rehab isn’t just about getting out of pain. We’ll address the pain, mobility, strength, and physical capacity that may be limiting you and progressively build you back toward your goals.",
    includedEmphasis: "pain, mobility, strength, and physical capacity",
    progression: {
      from: "From where you are now",
      to: "Where you want to be",
    },
    nextStep: "Take the first step back to what you love.",
  },
  "performance-training": {
    heroImage: {
      src: "/images/services/performance-training.webp",
      alt: "An athlete preparing to lift a barbell during a strength training session.",
    },
    overview: "Get stronger for the life you want to live.",
    fit: "If you want to build strength, improve mobility, and make training a consistent part of your life, personal training gives you a plan shaped around you. Dr. Ethan’s doctor-led approach considers your goals, current ability, and training experience, with a focus on staying capable for everyday life and the activities you enjoy.",
    included: "Strength and mobility work is designed around your goals and experience. Training options include:",
    includedItems: [
      "One-on-one personal training",
      "Small-group personal training",
    ],
    includedNote: "Your sessions give you a consistent way to train and build your ability to handle everyday demands. The focus is strength, mobility, and staying active for the long term.",
    nextStep: "Put a plan behind your next goal.",
  },
};
