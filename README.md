# Async Script Injection Example

Dynamically created and inserted scripts are _asynchronous_ by default.

This can be quickly tested by running the following command in your Browser's DevTools console:

    document.createElement('script').async // Returns `true`

This repo looks to show differences between this if it isn't taken into account when dynamically inserting scripts.

Navigate to https://async-script-injection-example.herokuapp.com and inject scripts synchronously or asynchronously and observe the differences in execution order.

> See the following for more information:
>
> -   [https://www.html5rocks.com/en/tutorials/speed/script-loading/](https://www.html5rocks.com/en/tutorials/speed/script-loading/)
> -   [https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#Compatibility_notes](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script#Compatibility_notes)
