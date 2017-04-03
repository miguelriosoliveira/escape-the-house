#!/usr/bin/env bash
rm -rf _dist/ &&
mkdir $_ &&
cd $_
ln -sf ../resources/ ./resources
ln -sf ../bower_components/ ./bower_components
gulp