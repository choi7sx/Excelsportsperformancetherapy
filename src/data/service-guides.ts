// Learning-page copy is separate from the short homepage service summaries.
export interface ServiceGuide {
  overview: string;
  situations: string[];
  focus: { title: string; description: string; takeaway: string }[];
  nextStep: string;
  questions: { question: string; answer: string }[];
}

export const serviceGuides: Record<string, ServiceGuide> = {
  "recovery-care": {
    overview: "Support for the everyday demands on your body.",
    situations: [
      "You feel tight or stiff between workouts.",
      "Mild aches make your everyday routine less comfortable.",
      "You want recovery and mobility to have a place in your schedule.",
    ],
    focus: [
      {
        title: "Hands-on care, with a purpose.",
        description: "A session can include chiropractic adjustments or soft tissue work, with dry needling or cupping when appropriate. Ethan’s assessment guides which options make sense for you. Bring your questions and preferences to that conversation.",
        takeaway: "Care selected around what your body needs.",
      },
      {
        title: "Movement beyond the treatment table.",
        description: "Mobility work and light corrective exercises give you something to work on between visits. The aim is to make recovery a practical part of your routine, alongside the activities you enjoy.",
        takeaway: "A role for you in your own recovery.",
      },
      {
        title: "The right level of support.",
        description: "Recovery care is intended for mild aches and stiffness. If pain keeps returning or is stopping you from being active, discuss that at your evaluation. A more focused rehab plan may be a better starting point.",
        takeaway: "A recommendation based on your assessment.",
      },
    ],
    nextStep: "Make room for more comfortable movement.",
    questions: [
      {
        question: "How often would I come in?",
        answer: "Recovery care is typically offered once or twice a month. Your evaluation is the starting point for deciding whether that frequency and type of care fit your needs.",
      },
      {
        question: "Does every session include an adjustment?",
        answer: "The treatment options listed here are tools, not a checklist for every visit. Talk with Ethan about your comfort with adjustments and other techniques so you can discuss the approach before treatment.",
      },
      {
        question: "How is this different from focused rehab?",
        answer: "Recovery care supports mild aches, stiffness, and ongoing movement. Focused rehab is a more structured path for pain or injury that repeatedly interrupts your activities. You do not need to decide which one to book before your initial evaluation.",
      },
    ],
  },
  "focused-rehab": {
    overview: "When pain needs more than occasional attention.",
    situations: [
      "The same discomfort keeps interrupting your routine.",
      "An injury has made you change or avoid activities you enjoy.",
      "You want a clear plan for rebuilding strength and confidence.",
    ],
    focus: [
      {
        title: "Start with the whole picture.",
        description: "Where it hurts is part of the conversation. How you move, what your day demands, and what you have already tried matter, too. Your assessment connects those details to the activities you want to return to.",
        takeaway: "A starting point tied to your real life.",
      },
      {
        title: "Connect treatment with movement.",
        description: "Hands-on care is paired with individualized strength and mobility work. Rather than leaving the exercise piece separate from treatment, your rehab plan brings them together around the limitations identified in your assessment.",
        takeaway: "A plan that includes building your capacity.",
      },
      {
        title: "Work toward your next milestone.",
        description: "Your goal might be getting back to lifting, returning to your sport, or moving through the day with more confidence. Progressive exercise gives that goal direction. Your response to the work helps inform what comes next.",
        takeaway: "Progress defined by what matters to you.",
      },
    ],
    nextStep: "Take the first step back to what you love.",
    questions: [
      {
        question: "What if I have already tried treatment?",
        answer: "Tell Ethan what you tried, what helped, and where you still feel limited. That history is useful for your assessment. A free consultation is a chance to discuss whether Excel’s combination of chiropractic care and progressive exercise could fit your needs.",
      },
      {
        question: "How long will my rehab take?",
        answer: "There is no single timeline for every person or injury. Ethan recommends next steps after evaluating your movement and goals. Ask about visit frequency, the work between visits, and how you will assess progress together.",
      },
      {
        question: "Do I need to know which treatment to book?",
        answer: "No. Start with an initial evaluation. You can explain what is limiting you without choosing a technique or committing to a particular care path first.",
      },
    ],
  },
  "performance-training": {
    overview: "Give your training a clear direction.",
    situations: [
      "You want a program connected to a specific fitness or sport goal.",
      "You are ready for more structure in your strength training.",
      "You want coaching and feedback as your training progresses.",
    ],
    focus: [
      {
        title: "A program with your goal in mind.",
        description: "Start with what you want your training to help you do. Your movement assessment, training background, and the demands of your sport or everyday life inform a personalized exercise program.",
        takeaway: "A reason behind the work you put in.",
      },
      {
        title: "Your training, in one place.",
        description: "App-based delivery gives you a place to follow your exercise programming. It brings structure to your sessions so you have a plan to refer to when it is time to train.",
        takeaway: "Less guesswork about what to work on.",
      },
      {
        title: "Coaching as you build.",
        description: "Monthly check-ins, exercise form review, and program progressions provide ongoing guidance. Use that feedback to ask questions, understand your exercises, and discuss how your training is going.",
        takeaway: "Support beyond receiving a workout plan.",
      },
    ],
    nextStep: "Put a plan behind your next goal.",
    questions: [
      {
        question: "Is this only for competitive athletes?",
        answer: "No. Performance training is for active adults and adolescents with general fitness or sport-specific goals. Getting stronger for everyday life is a useful goal, too.",
      },
      {
        question: "How is the programming delivered?",
        answer: "Exercise programming is delivered through an app, with monthly check-ins, form review, and progressions. Discuss your training setup and the kind of coaching support you need during your evaluation.",
      },
      {
        question: "What if I am still dealing with pain?",
        answer: "Bring it up before beginning a new program. Your evaluation helps Ethan recommend whether focused rehab, recovery care, or performance training is the appropriate starting point for you.",
      },
    ],
  },
};
