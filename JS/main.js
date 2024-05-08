// Obtener el canvas y el contexto
const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

// Obtener las dimensiones de la pantalla actual
const window_height = window.innerHeight;
const window_width = window.innerWidth;

// Establecer el tamaño del canvas
canvas.height = window_height;
canvas.width = window_width;

// Establecer el fondo del canvas
canvas.style.background = "Black";

// Definir la clase Circle para crear objetos circulares
class Circle {
    constructor(x, y, radius, color, dx, dy) {
        this.x = x; // Posición en el eje X
        this.y = y; // Posición en el eje Y
        this.radius = radius; // Radio del círculo
        this.color = color; // Color del círculo
        this.dx = dx; // Velocidad en el eje X
        this.dy = dy; // Velocidad en el eje Y
    }

    // Método para dibujar el círculo en el canvas
    draw(context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
        context.closePath();
    }

    // Método para actualizar la posición del círculo
    update() {
        // Rebotar en los bordes horizontales
        if (this.x + this.radius > window_width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }

        // Rebotar en los bordes verticales
        if (this.y + this.radius > window_height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        // Mover el círculo
        this.x += this.dx;
        this.y += this.dy;
    }

    // Método para verificar colisión con otro círculo y rebotar
    checkCollision(circle) {
        let dx = circle.x - this.x;
        let dy = circle.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.radius + circle.radius) {
            // Calcular el ángulo de colisión
            let angle = Math.atan2(dy, dx);
            let sin = Math.sin(angle);
            let cos = Math.cos(angle);

            // Rotar los puntos de colisión
            let x1 = 0;
            let y1 = 0;

            // Rotar este círculo
            let x2 = dx * cos + dy * sin;
            let y2 = dy * cos - dx * sin;

            // Rotar el otro círculo
            let x3 = this.dx * cos + this.dy * sin;
            let y3 = this.dy * cos - this.dx * sin;
            let x4 = circle.dx * cos + circle.dy * sin;
            let y4 = circle.dy * cos - circle.dx * sin;

            // Calcular las nuevas velocidades
            let vx1 = ((this.radius - circle.radius) * x3 + (2 * circle.radius) * x4) / (this.radius + circle.radius);
            let vy1 = y3;
            let vx2 = ((2 * this.radius) * x3 + (circle.radius - this.radius) * x4) / (this.radius + circle.radius);
            let vy2 = y4;

            // Actualizar las velocidades
            this.dx = vx1 * cos - vy1 * sin;
            this.dy = vy1 * cos + vx1 * sin;
            circle.dx = vx2 * cos - vy2 * sin;
            circle.dy = vy2 * cos + vx2 * sin;

            // Mover los círculos para evitar que queden superpuestos
            let overlap = this.radius + circle.radius - distance;
            this.x -= overlap * cos;
            this.y -= overlap * sin;
            circle.x += overlap * cos;
            circle.y += overlap * sin;
        }
    }
}

// Función para generar un número aleatorio entre min y max
function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

// Crear un arreglo de círculos
let arrayCircle = [];
let NumeroCirculos = 10; // Cambiar este valor para ajustar la cantidad de círculos

for (let i = 0; i < NumeroCirculos; i++) {
    let randomX = getRandomNumber(0, window_width);
    let randomY = getRandomNumber(0, window_height);
    let randomRadius = getRandomNumber(10, 50);
    let randomSpeedX = getRandomNumber(-5, 5);
    let randomSpeedY = getRandomNumber(-5, 5);

    let miCirculo = new Circle(randomX, randomY, randomRadius, 'blue', randomSpeedX, randomSpeedY);

    arrayCircle.push(miCirculo);
}


// Función para animar los círculos
function animate() {
    // Limpiar el lienzo
    ctx.clearRect(0, 0, window_width, window_height);

    // Actualizar y dibujar los círculos
    arrayCircle.forEach(circle => {
        circle.update();
        circle.draw(ctx);
    });

    // Verificar colisión entre los círculos y rebotar
    for (let i = 0; i < arrayCircle.length; i++) {
        for (let j = i + 1; j < arrayCircle.length; j++) {
            arrayCircle[i].checkCollision(arrayCircle[j]);
        }
    }

    // Solicitar el siguiente cuadro de animación
    requestAnimationFrame(animate);
}

// Iniciar la animación
animate();
