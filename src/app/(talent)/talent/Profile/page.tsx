import { PersonalInfoCard } from "./profile";
import { EducationExperienceGrid } from "./educationExperienc";
export default function ProfilePage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold text-black">Profile</h1>
      <PersonalInfoCard />
    </div>
  );
}