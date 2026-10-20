# Design system

<!-- impeccable:design-schema 1 -->

The terminal. One world: a blue screen you boot and then talk to.

## Principles

1. The screen is the interface. Navigation is a command list, not a menu of cards.
2. The text is the design. Type carries the hierarchy; there are no images on the surface.
3. Nothing decorative that is not also functional: the scanlines and the vignette are the only
   atmosphere, and they never cost a request or a frame.
4. The machine is honest. If JavaScript does not run, the terminal is still a terminal with all its
   text and all its links.

## Tokens

Defined in `src/styles/global.css` under `@theme`, consumed as Tailwind utilities.

| Token             | Value     | Role                                           |
| :---------------- | :-------- | :--------------------------------------------- |
| `ground`          | `#070a12` | the page, dark blue-black                      |
| `panel`           | `#0b1018` | the terminal window body, 40% over ground      |
| `edge`            | `#1b2333` | hairlines, window frame, row separators        |
| `phosphor`        | `#c7d5f2` | body text, 12.6:1 on ground                    |
| `phosphor-bright` | `#e9f0ff` | headings, the monogram, 16.4:1 on ground       |
| `phosphor-dim`    | `#6d809f` | chrome, hints, secondary text, 5.1:1 on ground |
| `accent`          | `#4d9dff` | the brand blue: links, commands, bar, focus    |
| `signal`          | `#ff6b6b` | reserved for errors, currently unused          |

Dark only, on purpose: the brand is blue and the terminal has one screen.

Type: `Geist Mono` for the terminal body and every command, `Geist Pixel` for the monogram and the
loader heading. Both are self-hosted latin subsets from Fontsource. No other family ships.

Radius: none, anywhere. Shadow: none, anywhere. Gradient: none, anywhere. The only colour that
moves is the blue, and it moves between three roles, never as decoration.

## Structure

- `src/layouts/TerminalLayout.astro` — the html shell, the CRT overlays, the top bar with the pixel
  monogram and the live clock, and the SEO head.
- `src/components/TerminalFrame.tsx` — the window: square buttons, title `adrian@portfolio:~`.
- `src/components/TerminalLoader.tsx` — the boot overlay: heading, BIOS lines, progress bar.
- `src/components/TerminalContent.tsx` — the identity block. The first line is the `h1`.
- `src/components/CommandList.tsx` — the command rows, each a real link.
- `src/components/TerminalPrompt.tsx` — the prompt, the input and the output region.
- `src/components/useTerminalSequence.ts` — the boot and typewriter timeline.
- `src/components/useTerminalCommands.ts` — command parsing and navigation.

## Motion

One orchestrated sequence, driven by anime.js, and nothing else moves:

1. Loader: BIOS lines fade in with a stagger, the progress bar fills over 1.5s.
2. The loader clears at 2.07s.
3. The identity types itself, 16ms per character, line by line.
4. The prompt appears, the input takes focus on pointer devices when nothing else holds it.

`prefers-reduced-motion` skips the whole thing: the loader is removed and the terminal is
immediately usable. Without JavaScript the loader clears itself through CSS at 3s and the text is
already in the HTML.

## Rules

- Styling goes through Tailwind utilities. A `<style>` block or a CSS rule in `global.css` needs a
  reason: the CRT material (scanlines, vignette, loader fallback) is the only one.
- The text lives in the HTML. The typewriter only reveals what is already there.
- Every command is a real anchor with a real `href`. A command that opens a new tab says so.
- Colour is signal: the blue marks the interactive, the dim blue marks chrome, the bright marks the
  name and the focus.
- No glyph outside the Geist subsets. Arrows are `->`, not `→`.
