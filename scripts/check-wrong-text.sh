#!/bin/bash
set -eu

RED="\e[31m"
GREEN="\e[32m"
END_COLOR="\e[0m"
targetDir='codex-v2'
function check_wrong_text (){
  word=$1
  errorMessage=$2
  path=$3
  res=$(grep -R "$word" "$path" | grep $targetDir | wc -l)
  if [ "$res" -eq 0 ]; then
    echo -e "${GREEN}OK: ${word} ${path}${END_COLOR}"
    return 0
  fi
  echo -e "${RED}ERR: ${res} ${word} is in ${path}${END_COLOR}"
  echo -e "$RED ${errorMessage}${END_COLOR}"
  echo -e "${RED}$(grep -R "$word" "$path" | grep $targetDir)${END_COLOR}"
  return 1
}

ret=0
check_wrong_text edDate 'use `at`. like: createdAt' ./src || ret=1
check_wrong_text createMock 'explain mock value. like: createSuccessMock, createFailureMock' ./src || ret=1
check_wrong_text '?:' 'use `| null` to be explicit' ./src/domain || ret=1
check_wrong_text 'let update' 'use `...ToBeUpdated` for variable name' ./src/ || ret=1
check_wrong_text 'const update' 'use `...ToBeUpdated` for variable name' ./src/ || ret=1
check_wrong_text 'LmsId:' 'use `externalLmsXxxId` to avoid confusing that ID related to domain model in this system' ./src/domain/entities || ret=1
check_wrong_text 'constract' 'maybe construct' ./ || ret=1
check_wrong_text 'Churnzero' 'use 2 words like ChurnZero' ./src || ret=1
check_wrong_text 'churnzero' 'use 2 words like churn-zero' ./src || ret=1
check_wrong_text 'chrun' 'maybe churn' ./src || ret=1
check_wrong_text 'Chrun' 'maybe Churn' ./src || ret=1
check_wrong_text 'packageCategory' 'use curriculumnBrand' ./src/domain || ret=1
check_wrong_text 'curriculumPackageCategory' 'use curriculumnBrand' ./src/domain || ret=1

exit $ret
