#!/usr/bin/python2.4
#
# Copyright 2010 Google Inc. All Rights Reserved.

"""Open a bunch of sites to test manually.
"""

__author__ = 'scottkirkwood@google.com (Scott Kirkwood)'

import subprocess
import os
import sys

sites = [
    'http://www.salon.com/',
    'http://www.orkut.com/',
    'http://andrewsullivan.theatlantic.com/the_daily_dish/',
    'http://www.wannanetwork.com/',  # wordpress
    'http://www.indecisionforever.com/',
    'http://antwrp.gsfc.nasa.gov/apod/',
    'http://www.youtube.com/watch?v=Cjbm5cJiPzw&feature=popular',
    'http://stackoverflow.com/',
]

def main():
  args = [
      'google-chrome',
      '--new-window',
      '--user-data-dir=' +
      os.path.expanduser('~/.config/google-chrome/scottforusers'),
    ] + sites
  ret = subprocess.call(args)
  if ret:
    print 'Problem running %s' % ' '.join(args)
    sys.exit(-1)


if __name__ == '__main__':
  main()
