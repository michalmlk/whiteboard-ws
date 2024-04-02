import { Point } from '../src/model';

type DrawLineProps = {
    currPoint: Point;
    prevPoint: Point | null;
    ctx: CanvasRenderingContext2D;
    color: string;
};

export const drawLine = ({ currPoint, prevPoint, ctx, color }: DrawLineProps) => {
    const { x: currX, y: currY } = currPoint;
    const lineWidth = 5;

    let startPoint = prevPoint ?? currPoint;
    ctx.beginPath();
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.moveTo(startPoint.x, startPoint.y);
    ctx.lineTo(currX, currY);
    ctx.stroke();

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(startPoint.x, startPoint.y, 2, 0, 2 * Math.PI);
    ctx.fill();
};
