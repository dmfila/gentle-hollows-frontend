import React, { useState } from 'react';
import ReactDataGrid from 'react-data-grid';
import { ToolsPanel, Draggable } from 'react-data-grid-addons';
import {Selectors} from '../../react-data-grid-addons-data';

const DraggableContainer = Draggable.Container;
const Toolbar = ToolsPanel.AdvancedToolbar;
const GroupedColumnsPanel = ToolsPanel.GroupedColumnsPanel;

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

const CustomRowRenderer = (props) => {
  let { row } = props;

  if (row.isFooterRow) {
    return (
        <div className="react-grid-row-group" style={{height: "35px"}}>
          <div style={{marginLeft: "20px", position: "relative", top: "50%", transform: "translateY(-50%)"}}>
            <strong>Total: {" "}
              {
                Object.keys(row.total).map((key, i) => {
                  let ret = key + "(" + Math.round(Number(row.total[key]), 2) + ")";
                  if( i + 1 < Object.keys(row.total).length ) {
                    ret += ", ";
                  }
                  return ret;
                })
              }
            </strong>
          </div>
        </div>
    );
  }
  return <ReactDataGrid.Row {...props} />;
};

const CustomDataGrid = (props) => {
  const [groupBy, setGroupBy] = useState([]);

  const rows = props.datainfo.rows;
  const columns = props.datainfo.columns;

  let totalColumns = ["Amount", "Debit", "Credit"];
  const groupedRows = Selectors.getRows( {rows, groupBy, totalColumns} );

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
        rowRenderer={CustomRowRenderer}
      />
    </DraggableContainer>
  );
}

export default CustomDataGrid;