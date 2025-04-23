import { Component } from './Comp'

// Create button elements
const buttonA = document.createElement('button')
const buttonB = document.createElement('button')

// Set button text
buttonA.textContent = 'Go to A'
buttonB.textContent = 'Go to B'

// Add styles to buttons
buttonA.style.fontSize = '20px'
buttonA.style.padding = '10px 20px'
buttonA.style.margin = '10px'

buttonB.style.fontSize = '20px'
buttonB.style.padding = '10px 20px'
buttonB.style.margin = '10px'

// Add event listeners to buttons
buttonA.addEventListener('click', function () {
  history.pushState(null, '', 'a')
  console.log('Navigated to A')
})

buttonB.addEventListener('click', function () {
  history.pushState(null, '', 'b')
  console.log('Navigated to B')
})

// Append buttons to the body
document.body.appendChild(buttonA)
document.body.appendChild(buttonB)

console.log(Component)
