export interface BilingualText {
  fr: string;
  ar: string;
}

export function bi(fr: string, ar: string): BilingualText {
  return { fr, ar };
}

export type ActivityType =
  | "poll"
  | "mcq_quiz"
  | "tf_quiz"
  | "prompt_builder"
  | "meta_prompt"
  | "project_vote"
  | "showcase_vote"
  | "exit_ticket";

export type ActivityStatus = "idle" | "open" | "closed" | "revealed";

export type SlideKind =
  | "welcome"
  | "vision"
  | "poll"
  | "concepts"
  | "quiz"
  | "use-cases"
  | "pillars"
  | "prompt-anatomy"
  | "prompt-builder"
  | "meta-prompt-flow"
  | "meta-prompt-exercise"
  | "web-trio"
  | "ecosystem"
  | "live-demo"
  | "gallery"
  | "group-projects"
  | "showcase-vote"
  | "exit-ticket"
  | "closing";

export interface SlideDefinition {
  id: string;
  sectionNumber: number;
  sectionTitle: BilingualText;
  timeRange: BilingualText;
  durationMinutes: number;
  title: BilingualText;
  subtitle: BilingualText;
  kind: SlideKind;
  activityKey?: string;
  keyPoints: BilingualText[];
  darijaNote: {
    title: BilingualText;
    fr: string;
    arabic: string;
  };
  techTerms: Array<{
    term: string;
    explanation: BilingualText;
  }>;
  presenterNotes: {
    durationCue: string;
    script: BilingualText;
    classroomExample: BilingualText;
    transition: BilingualText;
    discussionPrompt: BilingualText;
  };
}

export interface PollOption {
  id: string;
  label: BilingualText;
  shortLabel: BilingualText;
  description?: BilingualText;
}

export interface QuizQuestion {
  id: string;
  prompt: BilingualText;
  darijaHint?: string;
  options: Array<{ id: string; label: BilingualText }>;
  correctOptionId: string;
  explanation: BilingualText;
}

export interface ActivityDefinition {
  key: string;
  sectionNumber: number;
  type: ActivityType;
  title: BilingualText;
  instruction: BilingualText;
  options?: PollOption[];
  questions?: QuizQuestion[];
  categories?: Array<{
    id: string;
    label: BilingualText;
    description: BilingualText;
  }>;
}

export interface UseCaseItem {
  id: string;
  label: BilingualText;
  grade: string;
  subject: BilingualText;
  objective: BilingualText;
  competency: BilingualText;
  promptFr: string;
  promptAr: string;
  draftOutputTitle: BilingualText;
  draftOutputFr: string;
  draftOutputAr: string;
  teacherCheck: BilingualText;
  printable?: boolean;
}

export interface GalleryCategoryItem {
  id: string;
  number: number;
  title: BilingualText;
  problem: BilingualText;
  gradeRange: string;
  subject: BilingualText;
  learningObjective: BilingualText;
  proposedFeatures: BilingualText[];
  exampleInteraction: BilingualText;
  possibleImprovements: BilingualText[];
  demoKey?:
    | "arabic-literacy"
    | "french-reading"
    | "vocab-flashcards"
    | "math-manipulatives"
    | "remediation-tarl"
    | "formative-assessment"
    | "printable-worksheet"
    | "group-maker";
  offlineReady: boolean;
  printFriendly: boolean;
}

export interface GroupProjectGuide {
  id: "group1" | "group2" | "group3" | "group4";
  groupLabel: BilingualText;
  title: BilingualText;
  subtitle: BilingualText;
  defaultGrade: string;
  defaultSubject: BilingualText;
  defaultCompetency: BilingualText;
  problemSolved: BilingualText;
  expectedOutcome: BilingualText;
  requiredFeatures: BilingualText[];
  learningObjectives: BilingualText[];
  techSpec: BilingualText[];
  testingChecklist: BilingualText[];
  demoChecklist: BilingualText[];
}

export interface PublicWorkshopState {
  workshopId: string;
  workshopTitle: string;
  currentSlideId: string;
  currentSection: number;
  activeActivityKey: string | null;
  activityStatus: ActivityStatus;
  showResults: boolean;
  showQrOverlay: boolean;
  isPaused: boolean;
  demoMode: boolean;
  timerStartedAt: string | null;
  timerElapsedSeconds: number;
  timerRunning: boolean;
  stateVersion: number;
  updatedAt: string;
}

export interface OptionTally {
  optionId: string;
  label: BilingualText;
  shortLabel: BilingualText;
  count: number;
  percentage: number;
}

export interface QuestionTally {
  questionId: string;
  prompt: BilingualText;
  totalResponses: number;
  correctCount: number;
  correctOptionId: string | null;
  explanation: BilingualText | null;
  options: OptionTally[];
}

export interface ShowcaseCategoryTally {
  categoryId: string;
  categoryLabel: BilingualText;
  totalVotes: number;
  options: OptionTally[];
}

export interface AnonymizedSubmissionSnippet {
  id: string;
  label: string;
  content: string;
  secondary?: string;
  createdAt: string;
}

export interface ActivityAggregate {
  activityKey: string;
  resetGeneration: number;
  totalRespondents: number;
  totalSubmissions: number;
  optionTallies?: OptionTally[];
  questionTallies?: QuestionTally[];
  showcaseTallies?: ShowcaseCategoryTally[];
  recentSnippets?: AnonymizedSubmissionSnippet[];
}

export interface GalleryContributionRecord {
  id: string;
  contributorName: string;
  appTitle: string;
  gradeRange: string;
  discipline: string;
  language: string;
  learningObjective: string;
  description: string;
  classroomInstructions: string;
  appResource: string;
  testedFeatures: string[];
  privacyConfirmed: boolean;
  isDemo: boolean;
  createdAt: string;
}

export interface PublicWorkshopSnapshot {
  state: PublicWorkshopState;
  connectedCount: number;
  totalParticipants: number;
  responseRate: number;
  aggregate: ActivityAggregate | null;
  galleryContributionsCount: number;
}

export interface ParticipantResponseItem {
  itemKey: string;
  selectedOption: string | null;
  payload: Record<string, unknown>;
  isCorrect: boolean | null;
  createdAt: string;
}

export interface PresenterSubmissionRow {
  id: string;
  activityKey: string;
  itemKey: string;
  selectedOption: string | null;
  isCorrect: boolean | null;
  summary: string;
  createdAt: string;
}

export interface PresenterSnapshot extends PublicWorkshopSnapshot {
  recentSubmissions: PresenterSubmissionRow[];
  activityCounts: Record<string, number>;
}
