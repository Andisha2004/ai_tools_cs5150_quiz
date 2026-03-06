import React from "react";
import { render, screen } from "@testing-library/react";
import StatsBox from "./StatsBox";

vi.mock("../hooks", () => ({
  useDiagram: () => ({
    tables: [
      { id: "t1", fields: [{ id: "f1" }, { id: "f2" }] },
      { id: "t2", fields: [{ id: "f3" }] },
      { id: "t3", fields: [] },
    ],
    relationships: [
      { startTableId: "t1", endTableId: "t2" },
      { startTableId: "t2", endTableId: "t3" },
    ],
  }),
  useSettings: () => ({
    settings: { mode: "light" },
  }),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

describe("StatsBox", () => {
  it("shows table, relationship, field counts and max depth", () => {
    render(<StatsBox />);

    expect(screen.getByText("stats_box")).toBeInTheDocument();
    expect(screen.getByText(/tables:\s*3/i)).toBeInTheDocument();
    expect(screen.getByText(/relationships:\s*2/i)).toBeInTheDocument();
    expect(screen.getByText(/fields:\s*3/i)).toBeInTheDocument();
    // t1 -> t2 -> t3 gives max depth 2
    expect(screen.getByText(/max_depth:\s*2/i)).toBeInTheDocument();
  });
});


