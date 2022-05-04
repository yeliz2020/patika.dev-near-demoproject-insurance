#!/usr/bin/env bash
set -e


[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$INSURED" ] && echo "Missing \$INSURED environment variable" && exit 1

echo
echo 'About to call cancel() on the contract'
echo near call \$CONTRACT cancel '{"id":"$1"}' --account_id \$INSURED
echo
echo
echo
echo \$CONTRACT is $CONTRACT
echo \$INSURED is $INSURED
echo \$1 is [ $1 ] '(id )'
echo 
echo
near call $CONTRACT cancel '{"id":'"$1"'}' --account_id $INSURED 