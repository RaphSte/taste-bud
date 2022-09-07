# Taste-Bud

Tasting Buddy app for rating the taste of different things.   
Basically a digital way to hold and participate in beer/whine/etc. tastings

# TODOs

- loading indicator for committing and fetching firebase stuff:
    - [ ] submitting session config
    - [ ] fetching session config when adding taste items
    - [ ] submitting tasting items
    - [ ] changing session
- translations
- readme with screenshots
- [x] figure out a way to avoid people overwriting their submitted tasting items

# Known bugs

- copying the session code won't work in browser (ff, edge), perhaps this is different when installed as a pwa/ app over
  the appstore
- same for pasting
- sometimes submitting a session doesn't redirect to the success screen

# Future feature ideas
 - sort tasting items to get personal and over all favourites
 - perhaps extra rating screen 'how did you like this item'
 - configurable min and max values (rn it's fixed between 0 and 10)