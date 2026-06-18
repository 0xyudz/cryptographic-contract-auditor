import { AuditResult } from "../entities/audit-result.js";
import { AttestationHash, Signature } from "../value-objects/attestation.js";

export interface IAttestationGenerator {
  /**
   * Generates a deterministic SHA-256 hash representing the audit results,
   * bound to the auditor's identity and a specific timestamp.
   * 
   * @param auditResult The audit result details.
   * @param auditorId The identity of the auditor performing the validation.
   * @param timestamp Unix epoch timestamp in milliseconds.
   * @returns The validated AttestationHash value object.
   */
  generateHash(
    auditResult: AuditResult,
    auditorId: string,
    timestamp: number
  ): AttestationHash;

  /**
   * Signs the generated attestation hash with a cryptographic key.
   * 
   * @param hash The generated attestation hash.
   * @returns The generated Signature value object.
   */
  sign(hash: AttestationHash): Signature;
}
