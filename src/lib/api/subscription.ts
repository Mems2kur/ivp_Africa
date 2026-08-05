export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  jobLimit: number | null; // null = unlimited
  applicationLimit: number | null;
  features: string[];
}

export interface PaymentRecord {
  id: string;
  description: string;
  amount: number;
  status: "success" | "failed";
  date: string; // ISO date
}

export interface SubscriptionState {
  planId: string;
  nextRenewal: string; // ISO date
  candidatesViewed: number;
  candidateViewLimit: number | null;
  payments: PaymentRecord[];
}


const PREFIX = "ivp_employer_subscription_";

export const plans: SubscriptionPlan[] = [
  {
    id: "starter",
    name: "Starter Free",
    price: 0,
    jobLimit: 3,
    applicationLimit: 50,
    features: ["3 Active Jobs", "50 Applications/mo", "Standard Support"],
  },
  {
    id: "professional",
    name: "Professional",
    price: 49,
    jobLimit: 15,
    applicationLimit: null,
    features: ["15 Active Jobs", "Unlimited Applications", "Priority Matching", "Advanced Filters"],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 149,
    jobLimit: null,
    applicationLimit: null,
    features: ["Unlimited Jobs", "Dedicated Recruiter", "Custom Branding", "Integration APIs"],
  },
];

function keyFor(email: string) {
  return PREFIX + email.toLowerCase();
}

function addMonths(iso: string, months: number): string {
  const d = new Date(iso);
  d.setMonth(d.getMonth() + months);
  return d.toISOString();
}

function defaultState(): SubscriptionState {
  const now = new Date().toISOString();
  return {
    planId: "professional",
    nextRenewal: addMonths(now, 1),
    candidatesViewed: 108,
    candidateViewLimit: null,
    payments: [
      { id: crypto.randomUUID(), description: "Professional Plan - Initial Signup", amount: 49, status: "success", date: addMonths(now, -4) },
      { id: crypto.randomUUID(), description: "Professional Plan - Monthly Renewal", amount: 49, status: "success", date: addMonths(now, -3) },
      { id: crypto.randomUUID(), description: "Professional Plan - Monthly Renewal", amount: 49, status: "success", date: addMonths(now, -2) },
      { id: crypto.randomUUID(), description: "Professional Plan - Monthly Renewal", amount: 49, status: "success", date: addMonths(now, -1) },
    ],
  };
}

function readState(email: string): SubscriptionState {
  if (typeof window === "undefined") return defaultState();
  try {
    const raw = localStorage.getItem(keyFor(email));
    return raw ? JSON.parse(raw) : defaultState();
  } catch {
    return defaultState();
  }
}

function writeState(email: string, state: SubscriptionState) {
  localStorage.setItem(keyFor(email), JSON.stringify(state));
}

export const subscriptionApi = {
  get(email: string): SubscriptionState {
    const existing = readState(email);
    // seed once if nothing saved yet
    if (!localStorage.getItem(keyFor(email))) {
      writeState(email, existing);
    }
    return existing;
  },

  changePlan(email: string, planId: string) {
    const state = readState(email);
    const plan = plans.find((p) => p.id === planId);
    if (!plan) return;

    const payment: PaymentRecord = {
      id: crypto.randomUUID(),
      description: `${plan.name} Plan - Plan Change`,
      amount: plan.price,
      status: "success",
      date: new Date().toISOString(),
    };

    writeState(email, {
      ...state,
      planId,
      nextRenewal: addMonths(new Date().toISOString(), 1),
      payments: [payment, ...state.payments],
    });
  },
};