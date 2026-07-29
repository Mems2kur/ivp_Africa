"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  monthlyPrice: string;
  annualPrice: string;
}

interface EmployerSubscription {
  id: string;
  company: string;
  plan: string;
  billingCycle: "Monthly" | "Annual";
  status: "Active" | "Expiring soon" | "Cancelled";
}

const initialPlans: Plan[] = [
  { id: "1", name: "Starter Tier", monthlyPrice: "$49/mo", annualPrice: "$470/yr" },
  { id: "2", name: "Recruiter Pro", monthlyPrice: "$149/mo", annualPrice: "$1,430/yr" },
  { id: "3", name: "Enterprise Custom", monthlyPrice: "Contact Sales", annualPrice: "Contact Sales" },
];

const employerSubscriptions: EmployerSubscription[] = [
  { id: "1", company: "Vantage Tech", plan: "Recruiter Pro", billingCycle: "Monthly", status: "Active" },
  { id: "2", company: "AfriHealth Corp", plan: "Starter Tier", billingCycle: "Annual", status: "Expiring soon" },
  { id: "3", company: "Safaricom PLC", plan: "Recruiter Pro", billingCycle: "Annual", status: "Active" },
  { id: "4", company: "Kaziflow Technologies", plan: "Starter Tier", billingCycle: "Monthly", status: "Active" },
  { id: "5", company: "Jollof Media House", plan: "Starter Tier", billingCycle: "Monthly", status: "Cancelled" },
];

const statusStyles: Record<EmployerSubscription["status"], string> = {
  Active: "bg-green-50 text-green-700",
  "Expiring soon": "bg-amber-50 text-amber-700",
  Cancelled: "bg-red-50 text-red-600",
};

const PAGE_SIZE = 20;

export default function SubscriptionManagementPage() {
  const [plans, setPlans] = useState<Plan[]>(initialPlans);
  const [subscriptions] = useState<EmployerSubscription[]>(employerSubscriptions);
  const [page, setPage] = useState(1);

  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [addingPlan, setAddingPlan] = useState(false);
  const [draftName, setDraftName] = useState("");
  const [draftMonthly, setDraftMonthly] = useState("");
  const [draftAnnual, setDraftAnnual] = useState("");

  const totalPages = Math.max(1, Math.ceil(subscriptions.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedSubs = subscriptions.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const startIndex = subscriptions.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(currentPage * PAGE_SIZE, subscriptions.length);

  function openAddModal() {
    setDraftName("");
    setDraftMonthly("");
    setDraftAnnual("");
    setAddingPlan(true);
  }

  function openEditModal(plan: Plan) {
    setDraftName(plan.name);
    setDraftMonthly(plan.monthlyPrice);
    setDraftAnnual(plan.annualPrice);
    setEditingPlan(plan);
  }

  function handleSaveNewPlan() {
    if (!draftName.trim()) return;
    setPlans((prev) => [
      ...prev,
      { id: crypto.randomUUID(), name: draftName.trim(), monthlyPrice: draftMonthly.trim() || "—", annualPrice: draftAnnual.trim() || "—" },
    ]);
    setAddingPlan(false);
  }

  function handleSaveEdit() {
    if (!editingPlan || !draftName.trim()) return;
    setPlans((prev) =>
      prev.map((p) =>
        p.id === editingPlan.id
          ? { ...p, name: draftName.trim(), monthlyPrice: draftMonthly.trim() || "—", annualPrice: draftAnnual.trim() || "—" }
          : p
      )
    );
    setEditingPlan(null);
  }

  return (
    <>
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">Subscription & Plans</h1>
        <p className="mt-1 text-xs text-gray-500 sm:text-sm">
          Configure employer tiers and manage corporate billing.
        </p>
      </div>

      {/* Active Membership Plans */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-bold text-gray-900 sm:text-base">Active Membership Plans</h2>
          <button
            type="button"
            onClick={openAddModal}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-[#8A38F5] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#7226e0]"
          >
            <Plus size={16} />
            Add Plan
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-3 pr-4 text-xs font-medium text-gray-400">Plan name</th>
                <th className="hidden py-3 pr-4 text-xs font-medium text-gray-400 sm:table-cell">Monthly price</th>
                <th className="hidden py-3 pr-4 text-xs font-medium text-gray-400 sm:table-cell">Annual price</th>
                <th className="py-3 text-right text-xs font-medium text-gray-400">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {plans.map((plan) => (
                <tr key={plan.id} className="transition-colors hover:bg-gray-50">
                  <td className="py-3 pr-4">
                    <p className="text-sm font-semibold text-gray-900">{plan.name}</p>
                    <p className="text-xs text-gray-400 sm:hidden">
                      {plan.monthlyPrice} · {plan.annualPrice}
                    </p>
                  </td>
                  <td className="hidden py-3 pr-4 text-sm text-gray-600 sm:table-cell">{plan.monthlyPrice}</td>
                  <td className="hidden py-3 pr-4 text-sm text-gray-600 sm:table-cell">{plan.annualPrice}</td>
                  <td className="py-3 text-right">
                    <button
                      type="button"
                      onClick={() => openEditModal(plan)}
                      className="text-sm font-semibold text-[#8A38F5] hover:underline"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Employer Subscriptions */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 sm:p-6">
        <h2 className="mb-4 text-sm font-bold text-gray-900 sm:text-base">Employer Subscriptions</h2>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[480px] text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="py-3 pr-4 text-xs font-medium text-gray-400">Company</th>
                <th className="hidden py-3 pr-4 text-xs font-medium text-gray-400 sm:table-cell">Plan</th>
                <th className="hidden py-3 pr-4 text-xs font-medium text-gray-400 md:table-cell">Billing cycle</th>
                <th className="py-3 text-xs font-medium text-gray-400">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedSubs.map((sub) => (
                <tr key={sub.id} className="transition-colors hover:bg-gray-50">
                  <td className="py-3 pr-4">
                    <p className="text-sm font-semibold text-gray-900">{sub.company}</p>
                    <p className="text-xs text-gray-400 sm:hidden">{sub.plan}</p>
                  </td>
                  <td className="hidden py-3 pr-4 text-sm text-gray-600 sm:table-cell">{sub.plan}</td>
                  <td className="hidden py-3 pr-4 text-sm text-gray-500 md:table-cell">{sub.billingCycle}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap ${statusStyles[sub.status]}`}>
                      {sub.status}
                    </span>
                  </td>
                </tr>
              ))}

              {paginatedSubs.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-sm text-gray-400">
                    No employer subscriptions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {subscriptions.length > 0 && (
          <div className="mt-4 flex flex-col gap-3 border-t border-gray-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-gray-400 sm:text-sm">
              Showing {startIndex}-{endIndex} of {subscriptions.length} subscriptions
            </p>
            {totalPages > 1 && (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-gray-300 hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add/Edit plan modal — shared between both actions */}
      {(addingPlan || editingPlan) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-base font-bold text-gray-900">
                {editingPlan ? "Edit plan" : "Add new plan"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setAddingPlan(false);
                  setEditingPlan(null);
                }}
                className="text-gray-400 hover:text-gray-600"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">Plan name</label>
                <input
                  type="text"
                  value={draftName}
                  onChange={(e) => setDraftName(e.target.value)}
                  placeholder="e.g. Growth Tier"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#8A38F5]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">Monthly price</label>
                <input
                  type="text"
                  value={draftMonthly}
                  onChange={(e) => setDraftMonthly(e.target.value)}
                  placeholder="e.g. $99/mo"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#8A38F5]"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-500">Annual price</label>
                <input
                  type="text"
                  value={draftAnnual}
                  onChange={(e) => setDraftAnnual(e.target.value)}
                  placeholder="e.g. $950/yr"
                  className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm text-gray-900 outline-none focus:border-[#8A38F5]"
                />
              </div>
            </div>

            <button
              type="button"
              onClick={editingPlan ? handleSaveEdit : handleSaveNewPlan}
              disabled={!draftName.trim()}
              className="mt-5 w-full rounded-xl bg-[#8A38F5] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#7226e0] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {editingPlan ? "Save changes" : "Create plan"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}