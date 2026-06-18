import { z } from "zod";
import { PharosAgentKit } from "../agent/index.js";

export interface Action {
  name: string;
  similes: string[];
  description: string;
  examples: any[][];
  schema: z.ZodType<any>;
  handler: (agent: PharosAgentKit, input: Record<string, any>) => Promise<any>;
}
