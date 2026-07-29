export interface AdminSearchResult {
  id: string;
  label: string;
  subtitle: string;
  href: string;
}

const adminTools: { label: string; href: string }[] = [
  { label: "Dashboard", href: "/admin" },
  { label: "User management", href: "/admin/users" },
  { label: "Employer verification", href: "/admin/employer-verification" },
  { label: "Job management", href: "/admin/jobs" },
  { label: "Subscription management", href: "/admin/subscriptions" },
  { label: "Reports & analytics", href: "/admin/reports" },
  { label: "Content management", href: "/admin/content" },
  { label: "Notifications", href: "/admin/notifications" },
  { label: "Audit logs", href: "/admin/audit-logs" },
  { label: "Settings", href: "/admin/settings" },
  { label: "My Profile", href: "/admin/profile" },
];

// same mock users as User Management — kept here as a lightweight duplicate
// since that page's array isn't exported; worth centralizing later if this
// grows into real shared data
const mockProfiles: { name: string; type: string }[] = [
  { name: "Ella ThankGod", type: "Candidate" },
  { name: "Kofi Mensah", type: "Recruiter" },
  { name: "Fatima Yusuf", type: "Candidate" },
  { name: "Amara Chukwu", type: "Candidate" },
  { name: "David Okafor", type: "Recruiter" },
  { name: "Grace Wanjiru", type: "Candidate" },
  { name: "Samuel Boateng", type: "Recruiter" },
  { name: "Zainab Ibrahim", type: "Admin" },
  { name: "Michael Adeyemi", type: "Candidate" },
  { name: "Naledi Mokoena", type: "Candidate" },
  { name: "Tunde Bakare", type: "Recruiter" },
  { name: "Chidinma Eze", type: "Candidate" },
];

export function searchAdmin(query: string): AdminSearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  const toolResults: AdminSearchResult[] = adminTools
    .filter((tool) => tool.label.toLowerCase().includes(q))
    .map((tool) => ({
      id: `tool-${tool.href}`,
      label: tool.label,
      subtitle: "Admin tool",
      href: tool.href,
    }));

  const profileResults: AdminSearchResult[] = mockProfiles
    .filter((p) => p.name.toLowerCase().includes(q))
    .map((p) => ({
      id: `profile-${p.name}`,
      label: p.name,
      subtitle: p.type,
      href: "/admin/users",
    }));

  return [...toolResults, ...profileResults].slice(0, 8);
}