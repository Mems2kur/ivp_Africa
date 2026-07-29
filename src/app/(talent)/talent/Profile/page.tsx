"use client";

import { useEffect, useState } from "react";
import { PersonalInfoCard } from "./profile";
import { EducationExperienceGrid } from "./educationExperienc";
import { InternshipPreferences } from "./Internship";
import { SkillsAndDocuments } from "./SkillLevel";
import { useSession } from "@/lib/auth/useSession";
import { session as sessionStore } from "@/lib/auth/session";
import { profileApi } from "@/lib/api/profile";
import { notificationsApi } from "@/lib/api/notification";
import {
  emptyPersonalInfo,
  emptyEducationInfo,
  emptyExperienceInfo,
  emptyInternshipPreferences,
  emptySkillsAndDocuments,
  type CandidateProfileData,
  type PersonalInfo,
  type EducationInfo,
  type ExperienceInfo,
  type InternshipPreferencesInfo,
  type SkillsAndDocumentsInfo,
} from "@/lib/types/Profile";

export default function ProfilePage() {
  const { session } = useSession();
  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>(emptyPersonalInfo);
  const [education, setEducation] = useState<EducationInfo>(emptyEducationInfo);
  const [experience, setExperience] = useState<ExperienceInfo>(emptyExperienceInfo);
  const [internshipPreferences, setInternshipPreferences] = useState<InternshipPreferencesInfo>(
    emptyInternshipPreferences
  );
  const [skillsAndDocuments, setSkillsAndDocuments] = useState<SkillsAndDocumentsInfo>(
    emptySkillsAndDocuments
  );
  const [hasProfile, setHasProfile] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "updated">("idle");
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.email) return;
    const existing = profileApi.get(session.email);
    if (existing) {
      setPersonalInfo(existing.personalInfo ?? emptyPersonalInfo);
      setEducation(existing.education ?? emptyEducationInfo);
      setExperience(existing.experience ?? emptyExperienceInfo);
      setInternshipPreferences(existing.internshipPreferences ?? emptyInternshipPreferences);
      setSkillsAndDocuments(existing.skillsAndDocuments ?? emptySkillsAndDocuments);
      setHasProfile(true);
    } else {
      setPersonalInfo((p) => ({ ...p, email: session.email, fullName: session.displayName ?? "" }));
    }
  }, [session?.email]);

  function handleSave() {
    if (!session?.email) return;
    setSaveError(null);

    const wasNewProfile = !hasProfile; // capture BEFORE we flip it below

    const data: CandidateProfileData = {
      personalInfo,
      education,
      experience,
      internshipPreferences,
      skillsAndDocuments,
    };

    try {
      profileApi.save(session.email, data);
      notificationsApi.add(session.email, "Your profile was updated");
    } catch {
      setSaveError("Couldn't save — your photo or CV file may be too large for local storage.");
      return;
    }

    sessionStore.set({
      ...session,
      displayName: personalInfo.fullName || session.displayName,
      avatarUrl: personalInfo.avatarUrl,
    });

    setHasProfile(true);
    setSaveStatus(wasNewProfile ? "saved" : "updated");
    setTimeout(() => setSaveStatus("idle"), 2000);
  }

  const buttonLabel =
    saveStatus === "saved" ? "Saved ✓" : saveStatus === "updated" ? "Updated ✓" : hasProfile ? "Update" : "Save changes";

  return (
    <div className="flex flex-col gap-4 pb-24">
      <h1 className="text-2xl font-bold text-black">Profile</h1>
      <PersonalInfoCard value={personalInfo} onChange={setPersonalInfo} />
      <EducationExperienceGrid
        education={education}
        onEducationChange={setEducation}
        experience={experience}
        onExperienceChange={setExperience}
      />
      <InternshipPreferences value={internshipPreferences} onChange={setInternshipPreferences} />
      <SkillsAndDocuments value={skillsAndDocuments} onChange={setSkillsAndDocuments} />

      <div className="fixed right-8 bottom-6 flex flex-col items-end gap-2">
        {saveError && <span className="text-sm font-medium text-red-500">{saveError}</span>}
        <button
          type="button"
          onClick={handleSave}
          className="rounded-full bg-[#8A38F5] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-200 transition-colors hover:bg-[#7226e0]"
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
}