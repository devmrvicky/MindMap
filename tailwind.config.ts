// tailwind.config.js
module.exports = {
  darkMode: "class", // or 'media'
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            table: {
              width: "100%",
              borderCollapse: "collapse",
            },
            "table th, table td": {
              border: "1px solid #ddd",
              padding: "6px 12px",
            },
            "table th": {
              backgroundColor: "#f3f4f6",
              fontWeight: "600",
            },
            code: {
              backgroundColor: "#1e293b",
              color: "#f8fafc",
              padding: "0.2rem 0.4rem",
              borderRadius: "0.25rem",
              fontSize: "0.85em",
            },
            "pre code": {
              backgroundColor: "transparent",
              padding: "0",
              borderRadius: "0",
            },
            pre: {
              backgroundColor: "#1e293b",
              color: "#f8fafc",
              padding: "1rem",
              borderRadius: "0.5rem",
              overflowX: "auto",
            },
          },
        },
      },
    },
  },
  plugins: [
    require("tailwind-scrollbar-hide"),
    require("@tailwindcss/typography"),
  ],
};
