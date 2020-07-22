/**
 * A canvas-aware Bezier curve class
 */
class Bezier {
    constructor(...coords) {
        if (coords.length === 8) {
            this.points = [
                {x: coords[0], y: coords[1]},
                {x: coords[2], y: coords[3]},
                {x: coords[4], y: coords[5]},
                {x: coords[6], y: coords[7]}
            ];
        }
    }

    getPointNear(x,y,d) {
        const p = this.points;
        for(let i=0, e=p.length; i<e; i++) {
            let dx = Math.abs(p[i].x - x);
            let dy = Math.abs(p[i].y - y);
            if ((dx*dx + dy*dy)**0.5 <= d) {
                return p[i];
            }
        }
    }

    draw(ctx) {
        this.drawSkeleton(ctx);
        const p = this.points;
        const w = ctx.lineWidth;
        ctx.lineWidth = 2;
        ctx.strokeStyle = `#333`;
        ctx.beginPath();
        ctx.moveTo(p[0].x, p[0].y);
        ctx.bezierCurveTo(
            p[1].x, p[1].y,
            p[2].x, p[2].y,
            p[3].x, p[3].y,
        );
        ctx.stroke();
        ctx.lineWidth = w;
        this.drawPoints(ctx);
    }

    drawPoints(ctx) {
        const w = ctx.lineWidth;
        ctx.lineWidth = 2;
        ctx.strokeStyle = `#999`;
        const colors = [`red`, `green`, `blue`, `yellow`]
        this.points.forEach((p,i) => {
            ctx.fillStyle = colors[i];
            ctx.beginPath();
            ctx.arc(p.x, p.y, 5, 0, 2*Math.PI);
            ctx.fill();
            ctx.stroke();
        });
        ctx.lineWidth = w;
    }

    drawSkeleton(ctx) {
        const p = this.points;
        ctx.strokeStyle = `#555`;
        ctx.beginPath();
        ctx.moveTo(p[0].x, p[0].y);
        ctx.lineTo(p[1].x, p[1].y);
        ctx.lineTo(p[2].x, p[2].y);
        ctx.lineTo(p[3].x, p[3].y);
        ctx.stroke();
    }
}
