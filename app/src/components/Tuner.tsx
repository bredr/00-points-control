import { useDisclosure } from "@mantine/hooks";
import {
  Modal,
  ActionIcon,
  NumberInput,
  Button,
  Stack,
  NativeSelect,
} from "@mantine/core";
import { IconAdjustments } from "@tabler/icons-react";
import { useState } from "react";

async function setPointAngle({
  id,
  degrees,
}: {
  id: number;
  degrees: number;
}): Promise<void> {
  await fetch("/api/point/manual", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, degrees }),
  });
}

const Tuner = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [point, setPoint] = useState<number>(0);
  const [straightValue, setStraightValue] = useState<number | string>(45);
  const [divergentValue, setDivergentValue] = useState<number | string>(135);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Tuning">
        <Stack>
          <NativeSelect
            label="Point ID"
            value={point}
            onChange={(event) => setPoint(parseInt(event.currentTarget.value))}
            data={Array(8)
              .fill(0)
              .map((_, idx) => `${idx}`)}
          />
          <NumberInput
            label="Straight angle"
            value={straightValue}
            onChange={setStraightValue}
            min={5}
            max={175}
          />
          <NumberInput
            label="Divergent angle"
            value={divergentValue}
            onChange={setDivergentValue}
            min={5}
            max={175}
          />
          <Button.Group>
            <Button
              variant="default"
              onClick={() =>
                setPointAngle({ id: point, degrees: straightValue as number })
              }
            >
              Straight
            </Button>
            <Button
              variant="default"
              onClick={() =>
                setPointAngle({ id: point, degrees: divergentValue as number })
              }
            >
              Divergent
            </Button>
          </Button.Group>
        </Stack>
      </Modal>
      <ActionIcon variant="gradient" onClick={open}>
        <IconAdjustments />
      </ActionIcon>
    </>
  );
};

export default Tuner;
