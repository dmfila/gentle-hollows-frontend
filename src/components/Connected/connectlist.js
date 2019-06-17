import React, { useState } from 'react';
import ReactDataGrid from 'react-data-grid';
import { ToolsPanel, Data, Draggable } from "react-data-grid-addons";

const DraggableContainer = Draggable.Container;
const Toolbar = ToolsPanel.AdvancedToolbar;
const GroupedColumnsPanel = ToolsPanel.GroupedColumnsPanel;

const CustomToolbar = ({
  groupBy,
  onColumnGroupAdded,
  onColumnGroupDeleted
}) => {
  return (
    <Toolbar>
      <GroupedColumnsPanel
        groupBy={groupBy}
        onColumnGroupAdded={onColumnGroupAdded}
        onColumnGroupDeleted={onColumnGroupDeleted}
      />
    </Toolbar>
  );
};

const groupColumn = (columns, columnKey) => groupBy => {
  const columnGroups = groupBy.slice(0);
  const activeColumn = columns.find(c => c.key === columnKey);
  const isNotInGroups =
    columnGroups.find(c => activeColumn.key === c.name) == null;
  if (isNotInGroups) {
    columnGroups.push({ key: activeColumn.key, name: activeColumn.name });
  }
  return columnGroups;
};

const ungroupColumn = columnKey => groupBy => {
  return groupBy.filter(g =>
    typeof g === "string" ? g !== columnKey : g.key !== columnKey
  );
};

const ConnectList = (props) => {
  const [groupBy, setGroupBy] = useState([]);

  const rows = props.datainfo.rows;
  const columns = props.datainfo.columns;

  const groupedRows = Data.Selectors.getRows({ rows, groupBy });

  console.log(rows);

  return (
    <DraggableContainer>
      <ReactDataGrid
        columns={columns}
        rowGetter={i => groupedRows[i]}
        rowsCount={groupedRows.length}
        minHeight={500}
        enableDragAndDrop={true}
        toolbar={
          <CustomToolbar
            groupBy={groupBy}
            onColumnGroupAdded={columnKey => setGroupBy(groupColumn(columns, columnKey))}
            onColumnGroupDeleted={columnKey => setGroupBy(ungroupColumn(columnKey))}
          />
        }
      />
    </DraggableContainer>
  );
}

export default ConnectList;