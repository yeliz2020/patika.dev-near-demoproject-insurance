#!/usr/bin/env bash
set -e


[ -z "$CONTRACT" ] && echo "Missing \$CONTRACT environment variable" && exit 1

echo
echo

echo "--------------------------------------------"

echo "--------------------------------------------"
echo "These are the environment variables being used:"
echo
echo
echo "CONTRACT is [ $CONTRACT ]"
echo \$1 is [ $1 ] '(id)'
echo
echo
echo "near view $CONTRACT getById '{"id":"$1"}'"
echo
near view $CONTRACT getById '{"id":'"$1"'}'