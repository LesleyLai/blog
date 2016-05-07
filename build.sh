#!/bin/sh

# Builds .org files
echo "============================================================="
echo "Building org files:"
echo "============================================================="
emacs -batch -l org_export.el -kill