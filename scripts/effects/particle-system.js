export class ParticleSystem {
    constructor() {
        this.particles = [];
        this.mouseX = 0;
        this.mouseY = 0;
        this.animationFrameId = null;
        this.boundResize = this.resize.bind(this);
        this.boundMouseMove = this.handleMouseMove.bind(this);
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");
        this.canvas.className = "particle-canvas";

        document.body.insertBefore(this.canvas, document.body.firstChild);

        this.resize();
        this.animate();

        window.addEventListener("resize", this.boundResize);
        document.addEventListener("mousemove", this.boundMouseMove);
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createParticles();
    }

    createParticles() {
        this.particles = [];
        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile
            ? Math.min(Math.floor(window.innerWidth / 20), 30)
            : Math.min(Math.floor(window.innerWidth / 10), 100);

        for (let index = 0; index < particleCount; index += 1) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 2 + 1,
                color: "rgba(59, 130, 246, 0.3)",
                vx: Math.random() * 0.5 - 0.25,
                vy: Math.random() * 0.5 - 0.25,
                originX: Math.random() * this.canvas.width,
                originY: Math.random() * this.canvas.height
            });
        }
    }

    handleMouseMove(event) {
        this.mouseX = event.clientX;
        this.mouseY = event.clientY;
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((particle, index) => {
            const dx = this.mouseX - particle.x;
            const dy = this.mouseY - particle.y;
            const distance = Math.hypot(dx, dy);

            if (distance < 100) {
                const angle = Math.atan2(dy, dx);
                const force = (100 - distance) / 10;
                particle.vx -= Math.cos(angle) * force;
                particle.vy -= Math.sin(angle) * force;
            }

            particle.vx += (particle.originX - particle.x) * 0.01;
            particle.vy += (particle.originY - particle.y) * 0.01;
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.vx *= 0.95;
            particle.vy *= 0.95;

            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();

            for (let nextIndex = index + 1; nextIndex < this.particles.length; nextIndex += 1) {
                const other = this.particles[nextIndex];
                const xDiff = particle.x - other.x;
                const yDiff = particle.y - other.y;
                const linkDistance = Math.hypot(xDiff, yDiff);

                if (linkDistance < 100) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.strokeStyle = `rgba(59, 130, 246, ${0.2 * (1 - linkDistance / 100)})`;
                    this.ctx.stroke();
                }
            }
        });

        this.animationFrameId = window.requestAnimationFrame(() => this.animate());
    }

    destroy() {
        window.cancelAnimationFrame(this.animationFrameId);
        window.removeEventListener("resize", this.boundResize);
        document.removeEventListener("mousemove", this.boundMouseMove);
        this.canvas.remove();
    }
}
