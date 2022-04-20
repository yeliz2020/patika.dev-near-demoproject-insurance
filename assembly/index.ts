import { u128 } from 'near-sdk-as';
import { Policy} from "./model";


export function create(policyType: string): Policy {
  return Policy.createPolicy(policyType);
}

export function getById(id: u32): Policy {
  return Policy.findById(id);
}

export function get(offset: u32, limit: u32 = 10): Policy[] {
  return Policy.getPolicies(offset, limit);
}

export function claim(id: u32, amount:u128): Policy {
  return Policy.claimCompensation(id,amount);
}

export function activate(id: u32): Policy {
  return Policy.activateInsurancePolicy(id);
}
export function cancel(id: u32): void {
  Policy.cancelPolicy(id);
}

  
