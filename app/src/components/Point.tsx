import { ActionIcon, Tooltip, type MantineGradient } from "@mantine/core";
import { IconExclamationMark, IconLoader } from "@tabler/icons-react";
import { type ReactElement } from "react";
import useSWR from "swr";

interface PointProps {
  x: number;
  y: number;
  buttonPos?: "above" | "below" | "left" | "right";
  width: number;
  height: number;
  id: number;
  straightIcon: ReactElement;
  divergentIcon: ReactElement;
  gradient?: MantineGradient;
}

async function updatePoint(
  url: RequestInfo | URL,
  { id, is_straight }: { id: number; is_straight: boolean },
): Promise<{ is_straight: boolean }> {
  return await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, is_straight }),
  }).then((res) => res.json());
}

const Point = ({
  x,
  width,
  y,
  height,
  buttonPos,
  id,
  straightIcon,
  divergentIcon,
  gradient,
}: PointProps) => {
  const fetcher = ({
    url,
    ...args
  }: RequestInit & { url: RequestInfo | URL }) =>
    fetch(url, args).then((res) => res.json());

  const { data, error, isLoading, mutate } = useSWR<{ is_straight: boolean }>(
    {
      url: `/api/point/${id}`,
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
    fetcher,
  );

  const xButton =
    buttonPos == "left" ? x - 0.02 : buttonPos == "right" ? x + 0.02 : x;
  const yButton =
    buttonPos == "above" ? y - 0.04 : buttonPos == "below" ? y + 0.04 : y;
  return (
    <>
      <circle
        cx={x * width}
        cy={y * height}
        r={8}
        strokeWidth={2}
        fill="none"
        stroke="white"
      />
      <foreignObject
        x={xButton * width - 15}
        y={yButton * height - 15}
        width={40}
        height={40}
      >
        <Tooltip label={`ID ${id}`}>
          <ActionIcon
            variant="gradient"
            size="md"
            gradient={gradient ?? { from: "blue", to: "cyan", deg: 90 }}
            disabled={isLoading || error}
            onClick={async () => {
              if (data) {
                await mutate(
                  updatePoint("/api/point", {
                    id,
                    is_straight: !data?.is_straight,
                  }),
                );
              }
            }}
          >
            {error && <IconExclamationMark />}
            {isLoading && <IconLoader />}
            {!error && !isLoading && data && data.is_straight && straightIcon}
            {!error && !isLoading && data && !data.is_straight && divergentIcon}
          </ActionIcon>
        </Tooltip>
      </foreignObject>
    </>
  );
};

export default Point;
