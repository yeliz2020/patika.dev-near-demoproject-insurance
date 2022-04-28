#!/usr/bin/env bash
set -e


[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$INSURED" ] && echo "Missing \$INSURED environment variable" && exit 1

echo
echo 'About to call claim() on the contract'
echo "--------------------------------------------"
echo "--------------------------------------------"
echo near call \$CONTRACT claim '{"id":"$1","amount":"$2"}' --account_id \$INSURED 
echo
echo \$CONTRACT is $CONTRACT
echo \$INSURED is $INSURED
echo \$1 is [ $1 ] '(id )'
echo \$2 is [ $2 ] '(claim amount)'
echo
echo "--------------------------------------------"
near call $CONTRACT claim '{"id":'"$1"',"amount":"'"$2"'"}' --account_id $INSURED 
