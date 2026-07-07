# Changelog

## [1.1.0] — 2026-07-07

### Added
- 6 new languages: Portuguese, Chinese, Japanese, Korean, Russian, Hindi (with SVG flags)
- Custom DatePicker component with calendar popover (replaces native date input)
- Custom TimePicker component with hour/minute scrollable columns (replaces native time input)
- Form validation (required fields, pattern matching) with translated error messages
- Footer with contact info (phone, email), configurable via `src/config/contact.json`
- `CHANGELOG.md`
- Build step in `scripts/IndexWeb.sh`
- Chunk splitting in Vite config to eliminate bundle size warnings
- Placeholders on all form inputs (name, version, description, search fields)

### Changed
- Brand: "Rayden products index" → "Rayden Products Index" (all locales)
- Language selector: inline SVG flags for all 15 languages, 3×5 column-first grid
- DataTable: removed checkbox column, added row-click selection (Shift for range, Ctrl for toggle)
- EditModal: field types (date/time), inline validation errors, required indicators
- Product creation: fixed date format (ISO `YYYY-MM-DDTHH:mm:ss`), added version pattern validation
- Footer: 200px height, hidden until scroll (via `min-h-[calc(100dvh+200px)]` layout)
- Contact config moved from TypeScript to `contact.json`
- Version: `0.0.0` → `1.1.0`

### Fixed
- Product creation not working (malformed date/time string sent to backend)
- Error messages in forms not being translated
- Native date/time picker styling inconsistent with dark theme
