# Attar skills

Agent skills for [Attar](https://attar.dev), a compiler that turns a TypeScript
user interface into one native desktop binary: Blink stays for layout and paint,
V8, Node and Electron do not ship.

```sh
npx skills add occam-tech/attar-skills
```

## Skills

| Skill | What it does |
| --- | --- |
| [`attar-demo`](skills/attar-demo/SKILL.md) | Build a demo application with Attar that works on the first attempt: the project shape, the build and run loop, the UI surface Attar accepts, the constructs it refuses with their named errors, and a verified starting point. |

Attar itself installs with Homebrew on Apple silicon and with apt on Ubuntu and
Debian; the commands are on [attar.dev](https://attar.dev).
