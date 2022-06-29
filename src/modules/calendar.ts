import { auth, db } from "./firebase"
import { ref, get, set} from "firebase/database"
import { onAuthStateChanged } from "firebase/auth"

declare global {
    interface Window {
        calendar: Promise<Calendar | null>
    }
}

const advance = 3
let calendar: Promise<Calendar | null> = getCalendar()
window.calendar = calendar

//onAuthStateChanged(auth, () => calendar = getCalendar())

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
            /* '2022-06': [0, 0, 0, 0, 1, 2, 2, 2, 0, 0, 2, 2, 2, 2, 2, 2, 2, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2, 1, 0, 2],
            '2022-08': [0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 0, 2, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1] */
        })
        set(ref(db, `calendars/${auth.currentUser?.uid}`), calendar)
        return calendar
    }

    return updateCalendar(snap.toJSON() as Calendar)
}

async function setCalendar(calendar: Calendar) {
    const calendarRef = ref(db, `calendars/${auth.currentUser?.uid}`)
    set(calendarRef, updateCalendar(calendar))
}
(window as any).save = async () => await calendar != null ? setCalendar(await calendar as Calendar) : 0

type Availability = 0 | 1 | 2
type Calendar = {
    [name: string]: Availability[]
}