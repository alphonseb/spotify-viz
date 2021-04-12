import dataUrl from 'url:../sorted_final.csv'
import avenirLightUrl from 'url:../assets/Avenir/AvenirLight.ttf'
import avenirBoldUrl from 'url:../assets/Avenir/AvenirBold.ttf'
import avenirMediumUrl from 'url:../assets/Avenir/AvenirMedium.ttf'

import { intToRGB, hashCode } from '../utils/colors'

const canvas = {
    width: 600,
    height: 1.8* window.innerHeight / 3
}

export const graphSketch = (s) => {
    let table;
    let meanAcoustic = []
    let meanEnergy = []
    let timer = 0
    let start = false
    let avenirLight, avenirBold, avenirMedium
    const woodstockX = (9 * (canvas.width - canvas.width/3) / 20) + canvas.width / 6 
    
    s.preload = async () => {
        table = s.loadTable(dataUrl, 'csv', 'header')
        avenirLight = s.loadFont(avenirLightUrl)
        avenirBold = s.loadFont(avenirBoldUrl)
        avenirMedium = s.loadFont(avenirMediumUrl)
    }
    
    s.setup = () => {
        const cnv = s.createCanvas(canvas.width, canvas.height);
        cnv.id('p5-graph')
        cnv.parent('viz-graph')
        
        window.addEventListener('graph', () => {
            start = true
        })
        
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
                
                meanEnergy.push({
                    year: currentYear,
                    energy: energyAccummulator / counter
                })
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
        // s.clear()
        s.background('#1E1E1E')
        s.fill('#292929')
        s.noStroke()
        s.rect(canvas.width / 6, 0, canvas.width / 6, canvas.height)
        s.rect(canvas.width * 3 /6, 0, canvas.width / 6, canvas.height)
        s.rect(canvas.width * 5 /6, 0, canvas.width / 6, canvas.height)
        
        s.fill('#1E1E1E')
        s.rect(0, 0, canvas.width, 30)
        
        
        s.strokeWeight(1)
        s.stroke('white')
        s.drawingContext.setLineDash([5])
        s.line(woodstockX, 0,woodstockX, canvas.height)
        s.drawingContext.setLineDash([])
        s.stroke('transparent')
        s.strokeWeight(0)
        
        s.fill('#1E1E1E')
        s.rect(woodstockX - 50, 10, 60, 50)
        s.fill('white'
        )
        s.textAlign(s.CENTER)
        s.textFont(avenirBold, 20)
        s.text('1969', woodstockX, 30)
        s.textFont(avenirLight, 20)
        s.text('Woodstock', woodstockX, 50)
        s.textFont(avenirLight, 16)
        
        
        if (start) {
                
            
            
            s.stroke('#ED78AA')
            s.strokeWeight(2)
            s.noFill()
            
            s.beginShape()
            s.curveVertex(((meanAcoustic[0].year - 1960) * (canvas.width - canvas.width / 3) / 20) + canvas.width / 6, canvas.height * (1 - meanAcoustic[0].acousticness))
            for (let index = 0; index < meanAcoustic.length; index++) {
                
                const posX = ((meanAcoustic[index].year - 1960) * (canvas.width - canvas.width / 3) / 20) + canvas.width / 6
                const posY = (canvas.height - 50) * (1 - meanAcoustic[index].acousticness)
                if (timer > (meanAcoustic[index].year - 1960) * 2) {
                    
                    s.curveVertex(posX, posY)
                    if (index === 20) {
                        s.curveVertex(posX, posY)
                        
                    }
                }
                
                
                
            }
            s.endShape()
            
            
            s.stroke('#F9E73C')
            s.strokeWeight(2)
            s.noFill()
            
            s.beginShape()
            s.curveVertex(((meanEnergy[0].year - 1960) * (canvas.width - canvas.width / 3) / 20) + canvas.width / 6, canvas.height * (1 - meanEnergy[0].energy))
            
            for (let index = 0; index < meanEnergy.length; index++) {
                
                const posX = ((meanEnergy[index].year - 1960) * (canvas.width - canvas.width / 3) / 20) + canvas.width / 6
                const posY = (canvas.height - 50) * (1 - meanEnergy[index].energy)
                
                if (timer > (meanEnergy[index].year - 1960) * 2) {
                    
                    s.curveVertex(posX, posY)
                    if (index === 20) {
                        s.curveVertex(posX, posY)
                    }
                }
                
                
            }
            s.endShape()
            
            
            for (let i = 0; i < meanAcoustic.length; i += 5) {
                const posX = ((meanAcoustic[i].year - 1960) * (canvas.width - canvas.width / 3) / 20) + canvas.width / 6
                const posY = (canvas.height - 50) * (1 - meanAcoustic[i].acousticness)
                
                if (timer > (meanEnergy[i].year - 1960) * 2) {
                    s.fill('#1E1E1E')
                    s.stroke('#ED78AA')
                    s.strokeWeight(2)
                    s.circle(posX, posY, 15)
                    s.fill('#ED78AA')
                    s.noStroke()
                    
                    s.circle(posX, posY, 7)
                }
                
            }
            for (let i = 0; i < meanEnergy.length; i += 5) {
                
                const posX = ((meanEnergy[i].year - 1960) * (canvas.width - canvas.width / 3) / 20) + canvas.width / 6
                const posY = (canvas.height - 50) * (1 - meanEnergy[i].energy)
                    
                if (timer > (meanEnergy[i].year - 1960) * 2) {
                    s.fill('#1E1E1E')
                    s.strokeWeight(2)
                    s.stroke('#F9E73C')
                    s.circle(posX, posY, 15)
                    s.fill('#F9E73C')
                    s.noStroke()
                    s.circle(posX, posY, 7)
                }
            }
            
            for (let index = 0; index < meanAcoustic.length; index++) {
                
                const posX = ((meanAcoustic[index].year - 1960) * (canvas.width - canvas.width / 3) / 20) + canvas.width / 6
                const posY = (canvas.height - 50) * (1 - meanAcoustic[index].acousticness)
                
                if (s.dist(s.mouseX, s.mouseY, posX, posY) < 8) {
                    s.fill('#ED78AA')
                    s.noStroke()
                    s.circle(posX, posY, 10)
                    s.fill('white')
                    s.stroke('#ED78AA')
                    s.strokeWeight(3)
                    s.rectMode(s.CENTER)
                    s.rect(posX, meanAcoustic[index].year > 1969 ? posY + 50 : posY - 70, 170, 60, 8)
                    s.rectMode(s.CORNER)
                    s.textAlign(s.CENTER)
                    s.fill('#1E1E1E')
                    s.noStroke()
                    s.textFont(avenirBold)
                    s.text(`Year:`, posX - 20, meanAcoustic[index].year > 1969 ? posY + 45 : posY - 75)
                    s.textFont(avenirLight)
                    s.text(`${ meanEnergy[index].year }`, posX + 20, meanEnergy[index].year > 1969 ? posY + 45 : posY - 75)
                    s.textFont(avenirBold)
                    s.text(`Acousticness:`, posX - 20, meanAcoustic[index].year > 1969 ? posY + 65 : posY - 55)
                    s.textFont(avenirLight)
                    s.text(`${ Math.floor(meanAcoustic[index].acousticness * 100) / 100 }`, posX + 50, meanEnergy[index].year > 1969 ? posY + 65 : posY - 55)
                    s.strokeWeight(2)
                    s.noFill()
                }
                
                
                
            }
            
            for (let index = 0; index < meanEnergy.length; index++) {
                
                const posX = ((meanEnergy[index].year - 1960) * (canvas.width - canvas.width / 3) / 20) + canvas.width / 6
                const posY = (canvas.height - 50) * (1 - meanEnergy[index].energy)
                
                
                if (s.dist(s.mouseX, s.mouseY, posX, posY) < 15) {
                    s.fill('#F9E73C')
                    s.noStroke()
                    s.circle(posX, posY, 10)
                    s.fill('white')
                    s.stroke('#F9E73C')
                    s.strokeWeight(3)
                    s.rectMode(s.CENTER)
                    s.rect(posX, meanEnergy[index].year < 1969 ? posY + 50 : posY - 70, 120, 60, 8)
                    s.rectMode(s.CORNER)
                    s.textAlign(s.CENTER)
                    s.fill('#1E1E1E')
                    s.noStroke()
                    s.textFont(avenirBold)
                    s.text(`Year:`, posX - 20, meanEnergy[index].year < 1969 ? posY + 45 : posY - 75)
                    s.textFont(avenirLight)
                    s.text(`${ meanEnergy[index].year }`, posX + 20, meanEnergy[index].year < 1969 ? posY + 45 : posY - 75)
                    s.textFont(avenirBold)
                    s.text(`Energy:`, posX - 20, meanEnergy[index].year < 1969 ? posY + 65 : posY - 55)
                    s.textFont(avenirLight)
                    s.text(`${ Math.floor(meanEnergy[index].energy * 100) / 100 }`, posX + 30, meanEnergy[index].year < 1969 ? posY + 65 : posY - 55)
                    s.strokeWeight(2)
                    s.stroke('#F9E73C')
                    s.noFill()
                }
                
                
            }
            
        timer += 1
            
        }
        
        s.fill('#1E1E1E')
        s.noStroke()
        s.rect(0, canvas.height - 50, canvas.width, 50)
        
        s.textAlign(s.CENTER)
        s.fill('#696969')
        s.textFont(avenirMedium, 12)
        s.text('1960', canvas.width/6, canvas.height - 20)
        s.text('1965', 2*canvas.width/6, canvas.height - 20)
        s.text('1970', 3*canvas.width/6, canvas.height - 20)
        s.text('1975', 4*canvas.width/6, canvas.height - 20)
        s.text('1980', 5 * canvas.width / 6, canvas.height - 20)
        
        s.text('0', canvas.width/6 - 50, canvas.height - 50)
        s.text('0.5', canvas.width/6 - 50, (canvas.height - 50) / 2)
        s.text('1', canvas.width/6 - 50, 30)
        
    }
}