export type ActivityStatus = 'Planned' | 'Reserved' | 'Completed' | 'Cancelled';

export type ExpenseCategory = 
    | 'Transport'
    | 'Accommodation'
    | 'Food'
    | 'Tickets'
    | 'Shopping'
    | 'Other';

export interface Destination {
    id: number;
    travelPlanId: number;
    name: string;
    location: string;
    arrivalDate: string;
    departureDate: string;
    description: string | null;
    notes: string | null;
}

export interface Activity {
    id: number;
    travelPlanId: number;
    name: string;
    date: string;
    time: string | null;
    location: string | null;
    description: string | null;
    estimatedCost: number | null;
    status: ActivityStatus;
}

export interface Expense {
    id: number;
    travelPlanId: number;
    name: string;
    category: ExpenseCategory;
    amount: number;
    date: string;
    description: string | null;
}

export interface ChecklistItem {
    id: number;
    travelPlanId: number;
    name: string;
    isCompleted: boolean;
}

export interface TravelPlan {
  id: number;
  userId: number;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  budget: number;
  totalExpenses: number;
  remainingBudget: number;
  notes: string | null;
  createdAt: string;
  destinations: Destination[];
  activities: Activity[];
  expenses: Expense[];
  checklistItems: ChecklistItem[];
}

export interface TravelPlanSummary {
  id: number;
  userId: number;
  name: string;
  description: string | null;
  startDate: string;
  endDate: string;
  budget: number;
  totalExpenses: number;
  remainingBudget: number;
  createdAt: string;
  destinationCount: number;
  activityCount: number;
  checklistItemCount: number;
  completedChecklistItemCount: number;
}

export interface TravelPlanInput {
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  budget: number;
  notes: string;
}

export interface DestinationInput {
  name: string;
  location: string;
  arrivalDate: string;
  departureDate: string;
  description: string;
  notes: string;
}

export interface ActivityInput {
  name: string;
  date: string;
  time: string | null;
  location: string;
  description: string;
  estimatedCost: number | null;
  status: ActivityStatus;
}

export interface ExpenseInput {
  name: string;
  category: ExpenseCategory;
  amount: number;
  date: string;
  description: string;
}

export interface ChecklistItemInput {
  name: string;
  isCompleted: boolean;
}
