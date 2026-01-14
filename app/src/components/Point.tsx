import { ActionIcon, Portal, type MantineGradient } from "@mantine/core";
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
  portalTarget: HTMLDivElement | null;
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
  portalTarget,
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
  const offset = 35;

  const xOffset =
    buttonPos === "left" ? -offset : buttonPos === "right" ? offset : 0;
  const yOffset =
    buttonPos === "above" ? -offset : buttonPos === "below" ? offset : 0;

  const htmlX = x * width + xOffset;
  const htmlY = y * height + yOffset;
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
      {portalTarget && (
        <Portal target={portalTarget}>
          <div
            style={{
              position: "absolute",
              left: `${htmlX}px`,
              top: `${htmlY}px`,
              transform: "translate(-50%, -50%)", // Center the button on the point
              zIndex: 100,
              pointerEvents: "auto", // Ensure clicks work
            }}
          >
            <ActionIcon
              variant="gradient"
              size="md"
              gradient={gradient ?? { from: "blue", to: "cyan", deg: 90 }}
              disabled={isLoading || error}
              onClick={async (e) => {
                e.stopPropagation();
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
              {!error && !isLoading && data && (
                <>
                  <div style={{ display: data.is_straight ? "flex" : "none" }}>
                    {straightIcon}
                  </div>
                  <div style={{ display: !data.is_straight ? "flex" : "none" }}>
                    {divergentIcon}
                  </div>
                </>
              )}
            </ActionIcon>
          </div>
        </Portal>
      )}
    </>
  );
};

export default Point;
