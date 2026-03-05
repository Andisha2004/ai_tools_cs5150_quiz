import { useMemo } from "react";
import { useDiagram, useSettings } from "../hooks";
import { useTranslation } from "react-i18next";

function computeMaxDepth(tables, relationships) {
  if (!tables || tables.length === 0) return 0;

  const adjacency = new Map();

  tables.forEach((table) => {
    adjacency.set(table.id, new Set());
  });

  relationships.forEach((rel) => {
    const { startTableId, endTableId } = rel;
    if (!adjacency.has(startTableId) || !adjacency.has(endTableId)) return;
    adjacency.get(startTableId).add(endTableId);
    adjacency.get(endTableId).add(startTableId);
  });

  const bfsDepth = (startId) => {
    const visited = new Set([startId]);
    const queue = [[startId, 0]];
    let maxDepth = 0;

    while (queue.length > 0) {
      const [current, depth] = queue.shift();
      maxDepth = Math.max(maxDepth, depth);

      const neighbours = adjacency.get(current) || [];
      neighbours.forEach((next) => {
        if (!visited.has(next)) {
          visited.add(next);
          queue.push([next, depth + 1]);
        }
      });
    }

    return maxDepth;
  };

  let globalMaxDepth = 0;
  adjacency.forEach((_neighbors, tableId) => {
    globalMaxDepth = Math.max(globalMaxDepth, bfsDepth(tableId));
  });

  return globalMaxDepth;
}

export default function StatsBox() {
  const { tables, relationships } = useDiagram();
  const { settings } = useSettings();
  const { t } = useTranslation();

  const { tableCount, relationshipCount, fieldCount, maxDepth } = useMemo(() => {
    const tableCount = tables?.length ?? 0;
    const relationshipCount = relationships?.length ?? 0;
    const fieldCount =
      tables?.reduce(
        (sum, table) => sum + (Array.isArray(table.fields) ? table.fields.length : 0),
        0,
      ) ?? 0;

    const maxDepth = computeMaxDepth(tables ?? [], relationships ?? []);

    return { tableCount, relationshipCount, fieldCount, maxDepth };
  }, [tables, relationships]);

  if (!tableCount && !relationshipCount) return null;

  const themeClasses =
    settings.mode === "dark"
      ? "bg-zinc-800 text-zinc-100 border-zinc-700"
      : "bg-white text-zinc-900 border-zinc-200";

  return (
    <div className="absolute left-4 top-4 z-20 pointer-events-none select-none">
      <div
        className={`px-3 py-2 rounded-md shadow-md border text-xs space-y-1 ${themeClasses} pointer-events-auto`}
      >
        <div className="font-semibold">{t("stats_box")}</div>
        <div>
          {t("tables")}: {tableCount}
        </div>
        <div>
          {t("relationships")}: {relationshipCount}
        </div>
        <div>
          {t("fields")}: {fieldCount}
        </div>
        <div>
          {t("max_depth")}: {maxDepth}
        </div>
      </div>
    </div>
  );
}

