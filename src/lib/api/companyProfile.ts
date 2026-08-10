export interface CompanyProfile {
  companyName: string;
  industry: string;
  location: string;
  website: string;
  verified: boolean;
  about: string;
  contactEmail: string;
  officeAddress: string;
  logoUrl?: string;
}


const PREFIX = "ivp_company_profile_";

function keyFor(email: string) {
  return PREFIX + email.toLowerCase();
}

function defaultProfile(companyName: string, email: string): CompanyProfile {
  return {
    companyName,
    industry: "",
    location: "",
    website: "",
    verified: false,
    about: "",
    contactEmail: email,
    officeAddress: "",
    logoUrl: undefined,
  };
}

export const companyProfileApi = {
  get(email: string, fallbackName: string): CompanyProfile {
    if (typeof window === "undefined") return defaultProfile(fallbackName, email);
    try {
      const raw = localStorage.getItem(keyFor(email));
      return raw ? JSON.parse(raw) : defaultProfile(fallbackName, email);
    } catch {
      return defaultProfile(fallbackName, email);
    }
  },

  save(email: string, profile: CompanyProfile) {
    localStorage.setItem(keyFor(email), JSON.stringify(profile));
  },
};