import type React from "react";
import { CreateButton } from "@refinedev/mui";
import { Box } from "@mui/material";

export const ListToolbar = () => {
    return (
        <Box width="100%" textAlign="right" padding={2}>
            <CreateButton/>
        </Box>
    );
};
