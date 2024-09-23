export class RuinBloc {
    x;
    y;

    w;
    h;

    _sprite;
    _body;

    constructor(x, y, w, h) {

        console.log("Creating block", x, y, w, h);
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;

        this.createSprite();
    }

    createSprite() {
        const colors = [
            '#848484',
            '#c1c1c1',
            '#aaaaaa',
        ];

        this._sprite = document.createElement('canvas');
        this._sprite.width = this.w;
        this._sprite.height = this.h;
        const ctx = this._sprite.getContext('2d');

        let num = 2 + Math.floor(Math.random() * 4);
        
        for (let i = 0; i < num; i++) {
            let color = colors[i % 3];

            let gap = 30 + (Math.random() * 10);
            let w = this.w - (i * gap);
            let h = this.h - (i * gap);
            if (w < 10 || h < 10) {
                return;
            }
            let x = (this.w - w) / 2;
            let y = (this.h - h) / 2;
            
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.roundRect(x, y, w, h, 30);
            ctx.fill();
        }
    }

    get sprite() {
        return this._sprite.toDataURL();
    }
}
