## v0.4.0 (2013-12-18)

* Provide a `beforeRender` hook during view rendering.
* Batched collection reset rendering for performance.
* Routing `pathFor` and `visit` methods. Makes navigation much more convenient.
* Fix: View options didn't default to `{}`.
* Factor model relation loading out of the constructor.
* Allow object or function route handlers.
* Automatic route unloading.
* All routes are treated as singletons.

## v0.3.0 (2013-12-12)

* Support for automatically sideloading relations when instantiating models and
  parsing a collection.
* Package using a single IIFE.
* Add a router class with automatic route handling.

## v0.2.0 (2013-12-11)

* Include a minified version, osteo.min.js.
* Configure for bower usage.
* Remove LoDash specific functions (anything not in Underscore).
* Raise an exception for missing templates.
* Add an i18n helper for translation lookup. Handlebars helper compatible.

## v0.1.0 (2013-12-09)

* Initial release with ported base classes.
