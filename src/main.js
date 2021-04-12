import { timelineSketch } from './viz/timeline'
import { graphSketch } from './viz/graph'

new p5(timelineSketch);
new p5(graphSketch);

const body = document.querySelector('body')
const horizontal = document.querySelector('.horizontal')
const children = document.querySelectorAll('.horizontal > *')
let scroll = 0
let size = 0
for (const child of children) {
    size += child.clientWidth
}
size -= body.clientWidth

const timeline = document.querySelector('.dataviz__timeline')
const graph = document.querySelector('.dataviz__graph-viz')

// window.scrollBy(0, 300)
window.addEventListener('wheel', ({ deltaX, deltaY }) => {
    scroll += deltaY
    if (scroll < 0) {
        scroll = 0
    }
    if (scroll > size) {
        scroll = size
    }
    
    for (const child of children) {
        child.style.transform = `translateX(${-scroll}px)`
    }
})

const observer = new IntersectionObserver((entries) => {
    for (const entry of entries) {
        if (entry.isIntersecting) {
            switch (entry.target) {
                case timeline:
                    window.dispatchEvent(new Event('timeline'))
                    break;
                    
                case graph:
                    window.dispatchEvent(new Event('graph'))
                    break;
            }
        }
    }
}, {
    root: body,
    threshold: 0.6
});


observer.observe(timeline);
observer.observe(graph);

