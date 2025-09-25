#!/bin/bash
# Script to fix all CSS syntax errors including responsive breakpoints

# Fix all spacing issues in one go
sed -i \
  -e 's/dark: !/dark:!/g' \
  -e 's/hover: !/hover:!/g' \
  -e 's/active: !/active:!/g' \
  -e 's/focus: !/focus:!/g' \
  -e 's/sm: !/sm:!/g' \
  -e 's/md: !/md:!/g' \
  -e 's/lg: !/lg:!/g' \
  -e 's/xl: !/xl:!/g' \
  -e 's/2xl: !/2xl:!/g' \
  -e 's/3xl: !/3xl:!/g' \
  -e 's/2xsm: !/2xsm:!/g' \
  -e 's/xsm: !/xsm:!/g' \
  -e 's/dark:hover: !/dark:hover:!/g' \
  -e 's/dark:active: !/dark:active:!/g' \
  -e 's/dark:focus: !/dark:focus:!/g' \
  src/index.css

echo "All CSS fixes applied!"
