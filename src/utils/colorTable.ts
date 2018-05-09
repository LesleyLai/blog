export interface Color {
  readonly bg: string;
  readonly fg: string;
  readonly hover: string;
}

export const colors: { [key: string]: Color } = {
  red: {
    bg: "#db2828",
    fg: "#fff",
    hover: "#d01919"
  },
  orange: {
    bg: "#F2711C",
    fg: "#fff",
    hover: "#f26202"
  },
  yellow: {
    bg: "#fbbd08",
    fg: "#fff",
    hover: "#eaae00"
  },
  teal: {
    bg: "#00B5AD",
    fg: "#fff",
    hover: "#009c95"
  },
  green: {
    bg: "#21ba45",
    fg: "#fff",
    hover: "#16ab39"
  },
  blue: {
    bg: "#2185D0",
    fg: "#fff",
    hover: "#1678c2"
  },
  violet: {
    bg: "#6435C9",
    fg: "#fff",
    hover: "#5829bb"
  },
  purple: {
    bg: "#A333C8",
    fg: "#fff",
    hover: "#9627ba"
  },
  pink: {
    bg: "#E03997",
    fg: "#fff",
    hover: "#e61a8d"
  },
  black: {
    bg: "#1B1C1D",
    fg: "#fff",
    hover: "#272929"
  },
  white: {
    bg: "#e8e8e8",
    fg: "#666",
    hover: "#272929"
  }
};
