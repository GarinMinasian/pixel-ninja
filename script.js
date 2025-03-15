const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const objects = [];
let score = 0;
let gameOver = false;

class GameObject {
    constructor(x, y, radius, color, type) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.type = type;
        this.velocityY = Math.random() * 3 + 2;
        this.markedForDeletion = false;
    }

    update() {
        this.y += this.velocityY;
        if (this.y - this.radius > canvas.height) {
            this.markedForDeletion = true;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

function spawnObjects() {
    if (Math.random() < 0.08) {
        const x = Math.random() * canvas.width;
        const type = Math.random() < 0.8 ? "fruit" : "bomb";
        const color = type === "fruit" ? "red" : "black";
        const radius = type === "fruit" ? 30 : 40;
        objects.push(new GameObject(x, -radius, radius, color, type));
    }
}

canvas.addEventListener("click", (e) => {
    objects.forEach(obj => {
        const dist = Math.hypot(e.clientX - obj.x, e.clientY - obj.y);
        if (dist < obj.radius) {
            if (obj.type === "fruit") {
                score += 10;
            } else {
                gameOver = true;
            }
            obj.markedForDeletion = true;
        }
    });
});

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    objects.forEach(obj => obj.update());
    objects.forEach(obj => obj.draw());

    objects.forEach((obj, index) => {
        if (obj.markedForDeletion) objects.splice(index, 1);
    });

    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.fillText(`Score: ${score}`, 20, 40);

    if (!gameOver) {
        requestAnimationFrame(updateGame);
    } else {
        ctx.fillStyle = "red";
        ctx.font = "48px Arial";
        ctx.fillText("Game Over!", canvas.width / 2 - 100, canvas.height / 2);
    }
}

setInterval(spawnObjects, 1000);
updateGame();
