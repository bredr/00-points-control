import { useRef, useEffect, useState } from "react";
import { Box } from "@mantine/core";
import Track from "./Track";
import Point from "./Point";
import {
  IconArrowNarrowDown,
  IconArrowNarrowLeft,
  IconArrowNarrowRight,
  IconArrowNarrowUp,
} from "@tabler/icons-react";
const Layout = () => {
  const boxRef = useRef(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!boxRef.current) {
      return;
    }
    const { width, height } = (
      boxRef.current as unknown as HTMLHtmlElement
    ).getBoundingClientRect();
    setWidth(width);
    setHeight(height);
  }, [boxRef]);

  return (
    <Box ref={boxRef} mt={100} w="100%" h="80vh">
      <svg
        width={width}
        xmlns="http://www.w3.org/2000/svg"
        height={height}
        viewBox={`0 0 ${width * 0.8} ${height}`}
      >
        <Point
          id={0}
          x={0.25}
          y={0.1}
          buttonPos="below"
          width={width}
          height={height}
          straightIcon={<IconArrowNarrowDown />}
          divergentIcon={<IconArrowNarrowUp />}
          gradient={{ from: "IndianRed", to: "DarkRed", deg: 180 }}
        />
        <Point
          id={1}
          x={0.4}
          y={0.8}
          buttonPos="below"
          width={width}
          height={height}
          straightIcon={<IconArrowNarrowUp />}
          divergentIcon={<IconArrowNarrowDown />}
          gradient={{ from: "red", to: "blue", deg: 180 }}
        />
        <Point
          id={2}
          x={0.5}
          y={0.8}
          buttonPos="below"
          width={width}
          height={height}
          straightIcon={<IconArrowNarrowDown />}
          divergentIcon={<IconArrowNarrowUp />}
          gradient={{ from: "green", to: "red", deg: 180 }}
        />
        <Point
          id={3}
          x={0.4}
          y={0.7}
          buttonPos="below"
          width={width}
          height={height}
          straightIcon={<IconArrowNarrowUp />}
          divergentIcon={<IconArrowNarrowDown />}
          gradient={{ from: "green", to: "red", deg: 180 }}
        />
        <Point
          id={4}
          x={0.5}
          y={0.7}
          buttonPos="below"
          width={width}
          height={height}
          straightIcon={<IconArrowNarrowDown />}
          divergentIcon={<IconArrowNarrowUp />}
          gradient={{ from: "DarkGreen", to: "LightGreen", deg: 180 }}
        />
        <Point
          id={5}
          x={0.45}
          y={0.3}
          buttonPos="below"
          width={width}
          height={height}
          straightIcon={<IconArrowNarrowUp />}
          divergentIcon={<IconArrowNarrowDown />}
          gradient={{ from: "DarkGreen", to: "LightGreen", deg: 180 }}
        />
        <Point
          id={6}
          x={0.35}
          y={0.4}
          buttonPos="above"
          width={width}
          height={height}
          straightIcon={<IconArrowNarrowDown />}
          divergentIcon={<IconArrowNarrowLeft />}
          gradient={{ from: "DarkGreen", to: "LightGreen", deg: 180 }}
        />
        <Point
          id={7}
          x={0.75}
          y={0.4}
          buttonPos="left"
          width={width}
          height={height}
          straightIcon={<IconArrowNarrowLeft />}
          divergentIcon={<IconArrowNarrowRight />}
          gradient={{ from: "Blue", to: "DarkBlue", deg: 90 }}
        />

        <Track
          x1={0.35}
          x2={0.7}
          y1={0.01}
          y2={0.01}
          width={width}
          height={height}
          colour="OUTER"
        />
        <Track
          x1={0.35}
          x2={0.25}
          y1={0.01}
          y2={0.1}
          width={width}
          height={height}
          colour="OUTER"
        />
        <Track
          x1={0.01}
          x2={0.7}
          y1={0.1}
          y2={0.1}
          width={width}
          height={height}
          colour="OUTER"
        />

        <Track
          x1={0.05}
          x2={0.65}
          y1={0.2}
          y2={0.2}
          width={width}
          height={height}
          colour="INNER"
        />
        <Track
          x1={0.1}
          x2={0.6}
          y1={0.3}
          y2={0.3}
          width={width}
          height={height}
          colour="INNER"
        />
        <Track
          x1={0.1}
          x2={0.35}
          y1={0.4}
          y2={0.4}
          width={width}
          height={height}
          colour="INNER"
        />
        <Track
          x1={0.05}
          x2={0.65}
          y1={0.7}
          y2={0.7}
          width={width}
          height={height}
          colour="INNER"
        />
        <Track
          x1={0.01}
          x2={0.7}
          y1={0.8}
          y2={0.8}
          width={width}
          height={height}
          colour="OUTER"
        />
        <Track
          x1={0.5}
          x2={0.75}
          y1={0.9}
          y2={0.9}
          width={width}
          height={height}
          colour="BRANCH"
        />
        <Track
          x1={0.01}
          x2={0.01}
          y1={0.1}
          y2={0.8}
          width={width}
          height={height}
          colour="OUTER"
        />
        <Track
          x1={0.05}
          x2={0.05}
          y1={0.2}
          y2={0.7}
          width={width}
          height={height}
          colour="INNER"
        />
        <Track
          x1={0.35}
          x2={0.35}
          y1={0.4}
          y2={0.6}
          width={width}
          height={height}
          colour="INNER"
        />
        <Track
          x1={0.45}
          x2={0.35}
          y1={0.3}
          y2={0.4}
          width={width}
          height={height}
          colour="INNER"
        />
        <Track
          x1={0.6}
          x2={0.6}
          y1={0.3}
          y2={0.6}
          width={width}
          height={height}
          colour="INNER"
        />
        <Track
          x1={0.6}
          x2={0.5}
          y1={0.6}
          y2={0.7}
          width={width}
          height={height}
          colour="INNER"
        />
        <Track
          x1={0.4}
          x2={0.5}
          y1={0.7}
          y2={0.8}
          width={width}
          height={height}
          colour="INNER"
        />
        <Track
          x1={0.4}
          x2={0.5}
          y1={0.8}
          y2={0.9}
          width={width}
          height={height}
          colour="BRANCH"
        />
        <Track
          x1={0.65}
          x2={0.65}
          y1={0.2}
          y2={0.7}
          width={width}
          height={height}
          colour="INNER"
        />
        <Track
          x1={0.7}
          x2={0.7}
          y1={0.1}
          y2={0.8}
          width={width}
          height={height}
          colour="INNER"
        />
        <Track
          x1={0.7}
          x2={0.7}
          y1={0.1}
          y2={0.8}
          width={width}
          height={height}
          colour="OUTER"
        />
        <Track
          x1={0.75}
          x2={0.75}
          y1={0.9}
          y2={0.01}
          width={width}
          height={height}
          colour="BRANCH"
        />
        <Track
          x1={0.75}
          x2={0.8}
          y1={0.4}
          y2={0.35}
          width={width}
          height={height}
          colour="BRANCH"
        />
        <Track
          x1={0.8}
          x2={0.8}
          y1={0.01}
          y2={0.35}
          width={width}
          height={height}
          colour="BRANCH"
        />
      </svg>
    </Box>
  );
};

export default Layout;
