import dataUrl from 'url:../sorted_final.csv'
import avenirLightUrl from 'url:../assets/Avenir/AvenirLight.ttf'
import avenirBoldUrl from 'url:../assets/Avenir/AvenirBold.ttf'

import { intToRGB, hashCode } from '../utils/colors'

const canvas = {
    width: 600,
    height: window.innerHeight
}


export const timelineSketch = (s) => {
    let table
    let index = 0
    let currentYear = 1960
    let groupedTable = []
    let hovered = ''
    let wasHovered = ''
    let wasHoveredTimer = 0
    let avenirLight;
    let avenirBold;
    let timer = 0
    let hoverTimer = 0
    const woodstockX = 9 * canvas.width / 20
    let start = false
    
    
    s.preload = async () => {
        table = s.loadTable(dataUrl, 'csv', 'header')
        avenirLight = s.loadFont(avenirLightUrl)
        avenirBold = s.loadFont(avenirBoldUrl)
    }
    
    s.setup = () => {
        window.addEventListener('click', () => {
            start = true
        })
        
        const cnv = s.createCanvas(canvas.width, canvas.height);
        cnv.id('p5-timeline')
        cnv.parent('viz')
        let genre = ''
        let year;
        let count = 0
        let groupedIndex = -1
        let genres = {}
        for (let r = 1; r < table.getRowCount(); r++) {
            count += 1
            
            if (table.getNum(r, 'year') !== year) {
                genres = {}
                year = table.getNum(r, 'year')
                count = 0
            }
            
            if (genres[table.getString(r, 'genres')]) {
                genres[table.getString(r, 'genres')] += 1
            } else {
                genres[table.getString(r, 'genres')] = 1
            }
            
            
            // if ((table.getNum(r, 'year') !== year || table.getString(r, 'genres') !== genre) || count >= 100) {
            if (count >= 40) {
                let max = 0
                let selectedGenre
                for (const _genre of Object.keys(genres)) {
                    if (genres[_genre] > max) {
                        max = genres[_genre]
                        selectedGenre = _genre
                    }
                }
                if (groupedIndex > -1) {
                    groupedTable[groupedIndex].count = count
                }
                
                groupedIndex += 1
                genre = selectedGenre
                year = table.getNum(r, 'year')
                // console.log(count, genre, year);
                
                count = 0
                
                groupedTable.push({ genre, year })
            }
        }
    }

    s.draw = () => {
        let onCircle = false
        
        s.background('#1E1E1E');
        s.strokeWeight(1)
        s.stroke('white')
        s.drawingContext.setLineDash([5])
        s.line(woodstockX, 0,woodstockX, canvas.height)
        s.drawingContext.setLineDash([])
        s.stroke('transparent')
        s.strokeWeight(0)
        
        s.fill('#1E1E1E')
        s.rect(woodstockX - 50, 10, 200, 50)
        s.fill('white')
        s.textAlign(s.CENTER)
        s.textFont(avenirBold, 20)
        s.text('1969', woodstockX, 30)
        s.textFont(avenirLight, 20)
        s.text('Woodstock', woodstockX, 50)
        s.textFont(avenirLight, 16)
        
        s.textAlign(s.LEFT)
        
        if (start) {
            
            
            if (hovered) {
                s.fill(`#${intToRGB(hashCode(hovered + 'nul'))}`)
                s.circle(20, 20, 10)
                s.fill('white')
                s.text(hovered[0].toUpperCase() + hovered.substring(1), 30, 25)
            }
            
            
            groupedTable.forEach((point, i) => {
                if (hovered) {
                    if (hovered === point.genre) {
                        s.fill(`#${intToRGB(hashCode(point.genre + 'nul'))}`)
                    } else {
                        s.fill(`#${intToRGB(hashCode(point.genre + 'nul'))}`)
                        if (hoverTimer > (point.year - 1960)/2) {
                            s.fill('#1E1E1E')
                        }
                    }
                } else {
                    if (wasHovered) {
                        if (wasHovered !== point.genre) {
                            s.fill('#1E1E1E')
                            if (wasHoveredTimer > (point.year - 1960)) {
                                s.fill(`#${intToRGB(hashCode(point.genre + 'nul'))}`)
                            }
                        }
                        else {
                            
                            s.fill(`#${intToRGB(hashCode(point.genre + 'nul'))}`)
                        }
                    }
                    else {
                        s.fill(`#${intToRGB(hashCode(point.genre + 'nul'))}`)
                    }
                }
                if (point.year !== currentYear) {
                    currentYear = point.year
                    index = 0
                }
                if (index !== 0) {
                    index *= -1
                }
                if (timer > Math.abs(point.year - 1960)*2 && timer > Math.abs(index)*2) {
                    
                    s.circle(((point.year - 1960) * (canvas.width - 100) / 20) + 45, canvas.height / 2 + index * 15, 6)
                }
                if (s.dist(s.mouseX, s.mouseY, ((point.year - 1960) * (canvas.width - 100) / 20) + 45, canvas.height / 2 + index * 15) < 6) {
                    if (point.genre !== hovered) {
                        hoverTimer = 0
                    }
                    hovered = point.genre
                    wasHovered = hovered
                    onCircle = true
                    wasHoveredTimer = 0
                    
                }
                
                if (index >= 0) {
                    index += 1
                    
                }
            })
            if (onCircle == false) {
                hovered = ''
            }
            
            wasHoveredTimer += 1
            timer += 1
            hoverTimer += 1
        }
    }
}
