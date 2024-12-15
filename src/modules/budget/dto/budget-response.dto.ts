import { Budget } from "../entities/budget.entity";

export interface BudgetResponseDTO extends Budget {
  transactionsSum?: number;
}
