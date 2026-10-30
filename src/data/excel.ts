export const consultUrl = "https://forms.gle/nBraWwyNaS89eaHx6";
export const locations = [
  {
    name: "Old Hickory",
    venue: "Old Hickory CrossFit",
    address: "3323 Old Hickory Blvd",
    city: "Old Hickory, TN",
    hours: [
      { days: "Monday", time: "7am–5pm" },
      { days: "Tue – Thu", time: "7am–4pm" },
      { days: "Friday", time: "7am–2pm" },
    ],
    booking:
      "https://excelspt.janeapp.com/locations/excel-sports-performance-therapy-old-hickory/book",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
];
// With one location, Schedule Now opens its Jane calendar directly. Adding a
// second location restores the booking dialog and Jane's location chooser.
export const hasLocationChoice = locations.length > 1;
export const bookingUrl = hasLocationChoice ? "https://excelspt.janeapp.com/" : locations[0].booking;
export const bookingLinkAttrs = hasLocationChoice ? { "data-booking": "" } : {};
export const services = [
  {
    slug: "recovery-care",
    number: "01",
    icon: "recovery",
    title: "Chiropractic Care",
    tagline: "A little care. More good days.",
    description:
      "One-on-one chiropractic care for pain, injury, and movement limitations.",
    tags: ["Hands-on treatment", "Mobility", "Recovery"],
    intro: "Chiropractic care that starts with you.",
    detail:
      "One-on-one traditional chiropractic care for pain relief, stiffness, movement limitations, injury prevention, and maintenance care.",
    items: [
      "Chiropractic adjustments and soft tissue work",
      "Dry needling and cupping when appropriate",
      "Mobility work and light corrective exercise",
    ],
    expectation:
      "The current recovery care offering is built around periodic sessions, typically once or twice a month. Your initial evaluation helps Dr. Ethan determine whether this level of support fits your needs.",
    fit: "People with mild aches, tension, or stiffness who want ongoing movement and recovery support.",
  },
  {
    slug: "focused-rehab",
    number: "02",
    icon: "rehab",
    title: "Injury Rehab",
    tagline: "A plan to move forward.",
    description:
      "A customized plan to help you overcome injury and get back to what you want to do.",
    tags: ["Injury rehabilitation", "Strength", "Progress"],
    intro: "Injury rehab that actually fixes the problem",
    detail:
      "A customized rehab plan to help you recover from injury and return to the activities you enjoy. Work on pain, mobility, and strength while gradually rebuilding what your body can handle, with your goals guiding each step.",
    items: [
      "A movement assessment connected to your goals",
      "Individualized strength and mobility work",
      "A structured approach to rebuilding activity",
    ],
    expectation:
      "Start with an initial evaluation. Dr. Ethan will look at the movements that are difficult, talk through what you want to return to, and recommend the next steps for your care.",
    fit: "People whose pain repeatedly returns or limits the activities they want to do.",
  },
  {
    slug: "performance-training",
    number: "03",
    icon: "performance",
    title: "Personal Training",
    tagline: "Build what comes next.",
    description:
      "Doctor-led personal training for strength, mobility, and longevity.",
    tags: ["Custom programming", "Coaching", "Longevity"],
    intro: "Personal training for everyday strength.",
    detail:
      "Doctor-led personal training to build strength, improve mobility, and support an active life. Choose one-on-one or small-group sessions designed around your goals, current ability, and experience, with a plan you can build into your routine.",
    items: [
      "Custom exercise programming delivered through an app",
      "Monthly check-ins and exercise form review",
      "Progressions that build on your training",
    ],
    expectation:
      "Your evaluation gives Dr. Ethan a picture of how you move, how you train, and what you want to accomplish. From there, he can recommend programming that fits your goals.",
    fit: "Active adults and adolescents looking for guidance with general fitness or sport-specific goals.",
  },
];
export const faqs = [
  {
    question: "Do I have to be an athlete?",
    answer:
      "No. Dr. Ethan works with active adults and adolescents, whether your goal is competing, getting back to the gym, or feeling more comfortable in everyday life.",
  },
  {
    question: "What happens at my first visit?",
    answer:
      "Your first visit is a 60-minute initial evaluation. Dr. Ethan assesses your movement, discusses your training and goals, and looks at where discomfort or limitations show up. He then recommends an appropriate path for your care.",
  },
  {
    question: "I’m nervous about chiropractic care. Where should I start?",
    answer:
      "Request a free phone consultation through the short form, and Dr. Ethan will call you back. Bring your questions. Let Dr. Ethan know what feels uncomfortable or uncertain, including any concerns about adjustments. You can discuss the approach before deciding whether to book an evaluation.",
  },
  {
    question: "Do you accept insurance or HSA/FSA?",
    answer:
      "Excel is a cash-based practice and accepts HSA/FSA payments. Contact Dr. Ethan before booking to discuss current pricing and the financial commitment for your care.",
  },
  {
    question: "What if I’ve already tried physical therapy or chiropractic?",
    answer:
      "You can bring that history to your evaluation. Dr. Ethan’s approach combines chiropractic care with progressive strength and mobility work. A consultation is a chance to talk through what you have tried and whether Excel could be a good fit.",
  },
  {
    question: "Where are you located?",
    answer:
      "Excel is inside Old Hickory CrossFit at 3323 Old Hickory Blvd in Old Hickory, TN. Dr. Ethan sees patients there Monday through Friday. The booking calendar shows current availability.",
  },
];
