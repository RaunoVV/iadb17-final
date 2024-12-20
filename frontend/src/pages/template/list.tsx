import {useNavigation} from "@refinedev/core";

import {useDataGrid} from "@refinedev/mui";
import {DataGrid, type GridColDef} from "@mui/x-data-grid";

import React from "react";

import type {TTemplate} from "shared/types/Template";
import {GridActions} from "../../components/GridActions";
import {ListToolbar} from "../../components/ListToolbar";

export const ListTemplate = () => {
    const { dataGridProps } = useDataGrid<TTemplate>({
        sorters: {initial: [{field: "name", order: "asc"}], mode: "off"},
        filters: {mode: "off"},
        syncWithLocation: true,
    });
    const { edit } = useNavigation();
    const columns = React.useMemo<GridColDef<TTemplate>[]>(
        () => [
            {
                field: "name",
                headerName: "Name",
                type: "string",
                minWidth: 200,
            },
            {
                field: "task_count",
                headerName: "Task count",
                type: "number",
                minWidth: 200,
                valueGetter: (_value, row) => {
                    return row.spec.data?.tasks.length ?? 0;
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
                renderCell: function render({ row }: { row: TTemplate }) {
                    return <GridActions recordItemId={row.name} />;
                },
            },
        ],
        [],
    );

    return (
        <div>
            <h1>Templates</h1>
            <ListToolbar />
            <DataGrid
                {...dataGridProps}
                columns={columns}
                autoHeight
                onRowDoubleClick={(params) => {

                    edit("template", params.id);
                }}
            />
        </div>
    );
};
