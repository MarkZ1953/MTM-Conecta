import { ResourceAPI } from "@/api";
import type { Beneficiary } from "./beneficiaries.types";

class BeneficiariesAPI extends ResourceAPI<Beneficiary> {
    constructor() {
        super({ resource: "beneficiaries" });
    }
}

export const beneficiariesAPI = new BeneficiariesAPI();