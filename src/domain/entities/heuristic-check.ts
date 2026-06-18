export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW" | "INFO";

export interface HeuristicCheckProps {
  id: string;
  name: string;
  description: string;
  severity: Severity;
  passed: boolean;
  details?: string;
}

export class HeuristicCheck {
  public readonly id: string;
  public readonly name: string;
  public readonly description: string;
  public readonly severity: Severity;
  public readonly passed: boolean;
  public readonly details?: string;

  constructor(props: HeuristicCheckProps) {
    if (!props.id) {
      throw new Error("Heuristic check ID cannot be empty");
    }
    if (!props.name) {
      throw new Error("Heuristic check name cannot be empty");
    }
    if (!props.description) {
      throw new Error("Heuristic check description cannot be empty");
    }
    
    this.id = props.id;
    this.name = props.name;
    this.description = props.description;
    this.severity = props.severity;
    this.passed = props.passed;
    this.details = props.details;
  }
}
