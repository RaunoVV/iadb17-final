import { useNavigation } from "@refinedev/core";
import { useTable } from "@refinedev/core";
import { useDataGrid } from "@refinedev/mui";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import React from "react";

import { GridActions } from "../../components/GridActions";
import type { TWorkflow } from "shared/types/Workflow";
import { ListToolbar } from "../../components/ListToolbar";

export const ListWorkflow = () => {
    const { dataGridProps } = useDataGrid<TWorkflow>({
        sorters: { initial: [{ field: "id", order: "asc" }] },
        syncWithLocation: true,
    });
    const { edit } = useNavigation();
    const {
        tableQuery: { isLoading },
    } = useTable({
        resource: "Workflow",
        pagination: { current: 1, pageSize: 10 },
        sorters: { initial: [{ field: "name", order: "asc" }] },
    });

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
                valueGetter: (params) => {
                    return params.row.spec?.hardwareRef;
                },
            },
            {
                field: "templateRef",
                headerName: "Template Ref",
                type: "string",
                minWidth: 200,
                valueGetter: (params) => {
                    return params.row.spec?.templateRef;
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
                renderCell: function render({ row }) {
                    return <GridActions recordItemId={row.name} />;
                },
            },
        ],
        [isLoading],
    );

    return (
        <div>
            <h1>Workflows</h1>
            <ListToolbar />
            <DataGrid
                {...dataGridProps}
                columns={columns}
                autoHeight
                onRowDoubleClick={(params) => {
                    console.log(params);
                    edit("workflow", params.id);
                }}
            />
        </div>
    );
};
