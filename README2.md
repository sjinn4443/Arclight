## Appbar and Page Layout Consistency (June 2025)

### Shared Appbar Pattern

- All main pages now use a **shared appbar** (header with back arrow and page title) injected by the `initPage` function from `public/page-template.js`.
- The appbar, back arrow, and page title are styled **centrally** in `public/styles.css` for full consistency:
  - Font family: `'Calibri Light', Arial, sans-serif`
  - Appbar font size: 16px
  - Back arrow: 32px, bold, white, consistent padding
  - Page title: 24px, normal weight, centered
  - Appbar height and layout are uniform across all pages

### Pages Using the Shared Appbar

The following pages use the shared appbar and are visually/structurally consistent:
- `aboutalan.html`
- `atoms.html`
- `ear.html`
- `eye.html`
- `instructions.html`
- `referral.html`
- `skin.html`
- `weblinks.html`

### Main Content Justification

- The main content of the About Alan, Eye, Ear, and Skin pages uses `text-align: justify;` for edge-to-edge word wrapping.
- The instructions page uses a main content container with reduced top padding for a visually balanced layout.

### No Extraneous Code

- All appbar-related CSS and markup have been removed from individual HTML files.
- Only the shared template and stylesheet are used for the appbar, ensuring maintainability and consistency.

### CSS File Organization

- We will **keep both** `styles.css` and `styles_index.css` in the project.
- This separation makes it easier to understand and maintain styles, and avoids a single "monster" CSS file.
- Use `styles.css` for shared UI elements (like the appbar) and `styles_index.css` for home/index-specific or other specialized styles.

### How to Add a New Page with Appbar

1. Import and call `initPage` from `page-template.js` in your HTML file.
2. Ensure `<link rel="stylesheet" href="styles.css">` is included in the `<head>`.
3. Do **not** add local appbar/back-arrow/pageTitle CSS or markup.
4. For justified main content, use `text-align: justify;` on your main content container.

---

## Keyboard Accessibility: Focus Trap

A reusable focus trap system is implemented for all modals and side menus to ensure keyboard users can navigate the app efficiently.

- The `public/focus-trap.js` module provides a `FocusTrap` class.
- This is used in `home.js` to trap focus within the user info popup and the side menu when they are open.
- The trap:
  - Moves focus to the first focusable element when the modal/menu opens.
  - Cycles focus with Tab/Shift+Tab within the modal/menu.
  - Closes the modal/menu with Escape and returns focus to the trigger.
- To use for new modals, instantiate `new FocusTrap(yourModalElement)` and call `.activate()`/`.deactivate()` on open/close.

This feature significantly improves accessibility and user experience for keyboard and assistive technology users.

---

## Accessibility

### Marquee Content

- All duplicated marquee content (used for seamless scrolling) in `boxes.html` must have `aria-hidden="true"` on the duplicated elements (IDs ending in "b"). This ensures screen readers do not read the same content twice.

### Icon-only Buttons

- All icon-only buttons (buttons with no visible text, only an icon or image) must have an appropriate `aria-label` attribute describing their action. This applies to language selection, clear history, and similar buttons in `home.html`, `index.html`, and elsewhere.

---

## Accessibility Testing

Automated accessibility tests are included in `tests/ui.test.js` to enforce these requirements.

- **Marquee Accessibility:** Tests verify that all duplicated marquee elements in `boxes.html` have `aria-hidden="true"`.
- **Icon-only Button Accessibility:** Tests verify that all icon-only buttons in `home.html` and `index.html` have the correct `aria-label` attributes.

### Running the Accessibility Tests

To run the accessibility and UI tests:

```bash
npx jest tests/ui.test.js
```

These tests use [Jest](https://jestjs.io/) and [jsdom](https://github.com/jsdom/jsdom). Make sure both are installed in your project dependencies.
