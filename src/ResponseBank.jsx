// --- STRENGTHS (Mapped to Q1: Consistency) ---
export const StrengthResponses = {
  // Option A: The Machine (High Discipline)
  0: [
    "You have the rare ability to sit for long study hours without mental fatigue.",
    "Your consistency is your superpower; you show up even when you don't feel like it.",
    "You have built a 'Ranker's Routine' that protects you from exam-day anxiety.",
    "Your discipline allows you to cover huge syllabus portions without panicking.",
    "You don't rely on motivation; you rely on habit, which is the secret of toppers."
  ],
  // Option B: The Weekend Warrior (Inconsistent but capable)
  1: [
    "You have high 'Burst Energy'—when you sit to study, you can cover a lot quickly.",
    "You are resilient; you always manage to bounce back after a bad phase.",
    "You have the intent to work hard, you just need a system to channel it.",
    "Your 'Good Days' are extremely productive, showing you have the raw potential.",
    "You are self-aware about your dips in motivation, which is the first step to fixing them."
  ],
  // Option C: The Burst Worker (High Intensity, Low Stability)
  2: [
    "You possess the 'Deep Work' ability to block out distractions when you are in the zone.",
    "You can sprint through chapters faster than most students when the pressure is on.",
    "Your brain processes complex concepts quickly during your high-energy spikes.",
    "You are not afraid of hard work, you just struggle with the 'boring' consistency.",
    "You have a high 'Crash Recovery' speed—you can reset quickly after burnout."
  ],
  // Option D: The Procrastinator (Execution Gap)
  3: [
    "You have high standards for yourself (perfectionism), which is often why you delay starting.",
    "You are a strong planner; you know exactly what needs to be done, even if execution lags.",
    "You have preserved your energy; unlike burnt-out students, you have fresh fuel to restart.",
    "You are likely smart enough to understand concepts quickly, which makes you think you have time.",
    "Your desire to change is evident, otherwise, you wouldn't be taking this diagnostic."
  ]
};

// --- WEAKNESSES (Mapped to Q3: Syllabus Status) ---
export const WeaknessResponses = {
  // Option A: On Track (The Perfectionist's Risks)
  0: [
    "You likely suffer from 'Silly Mistakes' because you rush through easy questions.",
    "You might be ignoring 'Low Weightage' chapters, which can cost you the easy +4 marks.",
    "You are at risk of 'Peaking Too Early' and burning out before the actual exam.",
    "You may be over-dependent on your strong subject while neglecting your average one.",
    "You struggle to let go of 'Ego Questions' in the paper, wasting time on hard problems."
  ],
  // Option B: Manageable Debt (The Revision Skipper)
  1: [
    "Your revision is unstructured, causing you to forget chapters you mastered a month ago.",
    "You constantly switch strategies instead of sticking to one revision plan.",
    "You have 'Partial Knowledge' in many chapters, which leads to negative marking traps.",
    "You tend to procrastinate on the 'boring' parts like Inorganic Chemistry memorization.",
    "You panic when you see a new question type because your practice variety is limited."
  ],
  // Option C: Panic Mode (The Backlog Victim)
  2: [
    "You have a huge backlog from Class 11 that acts as a mental weight, paralyzing your progress.",
    "You are trying to do 'Everything' at once, which results in finishing 'Nothing'.",
    "You spend more time worrying about the syllabus size than actually chipping away at it.",
    "You are skipping basics to rush to high-weightage topics, leaving your foundation shaky.",
    "You fear Mock Tests because you know your syllabus isn't complete (a dangerous cycle)."
  ],
  // Option D: Fresh Start (The Beginner)
  3: [
    "You lack the fundamental problem-solving muscle that comes from months of grinding.",
    "You don't have a feedback loop; you make mistakes but don't know *why* you made them.",
    "Your study hours are currently too low to compete with the sheer volume of JEE syllabus.",
    "You get easily demoralized by difficult questions because your basics aren't clear yet.",
    "You are easily distracted because you haven't built the 'Deep Focus' habit yet."
  ]
};

// --- OPPORTUNITIES (Mapped to Q13: Energy) ---
export const OpportunityResponses = {
  // Option A: High Voltage
  0: [
    "You have the energy to add an extra 'Super Revision' slot at the end of the day.",
    "You can aggressively target 'Rank Booster' problems given your high stamina.",
    "Your physical fitness allows you to sit for 6-hour mock simulations without fatigue.",
    "You can mentor a peer to solidify your own concepts (teaching is the best learning).",
    "You can take on the hardest chapters during your peak energy hours for maximum gain."
  ],
  // Option B: Afternoon Crash
  1: [
    "Optimizing your lunch diet (less carbs) could unlock 3 extra productive hours daily.",
    "Using the 'Nap Strategy' (20 mins) can give you a second morning every single day.",
    "Shifting purely 'Passive Tasks' (like lectures) to your afternoon dip can save time.",
    "Aligning your mock test timing to your crash time will train your brain to fight fatigue.",
    "Hydration hacks during the afternoon can significantly sharpen your focus."
  ],
  // Option C: Zombie Mode
  2: [
    "Fixing your sleep cycle is the 'Low Hanging Fruit' that will instantly double your output.",
    "A simple 15-minute walk before studying can oxygenate your brain and kill the fog.",
    "Breaking study sessions into tiny 25-minute Pomodoros can bypass your low endurance.",
    "Meditation or breathing exercises can reset your exhausted dopamine receptors.",
    "Switching to 'Active Recall' (writing) instead of reading will force your brain to wake up."
  ],
  // Option D: Night Owl
  3: [
    "The quiet of the night is your asset; use it for your weakest, hardest subject.",
    "If you align your biological clock just 2 weeks before the exam, you can retain this edge.",
    "You have zero distractions at night; this deep focus is where rank differences are made.",
    "You can perform 'Mock Analysis' at night when the analytical brain is active.",
    "Your solitude allows for 'Loud Problem Solving' (speaking to yourself), which boosts memory."
  ]
};

// --- THREATS (Mapped to Q15: Environment) ---
export const ThreatResponses = {
  // Option A: The Bunker
  0: [
    "Isolation can lead to 'Overthinking' and anxiety loops if you don't talk to mentors.",
    "You might lose touch with the 'Competition Reality' sitting alone in your room.",
    "Lack of sunlight/movement in the bunker can slowly drain your mental health.",
    "You risk burnout because there are no external cues to tell you to take a break.",
    "Becoming too comfortable in silence might make you panic in a noisy exam hall."
  ],
  // Option B: The Library
  1: [
    "Commute time is a silent killer; ensure you are using audio-notes during travel.",
    "Comparing yourself to others in the library can create unnecessary 'Imposter Syndrome'.",
    "You might over-socialize during breaks, turning 15 mins into 1 hour.",
    "Inconsistent seat availability might ruin your flow on certain days.",
    "Carrying heavy books daily drains physical energy needed for solving."
  ],
  // Option C: Living Room
  2: [
    "Constant interruptions prevent you from ever reaching the 'Deep Flow' state.",
    "Your brain associates this space with 'Relaxation', fighting your will to study.",
    "Noise is a massive cognitive load; you are using brain power just to ignore it.",
    "Family drama or TV noise acts as a subconscious drain on your willpower.",
    "Lack of a dedicated desk ruins your posture, leading to fatigue and shorter hours."
  ],
  // Option D: The Chaos
  3: [
    "Toxic arguments at home are destroying your emotional stability required for learning.",
    "You are in 'Survival Mode', which prevents your brain from storing complex information.",
    "The unpredictable environment makes it impossible to stick to a timetable.",
    "Emotional exhaustion is making you hate your books by association.",
    "You are constantly on edge, which keeps cortisol high and memory retention low."
  ]
};
