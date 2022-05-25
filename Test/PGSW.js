!(function () {
    "use strict";
    function e(e, t, s, n) {
        return new (s || (s = Promise))(function (r, a) {
            function i(e) {
                try {
                    c(n.next(e));
                } catch (e) {
                    a(e);
                }
            }
            function o(e) {
                try {
                    c(n.throw(e));
                } catch (e) {
                    a(e);
                }
            }
            function c(e) {
                var t;
                e.done
                    ? r(e.value)
                    : ((t = e.value),
                        t instanceof s
                            ? t
                            : new s(function (e) {
                                e(t);
                            })).then(i, o);
            }
            c((n = n.apply(e, t || [])).next());
        });
    }
    try {
        self["workbox:core:6.5.1"] && _();
    } catch (e) {}
    class t extends Error {
        constructor(e, t) {
            super(
                ((e, ...t) => {
                    let s = e;
                    return t.length > 0 && (s += ` :: ${JSON.stringify(t)}`), s;
                })(e, t)
            ),
                (this.name = e),
                (this.details = t);
        }
    }
    const s = new Set();
    try {
        self["workbox:routing:6.5.1"] && _();
    } catch (e) {}
    const n = (e) => (e && "object" == typeof e ? e : { handle: e });
    class r {
        constructor(e, t, s = "GET") {
            (this.handler = n(t)), (this.match = e), (this.method = s);
        }
        setCatchHandler(e) {
            this.catchHandler = n(e);
        }
    }
    class a extends r {
        constructor(e, t, s) {
            super(
                ({ url: t }) => {
                    const s = e.exec(t.href);
                    if (s && (t.origin === location.origin || 0 === s.index))
                        return s.slice(1);
                },
                t,
                s
            );
        }
    }
    class i {
        constructor() {
            (this._routes = new Map()), (this._defaultHandlerMap = new Map());
        }
        get routes() {
            return this._routes;
        }
        addFetchListener() {
            self.addEventListener("fetch", (e) => {
                const { request: t } = e,
                    s = this.handleRequest({ request: t, event: e });
                s && e.respondWith(s);
            });
        }
        addCacheListener() {
            self.addEventListener("message", (e) => {
                if (e.data && "CACHE_URLS" === e.data.type) {
                    const { payload: t } = e.data,
                        s = Promise.all(
                            t.urlsToCache.map((t) => {
                                "string" == typeof t && (t = [t]);
                                const s = new Request(...t);
                                return this.handleRequest({ request: s, event: e });
                            })
                        );
                    e.waitUntil(s),
                    e.ports && e.ports[0] && s.then(() => e.ports[0].postMessage(!0));
                }
            });
        }
        handleRequest({ request: e, event: t }) {
            const s = new URL(e.url, location.href);
            if (!s.protocol.startsWith("http")) return;
            const n = s.origin === location.origin,
                { params: r, route: a } = this.findMatchingRoute({
                    event: t,
                    request: e,
                    sameOrigin: n,
                    url: s
                });
            let i = a && a.handler;
            const o = e.method;
            if (
                (!i &&
                this._defaultHandlerMap.has(o) &&
                (i = this._defaultHandlerMap.get(o)),
                    !i)
            )
                return;
            let c;
            try {
                c = i.handle({ url: s, request: e, event: t, params: r });
            } catch (e) {
                c = Promise.reject(e);
            }
            const h = a && a.catchHandler;
            return (
                c instanceof Promise &&
                (this._catchHandler || h) &&
                (c = c.catch(async (n) => {
                    if (h)
                        try {
                            return await h.handle({
                                url: s,
                                request: e,
                                event: t,
                                params: r
                            });
                        } catch (e) {
                            e instanceof Error && (n = e);
                        }
                    if (this._catchHandler)
                        return this._catchHandler.handle({
                            url: s,
                            request: e,
                            event: t
                        });
                    throw n;
                })),
                    c
            );
        }
        findMatchingRoute({ url: e, sameOrigin: t, request: s, event: n }) {
            const r = this._routes.get(s.method) || [];
            for (const a of r) {
                let r;
                const i = a.match({ url: e, sameOrigin: t, request: s, event: n });
                if (i)
                    return (
                        (r = i),
                        ((Array.isArray(r) && 0 === r.length) ||
                            (i.constructor === Object && 0 === Object.keys(i).length) ||
                            "boolean" == typeof i) &&
                        (r = void 0),
                            { route: a, params: r }
                    );
            }
            return {};
        }
        setDefaultHandler(e, t = "GET") {
            this._defaultHandlerMap.set(t, n(e));
        }
        setCatchHandler(e) {
            this._catchHandler = n(e);
        }
        registerRoute(e) {
            this._routes.has(e.method) || this._routes.set(e.method, []),
                this._routes.get(e.method).push(e);
        }
        unregisterRoute(e) {
            if (!this._routes.has(e.method))
                throw new t("unregister-route-but-not-found-with-method", {
                    method: e.method
                });
            const s = this._routes.get(e.method).indexOf(e);
            if (!(s > -1)) throw new t("unregister-route-route-not-registered");
            this._routes.get(e.method).splice(s, 1);
        }
    }
    let o;
    function c(e, s, n) {
        let c;
        if ("string" == typeof e) {
            const t = new URL(e, location.href);
            c = new r(({ url: e }) => e.href === t.href, s, n);
        } else if (e instanceof RegExp) c = new a(e, s, n);
        else if ("function" == typeof e) c = new r(e, s, n);
        else {
            if (!(e instanceof r))
                throw new t("unsupported-route-type", {
                    moduleName: "workbox-routing",
                    funcName: "registerRoute",
                    paramName: "capture"
                });
            c = e;
        }
        return (
            (o || ((o = new i()), o.addFetchListener(), o.addCacheListener()),
                o).registerRoute(c),
                c
        );
    }
    const h = {
            googleAnalytics: "googleAnalytics",
            precache: "precache-v2",
            prefix: "workbox",
            runtime: "runtime",
            suffix: "undefined" != typeof registration ? registration.scope : ""
        },
        l = (e) => {
            return (
                e ||
                ((t = h.runtime),
                    [h.prefix, t, h.suffix].filter((e) => e && e.length > 0).join("-"))
            );
            var t;
        };
    function u(e, t) {
        const s = new URL(e);
        for (const e of t) s.searchParams.delete(e);
        return s.href;
    }
    class d {
        constructor() {
            this.promise = new Promise((e, t) => {
                (this.resolve = e), (this.reject = t);
            });
        }
    }
    try {
        self["workbox:strategies:6.5.1"] && _();
    } catch (e) {}
    function f(e) {
        return "string" == typeof e ? new Request(e) : e;
    }
    class p {
        constructor(e, t) {
            (this._cacheKeys = {}),
                Object.assign(this, t),
                (this.event = t.event),
                (this._strategy = e),
                (this._handlerDeferred = new d()),
                (this._extendLifetimePromises = []),
                (this._plugins = [...e.plugins]),
                (this._pluginStateMap = new Map());
            for (const e of this._plugins) this._pluginStateMap.set(e, {});
            this.event.waitUntil(this._handlerDeferred.promise);
        }
        async fetch(e) {
            const { event: s } = this;
            let n = f(e);
            if (
                "navigate" === n.mode &&
                s instanceof FetchEvent &&
                s.preloadResponse
            ) {
                const e = await s.preloadResponse;
                if (e) return e;
            }
            const r = this.hasCallback("fetchDidFail") ? n.clone() : null;
            try {
                for (const e of this.iterateCallbacks("requestWillFetch"))
                    n = await e({ request: n.clone(), event: s });
            } catch (e) {
                if (e instanceof Error)
                    throw new t("plugin-error-request-will-fetch", {
                        thrownErrorMessage: e.message
                    });
            }
            const a = n.clone();
            try {
                let e;
                e = await fetch(
                    n,
                    "navigate" === n.mode ? void 0 : this._strategy.fetchOptions
                );
                for (const t of this.iterateCallbacks("fetchDidSucceed"))
                    e = await t({ event: s, request: a, response: e });
                return e;
            } catch (e) {
                throw (
                    (r &&
                    (await this.runCallbacks("fetchDidFail", {
                        error: e,
                        event: s,
                        originalRequest: r.clone(),
                        request: a.clone()
                    })),
                        e)
                );
            }
        }
        async fetchAndCachePut(e) {
            const t = await this.fetch(e),
                s = t.clone();
            return this.waitUntil(this.cachePut(e, s)), t;
        }
        async cacheMatch(e) {
            const t = f(e);
            let s;
            const { cacheName: n, matchOptions: r } = this._strategy,
                a = await this.getCacheKey(t, "read"),
                i = Object.assign(Object.assign({}, r), { cacheName: n });
            s = await caches.match(a, i);
            for (const e of this.iterateCallbacks("cachedResponseWillBeUsed"))
                s =
                    (await e({
                        cacheName: n,
                        matchOptions: r,
                        cachedResponse: s,
                        request: a,
                        event: this.event
                    })) || void 0;
            return s;
        }
        async cachePut(e, n) {
            const r = f(e);
            await (0, new Promise((e) => setTimeout(e, 0)));
            const a = await this.getCacheKey(r, "write");
            if (!n)
                throw new t("cache-put-with-no-response", {
                    url:
                        ((i = a.url),
                            new URL(String(i), location.href).href.replace(
                                new RegExp(`^${location.origin}`),
                                ""
                            ))
                });
            var i;
            const o = await this._ensureResponseSafeToCache(n);
            if (!o) return !1;
            const { cacheName: c, matchOptions: h } = this._strategy,
                l = await self.caches.open(c),
                d = this.hasCallback("cacheDidUpdate"),
                p = d
                    ? await (async function (e, t, s, n) {
                        const r = u(t.url, s);
                        if (t.url === r) return e.match(t, n);
                        const a = Object.assign(Object.assign({}, n), {
                                ignoreSearch: !0
                            }),
                            i = await e.keys(t, a);
                        for (const t of i) if (r === u(t.url, s)) return e.match(t, n);
                    })(l, a.clone(), ["__WB_REVISION__"], h)
                    : null;
            try {
                await l.put(a, d ? o.clone() : o);
            } catch (e) {
                if (e instanceof Error)
                    throw (
                        ("QuotaExceededError" === e.name &&
                        (await (async function () {
                            for (const e of s) await e();
                        })()),
                            e)
                    );
            }
            for (const e of this.iterateCallbacks("cacheDidUpdate"))
                await e({
                    cacheName: c,
                    oldResponse: p,
                    newResponse: o.clone(),
                    request: a,
                    event: this.event
                });
            return !0;
        }
        async getCacheKey(e, t) {
            const s = `${e.url} | ${t}`;
            if (!this._cacheKeys[s]) {
                let n = e;
                for (const e of this.iterateCallbacks("cacheKeyWillBeUsed"))
                    n = f(
                        await e({
                            mode: t,
                            request: n,
                            event: this.event,
                            params: this.params
                        })
                    );
                this._cacheKeys[s] = n;
            }
            return this._cacheKeys[s];
        }
        hasCallback(e) {
            for (const t of this._strategy.plugins) if (e in t) return !0;
            return !1;
        }
        async runCallbacks(e, t) {
            for (const s of this.iterateCallbacks(e)) await s(t);
        }
        *iterateCallbacks(e) {
            for (const t of this._strategy.plugins)
                if ("function" == typeof t[e]) {
                    const s = this._pluginStateMap.get(t),
                        n = (n) => {
                            const r = Object.assign(Object.assign({}, n), { state: s });
                            return t[e](r);
                        };
                    yield n;
                }
        }
        waitUntil(e) {
            return this._extendLifetimePromises.push(e), e;
        }
        async doneWaiting() {
            let e;
            for (; (e = this._extendLifetimePromises.shift()); ) await e;
        }
        destroy() {
            this._handlerDeferred.resolve(null);
        }
        async _ensureResponseSafeToCache(e) {
            let t = e,
                s = !1;
            for (const e of this.iterateCallbacks("cacheWillUpdate"))
                if (
                    ((t =
                        (await e({
                            request: this.request,
                            response: t,
                            event: this.event
                        })) || void 0),
                        (s = !0),
                        !t)
                )
                    break;
            return s || (t && 200 !== t.status && (t = void 0)), t;
        }
    }
    class w extends class {
        constructor(e = {}) {
            (this.cacheName = l(e.cacheName)),
                (this.plugins = e.plugins || []),
                (this.fetchOptions = e.fetchOptions),
                (this.matchOptions = e.matchOptions);
        }
        handle(e) {
            const [t] = this.handleAll(e);
            return t;
        }
        handleAll(e) {
            e instanceof FetchEvent && (e = { event: e, request: e.request });
            const t = e.event,
                s = "string" == typeof e.request ? new Request(e.request) : e.request,
                n = "params" in e ? e.params : void 0,
                r = new p(this, { event: t, request: s, params: n }),
                a = this._getResponse(r, s, t);
            return [a, this._awaitComplete(a, r, s, t)];
        }
        async _getResponse(e, s, n) {
            let r;
            await e.runCallbacks("handlerWillStart", { event: n, request: s });
            try {
                if (((r = await this._handle(s, e)), !r || "error" === r.type))
                    throw new t("no-response", { url: s.url });
            } catch (t) {
                if (t instanceof Error)
                    for (const a of e.iterateCallbacks("handlerDidError"))
                        if (((r = await a({ error: t, event: n, request: s })), r)) break;
                if (!r) throw t;
            }
            for (const t of e.iterateCallbacks("handlerWillRespond"))
                r = await t({ event: n, request: s, response: r });
            return r;
        }
        async _awaitComplete(e, t, s, n) {
            let r, a;
            try {
                r = await e;
            } catch (a) {}
            try {
                await t.runCallbacks("handlerDidRespond", {
                    event: n,
                    request: s,
                    response: r
                }),
                    await t.doneWaiting();
            } catch (e) {
                e instanceof Error && (a = e);
            }
            if (
                (await t.runCallbacks("handlerDidComplete", {
                    event: n,
                    request: s,
                    response: r,
                    error: a
                }),
                    t.destroy(),
                    a)
            )
                throw a;
        }
    } {
        async _handle(e, s) {
            let n,
                r = await s.cacheMatch(e);
            if (!r)
                try {
                    r = await s.fetchAndCachePut(e);
                } catch (e) {
                    e instanceof Error && (n = e);
                }
            if (!r) throw new t("no-response", { url: e.url, error: n });
            return r;
        }
    }
    let g;
    const m = new (class {
            constructor() {
                this.cacheKeyWillBeUsed = ({ request: t }) =>
                    e(this, void 0, void 0, function* () {
                        const e = t.url,
                            s = e.indexOf("?");
                        return -1 === s ? t : e.substring(0, s);
                    });
            }
        })(),
        y = new (class {
            constructor(t) {
                (this.cachedResponseWillBeUsed = ({ cachedResponse: t }) =>
                    e(this, void 0, void 0, function* () {
                        return t && this._isResponseDateFresh(t) ? t : null;
                    })),
                    (this.fetchDidSucceed = ({ response: t }) =>
                        e(this, void 0, void 0, function* () {
                            return "basic" !== t.type && "cors" !== t.type
                                ? t
                                : (function (t, s, n) {
                                    return e(this, void 0, void 0, function* () {
                                        "function" == typeof s && ((n = s), (s = !0));
                                        const e = s ? t.clone() : t,
                                            r = {
                                                headers: new Headers(e.headers),
                                                status: e.status,
                                                statusText: e.statusText
                                            },
                                            a = n ? n(r) : r,
                                            i = (function () {
                                                if (void 0 === g) {
                                                    const e = new Response("");
                                                    if ("body" in e)
                                                        try {
                                                            new Response(e.body), (g = !0);
                                                        } catch (e) {
                                                            g = !1;
                                                        }
                                                    g = !1;
                                                }
                                                return g;
                                            })()
                                                ? e.body
                                                : yield e.blob();
                                        return new Response(i, a);
                                    });
                                })(
                                    t,
                                    !1,
                                    (e) => (e.headers.set("date", new Date().toUTCString()), e)
                                );
                        })),
                    (this._maxAgeSeconds = t);
            }
            _isResponseDateFresh(e) {
                if (!this._maxAgeSeconds) return !1;
                const t = this._getDateHeaderTimestamp(e);
                return null !== t && t >= Date.now() - 1e3 * this._maxAgeSeconds;
            }
            _getDateHeaderTimestamp(e) {
                if (!e.headers.has("date")) return null;
                const t = e.headers.get("date"),
                    s = new Date(t).getTime();
                return isNaN(s) ? null : s;
            }
        })(900),
        v = /\/index(?:\.[a-z0-9]{3})?\.(?:html|json|js|jsonc)$/,
        b = /\/[A-Za-z0-9._~@-]+\.[a-f0-9]{5}\.[a-z0-9]{2,6}$/,
        R = "General";
    var q;
    c(
        ({ url: e }) => (null != e ? v.test(e.pathname) : void 0),
        new w({ cacheName: "Entry", plugins: [m, y] })
    ),
        c(
            ({ url: e }) => (null != e ? b.test(e.pathname) : void 0),
            new w({ cacheName: R, plugins: [m] })
        ),
        (q = () =>
            e(void 0, void 0, void 0, function* () {
                yield caches.delete(R);
            })),
        s.add(q),
        self.addEventListener("activate", (e) => {
            e.waitUntil(
                new Promise((e) => {
                    if (indexedDB) {
                        const t = indexedDB.deleteDatabase("workbox-expiration");
                        (t.onerror = () => {
                            e();
                        }),
                            (t.onsuccess = () => {
                                e();
                            });
                    } else e();
                }).catch(() => {})
            );
        });
})();
