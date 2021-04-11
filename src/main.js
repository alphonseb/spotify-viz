import { timelineSketch } from './viz/timeline'
import { graphSketch } from './viz/graph'
new p5(timelineSketch);
new p5(graphSketch);

// window.scrollBy(0, 300)
window.addEventListener('wheel', ({ deltaX, deltaY }) => {
    
    if (!deltaX) {
        console.log('hello', deltaY);
        window.scrollBy(deltaY, 0)
    }
})
