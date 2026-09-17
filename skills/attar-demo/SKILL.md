---
name: attar-demo
description: Build a demo application with the Attar compiler that works on the first attempt. Covers the project shape, the exact build and run loop, the UI surface Attar accepts, the constructs it refuses with named errors, and how to verify the result. Use when asked for an Attar demo, sample, example or showcase app.
metadata:
  author: occam-tech
  version: "1.0.0"
  homepage: https://attar.dev
---

# Attar demo

Attar compiles TypeScript and TSX ahead of time and links it with a carved
Blink engine into one native macOS application. No Electron, no Node at run
time, one process.

A demo fails on the first attempt for one reason: the author writes ordinary
web code that this closed world refuses. Read the two lists below before
writing a line. Everything in "Accepted" was built and launched on the current
release; everything in "Refused" fails with the named diagnostic.

## Before you write code

```sh
attar --version     # expect 0.1.0-dev.NNNN.gHASH
attar doctor        # every check must say PASS
```

`attar doctor` failing is not your problem to work around. Report it and stop.
Never restore files by hand to make it pass; that hides a broken install.

Requirements: Apple silicon, macOS 15 or newer, Xcode Command Line Tools.
The toolchain picks a compatible Apple SDK itself and prints
`ATTAR_UI_MACOS_SDK_REJECT` for each one it skips. That line is normal.

## Project shape

```
my-demo/
  attar.toml
  src/app.tsx        entry
  src/app.css        ordinary static CSS
  src/assets/…       images the entry imports
```

`attar.toml` for a standalone app:

```toml
[project]
name = "my-demo"
display_name = "My Demo"

[application]
id = "dev.attar.my-demo"

[ui]
entry = "src/app.tsx"
```

`[ui]` accepts exactly `entry`, `stylesheets`, `resources`, `fonts`. Any other
key fails with `ATTAR_UI_CONFIG`. Do not invent keys. `[viewport]` belongs to
the Electron host and is ignored here: **the standalone window size is not
configurable today**, the window opens at the default size.

The entry mounts React once:

```tsx
import React from 'react';
import { render } from 'react-dom';
import './app.css';

function App() { … }

render(<App />, document.getElementById('app'));
```

`document.getElementById('app')` is the container the host provides. Use
`render`, not `createRoot`.

## The loop

```sh
attar init my-demo --template tsx     # templates: tsx, js
cd my-demo
# edit src/app.tsx and src/app.css
attar build                            # about 5 minutes, ends with ATTAR_BUILD_PASS
open target/attar/aarch64-apple-darwin/release/my-demo.app
attar package                          # optional, makes a DMG
```

The build is slow because it links the engine. Budget one build, not ten. Write
the whole demo, then build. If you need to iterate, keep the app small.

## Accepted

Verified by building and launching on the current release.

- **React 19** with `useState`, `useEffect`, `useRef`. The pinned pair is
  `react` and `react-dom` 19.3.0.
- **Ordinary semantic HTML**: `main`, `section`, `header`, `footer`, `h1`–`h6`,
  `p`, `div`, `span`, `a`, `ul`, `li`, `label`, `button`, `input`, `textarea`,
  `select`, `progress`, `table` with `thead`, `tbody`, `tr`, `th`, `td`,
  formatting elements, fieldsets and forms.
- **Static CSS in files**, imported from the entry (`import './app.css'`) or
  listed in `[ui].stylesheets`. Blink parses it once and owns cascade, layout
  and paint. Flexbox, grid, transitions, custom properties, media queries,
  pseudo-classes all belong to Blink, not to Attar.
- **The React `style` prop** with a plain object, when the selected SDK
  supports it. The current release does.
- **`className`** and class-based styling. Tailwind works if you commit the
  compiled CSS file; the Tailwind CLI is a build tool, not a runtime.
- **Controlled inputs**: `value` with `onChange`, checkboxes with `checked`.
- **Lists** with `key`.
- **Refs** and `getBoundingClientRect`, `clientWidth`, `scrollHeight`,
  `focus`, `scrollIntoView`, `getElementsByTagName`.
- **Timers**: `setTimeout`, `setInterval`, `requestAnimationFrame`.
- **Events**: click, input, change, focus, blur, key, mouse, wheel, scroll,
  drag and drop between elements, context menu.
- **Inline SVG** and SVG files imported as assets.
- **shadcn/ui components** from the pinned Radix set. The repository example
  `examples/standalone-panels` ships fifteen unchanged components; use it as the
  reference for anything component-heavy. Menus, dialogs, tooltips and
  navigation are not among them and are known to fail.
- **Browser APIs that exist**: `getComputedStyle`, `querySelector` and
  `querySelectorAll`, `classList`, `dataset`, `matchMedia`, `MutationObserver`,
  `IntersectionObserver`, `ResizeObserver`, `TreeWalker`, `AbortController`,
  `document.createElement` and friends, pointer capture.

## Refused

Each of these ends the build or the commit with a named error. They are design
boundaries, not bugs, so do not work around them.

| Construct | Diagnostic |
|---|---|
| `dangerouslySetInnerHTML`, `innerHTML` | `ATTAR_UI_INNER_HTML_UNSUPPORTED` |
| `style.cssText`, stylesheet injection, rule generation | `ATTAR_UI_CSS_TEXT_FORBIDDEN` |
| CSS-in-JS: styled-components, emotion, tagged template styles | build error |
| `eval`, `new Function`, runtime code loading, computed `import` | build error with a source location |
| `Blob` | `ATTAR_WEB_API_UNSUPPORTED` |
| file drops from the desktop | `ATTAR_UI_FILE_DROP_UNSUPPORTED` |
| `window.scroll` | `ATTAR_UI_WINDOW_SCROLL_UNSUPPORTED` |

Not present at all in a standalone app, so do not design around them:
`fetch`, `XMLHttpRequest`, `WebSocket`, `localStorage`, `sessionStorage`,
`IndexedDB`, `canvas.getContext`, `<audio>`, `<video>`, `<iframe>`, workers,
service workers, `Notification`, clipboard APIs, geolocation, and every device
API. A demo that needs data must carry it in the bundle or compute it.

Anything not on either list: treat it as refused and pick another way. Guessing
costs a five minute build.

## Reading a failure

Every diagnostic starts with `ATTAR_`. Read the first one, not the last: later
lines are consequences.

- `ATTAR_UI_BUILD_FAILED stage=…` names the stage that failed.
- `ATTAR_UI_DISTRIBUTION_FILE` means the installed toolchain is damaged. Stop
  and report; do not repair it by hand.
- `ATTAR_UI_CONFIG` means `attar.toml` has a key that does not exist.
- A TypeScript error is an ordinary type error; fix the source.

## Rules

- One window, one screen, no navigation. There is no router and no second
  window.
- Keep the demo under roughly two hundred lines of TSX. The point is to show the
  compiler, not a product.
- Ship every asset inside the project. Nothing is fetched at run time.
- Do not weaken, skip or work around a check to make something pass.
- Do not report success from a build alone. Launch the app, confirm the window
  opens and the interaction works, then report.
- Quote real numbers only: the app size from `du`, the build time you measured.
  Never carry numbers over from another build.

## Starting point

`assets/app.tsx` and `assets/app.css` in this skill are a complete demo that
was built and launched on the current release. It covers state, a controlled
input, a list with keys, a table, a ref with geometry, a timer, the `style`
prop and inline SVG. Copy them into a fresh `attar init` project and change
them; that is the fastest safe path to a working first build.

## Done means

- `attar doctor` passes.
- `attar build` ends with `ATTAR_BUILD_PASS`.
- The `.app` opens, shows the demo, and reacts to the interaction it advertises.
- You report the app size, the build time and what you verified by looking at
  the window, each measured in this run.
