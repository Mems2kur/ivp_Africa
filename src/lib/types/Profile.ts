export interface PersonalInfo {
  fullName: string;
  email: string;
  location: string;
  whatsapp: string;
  age: string;
  avatarUrl?: string;
  bio:string,
  professionalTitle:string,
}

export interface EducationInfo {
  educationLevel: string;
  courseOfStudy: string;
  institution: string;
  currentlyInSchool: boolean;
  startDate: string; // new
}

export interface ExperienceInfo {
  hasInternship: boolean;
  company: string;
  role: string;
  startDate: string;
}

export const emptyPersonalInfo: PersonalInfo = {
  fullName: "",
  email: "",
  location: "",
  whatsapp: "",
  age: "",
  avatarUrl: undefined,
   professionalTitle: "",
  bio: "",
};

export const emptyEducationInfo: EducationInfo = {
  educationLevel: "Undergraduate",
  courseOfStudy: "",
  institution: "",
  currentlyInSchool: true,
  startDate:""
};

export const emptyExperienceInfo: ExperienceInfo = {
  hasInternship: false,
  company: "",
  role: "",
  startDate: "",
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