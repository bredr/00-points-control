const Colours = {
  INNER: "green",
  OUTER: "red",
  BRANCH: "blue",
};

const Track = ({
  x1,
  y1,
  x2,
  y2,
  width,
  height,
  colour,
}: {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  width: number;
  height: number;
  colour: "INNER" | "OUTER" | "BRANCH";
}) => {
  return (
    <line
      x1={x1 * width}
      x2={x2 * width}
      y1={y1 * height}
      y2={y2 * height}
      style={{ strokeWidth: 2, stroke: Colours[colour] }}
    />
  );
};

export default Track;
