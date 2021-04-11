import dataUrl from 'url:../sorted_final.csv'
import avenirLightUrl from 'url:../assets/Avenir/AvenirLight.ttf'
import avenirBoldUrl from 'url:../assets/Avenir/AvenirBold.ttf'

import { intToRGB, hashCode } from '../utils/colors'

const canvas = {
    width: 800,
    height: 600
}

export const graphSketch = (s) => {
    let table;
    let meanAcoustic = []
    let meanEnergy = []
    let timer = 0
    const woodstockX = (9 * (canvas.width - canvas.width/3) / 20) + canvas.width / 6 
    
    s.preload = async () => {
        table = s.loadTable(dataUrl, 'csv', 'header')
        avenirLight = s.loadFont(avenirLightUrl)
        avenirBold = s.loadFont(avenirBoldUrl)
    }
    
    s.setup = () => {
        const cnv = s.createCanvas(canvas.width, canvas.height);
        cnv.id('p5-graph')
        cnv.parent('viz')
        s.background('#1E1E1E')
        s.fill('#292929')
        s.noStroke()
        s.rect(canvas.width / 6, 0, canvas.width / 6, canvas.height)
        s.rect(canvas.width * 3 /6, 0, canvas.width / 6, canvas.height)
        s.rect(canvas.width * 5 /6, 0, canvas.width / 6, canvas.height)
        
        s.strokeWeight(1)
        s.stroke('white')
        s.drawingContext.setLineDash([5])
        s.line(woodstockX, 0,woodstockX, canvas.height)
        s.drawingContext.setLineDash([])
        s.stroke('transparent')
        s.strokeWeight(0)
        
        s.fill('#1E1E1E')
        s.rect(woodstockX - 50, 10, 60, 50)
        s.fill('white')
        s.textAlign(s.CENTER)
        s.textFont(avenirBold, 20)
        s.text('1969', woodstockX, 30)
        s.textFont(avenirLight, 20)
        s.text('Woodstock', woodstockX, 50)
        s.textFont(avenirLight, 16)
        
        let accousticAccummulator = 0
        let energyAccummulator = 0
        let currentYear = 1960
        let counter = 0
        
        for (let r = 1; r < table.getRowCount(); r++) {
            if (table.getNum(r, 'year') !== currentYear || r === table.getRowCount() - 1) {
                meanAcoustic.push({
                    year: currentYear,
                    acousticness: accousticAccummulator / counter
                })
                if (currentYear%5 === 0) {
                    s.fill('#ED78AA')
                    s.noStroke()
                    
                    s.circle(((currentYear - 1960) * (canvas.width - canvas.width/3) / 20) + canvas.width/6, canvas.height - accousticAccummulator/counter * canvas.height, 7)
                    s.noFill()
                    s.stroke('#ED78AA')
                    s.strokeWeight(2)
                    s.circle(((currentYear - 1960) * (canvas.width - canvas.width/3) / 20) + canvas.width/6, canvas.height - accousticAccummulator/counter * canvas.height, 15)
                }
                meanEnergy.push({
                    year: currentYear,
                    energy: energyAccummulator / counter
                })
                if (currentYear % 5 === 0) {
                
                    s.fill('#F9E73C')
                    s.noStroke()
                    s.circle(((currentYear - 1960) * (canvas.width - canvas.width/3) / 20) + canvas.width/6, canvas.height - energyAccummulator / counter * canvas.height, 7)
                    s.noFill()
                    s.strokeWeight(2)
                    s.stroke('#F9E73C')
                    s.circle(((currentYear - 1960) * (canvas.width - canvas.width/3) / 20) + canvas.width/6, canvas.height - energyAccummulator / counter * canvas.height, 15)
                }
                currentYear = table.getNum(r, 'year')
                counter = 0
                accousticAccummulator = 0
                energyAccummulator = 0
            }
            counter += 1
            accousticAccummulator += table.getNum(r, 'acousticness')
            energyAccummulator += table.getNum(r, 'energy')
        }
    }
    
    s.draw = () => {
        s.stroke('#ED78AA')
        s.strokeWeight(2)
        s.noFill()
        
        s.beginShape()
        s.curveVertex(((meanAcoustic[0].year - 1960) * (canvas.width - canvas.width/3) / 20) + canvas.width / 6, canvas.height * (1 - meanAcoustic[0].acousticness))
        for (let index = 0; index < meanAcoustic.length; index++) {
            if (timer > (meanAcoustic[index].year - 1960) * 2) {
                
                s.curveVertex(((meanAcoustic[index].year - 1960) * (canvas.width - canvas.width/3) / 20) + canvas.width/6, canvas.height * (1 - meanAcoustic[index].acousticness))
                if (index === 20) {
                    s.curveVertex(((meanAcoustic[index].year - 1960) * (canvas.width - canvas.width/3) / 20) + canvas.width/6, canvas.height * (1 - meanAcoustic[index].acousticness))
                    
                }
            }
        }
        
        s.endShape()
        s.stroke('#F9E73C')
        s.strokeWeight(2)
        s.noFill()
        
        s.beginShape()
        s.curveVertex(((meanEnergy[0].year - 1960) * (canvas.width - canvas.width/3) / 20) + canvas.width/6, canvas.height * (1 - meanEnergy[0].energy))
        
        for (let index = 0; index < meanEnergy.length; index++) {
            if (timer > (meanEnergy[index].year - 1960) * 2) {
                
                s.curveVertex(((meanEnergy[index].year - 1960) * (canvas.width - canvas.width/3) / 20) + canvas.width / 6, canvas.height * (1 - meanEnergy[index].energy))
                if (index === 20) {
                    console.log('hey');
                    s.curveVertex(((meanEnergy[index].year - 1960) * (canvas.width - canvas.width/3) / 20) + canvas.width / 6, canvas.height * (1 - meanEnergy[index].energy))
                }
            }
        }
        s.endShape()
        timer += 1
    }
}