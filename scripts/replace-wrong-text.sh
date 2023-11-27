#!/bin/bash
set -eu

targetDir='codex-v2'
function replace_wrong_text() {
  targetWord=$1
  replaceWord=$2
  path=$3
  find "$path" -type f | grep $targetDir | grep -Ewv '_gen' | xargs sed -i "s@$targetWord@$replaceWord@g"
}

replace_wrong_text 'edDate' 'edAt' ./src
replace_wrong_text '.toBeTruthy()' '.toEqual(true)' ./src
replace_wrong_text '.toBeFalsy()' '.toEqual(false)' ./src
replace_wrong_text 'omainModel' 'omainEntity' ./src
replace_wrong_text 'ypeOrm' 'ypeorm' ./src
replace_wrong_text 'Fist' 'First' ./src
replace_wrong_text 'fist' 'first' ./src
replace_wrong_text 'odeIllusion' 'odeillusion' ./
replace_wrong_text 'ode-illusion' 'odeillusion' ./
