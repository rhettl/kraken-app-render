# kraken-app-render
===========

Test app to showcase the difference between `app.render` and `res.render`


## Description of steps

1. use global yo@1.4.8 to install kraken via generator-kraken@2.1.0 in new directory
2. start this [readme.md](README.md)
3. add [lib/email.js](lib/email.js) and deps. (nodemailer, nodemailer-sendmail-transport, and extend)
4. add `mailtransport` config options to [config/config.js](config/config.js)
5. add [public/templates/layouts/email.dust](public/templates/layouts/email.dust) and [locales/US/en/layouts/email.dust](locales/US/en/layouts/email.dust)
6. add [public/templates/emails/test.dust](public/templates/emails/test.dust) and [locales/US/en/emails/test.dust](locales/US/en/emails/test.dust)
7. add [lib/emailController.js](lib/emailController.js) and initialize in [index.js](index.js)
8. make route `/testemail` to render email html to browser
9. set `NODE_DEBUG=dust-makara-helpers`
10. run:
```
/usr/local/bin/node server.js
Server listening on http://localhost:8000
Mail Transport Ready
DUST-MAKARA-HELPERS 41142: registering
DUST-MAKARA-HELPERS 41142: will autoload template content? true
DUST-MAKARA-HELPERS 41142: wrapping onLoad function to support content autoloading
DUST-MAKARA-HELPERS 41142: registering
DUST-MAKARA-HELPERS 41142: will autoload template content? true
DUST-MAKARA-HELPERS 41142: wrapping onLoad function to support content autoloading
Application ready to serve requests.
DUST-MAKARA-HELPERS 41142: calling old onLoad to get template '/Users/rhett/Projects/kraken-app-render/public/templates/emails/test.dust'
Environment: development
Sending email...
DUST-MAKARA-HELPERS 41142: got template function body_0(chk,ctx){ctx=ctx.shiftBlocks(blocks);return chk.p("layouts/email",ctx,ctx,{});}
DUST-MAKARA-HELPERS 41142: wrapping template 'emails/test' to look up default content
DUST-MAKARA-HELPERS 41142: content request for 'emails/test.properties'
DUST-MAKARA-HELPERS 41142: normalizing locale {"locale":"en-US"}
DUST-MAKARA-HELPERS 41142: performing lookup for template 'undefined' and locale null
```


I included `lib/email.js` and `lib/emailController.js` so you could see how that who section of my application is 
working, but I also wrote a function `renderTest` sitting at the bottom of `index.js` which will allow you to test more 
directly.

