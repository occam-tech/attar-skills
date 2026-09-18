---
name: attar-demo
description: "Build ambitious native applications with Attar while avoiding unsupported code. Use for Attar apps, demos, prototypes and showcases: establish the installed SDK boundary, prove uncertain dependencies early, and build complete user flows with React, static CSS and supported native capabilities."
metadata:
  author: occam-tech
  version: "1.2.0"
  homepage: https://attar.dev
---

# Build applications with Attar

Preserve the user's product ambition. Prevent unsupported constructs from becoming
architectural dependencies. Do not reduce an application to a toy because its
runtime has a closed API surface. Rich layouts, multiple in-window views, complex
state, reusable components and substantial domain logic can compose from a small
set of supported primitives.

Attar compiles TypeScript and TSX ahead of time and links them with Blink for
layout and paint. The standalone app does not ship Node or Electron. An npm
package's browser support does not establish Attar support.

The installed skill name remains `attar-demo`; its workflow applies to complete
applications as well as demos. There is no line-count, component-count or
single-screen limit imposed by this skill.

## Install the CLI and establish the build target

On Apple silicon with macOS 15 or newer, install
[Homebrew](https://brew.sh/) if it is missing. Install Apple's Command Line Tools
with `xcode-select --install` if `xcode-select -p` does not find them. Then:

```sh
brew install occam-tech/attar/attar
attar --version
attar doctor --json
```

The formula installs the CLI, compiler, SDK and its Python dependency. A generated
TSX starter needs no separate React, Node or Rust installation. Extra application
dependencies or native extensions can need additional build tools; document those
separately. For an existing Homebrew installation, use `brew update` followed by
`brew upgrade occam-tech/attar/attar`, then check the resulting version and doctor.

For a manual installation or Linux, follow the platform-specific
[release instructions](https://attar.dev/release). Do not apply the macOS commands
or its verification claim to Linux. Do not build the compiler or Chromium merely
to start an application.

Use `attar build --help` for the installed command surface.

Record the exact version and platform before choosing dependencies. This skill's
macOS baseline is `0.1.0-dev.7620.g57143d8614b3`, checked on 2026-09-18:
[public SDK release](https://github.com/occam-tech/attar-releases/releases/tag/v0.1.0-dev.7620.g57143d8614b3).
Its extracted SDK passed doctor, TSX and JS starter builds, signature checks and
packaged initial-tree startup. These checks do not prove every UI interaction.

That baseline needs Apple silicon, macOS 15 or newer and Xcode Command Line
Tools. The builder selects a compatible Apple SDK; an
`ATTAR_UI_MACOS_SDK_REJECT` line followed by a successful selection is normal.
Linux packages have their own release and verification scope. Do not apply the
macOS evidence to Linux or assume both package managers install the same version.

Use the [release guide](https://attar.dev/release) and
[compatibility guide](https://attar.dev/features) as discovery aids. Resolve any
conflict against the installed version, its diagnostics and a focused check.
If doctor fails, follow its documented remediation, then rerun it. Do not patch
installed toolchain files, bypass integrity checks or continue a dependent build
with a broken SDK. Continue independent design or source work where useful.

## Required UI framework and versions

For this skill's TSX applications, use **React with Attar's supplied renderer**.
Do not substitute Vue, Angular, Svelte, Preact, a browser ReactDOM renderer, or an
Electron/Next.js runtime. Such a change needs a separately implemented and
verified integration; it is not an ordinary application dependency choice.
The generated plain-JavaScript template is a separate supported entry route,
not evidence that another UI framework is integrated.

The `7620` release fixes these versions and bindings:

| Component | Required version or route |
|---|---|
| React | `19.3.0`, supplied through the SDK's React adapter. |
| React reconciler | `0.34.0`, supplied by the SDK; do not install a replacement renderer. |
| `react-dom` and `react-dom/client` imports | Both resolve to the SDK's `runtime/ui/attar-host/react-dom.js`. If an application package needs a `react-dom` peer dependency, pin `19.3.0`; this does not supply the browser renderer. |
| JSX runtime | The SDK's `react/jsx-runtime` alias; retain the generated build pipeline. |
| Styles | Static local CSS. Tailwind is optional and must be compiled to CSS before the Attar build. |

If an application declares React dependencies, use exact versions, without `^`,
`~` or `latest`, and commit its lockfile. Do not upgrade React or reconciler
independently of the SDK. A successful npm install cannot establish renderer
compatibility. For a newer SDK, inspect its shipped
`runtime/ui/react-host/package.json` and `runtime/ui/build/bundle.cjs` first;
record that release's exact pair and aliases before adapting these rules.

Component libraries are optional, not alternative renderers. The release's
Panels example pins `radix-ui` to `1.6.7`, and its CSS toolchain pins
`tailwindcss` and `@tailwindcss/cli` to `4.3.3`. Reuse matching fixtures when using
those integrations. This does not certify all Radix components or require
Tailwind for an application. Pin and probe any other component-library version
before depending on it.

## Preserve ambition; resolve risk before expansion

Sketch the requested user flows and the capabilities each needs. Pay particular
attention to data access, persistence, native integration, third-party components
and runtime code or style generation. Classify each dependency:

| Evidence for this target | What to do |
|---|---|
| Supported path with a matching example or test | Reuse that path and compose it into the application. |
| Explicitly refused construct | Use a supported equivalent that preserves the required behavior; otherwise identify the missing capability. |
| Unknown API, package, option or version | Inspect its imports and required APIs, then prove the smallest real usage before depending on it. Unknown does not mean forbidden. |

For an uncertain dependency, make a small isolated probe with the exact package
version, imports, CSS and interaction the application needs. Build it with the
installed SDK and exercise the relevant behavior. A successful import or startup
alone does not prove focus, scrolling, callbacks or teardown. Batch related probes
where that reduces linking time without hiding which capability failed.

A failed optional dependency does not invalidate the product. Prefer another
verified library, static CSS, or components composed from supported React and DOM
primitives. Preserve required semantics and visual quality. Do not silently
replace persistence with memory, live data with fixtures, or a real action with a
no-op. If a required capability has no verified route, state that exact blocker
and the viable tradeoff; continue independent parts of the requested application.

For an essential OS or data capability, consult the documented
[native integration route](https://attar.dev/native). A native extension is a
separate integration task to prove, not permission to invent a JavaScript API,
add Node to the runtime or bypass an SDK boundary.

## Start with the generated project

```sh
attar init my-app --template tsx
cd my-app
attar build
```

Build the generated starter once to establish a working installation. Keep its
mounting convention and configuration, then implement an end-to-end user flow.
Add the remaining flows incrementally, checking each new runtime dependency
before expanding it. Reuse successful checks for unchanged inputs; build time
is a reason to group coherent changes, not to defer all integration until the end.

The baseline standalone configuration is:

```toml
[project]
name = "my-app"
display_name = "My App"

[application]
id = "dev.attar.my-app"

[ui]
entry = "src/app.tsx"
```

On this baseline `[ui]` accepts `entry`, `stylesheets`, `resources` and `fonts`.
Do not invent configuration keys. Standalone window sizing is not exposed by
this recipe; an Electron `[viewport]` example does not configure it. Design the
layout to adapt to the available viewport rather than depend on an invented key.

The generated entry imports React, `render` from `react-dom`, and a static CSS
file, then calls `render(<App />, document.getElementById('app'))`. Keep that
known working mount unless another entry route has been verified for the target.
Use ordinary source modules to organize features. Multiple views can switch
through React state; a history-based router needs its own API check. Multiple
native windows are outside this standalone recipe.

## Build from the supported UI surface

Use these as starting points, not an exhaustive list or a promise that every
option and combination is covered:

- React state, effects, refs, keyed lists and controlled inputs. Keep the
  required SDK framework versions above. Check the exact control and interaction;
  support for one input does not establish every native control's behavior.
- Semantic HTML for forms, navigation, tables, panels and text; inline SVG and
  bundled images for graphics.
- Static CSS imported from the entry or listed in `[ui].stylesheets`. Blink owns
  cascade, layout and paint. Use flexbox, grid, custom properties, media queries,
  pseudo-classes and transitions. Precompile Tailwind to a local CSS file.
- `className` and supported individual properties in the React `style` object
  for state-dependent presentation. Dynamic values do not require runtime
  stylesheet generation.
- DOM refs, selectors, geometry, focus, element scrolling and event handlers.
  Timers, animation frames, MutationObserver, ResizeObserver, IntersectionObserver,
  matchMedia and AbortController have implemented paths. Probe the exact options
  and lifecycle of any unfamiliar use; this is not complete browser parity.

The SDK seal used by the macOS baseline passed 30 packaged shadcn component
scenarios: accordion, alert, alert-dialog, aspect-ratio, badge, button, card,
checkbox, collapsible, dialog, dropdown-menu, hover-card, input, label, menubar,
navigation-menu, popover, progress, radio-group, scroll-area, select, separator,
skeleton, slider, switch, table, tabs, textarea, toggle and tooltip.

Those results cover pinned `new-york-v4` fixtures, not every variant, keyboard
path, visual state or package upgrade. In a product checkout, use
`testing/shadcn/native-probes/suite.json`, its behavior files and registry sources
for exact cases and dependencies. `examples/standalone-panels` is an additional
15-component example, not the full supported set. Menus and dialogs are no longer
categorically excluded. Prove the interactions your application actually uses.

## Boundaries that must shape the code

The baseline refuses these paths; choose the supported construction before
writing a feature around them:

| Unsupported path | Supported direction or next step |
|---|---|
| Runtime HTML parsing through `innerHTML` or `dangerouslySetInnerHTML` | Construct React elements or a compiled node tree; `ATTAR_UI_INNER_HTML_UNSUPPORTED` is not an invitation to bypass parsing restrictions. |
| `style.cssText`, runtime stylesheet insertion or rule generation | Static CSS plus classes and supported individual style properties; `ATTAR_UI_CSS_TEXT_FORBIDDEN`. |
| Runtime CSS-in-JS such as style injection by emotion or styled-components | Extract styles at build time or use static CSS. Prove any extraction integration. |
| Remote/dynamic CSS imports or `.module.css` | Local static CSS imports; CSS Modules are not implemented in this recipe. |
| `eval`, `new Function`, arbitrary runtime code loading | A statically resolvable module graph; prebundle dependencies. |
| Runtime `node:*` imports or Node/Electron globals in the standalone UI | Pure application logic or a documented, verified native integration. Build tools may use Node. |
| `Blob`, desktop file drops, `window.scroll` | These have named unsupported diagnostics. Use an admitted asset, file integration or element-scroll path only when it satisfies the same need. |

Check specific API options as well as API names. These additional refusals are
explicit in the shipped `7620` JavaScript adapters:

| Released source, relative to the installed SDK | Explicit restriction |
|---|---|
| `runtime/ui/attar-host/cssom.js` | `style.setProperty` with a nonempty priority is refused (`ATTAR_UI_STYLE_PRIORITY_UNSUPPORTED`). Put `!important`, if needed, in static CSS. |
| `runtime/ui/attar-host/runtime-prelude.js` | `getComputedStyle(element, pseudo)` refuses a nonempty pseudo selector (`ATTAR_UI_PSEUDO_STYLE_UNSUPPORTED`). |
| `runtime/ui/attar-host/intersection-observer.js` | Document roots and the supplied options `delay`, `scrollMargin`, `trackVisibility` are refused, even if an option is `0` or `false`. Use supported element/null roots, `rootMargin` and thresholds. |
| `runtime/ui/attar-host/scroll-support.js` | Window scroll methods/offsets and the host root's element-scroll access are refused. Use a real scrollable element. This does not prohibit native wheel scrolling. |
| `runtime/ui/attar-host/web-globals.js` | Constructing the fallback `Blob` throws `ATTAR_WEB_API_UNSUPPORTED`; its presence as a function is not support. |
| `runtime/ui/build/bundle.cjs` | Dynamic CSS imports, `.module.css`, external stylesheets and unresolved external JavaScript edges are refused. The UI graph must close at build time. |
| `tools/attar_cli/standalone.py` | `[ui]` accepts only the four keys listed above. There is no `nativeLib` key; use a documented native build recipe. |

Blink's native CSS surface is also bounded. Parsing or bundling a CSS property
does not prove its native implementation is included. In this release,
`accent-color` reaches `ATTAR_LONGHAND_OUTSIDE_CLOSURE` during native execution;
avoid it and verify custom control styling in the packaged app. Probe unfamiliar
properties before applying them across the application. For inline SVG, use
literal attribute names such as `stroke-width`, `font-size` and `text-anchor`
when the adapter does not normalize the React camel-case spelling; verify the
rendered result rather than assuming browser ReactDOM parity.

Do not assume a browser service exists because Blink renders the UI. Networking
(`fetch`, XMLHttpRequest, WebSocket), persistent browser storage, canvas contexts,
media playback, embedded frames, workers, clipboard and device APIs are not
established by this standalone baseline. Before designing a feature around one,
find a documented route for the exact target and prove it. A JS polyfill does not
supply a missing OS service, native renderer or execution capability.

Treat the tables as confirmed release boundaries, and the service list above as
capabilities requiring evidence. Do not invent additional bans from an absent
example. Inspect the installed adapter, configuration validator and native
diagnostic for each proposed restriction. Record the SDK version and reproducer
when a new restriction is discovered; do not generalize it to other releases.

Keep required assets local and statically discoverable. Use the documented
resource and font configuration; do not hard-code development-machine paths.
Do not change a third-party component's behavior merely to conceal a missing
runtime primitive. A mock is appropriate only when the requested outcome
explicitly calls for one.

## Read failures and keep moving

Read the first actionable diagnostic and its source location or stage. Later
errors may be consequences. Keep the complete log for a failed build.

- `ATTAR_UI_CONFIG`: compare the configuration with the generated template and
  CLI help; do not guess another key.
- `ATTAR025_LOCK`: inspect the intended SDK/dependency change, then use
  `attar build --update-lock` when that change is deliberate. Do not delete the
  lock as a generic repair.
- `ATTAR_UI_DISTRIBUTION_FILE`: verify the installation and repair through the
  supported installer; do not edit signed or hashed payload files.
- A source/type/bundle error: correct the actual input or unsupported dependency.
- A crash, unsupported native operation or failed interaction: retain the
  reproducer and narrow the failing path. A successful link does not clear it.

Do not hide exceptions, disable guards or weaken checks to obtain a green result.
There is no blanket ban on iteration, application size, business logic or
component composition. Keep the user's full requested outcome as the target.

## Verify the delivered application

Use the output path printed by `ATTAR_BUILD_PASS`. For a macOS build of the
example project above, the initial-tree check is:

```sh
target/attar/aarch64-apple-darwin/release/my-app.app/Contents/MacOS/attar-app --attar-check-startup
```

Require exit zero and `ATTAR_UI_STARTUP_CHECK_PASS`. This checks the packaged
initial UI graph; it does not create a window or prove native input and paint.
Then test the actual package through the permitted local interaction channel.
Verify the advertised flows, relevant empty/error states, scrolling, focus and
keyboard behavior, and clean shutdown. If window interaction is unavailable,
report that limit and arrange the missing check rather than claiming completion.

`attar package` can prepare a distributable artifact after the app works.
Ad hoc signing is not evidence of notarization or clean-machine acceptance.
Report the exact SDK version, artifact path, what was built and what was actually
exercised. Give measured size or timing only when useful; never inherit them
from another application.

## Optional starting probe

The installed skill includes `assets/app.tsx` and `assets/app.css`. They exercise
state, a controlled input, a keyed list, table, geometry, a timer, inline style and
SVG. Copy them into a generated project when that probe is useful. They are not
the required design, architecture or size of the user's application.

Install the complete skill to obtain those files:
`npx skills add occam-tech/attar-skills`. Reading only the raw Markdown on the
website does not install its assets; the generated CLI starter also works without
them.
