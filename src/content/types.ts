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
  sectionTitle: string;
  timeRange: string;
  durationMinutes: number;
  title: string;
  subtitle: string;
  kind: SlideKind;
  activityKey?: string;
  keyPoints: string[];
  darijaNote: {
    title: string;
    arabic: string;
  };
  techTerms: Array<{ term: string; explanation: string }>;
  presenterNotes: {
    durationCue: string;
    script: string;
    classroomExample: string;
    transition: string;
  };
}

export interface PollOption {
  id: string;
  label: string;
  shortLabel: string;
  description?: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  darijaHint?: string;
  options: Array<{ id: string; label: string }>;
  correctOptionId: string;
  explanation: string;
}

export interface ActivityDefinition {
  key: string;
  sectionNumber: number;
  type: ActivityType;
  title: string;
  instruction: string;
  options?: PollOption[];
  questions?: QuizQuestion[];
  categories?: Array<{ id: string; label: string; description: string }>;
}

export interface UseCaseItem {
  id: string;
  label: string;
  grade: string;
  subject: string;
  objective: string;
  competency: string;
  promptLanguage: "fr" | "ar" | "bilingual";
  prompt: string;
  draftOutputTitle: string;
  draftOutputBody: string;
  arabicSample?: string;
  teacherCheck: string;
  printable?: boolean;
}

export interface GalleryCategoryItem {
  id: string;
  number: number;
  title: string;
  problem: string;
  gradeRange: string;
  subject: string;
  learningObjective: string;
  proposedFeatures: string[];
  exampleInteraction: string;
  possibleImprovements: string[];
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
  groupLabel: string;
  title: string;
  subtitle: string;
  defaultGrade: string;
  defaultSubject: string;
  defaultCompetency: string;
  problemSolved: string;
  expectedOutcome: string;
  requiredFeatures: string[];
  learningObjectives: string[];
  techSpec: string[];
  testingChecklist: string[];
  demoChecklist: string[];
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
  label: string;
  shortLabel: string;
  count: number;
  percentage: number;
}

export interface QuestionTally {
  questionId: string;
  prompt: string;
  totalResponses: number;
  correctCount: number;
  correctOptionId: string | null;
  explanation: string | null;
  options: OptionTally[];
}

export interface ShowcaseCategoryTally {
  categoryId: string;
  categoryLabel: string;
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
