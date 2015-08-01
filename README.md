#Offline Demo 01
This repository contains a number of demo applications meant to show the capabilities of the HTML5 application cache api.

Rather than have a one repository per application, here is a single repo with multiple [tagged releases](https://github.com/mnitchie/OfflineDemo1/releases) (V01, V02...), each one showing an incremental change over the previous. Jump between tags with `git checkout VXX`, replacing `XX` with the desired version number. Install the required dependencies with `npm install` then run with `node app.js`.

This is not meant to be a comprehensive tutorial. [There](http://diveintohtml5.info/offline.html) [are](http://www.html5rocks.com/en/tutorials/appcache/beginner/) [many](https://developer.mozilla.org/en-US/docs/Web/HTML/Using_the_application_cache) [of](http://appcache.offline.technology/) [those](http://html5doctor.com/go-offline-with-application-cache/) [on](https://msdn.microsoft.com/en-us/library/hh673545.aspx) [the](http://www.sitepoint.com/html5-application-cache/) [web](http://www.sitepoint.com/common-pitfalls-avoid-using-html5-application-cache/) [already](http://www.webreference.com/authoring/languages/html/HTML5-Application-Caching/index.html). This is meant to compliment those by providing several working examples in context.

See [This](https://github.com/mnitchie/OfflineDemo2) repository for examples of using application cache in conjunction with local storage and other local data store APIs.

##V01
[View demo](http://d1v1.mikenitchie.com)

A single, static HTML page viewable offline. The `manifest` attribute on the `html` tag points to a cache.manifest file. When the browser downloads this file with a `Content-Type` of `text/cache-manifest`, it will cache the page for use offline. Node/express seems to set this header for you. Your mileage with other servers may vary... I believe that this has to be set explicitly in Apache and Tomcat.

The most basic cache-manifest file is simply

    CACHE MANIFEST

##V02
[View diffs](https://github.com/mnitchie/OfflineDemo1/compare/V01...V02?diff=unified&name=V02)  
[View demo](http://d1v2.mikenitchie.com)

In the first example, Chrome complains that it can't find `favicon.ico`. this usually isn't an issue, but now that a manifest file is involved things get a bit more complicated.

Since we've declared a manifest file, the typical client-server workflow no longer applies. Now, when a resource is requested, the browser will see if it can find it in the application cache. If it can, it uses it. If it can't, then it throws an error. It doesn't even try to ask the server for it.

##V03
[View diffs](https://github.com/mnitchie/OfflineDemo1/compare/V02...V03)  
[View demo](http://d1v3.mikenitchie.com)

Add a simple css file to the page. We get an error, though, for the same reason we got an error with the favicon. All resources must be listed, somewhere, in the cache manifest file.

##V04
[View diffs](https://github.com/mnitchie/OfflineDemo1/compare/V03...V04)  
[View demo](http://d1v4.mikenitchie.com)

Add the css file to the manifest and we are good to go, but not until after loading the page twice. Reload once to download the css file and save it to the cache. Reload again to swap from the stale cache to the new cache.

Again, all resources on the page are loaded from the appcache. When a page first loads, it is loaded from the current appcache. If the manifest file changed from the last load, all of the resources listed are downloaded in the background. Those new resources are not ready for use until a page refresh.

##V05
[View diffs](https://github.com/mnitchie/OfflineDemo1/compare/V04...V05)  
[View demo](http://d1v5.mikenitchie.com)

We can allow resources to be accessed only when the user is online by enumerating them in a `NETWORK:` section of the manifest file, often referred to as the "Online White List." Resources listed here can include files that don't make sense to be included offline.

When offline, the resources in the `NETWORK:` section throw an error that can be safely ignored.

Here we add a basic hit counter to the page. When online, when the page loads pings the server, telling it that there has been a new "hit". The server responds with the hit count. When online, this never happens as the script file handling this is in the `NETWORK:` section of the manifest.

##V06
[View diffs](https://github.com/mnitchie/OfflineDemo1/compare/V05...V06)  
[View demo](http://d1v6.mikenitchie.com)

The `FALLBACK:` section lists pairs of URIs defining substitutions for resources that were not cached (either files that are listed in the `NETWORK` section or those that encountered an error). The first in the pair is a URL pattern, the second is a resource to use if the resource located at the URL can't be found.

Here we add an image to the page, and use the `FALLBACK` section to define a file that should be used in its place when offline.

##V07
[View diffs](https://github.com/mnitchie/OfflineDemo1/compare/V06...V07)  
[View demo](http://d1v7.mikenitchie.com)

The cache manifest need not be a static file; it can be generated dynamically. This is useful for applications with an arbitrary number of urls and that can be added or removed over time.

Here we added a button that can generate new pages. The pages are rendered using [Handlebars](http://handlebarsjs.com/). When a new page is created it is added to the cache manifest. The next time the page is reloaded, those pages will be cached.

##V08
[View diffs](https://github.com/mnitchie/OfflineDemo1/compare/V07...V08)  
[View demo](http://d1v8.mikenitchie.com)

The previous version has a problem. The newly generated pages aren't available for offline use until the user reloads the page... twice. If a new page is created, then the user goes offline and attempts to access the page, they will get an error.

To get around this, we use the applicationCache APIs. Upon successful page create, `applicationCache.update()` can be called. It will check if the cache manifest has changed and download all new versions of the resources if it has.

We're still not ready, though. The application is still running off of the old version of the cache. To start using the new version, call `applicationCache.swapCache()`. We trigger this when the applicationCache fires an 'updateready' event.

##V09
[View diffs](https://github.com/mnitchie/OfflineDemo1/compare/V08...V09)  
[View demo](http://d1v9.mikenitchie.com)

Explicitly caching resources can be cumbersome for a number of reasons. Alternatively, we can do a "passive" cache. In a passive cache, a resource isn't cached until it is visited by the user.

When passively caching, have every page point to the same cache manifest file. Any html resource that points to a cache manifest file will be cached (it need not be listed explicitly in the manifest file, but it is recommended to do so). In that manifest file, define the `FALLBACK` section so that, if a file matching a similar pattern is not found, another page can be shown in its place.

In our case, we had already set `/pages/ /error` in the `FALLBACK` section, so all we need to do is have the generated pages point to the manifest file.
