# UI Refinement: Modal Buttons & Card Icons

## Overview
User requested specific UI improvements to the results display:
1.  Remove the "Exportar" button from the result modal.
2.  Refine the result card icons to match the "Legenda" style (flatter, rounded, specific colors).

## Project Type
**WEB** (HTML/CSS/JS)

## Success Criteria
- [ ] "Exportar" button is gone from `consulta.html` modal.
- [ ] Result card icons in `ValidatorUI` verify result match the `legend-item` style:
    - Shape: Rounded square (not circle).
    - Style: Flat (no shadow, colored background).
    - Colors: Consistent with Inelegível/Elegível/Não Encontrado.

## Tech Stack
- **HTML/CSS**: Vanilla.
- **JS**: Vanilla (ES6 Modules).

## File Structure
- `public/consulta.html`: Template modification.
- `src/js/ui/validator-ui.js`: Rendering logic modification.

## Task Breakdown

### Task 1: Clean Modal Actions
- **File**: `public/consulta.html`
- **Action**: Remove the `button.modal-btn.primary` (Exportar) from `#modalResultado`.
- **Verify**: Open `consulta.html`, check modal footer.

### Task 2: Refactor Result Card Icons
- **File**: `src/js/ui/validator-ui.js`
- **Action**: Update `renderResult` method to modify the icon container classes.
    - Remove `rounded-full`, `bg-white`, `shadow-sm`.
    - Add classes to match `legend-icon` (likely `rounded-lg` or mapping the variables).
    - Use `bg-{color}-100` or `bg-{color}-50` instead of white/shadow.
- **Verify**: Run a mock verification in the UI and check the card icon appearance.

### Task 3: Sync & Build
- **Command**: `node scripts/sync-js.js` (or `npm run build` if that covers it).
- **Verify**: Ensure changes propagate to `public/assets/js`.

## Phase X: Verification
- [ ] Lint Check
- [ ] Visual Validation (Local Server)
