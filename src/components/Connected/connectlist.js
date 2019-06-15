import React, { useState, useEffect } from 'react';
import ReactDataGrid from 'react-data-grid';
import { ToolsPanel, Data, Draggable } from "react-data-grid-addons";
import axios from 'axios';

const DraggableContainer = Draggable.Container;
const Toolbar = ToolsPanel.AdvancedToolbar;
const GroupedColumnsPanel = ToolsPanel.GroupedColumnsPanel;

const columns = [
  { key: 'id', name: '#', resizable: true, draggable: true},
  { key: 'rid', name: 'RealmID', resizable: true, draggable: true },
  { key: 'api', name: 'QuickBooks API Call', resizable: true, draggable: true },
  { key: 'refresh', name: 'Refresh Token Call', resizable: true, draggable: true },
  { key: 'revoke', name: 'Revoke Token Call', resizable: true, draggable: true }
];

const rows = [
  {id: 0, rid: 0, api: 'row1', refersh: 20, revoke: 'aaaaaaaa'},
  {id: 1, rid: 1, api: 'row2', refersh: 30, revoke: 'bbbbbbbb'},
  {id: 2, rid: 2, api: 'row3', refersh: 40, revoke: 'cccccccc'},
];

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

const groupColumn = columnKey => groupBy => {
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
  const groupedRows = Data.Selectors.getRows({ rows, groupBy });

  useEffect(() => {
    let realmID = props.realmID;
    axios
    .get(`/api_call/${realmID}`, {})
    .then((res) => {
      
    })
    .catch((err) => {
      console.log(err);
    });
  });
  
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
            onColumnGroupAdded={columnKey => setGroupBy(groupColumn(columnKey))}
            onColumnGroupDeleted={columnKey => setGroupBy(ungroupColumn(columnKey))}
          />
        }
      />
    </DraggableContainer>
  );
}

export default ConnectList;