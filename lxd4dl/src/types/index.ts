
// Enums for ABC Methodology
export enum ABCMethod {
  Adquisition = 'Adquisition', // Passive input
  Inquiry = 'Inquiry', // Exploration
  Discussion = 'Discussion', // Exchange
  Practice = 'Practice', // Application
  Collaboration = 'Collaboration', // Group work
  Production = 'Production', // Creation
}

// Enums for Multimedia Levels
export enum MediaLevel {
  Level1 = 'Level 1 (Passive/Basic)',
  Level2 = 'Level 2 (Limited Interaction)',
  Level3 = 'Level 3 (Complex Interaction)',
  Level4 = 'Level 4 (Immersive/Gamified)',
}

// Hierarchical Data Structure
export interface Scene {
  id: string;
  title: string;
  durationMinutes: number;
  abcMethod?: ABCMethod;
  mediaLevel?: MediaLevel;
  mediaFormat?: string; // e.g., "Podcast", "Video 360", "PDF"
  learningObjective?: string;
  
  // New fields for Journey Sequencing
  interactionMoment?: string; // In-Situ, Sincrónica, etc.
  selectedActivityId?: string; // ID from the Activity Catalog
}

export interface Topic {
  id: string;
  title: string;
  scenes: Scene[];
}

export interface Unit {
  id: string;
  title: string;
  topics: Topic[];
}

export interface CourseModule {
  id: string;
  title: string;
  units: Unit[];
}

export interface Session {
  id: string;
  title: string;
  modules: CourseModule[];
}

// Syllabus Blueprint (9 Sections Methodology)
export interface SyllabusBlueprint {
  contextAndObjective: string;
  necessarySkills: string[];
  learningChallenges: string[];
  achievedCompetencies: string[]; // Outputs
  valueProposition: string; // 3 paragraphs format
  didacticDesign: {
    learningTypes: string[];
    interactionMoments: string[];
  };
  resourcesG2RI: string[]; // Levels 1, 2, 3
  assessmentStrategy: {
    formativeSummative: string;
    didacticsAppropriation: string;
  };
  finalNarrative: string; // Executive Summary
}

// Project Strategy
export interface Strategy {
  businessProblem: string;
  targetAudience: string; // Persona
  trainingNeed: string;
  
  // Design Dashboard Fields
  valueProposition: string;
  jobs: string[];
  pains: string[];
  gains: string[];
  
  // Training OKLR
  qualitativeObjective: string;
  okrs: string[]; // Key Learning Results (KLRs)

  impactValidation: string; // Used for backward compatibility
  interactionDesign?: string; // General description / Sequence
  
  // Interaction Design Specifics
  onsite: string[];
  video: string[];
  assisted: string[];
  independent: string[];
  collaborative: string[];
  asynchronous: string[];

  // Assessment Specifics
  formativeAssessment: string[];
  summativeAssessment: string[];
  didacticsEvaluation: string[];
  impactEvaluation: string[];

  assessmentMethod?: string; // Kept for backward compatibility/summary
  feedbackStrategy?: string;

  // Feedback Specifics
  frequency: string[];
  followUp: string[];
  progressMonitoring: string[];
  coachingMentoring: string[];

  // Outcome Mapping Specifics
  principle1: string[];
  principle2: string[];
  principle3: string[];
  principle4: string[];
  principle5: string[];

  generalObjectives: string[]; // Used for backward compatibility
}

// Main Project State
export interface LXDProject {
  title: string;
  strategy: Strategy;
  structure: Session[];
  syllabusBlueprint?: SyllabusBlueprint;
}

export type Step = 'strategy' | 'design' | 'content' | 'journey' | 'production';

// Activity Catalog Interface
export interface CatalogActivity {
  id: string;
  name: string;
  description: string;
  category: string; // e.g., Uso de Textos
  type: string; // e.g., Tipo 1, Tipo 2
  imageRef: string;
  abcTypes: string[]; // Adquisición, Práctica, etc.
  cognitiveOutputs: string[]; // Apropiación, Evaluación, etc.
  tool: 'Standard' | 'Adobe Captivate'; // To distinguish between generic pedagogical activities and specific tool widgets
  url?: string; // For documentation links
}
