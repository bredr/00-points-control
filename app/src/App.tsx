// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";

import { AppShell, Group, MantineProvider, Title } from "@mantine/core";
import { theme } from "./theme";
import Layout from "./components/Layout";
import Tuner from "./components/Tuner";

export default function App() {
  return (
    <MantineProvider theme={theme} defaultColorScheme="dark">
      <AppShell padding="lg" header={{ height: 70 }}>
        <AppShell.Header withBorder>
          <Group justify="space-between" p="sm">
            <Title order={1}>Model Railway Control</Title>
            <Tuner />
          </Group>
        </AppShell.Header>
        <AppShell.Main p="lg">
          <Layout />
        </AppShell.Main>
      </AppShell>
    </MantineProvider>
  );
}
