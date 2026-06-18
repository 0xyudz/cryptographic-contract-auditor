import { createHash } from "crypto";
import { IAttestationGenerator } from "../../domain/interfaces/attestation-generator.js";
import { AuditResult } from "../../domain/entities/audit-result.js";
import { AttestationHash, Signature } from "../../domain/value-objects/attestation.js";

export class Sha256AttestationGenerator implements IAttestationGenerator {
  /**
   * Generates a deterministic SHA-256 hash of the audit results,
   * canonically serialized and bound to the auditor identity and timestamp.
   */
  public generateHash(
    auditResult: AuditResult,
    auditorId: string,
    timestamp: number
  ): AttestationHash {
    const bytecodeHash = createHash("sha256")
      .update(auditResult.bytecode.getValue())
      .digest("hex");

    const payload = {
      contractAddress: auditResult.contractAddress.getValue(),
      bytecodeHash,
      checks: auditResult.checks
        .map((c) => ({ id: c.id, passed: c.passed, severity: c.severity }))
        .sort((a, b) => a.id.localeCompare(b.id)),
      riskScore: auditResult.riskScore.value,
      auditorId,
      timestamp,
    };

    const jsonStr = this.canonicalStringify(payload);
    const hashHex = createHash("sha256").update(jsonStr).digest("hex");
    return new AttestationHash(hashHex);
  }

  /**
   * Signs the generated attestation hash deterministically for demo validation.
   */
  public sign(hash: AttestationHash): Signature {
    const sigHex = createHash("sha256")
      .update(`SIGNATURE_PREFIX_${hash.getValue()}`)
      .digest("hex");
    return new Signature(sigHex);
  }

  /**
   * Deterministic JSON serializer to ensure stable hashes.
   * Sorts object keys alphabetically and strips formatting whitespaces.
   */
  private canonicalStringify(obj: any): string {
    if (obj === null) return "null";
    if (typeof obj !== "object") return JSON.stringify(obj);
    if (Array.isArray(obj)) {
      return "[" + obj.map((item) => this.canonicalStringify(item)).join(",") + "]";
    }
    const keys = Object.keys(obj).sort();
    const properties = keys.map(
      (key) => `${JSON.stringify(key)}:${this.canonicalStringify(obj[key])}`
    );
    return "{" + properties.join(",") + "}";
  }
}
