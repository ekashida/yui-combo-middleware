Change History
==============

@NEXT@
------


1.0.1 (2014-03-25)
------------------

- modify hash module group url format to encode hash length as part of module hash
- append host via info to the tail of the via header instead of the head


1.0.0 (2014-03-14)
------------------

- replace `path` module groups with absolute and relative path groups
- replace `root` with `shifter` module group name
- use `req.secure` to determine https request (instead of `req.comboSecure`)
- merged git@github.com:ekashida/yui-pathogen-decoder.git (default decoder)
- relax yui version validation from 3.x.x to x.x.x

0.3.4
------

- fix bug where older gallery versions require the "build" folder in the path
