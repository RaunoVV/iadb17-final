import { useNavigation } from "@refinedev/core";

import { useDataGrid } from "@refinedev/mui";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";

import React from "react";

import type { THardware } from "shared/types/Hardware";
import { GridActions } from "../../components/GridActions";
import { ListToolbar } from "../../components/ListToolbar";

export const ListHardware = () => {
    const { dataGridProps } = useDataGrid<THardware>({
        sorters: { initial: [{ field: "id", order: "asc" }] },
        syncWithLocation: true,
    });
    const { edit } = useNavigation();
    const columns = React.useMemo<GridColDef<THardware>[]>(
        () => [
            {
                field: "name",
                headerName: "Name",
                type: "number",
                minWidth: 200,
            },
            {
                field: "creationTimestamp",
                headerName: "Created",
                minWidth: 400,
                flex: 1,
            },
            {
                field: "mac",
                headerName: "MAC",

                valueGetter: (value) => {
                    return value.row.spec?.interfaces[0].dhcp.mac;
                },
                minWidth: 120,
                flex: 0.3,
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
        [],
    );

    return (
        <div>
            <h1>Hardware</h1>
            <ListToolbar />
            <DataGrid
                {...dataGridProps}
                columns={columns}
                autoHeight
                onRowDoubleClick={(params) => {
                    console.log(params);
                    edit("hardware", params.id);
                }}
            />
        </div>
    );
};
