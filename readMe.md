![ga_cog_large_red_rgb](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)

# Portal Survive



### [](https://github.com/danielsan89/WDI_LDN_29_PROJECT01#setup)Installation & Setup

#### Run Locally

- Download or clone the [Github repo](https://github.com/danielsan89/WDI_LDN_29_PROJECT01)
- Run `gulp` in the terminal to compile the source code and open in browser

#### View Online

- [View on Heroku](https://portal-survive.herokuapp.com/)
- [View on Github](https://github.com/danielsan89/WDI_LDN_29_PROJECT01/)



### [](hhttps://github.com/danielsan89/WDI_LDN_29_PROJECT01/#description)Description

This project was to build a JavaScript browser game, I chose to build a really basic 8bit Role Player Game . The game allows the player to move a character arround a small div where another player controlled by the CPU is trying to hit him. The basics of the game is to move around and don't get hit. You can move, attack, and heal yourself. The more time you survive the more points you get.


### [](https://github.com/danielsan89/WDI_LDN_29_PROJECT01/#technologies-used)Technologies used

The list of the languages, frameworks, lib used in the project:

- HTML5
- SASS
- JavaScript (ES6)
- jQuery
- jQuery-ui
- Gulp
- Git
- Github
- Heroku

### [](https://github.com/danielsan89/WDI_LDN_29_PROJECT01/#challenges-faced)Challenges faced

The biggest challenge of the game was the collision functionality. I used four variables to get the position of the main screen where the game is played(right, left, top, bottom) and then another four for each character I implemented (also right, left, top and bottom). Everytime a character is moved those variables are updated to check in live-motion if two o more divs collided. The tricky part about this was to deal with collisions when the divs were making an animation. In one hand if I decided to check for a collision after the animation stopped I would lost the collisions during the process of itself, in the other hand if I checked for collisions during all the process I ended up having lots of them while the whole point of this was to check if at least one collision happended. At the end I came up with the idea of storing a particular value for collision=true and for collision=false within an array and then if the value for collision=true was into the array after the animation finished I 

### [](https://github.com/timrooke1991/project-0#rounding-it-off)Rounding it off

Improvements that I would like to make to the project in the future would be:

- Optimize collisions functionalities by making them more accurate.
- Adding CPU own movement.
- Add more levels.
- Add more habilities for the player to display.
