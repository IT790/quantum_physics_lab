// To Do:
// Boson interaction functions
// Prioritise weak interaction, then electromagnetic, then strong
// Weak interaction - beta decay, absorption/emission, boson decay, x transmutation of quarks, leptons, neutrinos
// Electromagnetic interaction - x absorption/emission, pair production, annihilation, scattering, bremsstrahlung, synchrotron radiation
// Strong interaction - gluon exchange, quark confinement, hadronisation, jet formation
//x Fermion dispersion function (improvements)
// Fermion interactions, composite particles
// Change properties of particles e.g. colour charge, spin
// Move particles and change their momentum/velocity
// Higgs Boson
// Theoretical particles e.g. graviton, sterile neutrino, dark matter particles, magnetic monopole, (preons?)
const canvas = document.getElementById("labcanvas");
const ctx = canvas.getContext("2d");
let height = canvas.height;
let width = canvas.width;
let frame = 0;
let runtime = 0;
let class_list = [];
let key_list = [];
let event_list = [];
let change = false;
let pause = false;
let index = 1;
let select = null;
let event_save = 0;
let index_save = 0;
let colour_save = [0, 0, 0];
class quark {
    constructor(name, index, exists, text, colour, radius, cx, cy, vx, vy, mass, charge, colour_charge, spin, baryon_number, bonded) {
        this.name = name;
        this.index = index;
        this.exists = exists;
        this.text = text;
        this.colour = colour;
        this.radius = radius;
        this.cx = cx;
        this.cy = cy;
        this.vx = vx;
        this.vy = vy;
        this.mass = mass; 
        this.charge = charge;
        this.colour_charge = colour_charge;
        this.spin = spin;
        this.baryon_number = baryon_number;
        this.bonded = bonded;
    }
    evolution() {
        this.cx += this.vx;
        this.cy += this.vy;
        if (this.cx + this.radius > width || this.cx - this.radius < 0) {
            this.vx = -this.vx;
            this.cx += this.vx;
        }
        if (this.cy + this.radius > height || this.cy - this.radius < 0) {
            this.vy = -this.vy;
            this.cy += this.vy;
        }
    }
    dispersion() {
        if (this.exists && ! this.bonded) {
            for (let i = 0; i < class_list.length; i++) {
                if (this != class_list[i]) {
                    let theta = 0;
                    let dx = class_list[i].cx - this.cx;
                    let dy = this.cy - class_list[i].cy;
                    let A = (dx**2 + dy**2)**(1/2);
                    if (dx == 0) {
                        theta = Math.PI/2;
                    }
                    else {
                        theta = Math.atan(dy/dx);
                    }
                    if (theta <= 0) {
                        theta += Math.PI; 
                    }
                    if (dy <= 0) {
                        theta += Math.PI;
                    }
                    this.cx += 30*Math.cos(theta)/(A+2)**2;
                    this.cy += 30*Math.sin(theta)/(A+2)**2;
                }
            }
        }
    }
    decay() {
        let type = this.name.split(" ")[0];
        let rand = Math.random();
        let theta = Math.random*2*Math.PI;
        if (this.exists && this.bonded) {
            let invert = -this.vx/Math.abs(this.vx)
            if (type == "top") {
                if (rand <= 0.05) {
                    this.exists = false;
                    class_list.push(new quark("bottom quark", index++, true, "b", this.colour, 18, this.cx, this.cy, invert, 1, 173210, -1, [1, 0, 0], 1/2, 1));
                    class_list.push(new boson("W- boson", index++, true, "W-", [255, 255, 255], 10, this.cx, this.cy, 2, 2*invert, 80379, -3, 10000, 1));
                    event_list.push(Array(String("a top quark decayed into a bottom quark and W- boson"), String("force")))
                }
            }
            if (type == "bottom") {
                if (rand <= 0.02) {
                    this.exists = false;
                    class_list.push(new quark("charm quark", index++, true, "c", this.colour, 18, this.cx, this.cy, invert, 1, 1275, 2, [1, 0, 0], 1/2, 1));
                    class_list.push(new boson("W+ boson", index++, true, "W+", [255, 255, 255], 10, this.cx, this.cy, 2, 2*invert, 80379, 3, 10000, 1));
                    event_list.push(Array(String("a bottom quark decayed into a charm quark and W+ boson"), String("force")))
                }
            }
            if (type == "charm") {
                if (rand <= 0.01) {
                    this.exists = false;
                    class_list.push(new quark("strange quark", index++, true, "s", this.colour, 18, this.cx, this.cy, invert, 1, 95, -1, [1, 0, 0], 1/2, 1));
                    class_list.push(new boson("W- boson", index++, true, "W-", [255, 255, 255], 10, this.cx, this.cy, 2, 2*invert, 80379, -3, 10000, 1));
                    event_list.push(Array(String("a charm quark decayed into a strange quark and W- boson"), String("force")))
                }
            }
            if (type == "strange") {
                if (rand <= 0.005) {
                    this.exists = false;
                    class_list.push(new quark("up quark", index++, true, "u", this.colour, 18, this.cx, this.cy, invert, 1, 2.3, 2, [1, 0, 0], 1/2, 1));
                    class_list.push(new boson("W+ boson", index++, true, "W+", [255, 255, 255], 10, this.cx, this.cy, 2, 2*invert, 80379, 3, 10000, 1));
                    event_list.push(Array(String("a strange quark decayed into an up quark and W+ boson"), String("force")))
                }
            }
            if (type == "up") {
                null;
            }
            if (type == "down") {
                null;
            }
        }
    }
}
class lepton {
    constructor(name, index, exists, text, colour, radius, cx, cy, vx, vy, mass, charge, spin) {
        this.name = name;
        this.index = index;
        this.exists = exists;
        this.text = text;
        this.colour = colour;
        this.radius = radius;
        this.cx = cx;
        this.cy = cy;
        this.vx = vx;
        this.vy = vy;
        this.mass = mass;
        this.charge = charge;
        this.spin = spin;
    }
    evolution() {
        this.cx += this.vx;
        this.cy += this.vy;
        if (this.cx + this.radius > width || this.cx - this.radius < 0) {
            this.vx = -this.vx;
            this.cx += this.vx;
        }
        if (this.cy + this.radius > height || this.cy - this.radius < 0) {
            this.vy = -this.vy;
            this.cy += this.vy;
        }
    }
}
class boson {
    constructor(name, index, exists, text, colour, radius, cx, cy, vx, vy, mass, charge, energy, spin) {
        this.name = name;
        this.index = index;
        this.exists = exists;
        this.text = text;
        this.colour = colour;
        this.radius = radius;
        this.cx = cx;
        this.cy = cy;
        this.vx = vx;
        this.vy = vy;
        this.mass = mass;
        this.charge = charge;
        this.energy = energy;
        this.spin = spin;
    }
    evolution() {
        this.cx += this.vx;
        this.cy += this.vy;
        if (this.cx + this.radius > width || this.cx - this.radius < 0) {
            this.vx = -this.vx;
        }
        if (this.cy + this.radius > height || this.cy - this.radius < 0) {
            this.vy = -this.vy;
        }
    }
    gluon_interaction() {
        null;
    }
    photon_interaction() {
        for (let i = 0; i < class_list.length; i++) {
            if ((class_list[i].cx - this.cx)**2 + (class_list[i].cy - this.cy)**2 <= 225 && this != class_list[i]) {
                this.exists = false;
                event_list.push(Array("a photon was absorbed by a " + class_list[i].name, "EM"));
            }
        }
    }
    Z_boson_interaction() {
        null;
    }
    W_boson_interaction() {
        null;
    }
}
class composite {
    constructor(name, indexes, exists, text, colour, radius, cx, cy, vx, vy, mass, charge, spin, momentum) {
        this.name = name;
        this.indexes = indexes;
        this.exists = exists;
        this.text = text;
        this.colour = colour;
        this.radius = radius; 
        this.cx = cx;
        this.cy = cy;
        this.vx = vx;
        this.vy = vy;
        this.mass = mass;
        this.charge = charge;
        this.spin = spin;
        this.momentum = momentum;
    }
    evolution() {
        this.cx += this.vx;
        this.cy += this.vy;
        if (this.cx + this.radius > width || this.cx - this.radius < 0) {
            this.vx = -this.vx;
        }
        if (this.cy + this.radius > height || this.cy - this.radius < 0) {
            this.vy = -this.vy;
        }
    }
}
document.addEventListener("keydown", (event) => {
    if (!key_list.includes(event.key)) {
        key_list.push(event.key);
        change = true;
    }
})
document.addEventListener("keyup", (event) => {
    key_list.splice(key_list.indexOf(event.key), 2);
})
document.addEventListener("click", (event) => {
    const x = event.clientX - canvas.getBoundingClientRect().left;
    const y = event.clientY - canvas.getBoundingClientRect().top;
    if (x < 0 || x > width || y < 0 || y > height) {
        select = null;
    }
    for (let i = 0; i < class_list.length; i++) {
        if (i == select) {
            class_list[i].cx = x;
            class_list[i].cy = y;
            select = null;
            document.getElementById("edit").disabled = true;
            document.getElementById("submit").disabled = true;
        }
        else {
            if ((x - class_list[i].cx)**2 + (y - class_list[i].cy)**2 <= (class_list[i].radius + 2)**2) {
                select = i;
                document.getElementById("edit").disabled = false;
                document.getElementById("submit").disabled = false;
                if (class_list[i] instanceof quark) {
                    document.getElementById("information").innerText = `Name: ${class_list[i].name}\nMass: ${class_list[i].mass} MeV/c^2\nCharge: ${class_list[i].charge/3} e\nSpin: ${class_list[i].spin} ħ\nColour Charge: ${class_list[i].colour_charge}\nBaryon Number: ${class_list[i].baryon_number/3}\nBonded: ${class_list[i].bonded}`;
                    document.getElementById("edit").value = `spin=${class_list[i].spin},colour_charge=[${class_list[i].colour_charge[0]}, ${class_list[i].colour_charge[1]}, ${class_list[i].colour_charge[2]}];vx${class_list[i].vx};vy${class_list[i].vy}`;
                }
                else if (class_list[i] instanceof lepton) {
                    document.getElementById("information").innerText = `Name: ${class_list[i].name}\nMass: ${class_list[i].mass} MeV/c^2\nCharge: ${class_list[i].charge/3} e\nSpin: ${class_list[i].spin} ħ\nColour Charge: ${class_list[i].colour_charge}\nBaryon Number: ${class_list[i].baryon_number/3}`;
                    document.getElementById("edit").value = `spin=${class_list[i].spin};vx${class_list[i].vx};vy${class_list[i].vy}`;
                }
                else if (class_list[i] instanceof boson) {
                    document.getElementById("information").innerText = `Name: ${class_list[i].name}\nMass: ${class_list[i].mass} MeV/c^2\nCharge: ${class_list[i].charge/3} e\nSpin: ${class_list[i].spin} ħ\nEnergy: ${class_list[i].energy} MeV`;
                    document.getElementById("edit").value = `spin=${class_list[i].spin};vx${class_list[i].vx};vy${class_list[i].vy}`;
                }
            }
        }
    }
})
function submit() {
    let str = null;
    if (select != null) {
        console.log("AAAA");
        str = document.getElementById("edit").value;
        console.log(str);
    }
    if (str == null) {
        event_list.push(Array(String(class_list[select].name + " properties were updated"), String("submit")));
        if (class_list[select] instanceof quark) {
            for (let i = 0; i < document.getElementById("edit").value.split(" ").length; i++) {
                if (typeof(document.getElementById("edit").value.split(" ")[i]) != "str") {
                }
            }
        }
        if (class_list[select] instanceof lepton) {}
        if (class_list[select] instanceof boson) {}
        if (class_list[select] instanceof composite) {}
    }
}
function strong() {null}
function electromagnetism() {
    for (let i = 0; i < class_list.length; i++) {
        if (class_list[i].charge != 0) {
            for (let j = 0; j < class_list.length; j++) {
                if (class_list[j].charge/class_list[i].charge < 0 && i != j) {
                    let theta = 0;
                    let dx = class_list[i].cx - class_list[j].cx;
                    let dy = class_list[i].cy - class_list[j].cy;
                    let A = (dx**2 + dy**2)**(1/2);
                    if (event_list.length > 0) {
                        if ("mediated" in event_list[event_list.length - 1][1].split(" ")) {
                            console.log("c")
                            class_list.push(new boson("photon", index++, true, "γ", [255, 255, 255], 10, class_list[i].cx, class_list[i].cy, 7*dx/A, 7*dy/A, 0, 0, 10000, 1));
                            event_list.push(Array(String("a photon mediated the electromagnetic force between a " + class_list[i].name +  " and " + class_list[j].name), String("EM")));
                        }
                    }
                }
            }
        }
    }
}
function weak() {null}
append_list = (arr) => {
    const list = document.getElementById("log");
    const item = document.createElement("li");
    item.textContent = arr[0];
    list.appendChild(item);
}
function key_bind() {
    index_save = index;
    if (key_list.includes("q")) {
        if (key_list.includes("1")) {
            class_list.push(new quark("up quark", index++, true, "u", [0, 0, 255], 18, 500, 300, 1, 1, 2.3, 2, [0, 0, 1], 1/2, 1, false));
        }
        if (key_list.includes("2")) {
            class_list.push(new quark("down quark", index++, true, "d", [0, 0, 255], 18, 500, 300, 1, 1, 4.8, -1, [0, 0, 1], 1/2, 1, false));
        }
        if (key_list.includes("3")) {
            class_list.push(new quark("charm quark", index++, true, "c", [0, 0, 255], 18, 500, 300, 1, 1, 1275, 2, [0, 0, 1], 1/2, 1, false));
        }
        if (key_list.includes("4")) {
            class_list.push(new quark("strange quark", index++, true, "s", [0, 0, 255], 18, 500, 300, 1, 1, 95, -1, [0, 0, 1], 1/2, 1, false));
        }
        if (key_list.includes("5")) {
            class_list.push(new quark("top quark", index++, true, "t", [0, 0, 255], 18, 500, 300, 1, 1, 173210, 2, [0, 0, 1], 1/2, 1, false));
        }
        if (key_list.includes("6")) {
            class_list.push(new quark("bottom quark", index++, true, "b", [0, 0, 255], 18, 500, 300, 1, 1, 4180, -1, [0, 0, 1], 1/2, 1, false));
        }
        if (key_list.includes("7")) {
            class_list.push(new quark("antiup quark", index++, true, "u", [255, 255, 0], 18, 500, 300, 1, 1, 2.3, -2, [0, 0, -1], 1/2, -1, false));
        }
        if (key_list.includes("8")) {
            class_list.push(new quark("antidown quark", index++, true, "d", [255, 255, 0], 18, 500, 300, 1, 1, 4.8, 1, [0, 0, -1], 1/2, -1, false));
        }
        if (key_list.includes("9")) {
            class_list.push(new quark("anticharm quark", index++, true, "c", [255, 255, 0], 18, 500, 300, 1, 1, 1275, -2, [0, 0, -1], 1/2, -1, false));
        }
        if (key_list.includes("0")) {
            class_list.push(new quark("antistrange quark", index++, true, "s", [255, 255, 0], 18, 500, 300, 1, 1, 95, 1, [0, 0, -1], 1/2, -1, false));
        }
        if (key_list.includes("-")) {
            class_list.push(new quark("antitop quark", index++, true, "t", [255, 255, 0], 18, 500, 300, 1, 1, 173210, -2, [0, 0, -1], 1/2, -1, false));
        }
        if (key_list.includes("=")) {
            class_list.push(new quark("antibottom quark", index++, true, "b", [255, 255, 0], 18, 500, 300, 1, 1, 4180, 1, [0, 0, -1], 1/2, -1, false));
        }
    }
    if (key_list.includes("w")) {
        if (key_list.includes("1")) {
            class_list.push(new lepton("electron", index++, true, "e-", [216, 216, 216], 10, 500, 300, 2, 2, 0.510998910, -3, [0, 0, 0], 1/2, 0));
        }
        if (key_list.includes("2")) {
            class_list.push(new lepton("electron neutrino", index++, true, "νe", [255, 255, 255], 10, 500, 300, 2, 2, 0.0000022, 0, [0, 0, 0], 1/2, 0));
        }
        if (key_list.includes("3")) {
            class_list.push(new lepton("muon", index++, true, "μ-", [216, 216, 216], 10, 500, 300, 2, 2, 105.6583668, -3, [0, 0, 0], 1/2, 0));
        }
        if (key_list.includes("4")) {
            class_list.push(new lepton("muon neutrino", index++, true, "νμ", [255, 255, 255], 10, 500, 300, 2, 2, 0.17, 0, [0, 0, 0], 1/2, 0));
        }
        if (key_list.includes("5")) {
            class_list.push(new lepton("tau", index++, true, "τ-", [216, 216, 216], 10, 500, 300, 2, 2, 1776.84, -3, [0, 0, 0], 1/2, 0));
        }
        if (key_list.includes("6")) {
            class_list.push(new lepton("tau neutrino", index++, true, "ντ", [255, 255, 255], 10, 500, 300, 2, 2, 15.5, 0, [0, 0, 0], 1/2, 0));
        }
        if (key_list.includes("7")) {
            class_list.push(new lepton("positron", index++, true, "e+", [216, 216, 216], 10, 500, 300, 2, 2, 0.510998910, 3, [0, 0, 0], 1/2, 0));
        }
        if (key_list.includes("8")) {
            class_list.push(new lepton("electron antineutrino", index++, true, "νe", [255, 255, 255], 10, 500, 300, 2, 2, 0.0000022, 0, [0, 0, 0], 1/2, 0));
        }
        if (key_list.includes("9")) {
            class_list.push(new lepton("antimuon", index++, true, "μ+", [216, 216, 216], 10, 500, 300, 2, 2, 105.6583668, 3, [0, 0, 0], 1/2, 0));
        }
        if (key_list.includes("0")) {
            class_list.push(new lepton("muon antineutrino", index++, true, "νμ", [255, 255, 255], 10, 500, 300, 2, 2, 0.17, 0, [0, 0, 0], 1/2, 0));
        }
        if (key_list.includes("-")) {
            class_list.push(new lepton("antitau", index++, true, "τ+", [216, 216, 216], 10, 500, 300, 2, 2, 1776.84, 3, [0, 0, 0], 1/2, 0));
        }
        if (key_list.includes("=")) {
            class_list.push(new lepton("tau antineutrino", index++, true, "ντ", [255, 255, 255], 10, 500, 300, 2, 2, 15.5, 0, [0, 0, 0], 1/2, 0));
        }
    }
    if (key_list.includes("e")) {
        if (key_list.includes("1")) {
            class_list.push(new boson("gluon", index++, true, "g", [255, 255, 255], 10, 500, 300, 5, 5, 0, 0, 10000, 1));
        }
        if (key_list.includes("2")) {
            class_list.push(new boson("photon", index++, true, "γ", [255, 255, 255], 10, 500, 300, 5, 5, 0, 0, 10000, 1));
        }
        if (key_list.includes("3")) {
            class_list.push(new boson("Z boson", index++, true, "Z0", [255, 255, 255], 10, 500, 300, 5, 5, 91187.6, 0, 10000, 1));
        }
        if (key_list.includes("4")) {
            class_list.push(new boson("W+ boson", index++, true, "W+", [255, 255, 255], 10, 500, 300, 5, 5, 80379, 3, 10000, 1));
        }
        if (key_list.includes("5")) {
            class_list.push(new boson("W- boson", index++, true, "W-", [255, 255, 255], 10, 500, 300, 5, 5, 80379, -3, 10000, 1));
        }
    }
    if (key_list.includes("r")) {
        if (key_list.includes("1")) {
            class_list.push(new quark("up quark", index++, false, "u", [0, 0, 255], 18, 500, 300, 0, 0, 2.3, 2, [0, 0, 1], 1/2, 1, true));
            class_list.push(new quark("up quark", index++, false, "u", [0, 0, 255], 18, 500, 300, 0, 0, 2.3, 2, [0, 0, 1], 1/2, 1, true));
            class_list.push(new quark("down quark", index++, false, "d", [0, 0, 255], 18, 500, 300, 0, 0, 4.8, -1, [0, 0, 1], 1/2, 1, true));
            class_list.push(new composite("proton", index++, true, "uud", [255, 40, 40], 25, 500, 300, 1, 1, null, 3, 1/2, 1));
        }
        if (key_list.includes("2")) {
            class_list.push(new quark("up quark", index++, false, "u", [0, 0, 255], 18, 500, 300, 0, 0, 2.3, 1, 2, [0, 0, 1], 1/2, 1, true));
            class_list.push(new quark("down quark", index++, false, "d", [0, 0, 255], 18, 500, 300, 0, 0, 4.8, 0, -1, [0, 0, 1], 1/2, 1, true));
            class_list.push(new quark("down quark", index++, false, "d", [0, 0, 255], 18, 500, 300, 0, 0, 4.8, 0, -1, [0, 0, 1], 1/2, 1, true));
            class_list.push(new composite("neutron", index++, true, "udd", [160, 160, 160], 25, 500, 300, 1, 1, null, 0, 1/2, 1));
        }
        if (key_list.includes("3")) {
            class_list.push(new quark("up quark", index++, false, "u", [0, 0, 255], 18, 500, 300, 0, 0, 2.3, 2, [0, 0, 1], 1/2, 1, true));
            class_list.push(new quark("antiup quark", index++, false, "u", [255, 255, 0], 18, 500, 300, 0, 0, 2.3, -2, [0, 0, -1], 1/2, 1, true));
            class_list.push(new composite("pion", index++, true, "π", [160, 160, 160], 25, 500, 300, 0, 1, 1, 3, 1/2, 1))
        }
    }
    if (index_save != index) {
        event_list.push(Array(String("a new " + class_list[class_list.length - 1].name + " was created"), String("create")));
    }
}
function update() {
    ctx.clearRect(0, 0, width, height);
    if (change) {
        if (key_list.includes("p")) {
            pause = !pause;
        }
        key_bind();
    }
    change = false;
    runtime += 1;
    if (!pause) {
        frame += 1;
        for (let i = 0; i < class_list.length; i++) {
            if (class_list[i].exists) {
                class_list[i].evolution();
            }
        }
        for (let i = 0; i < class_list.length; i++) {
            if (class_list[i] instanceof quark && class_list[i].exists) {
                class_list[i].dispersion();
                class_list[i].decay();
            }
        }
        for (let i = 0; i < class_list.length; i++) {
            if (class_list[i] instanceof boson && class_list[i].exists) {
                if (class_list[i].name == "gluon") {
                    class_list[i].gluon_interaction();
                }
                if (class_list[i].name == "photon") {
                    class_list[i].photon_interaction();
                }
                if (class_list[i].name == "Z boson") {
                    class_list[i].Z_boson_interaction();
                }
                if (class_list[i].name == "W+ boson" || class_list[i].name == "W- boson") {
                    class_list[i].W_boson_interaction();
                }
            }
        }
    }
    strong()
    electromagnetism()
    weak()
    if (event_save != event_list.length) {
        document.getElementById("log").innerHTML = "";
        event_list.forEach(i => append_list(i));
    }
    event_save = event_list.length;
    for (let i = 0; i < class_list.length; i++) {
        if (class_list[i].exists) {
        ctx.lineWidth = 1;
        ctx.font = "bold 16px Arial";
        ctx.beginPath();
        ctx.arc(class_list[i].cx, class_list[i].cy, class_list[i].radius, 0, 2*Math.PI);
        if (!class_list[i].bonded) {
            for (let j = 0; j < 3; j++) {
                colour_save[j] = class_list[i].colour[j]
                if (class_list[i].colour[j] < 255) {
                    colour_save[j] = class_list[i].colour[1]*2/5 + 153; 
                }
            }
        }
        console.log(class_list[i].colour, colour_save)
        ctx.fillStyle = `rgb(${colour_save[0]}, ${colour_save[1]}, ${colour_save[2]})`;
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = "black";
        if (class_list[i] instanceof quark) {
            if (!class_list[i].bonded) {
                ctx.fillStyle = "gray";
            }
        }
        ctx.fillText(class_list[i].text, class_list[i].cx - 1 - 4*(class_list[i].text.length), class_list[i].cy + 5);
        }
    }
    if (select != null) {
        ctx.lineWidth = 4;
        if (class_list[i] instanceof quark) {
            if (!class_list[i].bonded) {
                ctx.lineWidth = 2;
            }
        }
        ctx.beginPath();
        ctx.arc(class_list[select].cx, class_list[select].cy, class_list[select].radius + 2, 0, 2*Math.PI);
        ctx.stroke();
    }
    ctx.fillStyle = "lightskyblue";
    ctx.beginPath();
    if (pause) {
        ctx.rect(20, 20, 6, 20);
        ctx.rect(30, 20, 6, 20);
    }
    else {
        ctx.moveTo(20, 20);
        ctx.lineTo(40, 30);
        ctx.lineTo(20, 40);
        ctx.closePath();
    }
    ctx.fill();
    requestAnimationFrame(update);
}
update();