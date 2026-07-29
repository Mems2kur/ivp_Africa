export interface PersonalInfo {
  fullName: string;
  email: string;
  location: string;
  whatsapp: string;
  age: string;
  avatarUrl?: string;
}

export interface EducationInfo {
  educationLevel: string;
  courseOfStudy: string;
  institution: string;
  currentlyInSchool: boolean;
}

export interface ExperienceInfo {
  hasInternship: boolean;
}

export const emptyPersonalInfo: PersonalInfo = {
  fullName: "",
  email: "",
  location: "",
  whatsapp: "",
  age: "",
  avatarUrl: undefined,
};

export const emptyEducationInfo: EducationInfo = {
  educationLevel: "Undergraduate",
  courseOfStudy: "",
  institution: "",
  currentlyInSchool: true,
};

export const emptyExperienceInfo: ExperienceInfo = {
  hasInternship: false,
};

export interface CandidateProfileData {
  personalInfo: PersonalInfo;
  education?: EducationInfo;
  experience?: ExperienceInfo;
  internshipPreferences?: InternshipPreferencesInfo;
  skillsAndDocuments?: SkillsAndDocumentsInfo;
}
export interface InternshipPreferencesInfo {
  selectedRoles: string[];
  duration: string;
}

export const emptyInternshipPreferences: InternshipPreferencesInfo = {
  selectedRoles: [],
  duration: "3-6 months",
};

export interface CvDocument {
  fileName: string;
  dataUrl: string; // base64
  sizeBytes: number;
}

export interface SkillsAndDocumentsInfo {
  skills: string[];
  portfolioLink: string;
  cv: CvDocument | null;
}

export const emptySkillsAndDocuments: SkillsAndDocumentsInfo = {
  skills: ["", "", ""],
  portfolioLink: "",
  cv: null,
};