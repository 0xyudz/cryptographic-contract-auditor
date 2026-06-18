import { z } from "zod";

// Input validation schema
export const AuditContractInputSchema = z.object({
  contractAddress: z
    .string()
    .trim()
    .regex(/^(0x)?[0-9a-fA-F]{40}$/, {
      message: "Contract address must be a valid 40-character hex string (optional 0x prefix)",
    }),
  bytecode: z
    .string()
    .trim()
    .min(1, { message: "Bytecode cannot be empty" })
    .regex(/^(0x)?[0-9a-fA-F]+$/, {
      message: "Bytecode must be a valid hex string",
    })
    .refine(
      (val) => {
        const clean = val.startsWith("0x") ? val.slice(2) : val;
        return clean.length % 2 === 0;
      },
      { message: "Bytecode hex representation must be byte-aligned (even length)" }
    ),
  auditorId: z.string().trim().min(1, { message: "Auditor ID cannot be empty" }),
});

export type AuditContractInput = z.infer<typeof AuditContractInputSchema>;

// Output response schema
export const AuditContractOutputSchema = z.object({
  contractAddress: z.string(),
  riskScore: z.number().min(0).max(100),
  riskLevel: z.enum(["SECURE", "LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  isSafeForAgent: z.boolean(),
  checks: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      severity: z.enum(["CRITICAL", "HIGH", "MEDIUM", "LOW", "INFO"]),
      passed: z.boolean(),
      details: z.string().optional(),
    })
  ),
  attestation: z.object({
    hash: z.string(),
    signature: z.string(),
    auditorId: z.string(),
    timestamp: z.string(), // ISO String representation
  }),
});

export type AuditContractOutput = z.infer<typeof AuditContractOutputSchema>;
