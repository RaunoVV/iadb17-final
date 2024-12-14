import { Refine } from "@refinedev/core";

import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
    AuthPage,
    ErrorComponent,
    notificationProvider,
    RefineSnackbarProvider,
    RefineThemes,
    ThemedLayoutV2,
} from "@refinedev/mui";

import { dataProvider } from "./providers/data-provider";
import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import { BrowserRouter, Route, Routes, Outlet } from "react-router-dom";
import routerBindings, {
    NavigateToResource,
    UnsavedChangesNotifier,
    DocumentTitleHandler,
} from "@refinedev/react-router-v6";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { Header } from "./components/header";

import { EditHardware } from "./pages/hardware/edit";
import { ListHardware } from "./pages/hardware/list";
import { CreateWorkflow } from "./pages/workflow/create";
import { ListWorkflow } from "./pages/workflow/list";

import "./styles/app.css";
import { CreateHardware } from "./pages/hardware/create";
import { EditWorkflow } from "./pages/workflow/edit";
import { ListTemplate } from "./pages/template/list.tsx";
import { EditTemplate } from "./pages/template/edit.tsx";
import { CreateTemplate } from "./pages/template/create.tsx";

function App() {
    return (
        <BrowserRouter>
            <RefineKbarProvider>
                <ColorModeContextProvider>
                    <CssBaseline />
                    <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
                    <RefineSnackbarProvider>
                        <Refine
                            dataProvider={dataProvider}
                            notificationProvider={notificationProvider}
                            routerProvider={routerBindings}
                            resources={[
                                {
                                    name: "hardware",
                                    list: "/hardware",
                                    show: "/hardware/:id",
                                    edit: "/hardware/:id/edit",
                                    create: "/hardware/create",
                                    meta: { label: "Hardware" },
                                },
                                {
                                    name: "workflow",
                                    list: "/workflow",
                                    show: "/workflow/:id",
                                    edit: "/workflow/:id/edit",
                                    create: "/workflow/create",
                                    meta: { label: "Workflows" },
                                },
                                {
                                    name: "template",
                                    list: "/template",
                                    show: "/template/:id",
                                    edit: "/template/:id/edit",
                                    create: "/template/create",
                                    meta: { label: "Templates" },
                                },
                            ]}
                            options={{
                                syncWithLocation: true,
                                warnWhenUnsavedChanges: true,
                                useNewQueryKeys: true,
                                projectId: "Wh2n0y-AaASBj-8VAXUj",
                            }}
                        >
                            <Routes>
                                <Route
                                    element={
                                        <ThemedLayoutV2 Header={() => <Header sticky />}>
                                            <Outlet />
                                        </ThemedLayoutV2>
                                    }
                                >
                                    <Route index element={<NavigateToResource resource="hardware" />} />
                                    <Route path="/hardware">
                                        <Route index element={<ListHardware />} />
                                        <Route path=":id" element={<EditHardware />} />
                                        <Route path=":id/edit" element={<EditHardware />} />
                                        <Route path="create" element={<CreateHardware />} />
                                    </Route>
                                    <Route path="/workflow">
                                        <Route index element={<ListWorkflow />} />
                                        {<Route path=":id" element={<EditWorkflow />} />}
                                        <Route path=":id/edit" element={<EditWorkflow />} />
                                        <Route path="create" element={<CreateWorkflow />} />
                                    </Route>
                                    <Route path="/template">
                                        <Route index element={<ListTemplate />} />
                                        <Route path=":id" element={<EditTemplate />} />
                                        <Route path=":id/edit" element={<EditTemplate />} />
                                        <Route path="create" element={<CreateTemplate />} />
                                    </Route>
                                    <Route path="*" element={<ErrorComponent />} />
                                </Route>
                            </Routes>

                            <RefineKbar />
                            <UnsavedChangesNotifier />
                            <DocumentTitleHandler />
                        </Refine>
                    </RefineSnackbarProvider>
                </ColorModeContextProvider>
            </RefineKbarProvider>
        </BrowserRouter>
    );
}

export default App;
