import {
  PersistentUnorderedMap,
  math,
  context,
  u128,
  ContractPromiseBatch,
} from "near-sdk-as";

export const insurancePolicies = new PersistentUnorderedMap<u32, Policy>(
  "insurancePolicies"
);
export const ONE_NEAR = u128.from("1000000000000000000000000");
export const TW0_NEAR = u128.from("2000000000000000000000000");
export const TEN_NEAR = u128.from("10000000000000000000000000");
export const CONTRACT_NAME = "dev-1650369272801-16471934066557";

@nearBindgen
export class Policy {
  id: u32;
  policyType: string;
  insured: string;
  premium: bool;
  limitsOfLiability: u128;

  constructor(policyType: string) {
    this.id = math.hash32<string>(policyType);
    this.insured = context.sender;
    this.policyType = policyType;
    this.premium = context.attachedDeposit >= TW0_NEAR;
    this.limitsOfLiability = TEN_NEAR;
  }

  static creatPolicy(policyType: string): Policy {
    // create a new Policy
    //near call $CONTRACT create '{"policyType":"Health"}' --accountId yeliz2.testnet   *premium false*
    //near call $CONTRACT create '{"policyType":"Car"}' --accountId yeliz.testnet --amount 2   *premium true*
    const insurancePolicy = new Policy(policyType);
    // add the Policy to the PersistentUnorderedMap the key is the Policy id and the value is the Policy itself. 
    insurancePolicies.set(insurancePolicy.id, insurancePolicy);

    return insurancePolicy;
  }

  static findById(id: u32): Policy {
    //near view $CONTRACT getById '{"id":SOME_ID_HERE}' --accountId

    // Lookup a Policy in the PersistentUnorderedMap by its id.
    return insurancePolicies.getSome(id);
  }

  static getPolicies(offset: u32, limit: u32): Policy[] {
    //near view $CONTRACT get '{"offset":0}' --accountId 

    // We'll start at the offset (skipping all policies before the offset)
    // and collect all policies until we reach the offset + limit 
    return insurancePolicies.values(offset, offset + limit);
  }

  static claimCompensation(id: u32, amount: u128): Policy {
    //near call $CONTRACT claim '{"id":1435075657,"amount":"3000000000000000000000000"}' --accountId $CONTRACT   *not policy owner*
    //near call $CONTRACT claim '{"id":1435075657,"amount":"3000000000000000000000000"}' --accountId yeliz2.testnet   *policy not active*
    //near call $CONTRACT claim '{"id":2781737085,"amount":"20000000000000000000000000"}' --accountId yeliz.testnet *above limit*
    //near call $CONTRACT claim '{"id":2781737085,"amount":"3000000000000000000000000"}' --accountId yeliz.testnet   *OK*

    //create a claim by sending id and amount as parameters.
    const insurancePolicy = insurancePolicies.getSome(id);
    const isActive = insurancePolicy.premium;
    const insured = insurancePolicy.insured;
    const caller = context.sender;
    let limit = insurancePolicy.limitsOfLiability;
    
    //we have to do three checks for compensation claim with assert functions
    //First: Is the policyholder the same person claiming compensation?
    //Second: Has the policy premium been paid? Is the policy active?
    //Third : Is the amount exceed limits of liability?

    assert(insured == caller, "ONLY THE POLICY OWNER CAN CLAIM COMPENSATION");
    assert(isActive == true, "THE POLICY IS NOT ACTIVE");
    assert(limit >= amount, "YOU CAN NOT CLAIM ABOVE THE LIMITS OF LIABILITY");

    //If it passes all three checks, we pay the policyholder
    const policyholder = ContractPromiseBatch.create(caller);
    policyholder.transfer(amount);

    // update the limitsOfLiability in-memory
    insurancePolicy.limitsOfLiability = u128.sub(limit, amount);
    insurancePolicies.set(insurancePolicy.id, insurancePolicy);

    return insurancePolicy;
  }
  static activateInsurancePolicy(id: u32): Policy {
    //near call $CONTRACT activate '{"id":1435075657 }' --accountId yeliz2.testnet   *not activated*
    //near call $CONTRACT activate '{"id":1435075657 }' --accountId yeliz.testnet --amount 2 *activated*
    

    // We will activate the policy by paying the premium
    //find the Policy by its id
    const insurancePolicy = this.findById(id);
    
    //We create a warning if premium is not paid
    assert(
      context.attachedDeposit >= TW0_NEAR,
      "THE POLICY CANNOT BE ACTIVATED WITHOUT PREMIUM PAYMENT"
    );
    //set premium: true, now the policy is active
    insurancePolicy.premium = true;
    insurancePolicies.set(id, insurancePolicy);

    return insurancePolicy;
  }

  static cancelPolicy(id: u32): void {
    //near call $CONTRACT cancel '{"id":1435075657}' --accountId yeliz.testnet   *different account* error*
    //near call $CONTRACT cancel '{"id":1435075657}' --accountId yeliz2.testnet  *policy canceled*
    //The policy cancellation right belongs only to the policy owner and the contract. 
    //If not, we do not give the right to cancel the policy.
    const insurancePolicy = insurancePolicies.getSome(id);
    const insured = insurancePolicy.insured;
    const caller = context.sender;

    assert(
      insured == caller || CONTRACT_NAME == caller,
      "ONLY THE POLICY OWNER OR THE CONTRACT CAN CANCEL THE POLICY"
    );
    insurancePolicies.delete(id);
  }

}
