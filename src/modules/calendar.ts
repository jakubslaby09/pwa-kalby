import { auth, db } from "./firebase"
import { ref, get, set} from "firebase/database"
import { onAuthStateChanged } from "firebase/auth"

declare global {
    interface Window {
        calendar: Calendar | null,
        Alpine: any,
    }
}

const advance = 2
let calendar: Calendar | null = null
window.calendar = calendar

onAuthStateChanged(auth, async () => {
    calendar = await getCalendar()
})

function updateCalendar(calendar: Calendar) {
    const firstMonth = new Date().getMonth()
    const firstYear = new Date().getFullYear()

    for (let i = firstMonth; i < firstMonth + advance; i++) {
        const length = new Date(new Date().getFullYear(), i + 1, 0).getDate()
        const date = new Date(firstYear, i)
        const name = date.getFullYear() + '-' + date.toLocaleString('cs', {
            month: '2-digit'
        })

        if(calendar[name]) continue
        calendar[name] = new Array<Availability>(length).fill(2)
    }

    const sorted: Calendar = {}
    Object.getOwnPropertyNames(calendar)
        .sort((a, b) => a.localeCompare(b))
        .forEach(key => sorted[key] = calendar[key])

    return sorted
}

async function getCalendar() {
    if(!auth.currentUser) await new Promise(r => onAuthStateChanged(auth, r))
    if(!auth.currentUser) return null

    const calendarRef = ref(db, `calendars/${auth.currentUser?.uid}`)
    const snap = await get(calendarRef)
    console.log(snap)
    
    if(!snap.exists()) {
        console.log('vytváření uživatele')
        const calendar = updateCalendar({
            /* '2022-06': [0, 0, 0, 0, 1, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 1, 0, 2] */
        })
        set(ref(db, `calendars/${auth.currentUser?.uid}`), calendar)
        return calendar
    }

    const calendar = updateCalendar(snap.toJSON() as Calendar)
    window.Alpine.store('calendar', calendar)
    return calendar
}

async function saveCalendar() {
    if(!calendar) return

    const calendarRef = ref(db, `calendars/${auth.currentUser?.uid}`)
    set(calendarRef, updateCalendar(calendar))
}
window.Alpine.store('save', saveCalendar)

type Availability = 0 | 1 | 2
type Calendar = {
    [name: string]: Availability[]
}