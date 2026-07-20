export interface FAQItem {
  title: string;
  body: string;
}

const CASE_1_FAQS: FAQItem[] = [
  {
    title: "My child isn't speaking yet. Should I be worried?",
    body: "Every child develops at their own pace, but speech delays can sometimes indicate a need for extra support. Tracking milestones early helps you understand if it is a temporary delay or something that requires attention. We recommend completing the screening to map your child's milestones.",
  },
  {
    title: "How do I know if this is autism or just delayed speech?",
    body: "Speech delay only affects language, while autism typically involves patterns in communication, social interaction, and behaviour. Only a structured screening and professional evaluation can help tell them apart. Starting a screening is a great first step.",
  },
  {
    title: 'My relatives say "boys speak late." Is that true?',
    body: "While there is slight variation, developmental milestones are generally the same for boys and girls. Relying on myths can delay getting help when it is most effective. Completing a developmental screening gives you objective information.",
  },
  {
    title: "Can autism be cured?",
    body: "Autism is a lifelong neurodevelopmental difference, not a disease, so there is no 'cure.' However, early intervention and personalized therapies can help children learn crucial skills, build on their strengths, and thrive.",
  },
  {
    title: "At what age can autism be identified?",
    body: "Early signs of autism can often be noticed as early as 12 to 18 months, and a reliable screening or diagnosis can be done by age 2. Identifying concerns early allows for timely support.",
  },
  {
    title: "What early signs should I look for?",
    body: "Look for signs like limited eye contact, not responding to their name, not pointing to show interest, repeating certain movements, or speech delays. A structured screening will guide you through observing these specific behaviours.",
  },
  {
    title: "Should I wait for a few more months?",
    body: "It is always best not to wait. Early brain development is highly responsive to learning and support. Screening now provides clarity, and if everything is on track, it gives you peace of mind.",
  },
  {
    title: "Which doctor should I consult first?",
    body: "A developmental pediatrician, child psychologist, or pediatric neurologist are the ideal specialists. Your regular pediatrician can also provide an initial referral.",
  },
  {
    title: "Will my child be able to go to a regular school?",
    body: "Yes, many autistic children attend mainstream schools, often with support like special educators or speech therapists. Early support is key to preparing them for school environments.",
  },
  {
    title: "If my child has autism, what should I do next?",
    body: "The next step is to consult a specialist to confirm the screening results and begin early intervention therapy, which helps build communication and social skills. Starting a screening now helps prepare you for that consultation.",
  },
];

const CASE_2_FAQS: FAQItem[] = [
  {
    title: "Why are some questions about behaviours that don't happen every day?",
    body: "The screening covers a wide range of developmental markers. Even occasional behaviours can provide important clues about your child's interaction and communication style.",
  },
  {
    title: "What should I do if I'm not sure which answer to choose?",
    body: "Choose the option that best describes your child's typical behaviour over the last few weeks. If a behaviour is rare or depends on the situation, select the closest match based on your usual observations.",
  },
  {
    title: "My child behaves differently at home and school. How should I answer?",
    body: "Answer based on how they behave in familiar settings (like home) where they are most comfortable, as this represents their natural responses.",
  },
  {
    title: "Will one answer change the entire screening result?",
    body: "No. The screening looks at overall patterns across multiple domains (Social, Emotional, Speech, Behaviour, Sensory, Cognitive). A single answer will not determine the final outcome.",
  },
  {
    title: "Why do some questions seem similar?",
    body: "Similar questions help capture subtle nuances of the same behaviour in different situations, ensuring a comprehensive and accurate understanding of each developmental domain.",
  },
  {
    title: "Can I pause now and continue later?",
    body: "Yes, your progress is automatically saved. You can exit the screening at any time and resume exactly where you left off from the Home Screen.",
  },
  {
    title: "Can I change my answers before I finish?",
    body: "Yes, you can go back to previous questions and edit your answers before submitting the final screening.",
  },
  {
    title: "Is this screening a diagnosis?",
    body: "No. It is an screening tool to detect signals of developmental concerns. A formal diagnosis must be made by qualified healthcare professionals.",
  },
  {
    title: "What will I receive after completing the screening?",
    body: "You will receive a detailed screening report with your child's domain scores, highlight areas, progress rings, and personalized insights to share with your doctor.",
  },
  {
    title: "Why is it important to complete all the questions?",
    body: "Completing all 40 questions ensures we can calculate a complete, reliable profile across all six development areas for an accurate report.",
  },
];

const DOMAIN_FAQS: Record<string, FAQItem[]> = {
  Social: [
    {
      title: "How can I help my child interact with other children?",
      body: "Start with structured, one-on-one playdates with a peer. Use shared interests (e.g. building blocks) to encourage parallel play, and guide them with simple social prompts.",
    },
    {
      title: "What does a delay in social reciprocity mean?",
      body: "It means the child might not naturally respond to social cues, like back-and-forth conversation, smiling back, or sharing enjoyment. Targeted therapies help build these reciprocal habits.",
    },
  ],
  Emotion: [
    {
      title: "Why does my child have sudden emotional meltdowns?",
      body: "Meltdowns are often responses to sensory overload or difficulty communicating feelings. Creating a calm environment and using visual feeling charts can help manage them.",
    },
    {
      title: "How do I help my child regulate their fears or anxiety?",
      body: "Validate their feelings, use slow breathing exercises, and prepare them for new situations beforehand using simple visual stories.",
    },
  ],
  Speech: [
    {
      title: "What should I do if my child only repeats words (echolalia)?",
      body: "Echolalia is a step towards language development. Acknowledge what they repeat, and offer a simple functional response (e.g. if they say 'want juice,' say 'Here is the juice').",
    },
    {
      title: "How can I encourage my child to communicate their needs?",
      body: "Use visual communication cards, point to objects while naming them, and give them choices (e.g., holding up two options) to prompt vocalizations or gestures.",
    },
  ],
  Behavior: [
    {
      title: "Why does my child repeat the same movements (like hand flapping)?",
      body: "These self-stimulatory behaviours (stimming) help your child self-regulate, focus, or cope with excitement or anxiety. Unless it causes harm, it is best to let them stim safely.",
    },
    {
      title: "How can I help my child cope with sudden changes in routine?",
      body: "Use visual schedules to preview the day's events. Provide clear warnings before transitions (e.g. '5 minutes until we leave').",
    },
  ],
  Sensory: [
    {
      title: "Why is my child extremely sensitive to loud noises?",
      body: "They may experience auditory sensory overload. Providing noise-canceling headphones and a quiet corner to withdraw to can help them feel safe.",
    },
    {
      title: "How do I handle sensory seeking behaviours, like touching everything?",
      body: "Provide safe sensory outlets, such as playdough, textured toys, or heavy work activities (like carrying groceries) to fulfill their sensory needs.",
    },
  ],
  Cognitive: [
    {
      title: "How can I help my child focus on learning tasks?",
      body: "Break tasks into very small, bite-sized steps. Use visual timers and offer immediate positive reinforcement (like praise or a favorite activity).",
    },
    {
      title: "What are 'savant abilities' or special interests?",
      body: "Some children have intense, highly focused interests (e.g., trains, numbers) or exceptional memory. You can use these interests as motivation to teach other skills.",
    },
  ],
};

const CASE_3_FAQS: FAQItem[] = [
  {
    title: "What does my child's screening score mean?",
    body: "The score indicates the presence and intensity of autism-related signals. A higher score indicates a higher need for support and professional guidance.",
  },
  {
    title: "Does this screening confirm whether my child has autism?",
    body: "No, it is a screening tool. It indicates potential developmental signals but a formal clinical diagnosis requires evaluation by a specialist.",
  },
  {
    title: "Which developmental areas should I focus on first?",
    body: "Focus on the areas labeled 'Needs support' or 'Needs extra support' in your report. These are the domains where support will have the greatest impact.",
  },
  {
    title: "What should I do after receiving this screening report?",
    body: "You should download the PDF report, schedule a consultation with a specialist, and share these observations to guide your discussion.",
  },
  {
    title: "Which specialist should I consult for my child's needs?",
    body: "We recommend consulting a developmental pediatrician, child psychologist, or pediatric neurologist for a comprehensive assessment.",
  },
  {
    title: "How can I support my child's development at home?",
    body: "You can use everyday routines for language modeling, visual schedules for predictability, and interactive play to build social skills.",
  },
  {
    title: "How do I share this report with my child's therapist or doctor?",
    body: "You can download the report as a PDF from the screening report screen and send it via email or print it out for your next appointment.",
  },
  {
    title: "When should I repeat the screening?",
    body: "It is generally recommended to repeat the screening every 3 to 6 months to monitor progress, track developmental changes, or after starting therapy.",
  },
  {
    title: "How can Saarathi help me track my child's progress?",
    body: "Saarathi tracks your screening history, visualizes score changes over time with charts, and provides domain-level trend tracking to celebrate improvements.",
  },
  {
    title: "What are the next best steps for my child's development?",
    body: "Connect with a clinical expert, establish consistent home strategies, and monitor development regularly through follow-up screenings.",
  },
];

const CASE_4_FAQS: FAQItem[] = [
  {
    title: "Is my child making progress compared to the last screening?",
    body: "You can review the Score Trend Chart on the screening report. If the line trends downward, it shows a reduction in developmental signals, indicating progress.",
  },
  {
    title: "Which developmental areas have improved the most over time?",
    body: "Compare the domain progress rings in your latest report with previous ones to see which areas transitioned to 'Doing well' or 'Doing great.'",
  },
  {
    title: "Which areas still need additional support?",
    body: "Look for domains that remain in the 'Needs support' or 'Needs extra support' ranges. These are your priority focus areas for therapy.",
  },
  {
    title: "Why have some scores changed since the previous screening?",
    body: "Fluctuations are normal and can be influenced by new environments, developmental transitions, or the positive effects of ongoing therapy.",
  },
  {
    title: "How can I help my child continue improving at home?",
    body: "Target specific domains by adjusting therapy goals, incorporating sensory breaks, and practicing communication during play.",
  },
  {
    title: "Should I update my child's developmental goals based on the latest report?",
    body: "Yes, share the trend report with your therapist to refine goals, focus on persistent challenges, and celebrate areas of improvement.",
  },
  {
    title: "How can I work with my child's therapist or teacher using these progress reports?",
    body: "Use the report to align on strategies, ensuring the same techniques are used at home, school, and therapy sessions.",
  },
  {
    title: "What patterns can I learn from my child's screening history?",
    body: "The trend shows long-term response to interventions and identifies whether certain domains improve faster than others.",
  },
  {
    title: "When should I complete the next screening?",
    body: "Continue screening every 3 months or as advised by your therapist to maintain a continuous, clear record of development.",
  },
  {
    title: "How can Saarathi help me monitor and celebrate my child's developmental journey over time?",
    body: "Saarathi provides a safe, structured space to record observations, track trends over multiple screenings, and share clear progress charts with your care team.",
  },
];

export function getDynamicFAQs(
  completedCount: number,
  isInProgress: boolean,
  priorityDomains: string[] = []
): FAQItem[] {
  // Case 2: Partial Screening
  if (isInProgress) {
    return CASE_2_FAQS;
  }

  // Case 4: Repeat Completed Screenings
  if (completedCount > 1) {
    return CASE_4_FAQS;
  }

  // Case 3: First Screening Completed
  if (completedCount === 1) {
    // Personalize by prioritizing domain-specific FAQs for domains needing support
    const personalized: FAQItem[] = [];
    
    // Add domain-specific FAQs first for priority domains
    priorityDomains.forEach((domainKey) => {
      // Map domainKey mapping if different (e.g. Emotional vs Emotion, Behaviour vs Behavior)
      let key = domainKey;
      if (key === 'Emotional') key = 'Emotion';
      if (key === 'Behaviour') key = 'Behavior';

      const faqs = DOMAIN_FAQS[key];
      if (faqs) {
        personalized.push(...faqs);
      }
    });

    // Fill rest with standard Case 3 FAQs until we reach 10
    const remaining = CASE_3_FAQS.filter(
      (item) => !personalized.some((p) => p.title === item.title)
    );
    
    return [...personalized, ...remaining].slice(0, 10);
  }

  // Case 1: New Users - No screening completed
  return CASE_1_FAQS;
}
