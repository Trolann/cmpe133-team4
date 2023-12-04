#!/bin/bash

set -e

virtualenv virtualenv
source virtualenv/bin/activate
pip install -r requirements.txt
deactivate

# Changes to this file should not be necessary unless there are specific build steps you need to perform.