import stack from './router'
import { animations } from './animations'

const modifications = {
    '[ripple], [page], body > header, button, input[type="submit"], input[type="checkbox"] + label' (e) {
        e.addEventListener('pointerdown', () => animations.ripple(e))
        e.addEventListener('keydown', event => {
            if((event as KeyboardEvent).key == 'Enter') animations.ripple(e, 10)
        })
    },
    'dialog' (e) {
        e.setAttribute('open', '')
    },
    '[view]' (e) {
        e.onclick = (() => {
            const name = e.getAttribute('view')
            if(!name) return
            stack.push(name)
        })
    },
    '[page]' (e) {
        e.onclick = () => {
            const name = e.getAttribute('page')
            if(!name) return
            stack.bottom = name
        }
    },
    'textfield' (e) {
        e.setAttribute('contenteditable', '')

        const update = async () => e.innerText == ''
        ?  e.setAttribute('empty', '')
        :  e.removeAttribute('empty')

        update()
        e.oninput = update
    },
} as { [selector: string]: (e: HTMLElement) => any }


function init(element: Element) {
    //const element = (node as any).matches ? node as HTMLElement : null
    
    for (const selector in modifications) {
        if(element?.matches(selector)) modifications[selector](element as HTMLElement)
    }

    for(const i in element.children) {
        const child = element.children[i]
        if(!!child.getAttribute) init(child)
    }
}

document.querySelectorAll('body *').forEach(node => init(node))

const observer = new MutationObserver(records =>
    records.forEach(record =>
        record.addedNodes.forEach(node => 
            (node as any).matches && init(node as HTMLElement)
        )
    )
)
observer.observe(document.body, {
    childList: true,
    subtree: true
})