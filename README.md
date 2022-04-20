# patika.dev-near-demoproject-insurance

This repo is a demo of Near Smart Contract with assemblyscript, about the insurance policy.
## Usage
### Prerequisites:
1. npm
2. Near-cli
3. Current version of Node.js
4. yarn: npm install --global yarn (or just npm i -g yarn)
5. You need near-cli installed globally. Here's how:
npm install --global near-cli
This will give you the near CLI tool. Ensure that it's installed with:
near --version

### Getting started
1. Clone this repo to a local folder
2. run yarn (This will install the dependencies so that we won’t have a problem related to that.)
3. yarn build:release
4. yarn deploy
 
Copy your Contract id

Export it so you do not have to copy and paste it while calling contract methods: 

export CONTRACT=YOUR-CONTRACT-ID

### Project Description

In this Near demo project, we will create several insurance policies and operate on them.

-----------------

We create policy with the create function. The owner of the policy is assigned as the caller of the function. The type of the policy is the parameter we send in the function, and the limit is set as 10 near. If we send attachedDeposit while calling the function, the premium is true, otherwise false.

```code
near call $CONTRACT create '{"policyType":"Health"}' --accountId yeliz2.testnet
```
<img width="860" alt="createWithoutPremium" src="https://user-images.githubusercontent.com/69525712/164076914-cf7554ac-6b50-4d96-815b-deb91a1f6fc7.png">

```code
near call $CONTRACT create '{"policyType":"Car"}' --accountId yeliz.testnet --amount 2
```
<img width="995" alt="createwithPremium" src="https://user-images.githubusercontent.com/69525712/164077272-49445a7a-2173-4db8-acc4-6f1efd220a61.png">

---------------------

We can find the policy by sending the id parameter with getById.

```code
near view $CONTRACT getById '{"id":623298080}'
```
<img width="691" alt="getById" src="https://user-images.githubusercontent.com/69525712/164077527-fba36ff6-cc98-4d71-b700-57e4c46386db.png">

-----------------------

With get function, we can list the policies.

```code
near view $CONTRACT get '{"offset":0}'
```

<img width="754" alt="policyList" src="https://user-images.githubusercontent.com/69525712/164077765-94bf11a5-b656-4f2b-a967-aa2333b51107.png">

---------------------------

We create a claim for compensation with claim function. First of all, we need to make three checks with the assert function. First: Is the policyholder the same person claiming compensation? Second: Has the policy premium been paid? Is the policy active? Third : Is the amount exceed limits of liability?

```code
near call $CONTRACT claim '{"id":1435075657,"amount":"3000000000000000000000000"}' --accountId $CONTRACT
```
<img width="1212" alt="OwnerError" src="https://user-images.githubusercontent.com/69525712/164078455-40d91c75-d4e5-4a28-acde-bc66145de01f.png">

```code
near call $CONTRACT claim '{"id":1435075657,"amount":"3000000000000000000000000"}' --accountId yeliz2.testnet
```
<img width="1207" alt="notActive" src="https://user-images.githubusercontent.com/69525712/164078736-318a18dd-dfb4-4641-a065-545b2a6544da.png">

```code
near call $CONTRACT claim '{"id":2781737085,"amount":"20000000000000000000000000"}' --accountId yeliz.testnet
````
<img width="1221" alt="overLimit" src="https://user-images.githubusercontent.com/69525712/164079363-b89c6610-4bc9-44e9-861f-3a0164dfad5e.png">

```code
near call $CONTRACT claim '{"id":2781737085,"amount":"3000000000000000000000000"}' --accountId yeliz.testnet
```
<img width="1191" alt="successClaim" src="https://user-images.githubusercontent.com/69525712/164079643-14910390-98fa-46da-8daf-b2669a51e278.png">

------------------------

With activate function, the policy is activated by sending the premium amount to the contract. If the amount is not sent, an error message is generated with the assert function.


```code
near call $CONTRACT activate '{"id":1435075657 }' --accountId yeliz2.testnet
```
<img width="1222" alt="premiumError" src="https://user-images.githubusercontent.com/69525712/164079984-00b52541-81c1-4ec6-9436-599636745f83.png">

```code
near call $CONTRACT activate '{"id":1435075657 }' --accountId yeliz.testnet --amount 2
```
<img width="1050" alt="activate" src="https://user-images.githubusercontent.com/69525712/164080243-2fb24848-98aa-4c96-900f-4d1fec596459.png">

-------------------------

With cancel function, the policy can be canceled. Cancellation can only be made by the policyholder or the contract. We use the assert function for checking. If the conditions are valid, the policy will be cancelled

```code
near call $CONTRACT cancel '{"id":1435075657}' --accountId yeliz.testnet
```

<img width="1214" alt="cancelError" src="https://user-images.githubusercontent.com/69525712/164172334-b61e6bd3-5222-4d33-b68c-98cb58d7fc35.png">

#### cancel successful
```code
near call $CONTRACT cancel '{"id":1435075657}' --accountId yeliz2.testnet
```

