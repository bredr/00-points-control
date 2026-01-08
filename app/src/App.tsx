// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";

import { AppShell, Box, MantineProvider, Title } from "@mantine/core";
import { theme } from "./theme";
import Layout from "./components/Layout";

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <AppShell padding="lg" header={{ height: 60 }}>
        <AppShell.Header withBorder>
          <Box ml={20} p={5} w="100%">
            <Title order={1}>Model Railway Control</Title>
          </Box>
        </AppShell.Header>
        <AppShell.Main p="lg">
          <Layout />
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}
