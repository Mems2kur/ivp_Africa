"use client";

import { FileText, Calendar, Bookmark } from "lucide-react";
import { TopNavbar } from "../TopNavbar";
import { StatCard } from "../components/talentcard";
import { ProfileCompletionCard } from "../components/ProfileCompletionCard";
import { RecentActivity } from "../components/RecentActivity";
import { ProfileCompletionPanel } from "../components/ProfileCompletionPanel";
import { RecommendedForYou } from "../components/Recomended";
import { LatestUpdates } from "../components/updates";
import { RequireAuth } from "@/app/(auth)/requireAuth";
import { useSession } from "@/lib/auth/useSession";
import { useEffect, useState } from "react";
import { applicationsApi, savedJobsApi } from "@/lib/api/applications";
import { profileApi } from "@/lib/api/profile";
import { getProfileCompletion, type ChecklistItem } from "@/lib/utils/profileCompletion";
import type { ApplicationRecord } from "@/lib/types/application";

function TalentDashboard() {
  const { session } = useSession();
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [savedCount, setSavedCount] = useState(0);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([]);
  const [completionPercentage, setCompletionPercentage] = useState(0);

 useEffect(() => {
  if (!session?.email) return;

  setApplications(applicationsApi.getAll(session.email));
  setSavedCount(savedJobsApi.getAll(session.email).length);

  const profile = profileApi.get(session.email);
  const { checklist: items, percentage } = getProfileCompletion(profile);
  setChecklist(items);
  setCompletionPercentage(percentage);
}, [session?.email]);

const shortlistedCount = applications.filter((a) => a.status === "shortlisted").length;
const interviewCount = applications.filter((a) => a.status === "interview").length;

const recentApplications = applications.slice(0, 4); // ← simplified, no .map() needed

  

  return (
    <div className="container mx-w-auto px-2 flex flex-col gap-4 bg-gray-100">
  
      <div className="mb-14">
        <h1 className="text-2xl text-[#8A38F5]/60 font-serif font-semibold">
          Welcome back, {session?.displayName ?? "there"}
        </h1>
        <p className="mt-5 text-black/50 text-[14]">
          Here&apos;s what&apos;s happening with your job search this week.
        </p>
      </div>

      <div className="container grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ProfileCompletionCard percentage={completionPercentage} />
        <StatCard
          icon={FileText}
          label="Applications"
          value={applications.length}
          sublabel={`${shortlistedCount} shortlisted`}
        />
        <StatCard icon={Calendar} label="Interview invites" value={interviewCount} />
        <StatCard icon={Bookmark} label="Saved jobs" value={savedCount} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity applications={recentApplications} />
        </div>
        <ProfileCompletionPanel checklist={checklist} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecommendedForYou />
        </div>
        <LatestUpdates />
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <RequireAuth>
      <TalentDashboard />
    </RequireAuth>
  );
}