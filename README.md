# 🟦 Lingolint

![Build Status](https://github.com/FriquetLuca/lingolint/actions/workflows/deploy.yml/badge.svg)

**Lingolint** is a professional-grade, browser-based JSON translation editor designed to manage multiple localization files simultaneously. It flattens complex nested JSON structures into a manageable grid, allowing developers and translators to sync keys across languages without losing structural integrity.

## 🎬 Live Demo

Check out the demo here: [https://FriquetLuca.github.io/lingolint/](https://FriquetLuca.github.io/lingolint/)

## ✨ Key Features

- **Multi-File Sync**: Drop multiple `.json` files and edit them in a unified side-by-side grid.
- **Schema-Aware Flattening**: Automatically handles deeply nested objects while preserving the original structure on export.
- **Dynamic Column Reordering**: Drag and drop language columns to organize your workspace with real-time visual drop indicators.
- **Key Path Validation**: Prevents "Type Collisions" (e.g., prevents adding `auth.user` if `auth` is already a string).
- **Smart Key Management**: Add or delete keys globally across all loaded files in one click.
- **Zero Configuration**: Runs entirely in the browser. No database, no setup, no "any" type linting headaches.
- **Export to ZIP**: Rebuilds your nested JSON structures and bundles them into a single download.

## 🚀 Getting Started

1.  **Open the App**: Visit the hosted URL or run locally.
2.  **Import**: Drag and drop your existing `.json` localization files onto the dashboard.
3.  **Translate**: Edit values directly in the grid. New keys added to one file are automatically tracked across all others.
4.  **Organize**: Use the drag handles on column headers to reorder languages (e.g., moving `en.json` to the first position).
5.  **Export**: Hit the **Export** button to download a ZIP containing your perfectly formatted, nested JSON files.

## 🛠️ Tech Stack

- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Utilities**: JSZip (for exports), Custom Flattening/Unflattening logic
- **State Management**: Custom React Hooks (`useAudit`)

## 🏗️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📝 License

MIT © 2026
