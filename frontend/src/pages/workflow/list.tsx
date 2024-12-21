import {useNavigation} from "@refinedev/core";

import {useDataGrid} from "@refinedev/mui";
import {DataGrid, type GridColDef} from "@mui/x-data-grid";

import React from "react";

import {GridActions} from "../../components/GridActions";
import type {TWorkflow} from "shared/types/Workflow";
import {ListToolbar} from "../../components/ListToolbar";

export const ListWorkflow = () => {
    const {dataGridProps} = useDataGrid<TWorkflow>({
        sorters: {initial: [{field: "name", order: "asc"}], mode: "off"},
        filters: {mode: "off"},
        syncWithLocation: true,
    });
    const {edit} = useNavigation();
    const columns = React.useMemo<GridColDef<TWorkflow>[]>(
        () => [
            {
                field: "name",
                headerName: "Name",
                type: "string",
                minWidth: 200,
            },
            {
                field: "hardwareRef",
                headerName: "Hardware Ref",
                type: "string",
                minWidth: 200,
                valueGetter: (_value, row) => {
                    return row.spec?.hardwareRef;
                },
            },
            {
                field: "templateRef",
                headerName: "Template Ref",
                type: "string",
                minWidth: 200,
                valueGetter: (_value, row) => {
                    return row.spec?.templateRef;
                },
            },
            {
                field: "creationTimestamp",
                headerName: "Created",
                minWidth: 400,
                flex: 1,
            },
            {
                field: "actions",
                headerName: "Actions",
                minWidth: 200,
                renderCell: function render({row}) {
                    return <GridActions recordItemId={row.name}/>;
                },
            },
        ],
        [],
    );

    return (
        <div>
            <h1>Workflows</h1>
            <ListToolbar/>
            <DataGrid
                {...dataGridProps}
                columns={columns}
                autoHeight
                onRowDoubleClick={(params) => {
                    edit("workflow", params.id);
                }}
            />
        </div>
    );
};
