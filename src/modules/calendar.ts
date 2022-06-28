class Calendar {
    size = 2
    months: { name: string; days: Availability[] }[]
    
    constructor() {
        const thisMonth = new Date().getMonth()

        this.months = []

        for (let i = 0; i < this.size; i++) {
            const length = new Date(
                new Date().getFullYear(),
                thisMonth + i + 1,
                0
            ).getDate()

            this.months[i] = {
                name: monthNames[(thisMonth + i) % 12],
                days: new Array<Availability>(length).fill(2)
            }
        }
    }
}

const monthNames = [
    'Leden',
    'Únor',
    'Březen',
    'Duben',
    'Květen',
    'Červen',
    'Červenec',
    'Srpen',
    'Září',
    'Říjen',
    'Listopad',
    'Prosinec',
]

const calendar = new Calendar()
console.log(calendar);

;(window as any).calendar = calendar




type Availability = 0 | 1 | 2