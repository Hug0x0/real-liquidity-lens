# Contributing

Thanks for helping improve REAL Liquidity Lens. Start with the [README](README.md), [development guide](docs/DEVELOPMENT.md), and [calculation methodology](docs/METHODOLOGY.md).

This project is licensed under the [MIT License](LICENSE). Contributions are provided under the same license.

## Discussing a change

For a bug, describe the expected behavior, actual behavior, and steps to reproduce it. Include the market, direction, notional, and whether API requests succeeded when relevant. Use sanitized sample data and omit credentials or private account information.

For a substantial feature, explain the user problem and intended behavior before implementation so scope and calculation assumptions can be reviewed.

## Making a change

1. Create a focused branch from `main`.
2. Install dependencies with `npm ci`.
3. Keep changes small and consistent with the existing React and TypeScript structure.
4. Add or update meaningful tests when changing calculation behavior.
5. Update documentation when behavior, configuration, or assumptions change.
6. Run `npm test` and `npm run build`.

Keep source comments, UI text, documentation, commit messages, and pull request descriptions in **English**.

Use small, meaningful commits. Follow the existing subject style, for example:

```text
fix: label synthetic depth consistently
test: cover partial sell execution
docs: clarify slippage reference price
```

## Pull requests

Explain the problem, the resulting behavior, and how you verified the change. Include screenshots for visual changes and reproducible examples for calculation changes. Call out remaining limitations that affect interpretation of the results.

Do not commit `.env`, credentials, `node_modules/`, or generated `dist/` output. Commit `package-lock.json` when intentionally changing dependencies.
