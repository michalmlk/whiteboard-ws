export type Point = {
  x: number;
  y: number;
};
export type DrawLineEvent = {
  prevPoint: Point | null;
  currPoint: Point;
  color: string;
};
