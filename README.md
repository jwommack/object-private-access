# What is this?

This is an attempt to play around with some ways to handle private parameter access in classes and alternatives to potentially speed up object serialization.

The idea is that filtering out parameters that are meant to be internal on an object before serialization is an unnecessary cost and could be better managed by simply never exposing them to the public object in the first place.

There are a few not great alternatives to how to do something like this and they're restrited by the lack of a real genric getter or setter in Javascript. In other languages this would be something like `__get` , the closest match to this in Javascript seems to be via Proxies', which have some known overhead impacts (which we'll need to measure).

defineProperties exists but doesn't allow defining of true private properties.
