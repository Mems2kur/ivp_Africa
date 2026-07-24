import { FileText, Calendar, Bookmark, ClipboardCheck } from "lucide-react";
import { TopNavbar } from "../TopNavbar";
import { StatCard } from "../components/talentcard";
import { ProfileCompletionCard } from "../components/ProfileCompletionCard";
import { RecentActivity } from "../components/RecentActivity";
import { ProfileCompletionPanel } from "../components/ProfileCompletionPanel";
import { RecommendedForYou } from "../components/Recomended";
import { LatestUpdates } from "../components/updates";
const recentApplications = [
  { id: 1, jobTitle: "Senior Product Designer", company: "FlutterHub", location: "Nigeria", status: "shortlisted" as const },
  { id: 2, jobTitle: "Backend Engineer (Node.js)", company: "Paystash", location: "Kenya", status: "interview" as const },
  { id: 3, jobTitle: "Clinical Officer", company: "Safiri Health", location: "Rwanda", status: "applied" as const },
  { id: 4, jobTitle: "Data Analyst", company: "BrightEd", location: "Egypt", status: "rejected" as const },
];

const profileChecklist = [
  { id: 1, label: "Basic info", done: true },
  { id: 2, label: "Skills & experience", done: true },
  { id: 3, label: "Add a portfolio link", done: false },
  { id: 4, label: "Upload latest CV", done: false },
];
const user={
  name:"John"
}
export default function Page() {
  return (
    <div className="container mx-w-auto px-2  flex flex-col gap-4 bg-gray-100 ">
      <div className="mb-14">
        {/* <TopNavbar userName="Amara" /> */}
        <h1 className="text-2xl text-[#8A38F5]/60 font-serif font-semibold ">Welcome back, {user.name}</h1>
        <p className="mt-5 text-black/50 text-[14]">Here's what's happening with your job search this week.</p>
      </div>

      <div className="container grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ProfileCompletionCard percentage={65} />
        <StatCard icon={FileText} label="Applications" value={12} sublabel="3 shortlisted" />
        <StatCard icon={Calendar} label="Interview invites" value={2} />
        <StatCard icon={Bookmark} label="Saved jobs" value={7} />
      </div>

      <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentActivity applications={recentApplications} />
        </div>
        <ProfileCompletionPanel  checklist={profileChecklist} />
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