#!/usr/bin/env bash
set -e


[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1
[ -z "$INSURED" ] && echo "Missing \$INSURED environment variable" && exit 1

echo
echo 'About to call activate() on the contract'
echo near call \$CONTRACT activate '{"id":"$1"}' --account_id \$INSURED --amount \$2
echo
echo
echo \$CONTRACT is $CONTRACT
echo \$INSURED is $INSURED
echo \$1 is [ $1 ] '(id )'
echo \$2 is [ $2 NEAR ] '(attached amount)'
echo
near call $CONTRACT activate '{"id":'"$1"'}' --account_id $INSURED --amount $2
