import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Table from "./Table";

const deleteAllFieldsMock = vi.fn();

vi.mock("../../hooks", () => ({
  useLayout: () => ({ layout: { readOnly: false, sidebar: true } }),
  useSettings: () => ({
    settings: {
      mode: "light",
      tableWidth: 200,
      showComments: false,
      showFieldSummary: false,
      showDataTypes: false,
    },
  }),
  useDiagram: () => ({
    database: "GENERIC",
    deleteTable: vi.fn(),
    deleteField: vi.fn(),
    updateTable: vi.fn(),
    deleteAllFields: deleteAllFieldsMock,
  }),
  useSelect: () => ({
    selectedElement: { element: "NONE" },
    setSelectedElement: vi.fn(),
    bulkSelectedElements: [],
    setBulkSelectedElements: vi.fn(),
  }),
  useUndoRedo: () => ({
    undoStack: [],
    redoStack: [],
    setUndoStack: vi.fn(),
    setRedoStack: vi.fn(),
  }),
  useSaveState: () => ({
    setSaveState: vi.fn(),
  }),
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
  initReactI18next: { init: () => {} },
}));

vi.mock("../../i18n/i18n", () => ({
  default: {
    t: (key) => key,
  },
}));
vi.mock("../../i18n/utils/rtl", () => ({
  isRtl: () => false,
}));

vi.mock("../../data/datatypes", () => ({
  dbToTypes: {
    GENERIC: {
      INT: { color: "", isSized: false, hasPrecision: false },
    },
  },
}));

// Mock Semi UI components to avoid pulling complex dependencies
vi.mock("@douyinfe/semi-ui", () => ({
  Popover: ({ children, content }) => (
    <div>
      {children}
      {content}
    </div>
  ),
  Tag: ({ children }) => <span>{children}</span>,
  Button: ({ children, ...props }) => <button {...props}>{children}</button>,
  SideSheet: ({ children }) => <div>{children}</div>,
}));

// Avoid rendering the full TableInfo editor in tests
vi.mock("../EditorSidePanel/TablesTab/TableInfo", () => ({
  default: () => <div />,
}));

describe("Table delete-all-fields control", () => {
  it("calls deleteAllFields when Delete all fields button is clicked", () => {
    const tableData = {
      id: "t1",
      name: "users",
      x: 0,
      y: 0,
      color: "#000",
      locked: false,
      hidden: false,
      comment: "",
      indices: [],
      fields: [
        {
          id: "f1",
          name: "id",
          type: "INT",
          default: "",
          check: "",
          primary: true,
          unique: true,
          notNull: true,
          increment: true,
          comment: "",
        },
      ],
    };

    render(
      <Table
        tableData={tableData}
        onPointerDown={() => {}}
        setHoveredTable={() => {}}
        handleGripField={() => {}}
        setLinkingLine={() => {}}
      />,
    );

    const button = screen.getByText("delete_all_fields");
    fireEvent.click(button);

    expect(deleteAllFieldsMock).toHaveBeenCalledWith("t1");
  });
});


